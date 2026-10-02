<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Setup writable /tmp paths for serverless environment
$storagePath = '/tmp/storage';
$tmpPaths = [
    $storagePath,
    $storagePath . '/framework',
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/logs',
    '/tmp/bootstrap_cache',
];

foreach ($tmpPaths as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Redirect cache paths from read-only filesystem to /tmp
putenv("APP_CONFIG_CACHE=/tmp/bootstrap_cache/config.php");
putenv("APP_SERVICES_CACHE=/tmp/bootstrap_cache/services.php");
putenv("APP_PACKAGES_CACHE=/tmp/bootstrap_cache/packages.php");
putenv("APP_ROUTES_CACHE=/tmp/bootstrap_cache/routes.php");
putenv("VIEW_COMPILED_PATH=/tmp/storage/framework/views");
putenv("SESSION_DRIVER=cookie");
putenv("CACHE_STORE=array");

// Fallback APP_KEY if not configured in Vercel Dashboard
if (!getenv('APP_KEY') && empty($_ENV['APP_KEY'])) {
    $fallbackKey = 'base64:qvKtnO2U6nOh8jNNSWtKEFL+Vm8bOidGtBxkq5t5jWQ=';
    putenv("APP_KEY={$fallbackKey}");
    $_ENV['APP_KEY'] = $fallbackKey;
    $_SERVER['APP_KEY'] = $fallbackKey;
}

// Fallback Neon DB connection if not passed in Vercel environment
if (!getenv('DATABASE_URL') && !getenv('POSTGRES_URL') && !getenv('DB_HOST')) {
    $neonUrl = 'postgresql://neondb_owner:npg_W4Y5jsolOTuz@ep-bitter-firefly-b3tc6ff8.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
    putenv("DATABASE_URL={$neonUrl}");
    putenv("DATABASE_URL_UNPOOLED={$neonUrl}");
    putenv("POSTGRES_URL={$neonUrl}");
    putenv("DB_CONNECTION=pgsql");
    $_ENV['DATABASE_URL'] = $neonUrl;
    $_ENV['DATABASE_URL_UNPOOLED'] = $neonUrl;
    $_ENV['POSTGRES_URL'] = $neonUrl;
    $_ENV['DB_CONNECTION'] = 'pgsql';
    $_SERVER['DATABASE_URL'] = $neonUrl;
    $_SERVER['DATABASE_URL_UNPOOLED'] = $neonUrl;
    $_SERVER['POSTGRES_URL'] = $neonUrl;
    $_SERVER['DB_CONNECTION'] = 'pgsql';
}

// Fallback SMS API Configuration for Vercel Serverless
if (!getenv('SMS_API_KEY') && empty($_ENV['SMS_API_KEY'])) {
    $smsApiKey = 'sk-2b10fnwt82j2gdxghqora8ukknzfczpo';
    putenv("SMS_API_KEY={$smsApiKey}");
    $_ENV['SMS_API_KEY'] = $smsApiKey;
    $_SERVER['SMS_API_KEY'] = $smsApiKey;
}
if (!getenv('SMS_API_URL') && empty($_ENV['SMS_API_URL'])) {
    $smsApiUrl = 'https://smsapiph.onrender.com/api/v1/send/sms';
    putenv("SMS_API_URL={$smsApiUrl}");
    $_ENV['SMS_API_URL'] = $smsApiUrl;
    $_SERVER['SMS_API_URL'] = $smsApiUrl;
}

// Normalize SCRIPT_NAME and PHP_SELF so Symfony Request does not treat /api as the basePath
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

// Also ensure REQUEST_URI starts with /api if it was stripped
if (isset($_SERVER['REQUEST_URI']) && !str_starts_with($_SERVER['REQUEST_URI'], '/api')) {
    $_SERVER['REQUEST_URI'] = '/api' . (str_starts_with($_SERVER['REQUEST_URI'], '/') ? '' : '/') . $_SERVER['REQUEST_URI'];
}

// Autoload composer dependencies from root or backend/
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require __DIR__ . '/../vendor/autoload.php';
} elseif (file_exists(__DIR__ . '/../backend/vendor/autoload.php')) {
    require __DIR__ . '/../backend/vendor/autoload.php';
} else {
    header('Content-Type: application/json', true, 500);
    echo json_encode(['error' => 'Composer dependencies not found on serverless instance.']);
    exit;
}

try {
    // Bootstrap Laravel
    /** @var \Illuminate\Foundation\Application $app */
    $app = require_once __DIR__ . '/../backend/bootstrap/app.php';

    // Redirect Laravel storage to writable /tmp
    $app->useStoragePath($storagePath);

    // Handle incoming serverless request
    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ], JSON_PRETTY_PRINT);
    exit;
}

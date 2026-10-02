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

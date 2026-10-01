<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Serverless environments like Vercel have a read-only filesystem except /tmp
$storagePath = '/tmp/storage';
foreach ([
    $storagePath,
    $storagePath . '/framework',
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/logs',
] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Autoload composer dependencies from backend/
require __DIR__ . '/../backend/vendor/autoload.php';

// Bootstrap Laravel
/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';

// Redirect Laravel storage to writable /tmp
$app->useStoragePath($storagePath);

// Handle incoming serverless request
$app->handleRequest(Request::capture());

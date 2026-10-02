<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RestockScheduleController;
use App\Http\Controllers\Api\StockMovementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for Vjay's Bike Parts & Accessories
|--------------------------------------------------------------------------
*/

// Status route for /api and /api/
Route::get('/', function () {
    return response()->json([
        'app' => "Vjay's Bike Parts & Accessories API",
        'status' => 'online',
        'database' => \Illuminate\Support\Facades\DB::connection()->getDriverName(),
        'version' => '1.0.0',
    ]);
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/create-pin', [AuthController::class, 'createPin']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/reset-pin', [AuthController::class, 'resetPin']);

    // Forget PIN & Phone Code Verification Routes
    Route::post('/forgot-pin/send-code', [AuthController::class, 'sendResetCode']);
    Route::post('/forgot-pin/verify-code', [AuthController::class, 'verifyResetCode']);
    Route::post('/forgot-pin/reset-pin', [AuthController::class, 'resetPinWithCode']);
});

// Products Routes
Route::delete('products/delete-all', [ProductController::class, 'destroyAll']);
Route::apiResource('products', ProductController::class);

// Stock Movement Routes
Route::prefix('stock-movements')->group(function () {
    Route::get('/', [StockMovementController::class, 'index']);
    Route::post('/in', [StockMovementController::class, 'stockIn']);
    Route::post('/out', [StockMovementController::class, 'stockOut']);
});

// Restock Schedules Routes (with Automated Restock Execution)
Route::prefix('schedules')->group(function () {
    Route::get('/', [RestockScheduleController::class, 'index']);
    Route::post('/', [RestockScheduleController::class, 'store']);
    Route::post('/process-due', [RestockScheduleController::class, 'autoProcessDue']);
    Route::delete('/{id}', [RestockScheduleController::class, 'destroy']);
});

// Dashboard Metrics Routes
Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/restock-queue', [DashboardController::class, 'getRestockQueue']);
    Route::get('/recent-movements', [DashboardController::class, 'getRecentMovements']);
});

// Audit Logs Ledger Routes
Route::get('/audit-logs', [AuditLogController::class, 'index']);

// System & Database Operations (for Vercel Serverless & Postgres Health)
Route::get('/system/db-status', function () {
    try {
        $driver = \Illuminate\Support\Facades\DB::connection()->getDriverName();
        $productsCount = \App\Models\Product::count();
        $auditLogsCount = \App\Models\AuditLog::count();
        $movementsCount = \App\Models\StockMovement::count();

        return response()->json([
            'status' => 'connected',
            'driver' => $driver,
            'counts' => [
                'products' => $productsCount,
                'audit_logs' => $auditLogsCount,
                'stock_movements' => $movementsCount,
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

Route::match(['get', 'post'], '/system/migrate', function (\Illuminate\Http\Request $request) {
    $configuredSecret = env('MIGRATE_SECRET_KEY', env('APP_KEY'));
    $providedSecret = $request->query('secret') ?: $request->header('X-Migrate-Secret');

    if (!$configuredSecret || $providedSecret !== $configuredSecret) {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized. Provide valid ?secret= matching MIGRATE_SECRET_KEY or APP_KEY in Vercel environment variables.',
        ], 401);
    }

    try {
        $seed = $request->boolean('seed', false);

        \Illuminate\Support\Facades\Artisan::call('migrate', [
            '--force' => true,
        ]);
        $output = \Illuminate\Support\Facades\Artisan::output();

        if ($seed) {
            \Illuminate\Support\Facades\Artisan::call('db:seed', [
                '--force' => true,
            ]);
            $output .= "\n" . \Illuminate\Support\Facades\Artisan::output();
        }

        return response()->json([
            'status' => 'success',
            'database_driver' => \Illuminate\Support\Facades\DB::connection()->getDriverName(),
            'output' => $output,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});


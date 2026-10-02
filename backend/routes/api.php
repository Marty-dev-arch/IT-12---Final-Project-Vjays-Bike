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
    Route::post('/login-with-code', [AuthController::class, 'loginWithCode']);
    Route::post('/reset-pin', [AuthController::class, 'resetPin']);

    // PIN Reset & Verification Code Routes
    Route::post('/forgot-pin/send-code', [AuthController::class, 'sendResetCode']);
    Route::post('/forgot-pin/verify-code', [AuthController::class, 'verifyResetCode']);
    Route::post('/forgot-pin/reset-pin', [AuthController::class, 'resetPinWithCode']);

    // Registration & Phone Security PIN Request / Verify Routes
    Route::post('/request-pin-code', [AuthController::class, 'requestPinCode']);
    Route::post('/verify-pin-code', [AuthController::class, 'verifyPinCode']);
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
Route::post('/audit-logs', [AuditLogController::class, 'store']);

// System & Database Operations (for Vercel Serverless & Postgres Health)
Route::get('/system/db-status', function () {
    try {
        $driver = \Illuminate\Support\Facades\DB::connection()->getDriverName();

        // Ensure default owner user exists in database
        if (\App\Models\User::count() === 0) {
            \App\Models\User::create([
                'name' => 'Vjay',
                'phone' => '09123456789',
                'role' => 'owner',
                'pin_hash' => \Illuminate\Support\Facades\Hash::make('123456'),
            ]);
        }

        return response()->json([
            'status' => 'connected',
            'driver' => $driver,
            'counts' => [
                'products' => \App\Models\Product::count(),
                'stock_movements' => \App\Models\StockMovement::count(),
                'audit_logs' => \App\Models\AuditLog::count(),
                'restock_schedules' => \App\Models\RestockSchedule::count(),
                'users' => \App\Models\User::count(),
                'pin_reset_codes' => \App\Models\PinResetCode::count(),
            ],
            // Database-persisted verification dispatches (visible in Vercel & Neon Postgres)
            'latest_sms_verifications' => \App\Models\PinResetCode::latest()->take(10)->get([
                'id', 'phone', 'code', 'status', 'channel', 'message', 'expires_at', 'verified_at', 'created_at'
            ]),
            'timestamp' => now()->toIso8601String(),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

// Dedicated endpoint to inspect SMS verification codes in database on Vercel
Route::get('/system/sms-logs', function () {
    try {
        $logs = \App\Models\PinResetCode::latest()->take(50)->get();
        return response()->json([
            'total' => \App\Models\PinResetCode::count(),
            'records' => $logs,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
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


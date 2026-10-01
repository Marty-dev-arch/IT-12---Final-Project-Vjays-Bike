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

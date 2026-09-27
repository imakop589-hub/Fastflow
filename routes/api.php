<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Owner\RestaurantHourController;
use App\Http\Controllers\Owner\RestaurantProfileController;
use App\Http\Controllers\Owner\RestaurantStaffController;
use App\Http\Controllers\Public\RestaurantController as PublicRestaurantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| FoodBrio API v1 Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Authentication Routes (Rate limited)
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
    });

    // Public Marketplace Routes
    Route::get('/restaurants', [PublicRestaurantController::class, 'index']);
    Route::get('/restaurants/{slug}', [PublicRestaurantController::class, 'show']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Restaurant Owner Routes (Supports both primary restaurant and multi-vendor portfolio)
        Route::prefix('owner')->group(function () {
            Route::get('/restaurants', [RestaurantProfileController::class, 'index']);
            Route::get('/restaurant', [RestaurantProfileController::class, 'show']);
            Route::get('/restaurants/{restaurant}', [RestaurantProfileController::class, 'show']);
            Route::post('/restaurant', [RestaurantProfileController::class, 'store']);
            Route::put('/restaurant', [RestaurantProfileController::class, 'update']);
            Route::put('/restaurants/{restaurant}', [RestaurantProfileController::class, 'update']);

            Route::get('/hours', [RestaurantHourController::class, 'index']);
            Route::get('/restaurants/{restaurant}/hours', [RestaurantHourController::class, 'index']);
            Route::put('/hours', [RestaurantHourController::class, 'update']);
            Route::put('/restaurants/{restaurant}/hours', [RestaurantHourController::class, 'update']);

            Route::get('/staff', [RestaurantStaffController::class, 'index']);
            Route::get('/restaurants/{restaurant}/staff', [RestaurantStaffController::class, 'index']);
            Route::post('/staff', [RestaurantStaffController::class, 'store']);
            Route::post('/restaurants/{restaurant}/staff', [RestaurantStaffController::class, 'store']);
            Route::put('/staff/{staff}/toggle-status', [RestaurantStaffController::class, 'toggleStatus']);
            Route::delete('/staff/{staff}', [RestaurantStaffController::class, 'destroy']);
        });

        // Admin Routes
        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index']);

            // Restaurants Management & Workflow
            Route::get('/restaurants', [AdminRestaurantController::class, 'index']);
            Route::get('/restaurants/{restaurant}', [AdminRestaurantController::class, 'show']);
            Route::post('/restaurants/{restaurant}/approve', [AdminRestaurantController::class, 'approve']);
            Route::post('/restaurants/{restaurant}/reject', [AdminRestaurantController::class, 'reject']);
            Route::post('/restaurants/{restaurant}/request-changes', [AdminRestaurantController::class, 'requestChanges']);
            Route::post('/restaurants/{restaurant}/suspend', [AdminRestaurantController::class, 'suspend']);
            Route::post('/restaurants/{restaurant}/activate', [AdminRestaurantController::class, 'activate']);

            // Users Management
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{user}', [UserController::class, 'show']);
            Route::put('/users/{user}', [UserController::class, 'update']);
            Route::delete('/users/{user}', [UserController::class, 'destroy']);

            // Roles & Permissions
            Route::get('/roles', [RoleController::class, 'index']);
            Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);

            // Settings
            Route::get('/settings', [SettingController::class, 'index']);
            Route::put('/settings', [SettingController::class, 'update']);

            // Audit Logs
            Route::get('/audit-logs', [AuditLogController::class, 'index']);
        });
    });
});

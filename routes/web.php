<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'application' => 'FoodBrio Multi-Vendor Marketplace',
        'phase' => 'Phase 1 - Foundation & Core',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Catch-all route to serve the Vue 3 Single Page Application
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

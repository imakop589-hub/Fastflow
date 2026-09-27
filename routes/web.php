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
        'application' => 'Fastflow Multi-Vendor Marketplace',
        'phase' => 'Phase 1 - Foundation & Core',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Catch-all route to serve the React 19 Single Page Application
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

<?php

use App\Http\Controllers\Api\BoardApiController;
use App\Http\Controllers\Api\BoardPinApiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Board API routes (JSON responses for headless backend)
Route::middleware(['auth', 'verified'])
    ->prefix('api')
    ->name('api.')
    ->group(function () {
        Route::get('boards',        [BoardApiController::class, 'index'])->name('boards.index');
        Route::post('boards',       [BoardApiController::class, 'store'])->name('boards.store');
        Route::get('boards/{board}',[BoardApiController::class, 'show'])->name('boards.show');
        Route::put('boards/{board}',[BoardApiController::class, 'update'])->name('boards.update');
        Route::delete('boards/{board}',[BoardApiController::class,'destroy'])->name('boards.destroy');

        // Save / Unsave pin ke board
        Route::post('boards/{board}/pins', [BoardPinApiController::class, 'store'])->name('boards.pins.store');
        Route::delete('boards/{board}/pins/{pin}', [BoardPinApiController::class, 'destroy'])->name('boards.pins.destroy');
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

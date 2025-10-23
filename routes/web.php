<?php

use App\Http\Controllers\Api\BoardApiController;
use App\Http\Controllers\Api\BoardPinApiController;
use App\Http\Controllers\PinController;
use App\Models\Board;
use App\Models\Pin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $pins = Pin::latest()
            ->get(['id', 'title', 'description', 'image_url', 'created_at']);
        
        return Inertia::render('dashboard', [
            'pins' => $pins
        ]);
    })->name('dashboard');

    // Boards page (Inertia render)
    Route::get('boards', function () {
        $boards = auth()->user()->boards()
            ->with(['pins' => function($query) {
                $query->select('pins.id', 'pins.title', 'pins.image_url', 'pins.created_at')
                      ->orderBy('board_pin.created_at', 'desc')
                      ->take(4);
            }])
            ->withCount('pins')
            ->latest()
            ->get();

        return Inertia::render('Boards/Index', [
            'boards' => ['data' => $boards]
        ]);
    })->name('boards');

    // Board detail page
    Route::get('boards/{board}', function (Board $board) {
        // Authorization check
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $board->load(['pins' => function($query) {
            $query->select('pins.id', 'pins.title', 'pins.description', 'pins.image_url', 'pins.created_at')
                  ->orderBy('board_pin.created_at', 'desc');
        }])->loadCount('pins');

        // Get available pins that user can add
        $availablePins = Pin::latest()
            ->get();

        return Inertia::render('Boards/Show', [
            'board' => ['data' => $board],
            'availablePins' => ['data' => $availablePins]
        ]);
    })->name('boards.show');

    Route::get('/pins/create', [PinController::class, 'create'])->name('pins.create');
    Route::post('/pins', [PinController::class, 'store'])->name('pins.store');

    // Pin detail page
    Route::get('/pin/{pin}', [PinController::class, 'show'])->name('pins.show');
    Route::post('/pin/{pin}/like', [PinController::class, 'toggleLike'])->name('pins.like');
    Route::post('/pin/{pin}/save', [PinController::class, 'saveToBoard'])->name('pins.save');
    Route::put('/pin/{pin}', [PinController::class, 'update']);
    Route::delete('/pin/{pin}', [PinController::class, 'destroy']);
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

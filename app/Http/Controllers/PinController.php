<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class PinController extends Controller
{
    public function index()
    {
        $pins = Pin::latest()->get(['id', 'title', 'image_url']);
        return inertia('dashboard', ['pins' => $pins]);
    }

    public function show(Pin $pin)
    {
        $pin->load('user');

        $pin->likes_count = $pin->likedBy()->count();

        $is_liked = false;
        if (Auth::check()) {
            $is_liked = $pin->likedBy()->where('user_id', Auth::id())->exists();
        }

        $boards = auth()->user()->boards()->get();

        return inertia('pin/Show', [
            'pin' => $pin->load('user'),
            'boards' => $boards,
            'isLiked' => $is_liked
        ]);
    }

    public function toggleLike(Pin $pin)
    {
        Auth::user()->likedPins()->toggle($pin->id);

        return redirect()->back();
    }

    public function saveToBoard(Request $request, Pin $pin)
    {
        $request->validate([
            'board_id' => 'required|integer'
        ]);

        $board = Auth::user()->boards()->findOrFail($request->board_id);

        $board->pins()->syncWithoutDetaching($pin->id);

        return redirect()->back();
    }
}

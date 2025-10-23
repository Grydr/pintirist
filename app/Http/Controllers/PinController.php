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

        $can_update = Auth::check() ? auth()->user()->can('update', $pin) : false;

        $boards = auth()->user()->boards()->get();

        return inertia('pin/Show', [
            'pin' => $pin->load('user'),
            'boards' => $boards,
            'isLiked' => $is_liked,
            'canUpdate' => $can_update
        ]);
    }

    public function update(Request $request, Pin $pin)
    {
        $this->authorize('update', $pin);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $pin->update($validated);

        return redirect('/pin/' . $pin->id);
    }

    public function destroy(Pin $pin)
    {
        $this->authorize('delete', $pin);

        $pin->delete();

        return redirect('/');
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

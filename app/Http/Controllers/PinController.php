<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

        return redirect()->route('dashboard')->with('success', 'Pin deleted');
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

        return redirect()->back()->with('success', 'Pin saved to board');
    }

    public function create() {
        return Inertia::render('Pins/Create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'image'       => ['required','image','max:5120'],
            'title'       => ['required','string','max:120'],
            'description' => ['nullable','string','max:2000'],
        ]);

        $path = $request->file('image')->store('pins', 'public');
        
        // Store as relative path: /storage/pins/filename.jpg
        $imageUrl = '/storage/' . $path;

        Pin::create([
            'user_id'     => auth()->id(),
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_url'  => $imageUrl,
        ]);

        return redirect()->route('dashboard')->with('success', 'Pin published!');
    }

}

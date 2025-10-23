<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PinController extends Controller
{
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
        $url  = Storage::url($path);

        Pin::create([
            'user_id'     => auth()->id(),
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_url'  => $url,
        ]);

        return redirect()->route('dashboard')->with('success', 'Pin published!');
    }

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

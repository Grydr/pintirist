<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
}

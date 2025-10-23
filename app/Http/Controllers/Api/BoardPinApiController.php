<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttachPinRequest;
use App\Models\Board;
use App\Models\Pin;
use Illuminate\Http\Request;

class BoardPinApiController extends Controller
{
    public function store(AttachPinRequest $request, Board $board)
    {
        // Authorization menggunakan Policy
        $this->authorize('update', $board);

        $pinId = (int) $request->validated()['pin_id'];

        // hindari duplikat di pivot
        if (! $board->pins()->where('pin_id', $pinId)->exists()) {
            $board->pins()->attach($pinId);
        }

        return response()->json(['message' => 'Pin saved to board'], 201);
    }

    public function destroy(Request $request, Board $board, Pin $pin)
    {
        // Authorization menggunakan Policy
        $this->authorize('update', $board);

        $board->pins()->detach($pin->id);

        return response()->json(['message' => 'Pin removed from board']);
    }
}

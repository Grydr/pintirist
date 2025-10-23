<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardApiController extends Controller
{
    public function index(Request $request)
    {
        $boards = $request->user()->boards()
            ->withCount('pins')
            ->latest()
            ->paginate(12);

        return BoardResource::collection($boards);
    }

    public function store(StoreBoardRequest $request)
    {
        $board = $request->user()->boards()->create($request->validated());

        return (new BoardResource($board->loadCount('pins')))
            ->additional(['message' => 'Board created'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Board $board)
    {
        // Authorization menggunakan Policy
        $this->authorize('view', $board);

        $board->load([
            'pins' => fn($q) => $q->latest(),
            'user',
        ])->loadCount('pins');

        return new BoardResource($board);
    }

    public function update(UpdateBoardRequest $request, Board $board)
    {
        // Authorization menggunakan Policy
        $this->authorize('update', $board);

        $board->update($request->validated());

        return (new BoardResource($board->loadCount('pins')))
            ->additional(['message' => 'Board updated']);
    }

    public function destroy(Request $request, Board $board)
    {
        // Authorization menggunakan Policy
        $this->authorize('delete', $board);

        $board->delete();

        return response()->json(['message' => 'Board deleted']);
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'user_id'     => $this->user_id,
            'pins_count'  => $this->when(isset($this->pins_count), $this->pins_count),
            'pins'        => PinResource::collection($this->whenLoaded('pins')),
            'created_at'  => $this->created_at,
        ];
    }
}

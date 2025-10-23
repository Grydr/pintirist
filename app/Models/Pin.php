<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Pin extends Model
{
    protected $fillable = [
        'user_id',        // ✅ allow setting user
        'title',
        'description',
        'image_url'
    ];

    // expose image_url derived from image_path
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function boards(): BelongsToMany { return $this->belongsToMany(Board::class, 'board_pin')->withTimestamps(); }
    public function comments(): HasMany { return $this->hasMany(Comment::class); }
    public function likedBy(): BelongsToMany { return $this->belongsToMany(User::class, 'likes'); }
}

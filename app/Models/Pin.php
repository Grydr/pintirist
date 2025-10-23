<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pin extends Model
{
    protected $fillable = [
        'user_id',        // ✅ allow setting user
        'title',
        'description',
        'image_url'
    ];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // If it's already a full URL, return as is
                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
                    return $value;
                }
                // If it starts with /storage, make it a full URL
                if (str_starts_with($value, '/storage')) {
                    return url($value);
                }
                // Otherwise return as is
                return $value;
            }
        );
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function boards(): BelongsToMany { return $this->belongsToMany(Board::class, 'board_pin')->withTimestamps(); }
    public function comments(): HasMany { return $this->hasMany(Comment::class); }
    public function likedBy(): BelongsToMany { return $this->belongsToMany(User::class, 'likes'); }
}

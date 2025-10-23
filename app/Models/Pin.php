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
                // Handle null or empty value
                if (empty($value)) {
                    return null;
                }
                
                // If it's a full URL
                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
                    $parsedUrl = parse_url($value);
                    $host = $parsedUrl['host'] ?? '';
                    
                    // If it's an external URL (not localhost/127.0.0.1), return as is
                    if (!in_array($host, ['localhost', '127.0.0.1', ''])) {
                        return $value;
                    }
                    
                    // If it's localhost with wrong port, extract the path and fix it
                    if (isset($parsedUrl['path']) && str_contains($parsedUrl['path'], '/storage/')) {
                        return url($parsedUrl['path']);
                    }
                    
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

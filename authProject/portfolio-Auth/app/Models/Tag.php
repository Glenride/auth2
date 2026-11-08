<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
    ];

    /**
     * Articles relation.
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class)->withTimestamps();
    }

    protected static function booted(): void
    {
        static::saving(function (self $tag): void {
            $tag->slug ??= Str::slug($tag->name);
        });
    }
}

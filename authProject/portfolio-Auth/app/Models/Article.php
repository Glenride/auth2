<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'subtitle',
        'slug',
        'content',
        'excerpt',
        'hero_image_path',
        'category',
        'status',
        'published_at',
        'view_count',
        'read_time_minutes',
        'meta_description',
        'visibility',
        'required_tier',
        'is_premium_preview',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_premium_preview' => 'boolean',
    ];

    protected $appends = [
        'hero_image_url',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Scope for published articles.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Author relation.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Tags relation.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    /**
     * Bookmarks relation.
     */
    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * Reads relation.
     */
    public function reads(): HasMany
    {
        return $this->hasMany(ArticleRead::class);
    }

    /**
     * Accessor for hero image URL.
     */
    public function getHeroImageUrlAttribute(): ?string
    {
        if (!$this->hero_image_path) {
            return null;
        }

        return config('app.env') === 'production'
            ? Storage::disk('s3')->url($this->hero_image_path)
            : Storage::disk('public')->url($this->hero_image_path);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at !== null
            && $this->published_at->lte(now());
    }

    public function previewContent(int $paragraphs = 3): string
    {
        $content = $this->content ?? '';
        $chunks = collect(preg_split('/\n\s*\n/', (string) $content, -1, PREG_SPLIT_NO_EMPTY));

        return $chunks->take($paragraphs)->implode("\n\n");
    }

    public function requiresAuthentication(): bool
    {
        return $this->visibility === 'preview';
    }

    public function canBeViewedFully(?User $user): bool
    {
        if ($this->requiresAuthentication()) {
            return $user !== null;
        }

        return true;
    }
}

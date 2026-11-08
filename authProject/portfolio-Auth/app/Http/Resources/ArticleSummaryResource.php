<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'preview_content' => $this->previewContent(),
            'hero_image_url' => $this->hero_image_url,
            'category' => $this->category,
            'read_time_minutes' => $this->read_time_minutes,
            'published_at' => optional($this->published_at)->toIso8601String(),
            'author' => [
                'name' => $this->author?->name,
                'avatar' => $this->author?->avatar,
            ],
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($tag) => [
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])),
            'is_bookmarked' => (bool) ($this->is_bookmarked ?? false),
            'is_premium_preview' => (bool) $this->is_premium_preview,
        ];
    }
}

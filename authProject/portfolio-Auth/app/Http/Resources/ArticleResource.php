<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $canViewFullContent = $this->canBeViewedFully($user);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'slug' => $this->slug,
            'content' => $canViewFullContent ? $this->content : $this->previewContent(),
            'preview_content' => $this->previewContent(),
            'hero_image_url' => $this->hero_image_url,
            'category' => $this->category,
            'status' => $this->status,
            'visibility' => $this->visibility,
            'required_tier' => $this->required_tier,
            'is_premium_preview' => (bool) $this->is_premium_preview,
            'is_fully_accessible' => $canViewFullContent,
            'read_time_minutes' => $this->read_time_minutes,
            'meta_description' => $this->meta_description,
            'published_at' => optional($this->published_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
            'view_count' => $this->view_count,
            'bookmark_count' => $this->whenCounted('bookmarks', $this->bookmarks_count),
            'read_count' => $this->whenCounted('reads', $this->reads_count),
            'author' => [
                'name' => $this->author?->name,
                'avatar' => $this->author?->avatar,
            ],
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($tag) => [
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])),
        ];
    }
}

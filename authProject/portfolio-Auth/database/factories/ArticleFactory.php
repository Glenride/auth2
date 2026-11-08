<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $content = collect(range(1, 6))
            ->map(fn () => $this->faker->paragraphs(3, true))
            ->implode("\n\n");

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'subtitle' => $this->faker->optional()->sentence(10),
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'content' => $content,
            'excerpt' => Str::limit(strip_tags($content), 200),
            'hero_image_path' => null,
            'category' => $this->faker->randomElement(['research', 'systems', 'creative']),
            'status' => 'draft',
            'published_at' => null,
            'view_count' => 0,
            'read_time_minutes' => max(1, (int) ceil(str_word_count($content) / 200)),
            'meta_description' => $this->faker->sentence(20),
            'visibility' => 'preview',
            'required_tier' => 'free',
            'is_premium_preview' => false,
        ];
    }

    public function published(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function scheduled(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'published_at' => now()->addWeek(),
        ]);
    }
}

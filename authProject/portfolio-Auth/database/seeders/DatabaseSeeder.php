<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $author = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Article::factory()
            ->for($author, 'author')
            ->published()
            ->create([
                'title' => 'How to seed your Laravel database',
                'slug' => 'how-to-seed-your-laravel-database',
                'excerpt' => 'A quick guide to seeding data in Laravel using factories and seeders.',
                'content' => <<<MARKDOWN
In this article, we walk through creating factories, writing seeders, and running them with Artisan. You will learn how to add states like "published" and generate realistic test data for development.
MARKDOWN,
            ]);

        Article::factory()
            ->count(10)
            ->for($author, 'author')
            ->published()
            ->create();
    }
}

<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('filters published articles by category and search', function (): void {
    $matchingArticle = Article::factory()
        ->published()
        ->create([
            'title' => 'Systems Design Playbook',
            'category' => 'systems',
            'excerpt' => 'Deep dives into system design.',
        ]);

    Article::factory()
        ->published()
        ->create([
            'title' => 'Research Strategy Notes',
            'category' => 'research',
            'excerpt' => 'Insights on clinical ops.',
        ]);

    Article::factory()
        ->scheduled()
        ->create([
            'title' => 'Systems Roadmap (Draft)',
            'category' => 'systems',
        ]);

    $this->get(route('blog.index', ['category' => 'systems', 'search' => '  Playbook  ']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/index')
            ->where('filters.category', 'systems')
            ->where('filters.search', 'Playbook')
            ->has('articles.data', 1, fn (Assert $article) => $article
                ->where('id', $matchingArticle->id)
                ->where('title', $matchingArticle->title)
                ->where('category', 'systems')
                ->etc()
            )
        );
});

it('gates article content previews for unauthenticated readers', function (): void {
    $content = <<<'MARKDOWN'
Paragraph one lays the groundwork.

Paragraph two dives deeper.

Paragraph three builds momentum.

Paragraph four delivers the payoff.
MARKDOWN;

    $article = Article::factory()->published()->create([
        'title' => 'Preview of a Breakthrough System',
        'content' => $content,
        'visibility' => 'preview',
    ]);

    $preview = $article->previewContent();

    $this->get(route('blog.show', $article))
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/show')
            ->where('article.data.slug', $article->slug)
            ->where('article.data.is_fully_accessible', false)
            ->where('article.data.content', $preview)
        );

    $reader = User::factory()->create();

    $this->actingAs($reader)
        ->get(route('blog.show', $article))
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/show')
            ->where('article.data.slug', $article->slug)
            ->where('article.data.is_fully_accessible', true)
            ->where('article.data.content', $content)
        );
});

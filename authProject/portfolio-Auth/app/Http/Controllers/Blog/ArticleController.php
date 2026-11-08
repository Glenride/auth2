<?php

namespace App\Http\Controllers\Blog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\ArticleIndexRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleSummaryResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(ArticleIndexRequest $request): Response
    {
        $filters = $request->validated();
        $user = $request->user();

        $query = Article::query()
            ->published()
            ->with([
                'author:id,name,avatar',
                'tags:id,name,slug',
            ]);

        if ($category = $filters['category'] ?? null) {
            $query->where('category', $category);
        }

        if ($search = $filters['search'] ?? null) {
            $like = "%{$search}%";

            $query->where(function ($inner) use ($like) {
                $inner->where('title', 'like', $like)
                    ->orWhere('excerpt', 'like', $like)
                    ->orWhereHas('tags', fn ($tags) => $tags->where('name', 'like', $like));
            });
        }

        if ($user) {
            $query->withExists([
                'bookmarks as is_bookmarked' => fn ($bookmarks) => $bookmarks->where('user_id', $user->id),
            ]);
        }

        $articles = $query
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('blog/index', [
            'filters' => $filters,
            'articles' => ArticleSummaryResource::collection($articles),
            'categories' => ['research', 'systems', 'creative'],
        ]);
    }

    public function show(Request $request, Article $article): Response
    {
        if (!$article->isPublished()) {
            abort(404);
        }

        $article->load([
            'author:id,name,avatar',
            'tags:id,name,slug',
        ])->loadCount([
            'bookmarks',
            'reads',
        ]);

        return Inertia::render('blog/show', [
            'article' => ArticleResource::make($article),
        ]);
    }
}

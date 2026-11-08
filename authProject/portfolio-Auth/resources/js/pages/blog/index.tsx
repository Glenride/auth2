import { useEffect, useMemo, useState, type FormEvent } from 'react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index as blogIndex, show as blogShow } from '@/routes/blog';
import { login } from '@/routes';
import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, Filter, Sparkles } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
    research: 'Research',
    systems: 'Systems',
    creative: 'Creative',
};

type ArticleAuthor = {
    name: string | null;
    avatar: string | null;
};

type ArticleTag = {
    name: string;
    slug: string;
};

type ArticleSummary = {
    id: number;
    title: string;
    subtitle: string | null;
    slug: string;
    excerpt: string | null;
    preview_content: string;
    hero_image_url: string | null;
    category: string;
    read_time_minutes: number;
    published_at: string | null;
    author: ArticleAuthor;
    tags?: ArticleTag[];
    is_bookmarked: boolean;
    is_premium_preview: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type ArticleCollection = {
    data: ArticleSummary[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
};

type BlogIndexPageProps = SharedData & {
    filters: {
        category?: string | null;
        search?: string | null;
    };
    categories: string[];
    articles: ArticleCollection;
};

export default function BlogIndex() {
    const {
        props: { auth, filters, categories, articles },
    } = usePage<BlogIndexPageProps>();

    const isAuthenticated = Boolean(auth?.user);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const activeCategory = (filters.category ?? 'all').toLowerCase();

    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const categoryOptions = useMemo(() => {
        const unique = new Set(['all', ...categories.map((value) => value.toLowerCase())]);
        return Array.from(unique);
    }, [categories]);

    const handleNavigate = (query: { category?: string; search?: string }) => {
        const params: Record<string, string> = {};

        if (query.category && query.category !== 'all') {
            params.category = query.category;
        }

        const trimmedSearch = query.search?.trim();
        if (trimmedSearch) {
            params.search = trimmedSearch;
        }

        const url = blogIndex({ query: Object.keys(params).length ? params : undefined }).url;

        router.get(url, {}, {
            replace: true,
            preserveScroll: true,
        });
    };

    const handleCategoryClick = (category: string) => {
        const nextCategory = category.toLowerCase();
        if (nextCategory === activeCategory) {
            return;
        }

        handleNavigate({ category: nextCategory, search: searchValue });
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleNavigate({ category: activeCategory, search: searchValue });
    };

    const formatPublishedDate = (isoDate: string | null) => {
        if (!isoDate) {
            return 'Unpublished';
        }

        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(isoDate));
    };

    const renderPreview = (content: string) => {
        return content
            .split(/\n\s*\n/)
            .filter((paragraph) => paragraph.trim().length > 0)
            .slice(0, 2)
            .map((paragraph, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                    {paragraph.trim()}
                </p>
            ));
    };

    const renderPagination = () => {
        const paginationLinks = articles.meta?.links ?? [];

        if (paginationLinks.length <= 1) {
            return null;
        }

        return (
            <nav className="mt-10 flex items-center justify-center gap-2">
                {paginationLinks
                    .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                    .map((link, index) => {
                        const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                        const isActive = link.active;

                        if (!link.url) {
                            return (
                                <Button key={`${label}-${index}`} variant="ghost" size="sm" disabled>
                                    {label}
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={`${label}-${index}`}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(link.url ?? '', {}, { preserveScroll: true, replace: true })}
                            >
                                {label}
                            </Button>
                        );
                    })}
            </nav>
        );
    };

    const breadcrumbs = useMemo(
        () => [
            {
                title: 'Blog',
                href: blogIndex().url,
            },
        ],
        [],
    );

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog" />

            <section className="border-b bg-muted/40">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            Latest thinking
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                                Breakthroughs in research, systems, and creative execution.
                            </h1>
                            <p className="text-base text-muted-foreground md:text-lg">
                                Read the strategies I use to accelerate clinical operations, build resilient marketing systems, and ship creative work that converts.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                <Filter className="h-4 w-4" /> Categories
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {categoryOptions.map((category) => (
                                    <Button
                                        key={category}
                                        type="button"
                                        variant={activeCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        {CATEGORY_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full items-center gap-3 md:ml-auto md:w-auto">
                            <Input
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search titles, excerpts, or tags"
                                className="w-full md:w-72"
                                type="search"
                                aria-label="Search articles"
                            />
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
                {articles.data.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-xl">No articles yet.</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Check back soon—fresh research and systems breakdowns are on the way.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                        {articles.data.map((article) => {
                            const articleUrl = blogShow({ article: article.slug }).url;
                            const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

                            return (
                                <Card key={article.id} className="flex h-full flex-col overflow-hidden">
                                    <CardHeader className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Badge variant="outline" className="text-[0.65rem] uppercase tracking-[0.3em]">
                                                {categoryLabel}
                                            </Badge>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" /> {article.read_time_minutes} min read
                                            </span>
                                            {article.published_at && (
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {formatPublishedDate(article.published_at)}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="line-clamp-2 text-balance text-xl font-semibold leading-snug">
                                            <Link href={articleUrl} className="transition hover:text-primary">
                                                {article.title}
                                            </Link>
                                        </CardTitle>
                                        {article.subtitle && <p className="line-clamp-2 text-sm text-muted-foreground">{article.subtitle}</p>}
                                    </CardHeader>

                                    <CardContent className="flex flex-1 flex-col gap-3">
                                        <div className="space-y-3">
                                            {renderPreview(article.preview_content)}
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {article.tags?.slice(0, 3).map((tag) => (
                                                <Badge key={tag.slug} variant="secondary" className="text-xs font-medium">
                                                    #{tag.slug}
                                                </Badge>
                                            ))}
                                            {article.is_premium_preview && (
                                                <Badge variant="default" className="text-xs font-semibold">
                                                    Premium Preview
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between border-t bg-muted/50">
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>{article.author?.name ?? 'D\'Vaughn House'}</span>
                                            <span>
                                                {article.published_at
                                                    ? formatPublishedDate(article.published_at)
                                                    : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!isAuthenticated && (
                                                <Button asChild variant="ghost" size="sm">
                                                    <Link href={login().url}>Create account</Link>
                                                </Button>
                                            )}
                                            <Button asChild size="sm">
                                                <Link href={articleUrl}>Read article</Link>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {renderPagination()}
            </section>
        </AppHeaderLayout>
    );
}

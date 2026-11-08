import { useMemo } from 'react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { index as blogIndex } from '@/routes/blog';
import { login } from '@/routes';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bookmark, CalendarDays, Clock, Lock } from 'lucide-react';

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

type ArticlePayload = {
    id: number;
    title: string;
    subtitle: string | null;
    slug: string;
    content: string;
    preview_content: string;
    hero_image_url: string | null;
    category: string;
    status: string;
    visibility: string;
    required_tier: string;
    is_premium_preview: boolean;
    is_fully_accessible: boolean;
    read_time_minutes: number;
    meta_description: string | null;
    published_at: string | null;
    updated_at: string | null;
    view_count: number;
    bookmark_count: number | null;
    read_count: number | null;
    author: ArticleAuthor;
    tags?: ArticleTag[];
};

type BlogShowPageProps = SharedData & {
    article: ArticlePayload;
};

const renderMarkdown = (content: string) => {
    return content
        .split(/\n\s*\n/)
        .filter((paragraph) => paragraph.trim().length > 0)
        .map((paragraph, index) => {
            const isHeading = /^#{1,3}\s/.test(paragraph.trim());
            const cleaned = paragraph.replace(/^#{1,3}\s*/, '').trim();

            if (isHeading) {
                return (
                    <h2 key={`heading-${index}`} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        {cleaned}
                    </h2>
                );
            }

            return (
                <p key={`paragraph-${index}`} className="leading-relaxed text-muted-foreground">
                    {cleaned}
                </p>
            );
        });
};

export default function BlogShow() {
    const {
        props: { auth, article },
    } = usePage<BlogShowPageProps>();

    const isAuthenticated = Boolean(auth?.user);
    const breadcrumbs = useMemo(
        () => [
            {
                title: 'Blog',
                href: blogIndex().url,
            },
            {
                title: article.title,
                href: '#',
            },
        ],
        [article.title],
    );

    const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

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

    const renderContent = () => {
        if (article.is_fully_accessible) {
            return <div className="prose prose-neutral dark:prose-invert">{renderMarkdown(article.content)}</div>;
        }

        return (
            <div className="space-y-6">
                <div className="prose prose-neutral dark:prose-invert">{renderMarkdown(article.preview_content)}</div>
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-muted/60 p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        <Lock className="h-4 w-4" /> Continue reading
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Create a free account to unlock the full article, bookmark it, and get notified when new research drops.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button asChild>
                            <Link href={login().url}>Create an account</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={login().url + '?mode=login'}>Log in</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const HeroImage = () => {
        if (!article.hero_image_url) {
            return null;
        }

        return (
            <figure className="overflow-hidden rounded-2xl border border-border/60">
                <img
                    src={article.hero_image_url}
                    alt={article.title}
                    className="h-64 w-full object-cover md:h-[420px]"
                    loading="lazy"
                />
            </figure>
        );
    };

    const MetadataCard = () => (
        <Card className="sticky top-6 space-y-4">
            <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {article.read_time_minutes} min read
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> {formatPublishedDate(article.published_at)}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[0.65rem] uppercase tracking-[0.3em]">
                        {categoryLabel}
                    </Badge>
                    {article.tags?.map((tag) => (
                        <Badge key={tag.slug} variant="secondary" className="text-xs font-medium">
                            #{tag.slug}
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Author</span>
                    <span className="text-sm text-foreground">{article.author?.name ?? "D'Vaughn House"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Bookmark className="h-4 w-4" />
                    {article.bookmark_count ?? 0} bookmarks · {article.view_count} views
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/50">
                {article.is_fully_accessible ? (
                    <Button variant="secondary" size="sm" disabled>
                        Bookmarking coming soon
                    </Button>
                ) : (
                    <Button asChild size="sm">
                        <Link href={login().url}>Unlock with free account</Link>
                    </Button>
                )}
                <Button asChild variant="ghost" size="sm">
                    <Link href={blogIndex().url} className="inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to all articles
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={article.title} />

            <article className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-8 lg:flex-row">
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            <Badge variant="outline" className="text-[0.65rem] uppercase tracking-[0.3em]">
                                {categoryLabel}
                            </Badge>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {article.read_time_minutes} min read
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" /> {formatPublishedDate(article.published_at)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                                {article.title}
                            </h1>
                            {article.subtitle && (
                                <p className="text-lg text-muted-foreground md:text-xl">{article.subtitle}</p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>By {article.author?.name ?? "D'Vaughn House"}</span>
                            <span aria-hidden="true">•</span>
                            <span>{article.view_count} views</span>
                            {article.is_premium_preview && (
                                <>
                                    <span aria-hidden="true">•</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                        <Lock className="h-3.5 w-3.5" /> Premium preview
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <HeroImage />

                    <div className={cn('space-y-6', article.is_fully_accessible ? 'mt-6' : 'mt-2')}>{renderContent()}</div>
                </div>

                <aside className="w-full lg:w-80">
                    <MetadataCard />
                </aside>
            </article>
        </AppHeaderLayout>
    );
}

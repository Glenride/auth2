import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { index as blogIndex } from '@/routes/blog';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href={blogIndex()}
                        className="group relative flex aspect-video flex-col overflow-hidden rounded-xl border border-sidebar-border/70 transition hover:border-neutral-400 hover:shadow-lg dark:border-sidebar-border/80 dark:hover:border-neutral-600"
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/15 transition-opacity duration-200 group-hover:opacity-40 dark:stroke-neutral-100/15" />
                        <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors duration-200 group-hover:text-neutral-800 dark:text-neutral-300 dark:group-hover:text-neutral-100">
                                <span className="rounded-full bg-neutral-900/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-700 dark:bg-neutral-100/10 dark:text-neutral-200">
                                    Resources
                                </span>
                                <span>Latest from the blog</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-neutral-900 transition-colors duration-200 group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200">
                                    Read our blog
                                </h3>
                                <span className="rounded-full border border-neutral-900/20 px-3 py-1 text-sm font-medium text-neutral-700 transition duration-200 group-hover:bg-neutral-900 group-hover:text-white dark:border-neutral-100/30 dark:text-neutral-200 dark:group-hover:border-transparent dark:group-hover:bg-neutral-200 dark:group-hover:text-neutral-900">
                                    Visit
                                </span>
                            </div>
                        </div>
                    </Link>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

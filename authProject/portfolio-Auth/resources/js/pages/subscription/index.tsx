import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface SubscriptionPageProps {
    subscription: any;
    subscriptions: any[];
    invoices: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subscription',
        href: '/subscription',
    },
];

export default function SubscriptionIndex({
    subscription,
    subscriptions,
    invoices,
}: SubscriptionPageProps) {
    const handleCancel = () => {
        if (
            confirm(
                'Are you sure you want to cancel your subscription? You can continue using it until the end of the billing period.',
            )
        ) {
            router.post('/subscription/cancel');
        }
    };

    const handleResume = () => {
        router.post('/subscription/resume');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Subscription</CardTitle>
                            <CardDescription>
                                Manage your subscription plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subscription ? (
                                <>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Status:{' '}
                                            <span className="font-medium text-foreground">
                                                {subscription.stripe_status}
                                            </span>
                                        </p>
                                        {subscription.ends_at && (
                                            <p className="text-sm text-muted-foreground">
                                                Ends at:{' '}
                                                <span className="font-medium text-foreground">
                                                    {new Date(
                                                        subscription.ends_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {subscription.stripe_status ===
                                            'active' &&
                                            !subscription.ends_at && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel Subscription
                                                </Button>
                                            )}
                                        {subscription.ends_at && (
                                            <Button onClick={handleResume}>
                                                Resume Subscription
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        You don't have an active subscription.
                                    </p>
                                    <Link href="/subscription/create">
                                        <Button>Create Subscription</Button>
                                    </Link>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                            <CardDescription>
                                View your past invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices && invoices.length > 0 ? (
                                <div className="space-y-2">
                                    {invoices.slice(0, 5).map((invoice: any) => (
                                        <div
                                            key={invoice.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="text-sm">
                                                <p className="font-medium">
                                                    {new Date(
                                                        invoice.date.date,
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    ${invoice.total / 100}
                                                </p>
                                            </div>
                                            <a
                                                href={invoice.hosted_invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    View
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No invoices yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

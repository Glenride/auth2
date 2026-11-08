import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface CreateSubscriptionProps {
    intent: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subscription',
        href: '/subscription',
    },
    {
        title: 'Create',
        href: '/subscription/create',
    },
];

export default function CreateSubscription({ intent }: CreateSubscriptionProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Subscription" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Subscribe</CardTitle>
                        <CardDescription>
                            Choose a plan and start your subscription
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                To complete the subscription setup, you'll need
                                to integrate Stripe Elements for payment method
                                collection. This requires installing{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    @stripe/stripe-js
                                </code>{' '}
                                and{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    @stripe/react-stripe-js
                                </code>
                                .
                            </p>

                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="mb-2 text-sm font-medium">
                                    Next Steps:
                                </p>
                                <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Install Stripe packages: npm install
                                        @stripe/stripe-js
                                        @stripe/react-stripe-js
                                    </li>
                                    <li>Add Stripe publishable key to .env</li>
                                    <li>
                                        Create pricing plans in your Stripe
                                        Dashboard
                                    </li>
                                    <li>
                                        Implement Stripe Elements form
                                        component
                                    </li>
                                </ol>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <a href="/subscription">Back</a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

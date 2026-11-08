import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PaymentProps {
    stripeKey: string;
    amount: string;
    payment: any;
    paymentIntent: {
        id: string;
        status: string;
        payment_method_types: string[];
        client_secret?: string;
        payment_method?: { id: string };
    };
    paymentMethod: string;
    errorMessage: string;
    customer: any;
    redirect: string;
}

export default function Payment({
    amount,
    paymentIntent,
    errorMessage: initialErrorMessage,
    redirect,
}: PaymentProps) {
    const handleGoBack = () => {
        const url = new URL(redirect);

        if (paymentIntent.status === 'succeeded') {
            url.searchParams.append('success', 'true');
        } else {
            url.searchParams.append('success', 'false');
        }

        if (initialErrorMessage) {
            url.searchParams.append('message', initialErrorMessage);
        }

        window.location.href = url.toString();
    };

    const renderStatusContent = () => {
        switch (paymentIntent.status) {
            case 'succeeded':
                return (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Payment Successful
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This payment was successfully confirmed.
                            </p>
                        </div>
                    </div>
                );

            case 'processing':
                return (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Payment Processing
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This payment is currently processing. Refresh
                                this page from time to time to see its status.
                            </p>
                        </div>
                    </div>
                );

            case 'canceled':
                return (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="rounded-full bg-gray-100 p-3">
                            <AlertCircle className="h-8 w-8 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Payment Canceled
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This payment was canceled.
                            </p>
                        </div>
                    </div>
                );

            case 'requires_payment_method':
                return (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Confirm Your Payment
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                To complete the payment flow, you'll need to
                                integrate Stripe Elements. This requires
                                installing{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    @stripe/stripe-js
                                </code>{' '}
                                and{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    @stripe/react-stripe-js
                                </code>
                                .
                            </p>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="mb-2 text-sm font-medium">
                                Next Steps:
                            </p>
                            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                                <li>
                                    Install Stripe packages: npm install
                                    @stripe/stripe-js @stripe/react-stripe-js
                                </li>
                                <li>
                                    Implement Stripe Payment Element in this
                                    component
                                </li>
                                <li>
                                    Handle payment confirmation with Stripe's
                                    APIs
                                </li>
                            </ol>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Payment Status Unknown
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                The payment status is currently unknown. Please
                                try again or contact support.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Head title={`Payment Confirmation - ${amount}`} />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-lg">
                    <h1 className="mb-6 text-center text-4xl font-bold text-gray-900">
                        Your {amount} payment
                    </h1>

                    {initialErrorMessage && (
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm">
                                {initialErrorMessage}
                            </span>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>
                                Payment ID: {paymentIntent.id}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {renderStatusContent()}

                            <Button
                                onClick={handleGoBack}
                                className="w-full"
                                variant="outline"
                            >
                                Go back
                            </Button>
                        </CardContent>
                    </Card>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}

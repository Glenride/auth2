<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Http\Middleware\VerifyRedirectUrl;
use Laravel\Cashier\Payment;
use Stripe\Exception\InvalidRequestException as StripeInvalidRequestException;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware(VerifyRedirectUrl::class);
    }

    public function show(string $id): Response
    {
        try {
            $payment = new Payment(Cashier::stripe()->paymentIntents->retrieve(
                $id,
                ['expand' => ['payment_method']]
            ));
        } catch (StripeInvalidRequestException $exception) {
            abort(404, 'Payment not found.');
        }

        $paymentIntent = Arr::only($payment->asStripePaymentIntent()->toArray(), [
            'id', 'status', 'payment_method_types', 'client_secret', 'payment_method',
        ]);

        $paymentIntent['payment_method'] = Arr::only($paymentIntent['payment_method'] ?? [], 'id');

        $customer = $payment->customer();

        return Inertia::render('cashier/payment', [
            'stripeKey' => config('cashier.key'),
            'amount' => $payment->amount(),
            'payment' => [
                'amount' => $payment->amount(),
                'id' => $payment->id(),
            ],
            'paymentIntent' => array_filter($paymentIntent),
            'paymentMethod' => (string) request('source_type', optional($payment->payment_method)->type),
            'errorMessage' => request('redirect_status') === 'failed'
                ? 'Something went wrong when trying to confirm the payment. Please try again.'
                : '',
            'customer' => [
                'name' => optional($customer)->stripeName(),
                'email' => optional($customer)->stripeEmail(),
            ],
            'redirect' => url(request('redirect', '/')),
        ]);
    }
}

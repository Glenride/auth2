<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubscribeRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('Subscription/Index', [
            'subscription' => $user->subscription('default'),
            'subscriptions' => $user->subscriptions,
            'invoices' => $user->invoices(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Subscription/Create', [
            'intent' => auth()->user()->createSetupIntent(),
        ]);
    }

    public function store(SubscribeRequest $request): RedirectResponse
    {
        $user = auth()->user();

        try {
            $user->createOrGetStripeCustomer();

            $user->newSubscription('default', $request->price_id)
                ->create($request->payment_method);

            return to_route('subscription.index')
                ->with('success', 'Subscription created successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create subscription: '.$e->getMessage());
        }
    }

    public function cancel(): RedirectResponse
    {
        $user = auth()->user();

        if ($user->subscribed('default')) {
            $user->subscription('default')->cancel();

            return back()->with('success', 'Subscription canceled successfully. You can continue using it until the end of the billing period.');
        }

        return back()->with('error', 'No active subscription found.');
    }

    public function resume(): RedirectResponse
    {
        $user = auth()->user();

        if ($user->subscription('default')?->onGracePeriod()) {
            $user->subscription('default')->resume();

            return back()->with('success', 'Subscription resumed successfully!');
        }

        return back()->with('error', 'Unable to resume subscription.');
    }
}

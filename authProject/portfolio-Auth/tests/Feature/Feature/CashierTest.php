<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Cashier\Billable;

uses(RefreshDatabase::class);

test('stripe credentials are configured', function () {
    expect(config('services.stripe.key'))->not->toBeEmpty();
    expect(config('services.stripe.secret'))->not->toBeEmpty();
    expect(config('services.stripe.key'))->toStartWith('pk_');
    expect(config('services.stripe.secret'))->toStartWith('sk_');
});

test('user model uses billable trait', function () {
    $user = User::factory()->create();
    
    expect($user)->toBeInstanceOf(User::class);
    $traits = class_uses_recursive(User::class);
    expect($traits)->toContain(Billable::class);
});

test('can create stripe setup intent for user', function () {
    $user = User::factory()->create();
    
    $setupIntent = $user->createSetupIntent();
    
    expect($setupIntent)->toBeInstanceOf(\Stripe\SetupIntent::class);
    expect($setupIntent->id)->not->toBeEmpty();
    expect($setupIntent->id)->toStartWith('seti_');
    expect($setupIntent->client_secret)->not->toBeEmpty();
});

test('can create or get stripe customer for user', function () {
    $user = User::factory()->create([
        'email' => 'test-cashier-' . time() . '@example.com',
    ]);
    
    $customer = $user->createOrGetStripeCustomer();
    
    expect($customer)->toBeInstanceOf(\Stripe\Customer::class);
    expect($customer->id)->not->toBeEmpty();
    expect($customer->id)->toStartWith('cus_');
    expect($customer->email)->toBe($user->email);
    
    // Verify stripe_id was saved to user
    $user->refresh();
    expect($user->stripe_id)->toBe($customer->id);
});

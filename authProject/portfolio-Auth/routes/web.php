<?php

use App\Http\Controllers\Blog\ArticleController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('links', function () {
    return Inertia::render('links');
})->name('links');

Route::post('contact', [ContactMessageController::class, 'store'])->name('contact.store');

Route::get('blog', [ArticleController::class, 'index'])->name('blog.index');
Route::get('blog/{article:slug}', [ArticleController::class, 'show'])->name('blog.show');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('subscription/create', [SubscriptionController::class, 'create'])->name('subscription.create');
    Route::post('subscription', [SubscriptionController::class, 'store'])->name('subscription.store');
    Route::post('subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('subscription/resume', [SubscriptionController::class, 'resume'])->name('subscription.resume');
});

Route::get('stripe/payment/{id}', [App\Http\Controllers\Cashier\PaymentController::class, 'show'])->name('cashier.payment');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

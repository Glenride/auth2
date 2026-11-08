# Product Requirements Document: Gated Blog Dashboard

## Product Overview
A Substack-style blog system built on Laravel Work OS starter kit, where users must create an account to access premium content. Free preview content drives account creation; logged-in users get full access to articles, comments, and saved content.

---

## Goals & Success Metrics

**Primary Goal:** Convert anonymous visitors into registered users through high-value content

**Success Metrics:**
- Account creation rate from blog landing page
- Average articles read per user per session
- Comment engagement rate
- Return visitor rate (30-day window)
- Time spent on platform

---

## User Personas

### Persona 1: The Browser
- Discovers content via search or social
- Wants quick evaluation of value before committing
- Needs: Preview content, clear value proposition, frictionless signup

### Persona 2: The Subscriber
- Registered user, comes for specific insights
- Wants to track reading progress and engage
- Needs: Full article access, bookmarking, commenting, email notifications

### Persona 3: You (Admin)
- Publishes 2-4 articles per month
- Wants analytics on what resonates
- Needs: Simple CMS, draft management, engagement metrics

---

## Core Features

### 1. Public Blog Landing Page (No Auth Required)

**Articles Feed**
- Display 6-12 most recent articles in reverse chronological order
- Each card shows:
  - Title
  - Subtitle/excerpt (150 chars)
  - Published date
  - Read time estimate
  - Category tag (Research | Systems | Creative)
  - Author byline with small photo
- Responsive grid: 1 column mobile, 2-3 columns desktop

**Preview Content Gate**
- Anonymous users see first 3 paragraphs (~200 words)
- After preview: blur effect + CTA overlay
  - "Create a free account to keep reading"
  - "Sign up in 30 seconds — no credit card required"
  - Email field + "Continue Reading" button
- Clicking CTA triggers registration flow, then redirects back to article

**Navigation**
- Logo (links to blog home)
- Categories filter (All | Research | Systems | Creative)
- Search bar (searches titles, excerpts, tags)
- "Sign In" and "Create Account" buttons (top right)

---

### 2. Article Detail Page

**Anonymous User View**
- Full title, subtitle, author, date, read time
- Hero image (if present)
- First 3 paragraphs rendered
- Blur overlay starting at paragraph 4
- Sticky bottom bar: "Unlock this article — Create free account"

**Authenticated User View**
- Full article content (markdown rendered to HTML)
- Table of contents (auto-generated from H2/H3 headers)
- Social share buttons (Twitter, LinkedIn, copy link)
- "Bookmark" button (saves to user's reading list)
- Related articles module (3 articles based on tags/category)
- Comment section (see Feature 4)

**Article Metadata**
- View count
- Bookmark count
- Comment count
- Last updated date (if edited after publish)

---

### 3. User Dashboard (Post-Login)

**My Reading List**
- Bookmarked articles
- Reading progress (% complete based on scroll depth)
- "Continue Reading" for in-progress articles
- Remove from list option

**Recent Activity**
- Last 10 articles read with timestamps
- Your comments with links back to articles

**Account Settings**
- Email preferences:
  - [ ] New article notifications
  - [ ] Reply notifications
  - [ ] Weekly digest
- Profile:
  - Display name (public in comments)
  - Bio (optional, 280 chars)
  - Avatar upload
- Change password
- Delete account

---

### 4. Comment System

**Requirements**
- Threaded comments (2 levels: parent + replies)
- Markdown support (bold, italic, links, code blocks)
- @mentions trigger notifications
- Edit within 15 minutes of posting
- Delete your own comments
- Report abuse button (flags for admin review)

**Display**
- Sort by: Newest | Oldest | Most Replies
- Show commenter display name + avatar
- Timestamp (e.g., "2 hours ago")
- Reply count on parent comments
- Load more pagination (20 comments per page)

**Permissions**
- Only authenticated users can comment
- Must have verified email to comment (prevents spam)

---

### 5. Admin CMS (Your Dashboard)

**Article Management**
- List view: all articles with status (Draft | Scheduled | Published)
- Filters: Status, Category, Date range
- Quick actions: Edit, Duplicate, Preview, Delete

**Article Editor**
- Rich markdown editor with live preview
- Fields:
  - Title (required, 120 char limit)
  - Subtitle (optional, 200 char limit)
  - Category dropdown (single select)
  - Tags (multi-select, create new on the fly)
  - Hero image upload (optimized to 1200x630)
  - SEO meta description (160 chars)
  - Publish date/time (schedule future posts)
  - Visibility: Public preview (3 paragraphs) or Full access only
- Save as Draft | Schedule | Publish Now buttons

**Analytics Dashboard**
- Overview (last 30 days):
  - Total views
  - New accounts created
  - Total comments
  - Average read time
- Top 10 articles by views
- Account signups by traffic source (if UTM tracking enabled)
- Comment moderation queue

---

### 6. Email Notifications

**Transactional (Immediate)**
- Welcome email (on account creation)
- Password reset
- Email verification
- Comment reply notification
- @mention notification

**Digest (Weekly, user opt-in)**
- Subject: "3 new articles this week from D'Vaughn House"
- Preview of each article with "Read Now" CTA
- Unsubscribe link in footer

**Technical**
- Use Laravel queues for async sending
- Track open rates and click-throughs
- Unsubscribe = update user email preferences, don't delete account

---

## Technical Specifications

### Database Schema

**articles**
- id (primary key)
- user_id (foreign key, admin author)
- title (string, 120)
- subtitle (string, 200, nullable)
- slug (string, unique, indexed)
- content (text, markdown)
- excerpt (string, 200, auto-generated from first paragraph)
- hero_image_url (string, nullable)
- category (enum: research, systems, creative)
- status (enum: draft, scheduled, published)
- published_at (timestamp, nullable)
- view_count (integer, default 0)
- read_time_minutes (integer, calculated on save)
- meta_description (string, 160, nullable)
- created_at, updated_at, deleted_at (soft deletes)

**article_tags**
- id
- article_id (foreign key)
- tag_id (foreign key)

**tags**
- id
- name (string, unique)
- slug (string, unique)

**bookmarks**
- id
- user_id (foreign key)
- article_id (foreign key)
- created_at
- Unique constraint: (user_id, article_id)

**comments**
- id
- user_id (foreign key)
- article_id (foreign key)
- parent_comment_id (foreign key, nullable for top-level)
- content (text, markdown)
- is_flagged (boolean, default false)
- created_at, updated_at, deleted_at

**article_reads**
- id
- user_id (foreign key)
- article_id (foreign key)
- progress_percent (integer, 0-100)
- last_read_at (timestamp)
- Unique constraint: (user_id, article_id)

### Routes Structure

```
Public Routes:
GET  /blog                          → List articles (preview mode)
GET  /blog/{slug}                   → Article detail (gated for anon users)
GET  /blog/category/{category}      → Filter by category
GET  /blog/search?q={query}         → Search articles

Auth Required:
GET  /dashboard                     → User dashboard (reading list, activity)
POST /blog/{slug}/bookmark          → Toggle bookmark
POST /blog/{slug}/track-progress    → Update read progress (AJAX)
GET  /blog/{slug}/full              → Full article content (API endpoint)

Comments (Auth Required):
POST   /blog/{slug}/comments        → Create comment
PATCH  /blog/{slug}/comments/{id}   → Edit comment
DELETE /blog/{slug}/comments/{id}   → Delete comment
POST   /blog/{slug}/comments/{id}/flag → Flag comment

Admin Routes (role: admin):
GET    /admin/articles              → Article list
GET    /admin/articles/create       → New article form
POST   /admin/articles              → Store article
GET    /admin/articles/{id}/edit    → Edit form
PATCH  /admin/articles/{id}         → Update article
DELETE /admin/articles/{id}         → Soft delete
GET    /admin/analytics             → Analytics dashboard
GET    /admin/comments/moderation   → Flagged comments
```

### Middleware
- `auth` → Require logged-in user
- `verified` → Require verified email (for commenting)
- `role:admin` → Admin-only routes

### Frontend Stack (Recommendations)
- **Blade templates** with Alpine.js for interactivity (reading progress bar, bookmark button)
- **Tailwind CSS** for styling
- **Markdown parser**: `league/commonmark` (Laravel's built-in)
- **Syntax highlighting** for code blocks: Prism.js or Highlight.js
- **Lazy loading** images: `loading="lazy"` attribute

### Performance Considerations
- Cache article list (15 min TTL)
- Cache individual articles (clear on update)
- Eager load relationships (author, tags, comment counts)
- CDN for hero images (or optimize/resize on upload)
- Paginate comments (20 per page)
- Index: `articles.published_at`, `articles.slug`, `comments.article_id`

---

## User Flows

### Flow 1: Anonymous Visitor → Registered User
1. Lands on `/blog` via Google search
2. Sees article titled "How I Cut Clinical Trial Enrollment Time by 40%"
3. Clicks article, reads first 3 paragraphs
4. Hits paywall overlay
5. Enters email, clicks "Continue Reading"
6. Redirected to `/register` (email pre-filled)
7. Completes password field, submits
8. Verification email sent (can skip and verify later)
9. Redirected back to article, now sees full content
10. Receives welcome email with link to dashboard

### Flow 2: Registered User Returns
1. Receives weekly digest email: "3 new articles this week"
2. Clicks "Read Now" on article
3. If not logged in: redirected to `/login`, then back to article
4. Reads full article, bookmarks it
5. Scrolls to comments, leaves reply
6. Notification sent to original commenter
7. Navigates to `/dashboard`, sees article in "Recently Read"

### Flow 3: You Publish New Article
1. Log in to `/admin/articles`
2. Click "New Article"
3. Write in markdown, add hero image, select category + tags
4. Preview in new tab to check formatting
5. Set publish date (immediate or schedule for next Tuesday 9am)
6. Click "Publish Now"
7. Article appears on `/blog` feed
8. Queued job sends email digest to subscribed users (batched)
9. Check analytics next day for view count and signups

---

## Subscription & Payment System (Laravel Cashier + Stripe)

### Subscription Tiers

**Free Tier (Default)**
- 3 full articles per month
- Unlimited previews (first 3 paragraphs)
- Email updates for new posts
- No commenting or bookmarking

**Pro Tier ($9/month or $90/year)**
- Unlimited full article access
- Commenting with @mentions
- Bookmark library with reading progress
- Priority email support
- Weekly digest customization

**Premium Tier ($29/month or $290/year)**
- Everything in Pro
- Audio versions of articles (leveraging your vocal work)
- Early access (48 hours before Pro users)
- Monthly group office hours
- Access to template library (SOPs, checklists, frameworks)
- Private community forum

---

### Updated Database Schema for Subscriptions

```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN stripe_id VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN pm_type VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN pm_last_four VARCHAR(4) NULL;
ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP NULL;
ALTER TABLE users ADD INDEX(stripe_id);

-- Cashier migrations (run: php artisan vendor:publish --tag="cashier-migrations")
-- This creates: subscriptions, subscription_items tables

-- New table: subscription_tiers
CREATE TABLE subscription_tiers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    stripe_price_id VARCHAR(255) NOT NULL,
    price_cents INT NOT NULL,
    interval ENUM('month', 'year') NOT NULL,
    features JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Update articles table
ALTER TABLE articles ADD COLUMN required_tier ENUM('free', 'pro', 'premium') DEFAULT 'free';
ALTER TABLE articles ADD COLUMN is_premium_preview BOOLEAN DEFAULT FALSE; -- Allow premium content previews

-- Track free tier article consumption
CREATE TABLE article_reads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    article_id BIGINT UNSIGNED NOT NULL,
    progress_percent INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_article (user_id, article_id)
);
```

---

### Installation & Setup Steps

**1. Install Laravel Cashier**
```bash
composer require laravel/cashier
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

**2. Configure Stripe Keys**
```env
# .env
STRIPE_KEY=pk_test_your_publishable_key
STRIPE_SECRET=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CASHIER_CURRENCY=usd
```

**3. Add Billable Trait to User Model**
```php
// app/Models/User.php
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
    
    protected $casts = [
        'trial_ends_at' => 'datetime',
    ];
    
    // Check if user has active subscription
    public function hasActiveSubscription(): bool
    {
        return $this->subscribed('default');
    }
    
    // Get current tier
    public function currentTier(): string
    {
        if (!$this->hasActiveSubscription()) {
            return 'free';
        }
        
        $priceId = $this->subscription('default')->stripe_price;
        
        return match($priceId) {
            config('subscriptions.pro.monthly_price_id'),
            config('subscriptions.pro.yearly_price_id') => 'pro',
            config('subscriptions.premium.monthly_price_id'),
            config('subscriptions.premium.yearly_price_id') => 'premium',
            default => 'free',
        };
    }
    
    // Check if user can access article
    public function canAccessArticle(Article $article): bool
    {
        $requiredTier = $article->required_tier ?? 'free';
        
        // Free articles accessible to everyone
        if ($requiredTier === 'free') return true;
        
        // Check subscription tier hierarchy
        $userTier = $this->currentTier();
        
        $tierHierarchy = ['free' => 0, 'pro' => 1, 'premium' => 2];
        
        if ($tierHierarchy[$userTier] >= $tierHierarchy[$requiredTier]) {
            return true;
        }
        
        // Free users get 3 articles per month
        if ($userTier === 'free' && $requiredTier === 'pro') {
            return $this->articlesReadThisMonth() < 3;
        }
        
        return false;
    }
    
    // Count articles read this month
    public function articlesReadThisMonth(): int
    {
        return $this->articleReads()
            ->whereHas('article', fn($q) => $q->where('required_tier', '!=', 'free'))
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
    }
    
    // Relationship to article reads
    public function articleReads()
    {
        return $this->hasMany(ArticleRead::class);
    }
    
    // Track that user read an article
    public function trackArticleRead(Article $article): void
    {
        $this->articleReads()->updateOrCreate(
            ['article_id' => $article->id],
            ['updated_at' => now()]
        );
    }
}
```

**4. Create Subscription Configuration**
```php
// config/subscriptions.php
return [
    'pro' => [
        'name' => 'Pro',
        'monthly_price_id' => env('STRIPE_PRO_MONTHLY_PRICE_ID'),
        'yearly_price_id' => env('STRIPE_PRO_YEARLY_PRICE_ID'),
        'monthly_price' => 900, // $9.00 in cents
        'yearly_price' => 9000, // $90.00 in cents
        'features' => [
            'Unlimited articles',
            'Comments and @mentions',
            'Bookmark library',
            'Reading progress tracking',
            'Priority email support',
        ],
    ],
    'premium' => [
        'name' => 'Premium',
        'monthly_price_id' => env('STRIPE_PREMIUM_MONTHLY_PRICE_ID'),
        'yearly_price_id' => env('STRIPE_PREMIUM_YEARLY_PRICE_ID'),
        'monthly_price' => 2900, // $29.00
        'yearly_price' => 29000, // $290.00
        'features' => [
            'Everything in Pro',
            'Audio versions of articles',
            'Early access (48hrs)',
            'Monthly office hours',
            'Template library access',
            'Private community',
        ],
    ],
    'trial_days' => 7,
];
```

---

### Routes for Subscriptions

```php
// routes/web.php

// Public pricing page (unauthenticated users can view)
Route::get('/pricing', [SubscriptionController::class, 'pricing'])
    ->name('pricing');

// Subscription management (authenticated only)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Subscribe
    Route::post('/subscribe/{tier}/{interval}', [SubscriptionController::class, 'subscribe'])
        ->name('subscribe')
        ->where('tier', 'pro|premium')
        ->where('interval', 'monthly|yearly');
    
    // Billing portal
    Route::get('/billing', [SubscriptionController::class, 'billing'])
        ->name('billing');
    
    // Update payment method
    Route::get('/billing/payment-method', [SubscriptionController::class, 'paymentMethod'])
        ->name('billing.payment-method');
    Route::post('/billing/payment-method', [SubscriptionController::class, 'updatePaymentMethod'])
        ->name('billing.update-payment-method');
    
    // Cancel subscription
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('subscription.cancel');
    
    // Resume cancelled subscription
    Route::post('/subscription/resume', [SubscriptionController::class, 'resume'])
        ->name('subscription.resume');
    
    // Download invoices
    Route::get('/billing/invoice/{invoice}', [SubscriptionController::class, 'downloadInvoice'])
        ->name('billing.invoice');
});

// Stripe webhook (exclude from CSRF)
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);
```

---

### Subscription Controller

```php
// app/Http/Controllers/SubscriptionController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function pricing()
    {
        $user = auth()->user();
        $currentTier = $user?->currentTier() ?? 'free';
        $subscription = $user?->subscription('default');
        
        return view('subscription.pricing', compact('currentTier', 'subscription'));
    }
    
    public function subscribe(Request $request, string $tier, string $interval)
    {
        $user = auth()->user();
        
        // Validate tier and interval
        $config = config("subscriptions.{$tier}");
        if (!$config) abort(404);
        
        $priceId = $interval === 'monthly' 
            ? $config['monthly_price_id'] 
            : $config['yearly_price_id'];
        
        try {
            // If user already has subscription, swap instead
            if ($user->subscribed('default')) {
                $user->subscription('default')->swap($priceId);
                
                return redirect()->route('billing')
                    ->with('success', 'Subscription updated successfully!');
            }
            
            // Create new subscription with trial
            $user->newSubscription('default', $priceId)
                ->trialDays(config('subscriptions.trial_days'))
                ->create($request->paymentMethod);
            
            return redirect()->route('dashboard')
                ->with('success', "Welcome to {$config['name']}! Your {config('subscriptions.trial_days')}-day trial has started.");
                
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Payment failed: ' . $e->getMessage()]);
        }
    }
    
    public function billing()
    {
        $user = auth()->user();
        
        return view('subscription.billing', [
            'subscription' => $user->subscription('default'),
            'paymentMethod' => $user->defaultPaymentMethod(),
            'invoices' => $user->invoicesIncludingPending(),
            'currentTier' => $user->currentTier(),
        ]);
    }
    
    public function paymentMethod()
    {
        return view('subscription.payment-method', [
            'intent' => auth()->user()->createSetupIntent(),
        ]);
    }
    
    public function updatePaymentMethod(Request $request)
    {
        $user = auth()->user();
        
        $user->updateDefaultPaymentMethod($request->paymentMethod);
        
        return redirect()->route('billing')
            ->with('success', 'Payment method updated successfully!');
    }
    
    public function cancel()
    {
        $subscription = auth()->user()->subscription('default');
        
        if (!$subscription) {
            return back()->withErrors(['error' => 'No active subscription found.']);
        }
        
        $subscription->cancel();
        
        return back()->with('success', 'Subscription cancelled. You have access until ' . $subscription->ends_at->format('F j, Y'));
    }
    
    public function resume()
    {
        $subscription = auth()->user()->subscription('default');
        
        if (!$subscription || !$subscription->onGracePeriod()) {
            return back()->withErrors(['error' => 'Unable to resume subscription.']);
        }
        
        $subscription->resume();
        
        return back()->with('success', 'Subscription resumed successfully!');
    }
    
    public function downloadInvoice(Request $request, string $invoiceId)
    {
        return $request->user()->downloadInvoice($invoiceId, [
            'vendor' => 'D\'Vaughn House',
            'product' => 'Blog Subscription',
        ]);
    }
}
```

---

### Webhook Handler

```php
// app/Http/Controllers/WebhookController.php

namespace App\Http\Controllers;

use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;

class WebhookController extends CashierController
{
    /**
     * Handle subscription updated.
     */
    public function handleCustomerSubscriptionUpdated(array $payload)
    {
        parent::handleCustomerSubscriptionUpdated($payload);
        
        // Custom logic after subscription update
        $user = $this->getUserByStripeId($payload['data']['object']['customer']);
        
        if ($user) {
            // Send email notification
            // Log to analytics
            // Update user permissions
        }
    }
    
    /**
     * Handle successful payment.
     */
    public function handleInvoicePaymentSucceeded(array $payload)
    {
        parent::handleInvoicePaymentSucceeded($payload);
        
        // Send thank you email
        // Update analytics
    }
    
    /**
     * Handle failed payment.
     */
    public function handleInvoicePaymentFailed(array $payload)
    {
        parent::handleInvoicePaymentFailed($payload);
        
        $user = $this->getUserByStripeId($payload['data']['object']['customer']);
        
        if ($user) {
            // Send payment failed notification
            \Mail::to($user)->send(new PaymentFailedMail($user));
        }
    }
}
```

**Register webhook in routes/web.php:**
```php
// Exclude from CSRF verification in app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'stripe/webhook',
];
```

---

### Middleware for Subscription Gates

```php
// app/Http/Middleware/RequireSubscription.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireSubscription
{
    public function handle(Request $request, Closure $next, string $tier = 'pro')
    {
        $user = auth()->user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        $userTier = $user->currentTier();
        $tierHierarchy = ['free' => 0, 'pro' => 1, 'premium' => 2];
        
        if ($tierHierarchy[$userTier] < $tierHierarchy[$tier]) {
            return redirect()->route('pricing')
                ->with('error', 'This feature requires a ' . ucfirst($tier) . ' subscription.');
        }
        
        return $next($request);
    }
}

// Register in app/Http/Kernel.php
protected $middlewareAliases = [
    // ... other middleware
    'subscription' => \App\Http\Middleware\RequireSubscription::class,
];
```

**Usage in routes:**
```php
// Comments require Pro tier
Route::post('/blog/{slug}/comments', [CommentController::class, 'store'])
    ->middleware(['auth', 'subscription:pro']);

// Template library requires Premium
Route::get('/templates', [TemplateController::class, 'index'])
    ->middleware(['auth', 'subscription:premium']);
```

---

### Updated Article Controller with Subscription Logic

```php
// app/Http/Controllers/ArticleController.php

public function show(string $slug)
{
    $article = Article::where('slug', $slug)
        ->where('status', 'published')
        ->with(['author', 'tags'])
        ->firstOrFail();
    
    $user = auth()->user();
    
    // Anonymous users: preview only
    if (!$user) {
        return view('articles.preview', compact('article'));
    }
    
    // Check access permissions
    if (!$user->canAccessArticle($article)) {
        $articlesRemaining = null;
        
        // Free user hit monthly limit
        if ($user->currentTier() === 'free') {
            $articlesRead = $user->articlesReadThisMonth();
            $articlesRemaining = max(0, 3 - $articlesRead);
            
            if ($articlesRemaining === 0) {
                return view('articles.upgrade-prompt', compact('article', 'articlesRead'));
            }
        }
        
        // Wrong tier (e.g., Pro user trying to view Premium content)
        return view('articles.tier-gate', [
            'article' => $article,
            'requiredTier' => $article->required_tier,
            'userTier' => $user->currentTier(),
        ]);
    }
    
    // User has access - track the read
    $user->trackArticleRead($article);
    
    // Increment view count
    $article->increment('view_count');
    
    return view('articles.show', compact('article'));
}
```

---

### Pricing Page Blade Template

```blade
<!-- resources/views/subscription/pricing.blade.php -->

<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p class="text-xl text-gray-600">Get full access to insights on research, systems, and creative work.</p>
        </div>
        
        <!-- Billing Toggle -->
        <div class="flex justify-center mb-8">
            <div class="bg-gray-100 rounded-lg p-1">
                <button class="px-6 py-2 rounded-md" id="monthly-toggle">Monthly</button>
                <button class="px-6 py-2 rounded-md" id="yearly-toggle">Yearly <span class="text-green-600 text-sm ml-1">Save 17%</span></button>
            </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
            <!-- Free Tier -->
            <div class="border rounded-lg p-8">
                <h3 class="text-2xl font-bold mb-2">Free</h3>
                <p class="text-4xl font-bold mb-6">$0<span class="text-lg text-gray-600">/mo</span></p>
                
                <ul class="space-y-3 mb-8">
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>3 full articles per month</span>
                    </li>
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>Unlimited previews</span>
                    </li>
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>Email updates</span>
                    </li>
                </ul>
                
                @guest
                    <a href="{{ route('register') }}" class="block w-full text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Get Started
                    </a>
                @else
                    @if($currentTier === 'free')
                        <button disabled class="block w-full text-center px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                            Current Plan
                        </button>
                    @endif
                @endguest
            </div>
            
            <!-- Pro Tier -->
            <div class="border-2 border-blue-500 rounded-lg p-8 relative">
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
                
                <h3 class="text-2xl font-bold mb-2">Pro</h3>
                <p class="text-4xl font-bold mb-6">
                    <span class="monthly-price">$9</span>
                    <span class="yearly-price hidden">$7.50</span>
                    <span class="text-lg text-gray-600">/mo</span>
                </p>
                
                <ul class="space-y-3 mb-8">
                    @foreach(config('subscriptions.pro.features') as $feature)
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>{{ $feature }}</span>
                    </li>
                    @endforeach
                </ul>
                
                @auth
                    @if($currentTier === 'pro')
                        <button disabled class="block w-full text-center px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                            Current Plan
                        </button>
                    @else
                        <button onclick="subscribe('pro')" class="block w-full text-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Start 7-Day Trial
                        </button>
                    @endif
                @else
                    <a href="{{ route('register') }}" class="block w-full text-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Start 7-Day Trial
                    </a>
                @endauth
            </div>
            
            <!-- Premium Tier -->
            <div class="border rounded-lg p-8">
                <h3 class="text-2xl font-bold mb-2">Premium</h3>
                <p class="text-4xl font-bold mb-6">
                    <span class="monthly-price">$29</span>
                    <span class="yearly-price hidden">$24.17</span>
                    <span class="text-lg text-gray-600">/mo</span>
                </p>
                
                <ul class="space-y-3 mb-8">
                    @foreach(config('subscriptions.premium.features') as $feature)
                    <li class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>{{ $feature }}</span>
                    </li>
                    @endforeach
                </ul>
                
                @auth
                    @if($currentTier === 'premium')
                        <button disabled class="block w-full text-center px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                            Current Plan
                        </button>
                    @else
                        <button onclick="subscribe('premium')" class="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                            Start 7-Day Trial
                        </button>
                    @endif
                @else
                    <a href="{{ route('register') }}" class="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                        Start 7-Day Trial
                    </a>
                @endauth
            </div>
        </div>
        
        <p class="text-center text-gray-600 mt-8">All plans include a 7-day free trial. Cancel anytime.</p>
    </div>
    
    @auth
    <!-- Stripe Checkout Modal -->
    <div id="checkout-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <h3 class="text-2xl font-bold mb-4">Complete Your Subscription</h3>
                
                <form id="payment-form">
                    @csrf
                    <input type="hidden" id="selected-tier" name="tier">
                    <input type="hidden" id="selected-interval" name="interval">
                    
                    <div id="card-element" class="border rounded p-3 mb-4"></div>
                    <div id="card-errors" class="text-red-600 text-sm mb-4"></div>
                    
                    <button type="submit" id="submit-payment" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                        Start Trial
                    </button>
                    <button type="button" onclick="closeModal()" class="w-full mt-2 text-gray-600 hover:text-gray-800">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <script src="https://js.stripe.com/v3/"></script>
    <script>
        const stripe = Stripe('{{ config('cashier.key') }}');
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        
        let billingInterval = 'monthly';
        
        document.addEventListener('DOMContentLoaded', function() {
            cardElement.mount('#card-element');
            
            // Toggle billing interval
            document.getElementById('monthly-toggle').addEventListener('click', function() {
                billingInterval = 'monthly';
                this.classList.add('bg-white');
                document.getElementById('yearly-toggle').classList.remove('bg-white');
                document.querySelectorAll('.monthly-price').forEach(el => el.classList.remove('hidden'));
                document.querySelectorAll('.yearly-price').forEach(el => el.classList.add('hidden'));
            });
            
            document.getElementById('yearly-toggle').addEventListener('click', function() {
                billingInterval = 'yearly';
                this.classList.add('bg-white');
                document.getElementById('monthly-toggle').classList.remove('bg-white');
                document.querySelectorAll('.monthly-price').forEach(el => el.classList.add('hidden'));
                document.querySelectorAll('.yearly-price').forEach(el => el.classList.remove('hidden'));
            });
        });
        
        function subscribe(tier) {
            document.getElementById('selected-tier').value = tier;
            document.getElementById('selected-interval').value = billingInterval;
            document.getElementById('checkout-modal').classList.remove('hidden');
        }
        
        function closeModal() {
            document.getElementById('checkout-modal').classList.add('hidden');
        }
        
        const form = document.getElementById('payment-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = document.getElementById('submit-payment');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            
            if (error) {
                document.getElementById('card-errors').textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Start Trial';
            } else {
                const tier = document.getElementById('selected-tier').value;
                const interval = document.getElementById('selected-interval').value;
                
                // Submit to server
                fetch(`/subscribe/${tier}/${interval}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                    },
                    body: JSON.stringify({
                        paymentMethod: paymentMethod.id
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/dashboard';
                    } else {
                        document.getElementById('card-errors').textContent = data.error;
                        submitButton.disabled = false;
                        submitButton.textContent = 'Start Trial';
                    }
                });
            }
        });
    </script>
    @endauth
</x-app-layout>
```

---

### Billing Portal Page

```blade
<!-- resources/views/subscription/billing.blade.php -->

<x-app-layout>
    <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Billing & Subscription</h1>
        
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {{ session('success') }}
            </div>
        @endif
        
        @if($subscription)
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Current Subscription</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <p class="text-gray-600 text-sm">Plan</p>
                    <p class="text-lg font-semibold">{{ ucfirst($currentTier) }}</p>
                </div>
                
                <div>
                    <p class="text-gray-600 text-sm">Status</p>
                    <p class="text-lg font-semibold">
                        @if($subscription->onTrial())
                            <span class="text-blue-600">Trial (ends {{ $subscription->trial_ends_at->format('M j, Y') }})</span>
                        @elseif($subscription->onGracePeriod())
                            <span class="text-yellow-600">Cancelled (access until {{ $subscription->ends_at->format('M j, Y') }})</span>
                        @elseif($subscription->active())
                            <span class="text-green-600">Active</span>
                        @else
                            <span class="text-red-600">Inactive</span>
                        @endif
                    </p>
                </div>
                
                @if(!$subscription->onGracePeriod() && !$subscription->cancelled())
                <div>
                    <p class="text-gray-600 text-sm">Next Billing Date</p>
                    <p class="text-lg font-semibold">{{ $subscription->asStripeSubscription()->current_period_end }}</p>
                </div>
                @endif
            </div>
            
            <div class="mt-6 flex gap-4">
                @if($subscription->onGracePeriod())
                    <form method="POST" action="{{ route('subscription.resume') }}">
                        @csrf
                        <button type="submit" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Resume Subscription
                        </button>
                    </form>
                @else
                    <a href="{{ route('pricing') }}" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Change Plan
                    </a>
                    
                    <form method="POST" action="{{ route('subscription.cancel') }}" 
                          onsubmit="return confirm('Are you sure you want to cancel? You\'ll have access until the end of your billing period.')">
                        @csrf
                        <button type="submit" class="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                            Cancel Subscription
                        </button>
                    </form>
                @endif
            </div>
        </div>
        @else
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p class="text-blue-900 font-semibold mb-2">You're on the Free plan</p>
            <p class="text-blue-800 mb-4">Upgrade to unlock unlimited articles, comments, and more.</p>
            <a href="{{ route('pricing') }}" class="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                View Plans
            </a>
        </div>
        @endif
        
        @if($paymentMethod)
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Payment Method</h2>
            
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="w-8 h-8 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <div>
                        <p class="font-semibold">{{ ucfirst($paymentMethod->card->brand) }} •••• {{ $paymentMethod->card->last4 }}</p>
                        <p class="text-sm text-gray-600">Expires {{ $paymentMethod->card->exp_month }}/{{ $paymentMethod->card->exp_year }}</p>
                    </div>
                </div>
                
                <a href="{{ route('billing.payment-method') }}" class="text-blue-500 hover:text-blue-600">
                    Update
                </a>
            </div>
        </div>
        @endif
        
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Billing History</h2>
            
            @if($invoices->count() > 0)
            <div class="space-y-4">
                @foreach($invoices as $invoice)
                <div class="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                        <p class="font-semibold">{{ $invoice->date()->format('F j, Y') }}</p>
                        <p class="text-sm text-gray-600">{{ $invoice->total() }}</p>
                    </div>
                    
                    <a href="{{ route('billing.invoice', $invoice->id) }}" 
                       class="text-blue-500 hover:text-blue-600 text-sm font-semibold">
                        Download PDF
                    </a>
                </div>
                @endforeach
            </div>
            @else
            <p class="text-gray-600">No invoices yet.</p>
            @endif
        </div>
    </div>
</x-app-layout>
```

---

### Update Payment Method Page

```blade
<!-- resources/views/subscription/payment-method.blade.php -->

<x-app-layout>
    <div class="max-w-md mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Update Payment Method</h1>
        
        <div class="bg-white rounded-lg shadow p-6">
            <form id="payment-method-form">
                @csrf
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold mb-2">Card Information</label>
                    <div id="card-element" class="border rounded p-3"></div>
                    <div id="card-errors" class="text-red-600 text-sm mt-2"></div>
                </div>
                
                <button type="submit" id="submit-button" 
                        class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
                    Update Payment Method
                </button>
                
                <a href="{{ route('billing') }}" class="block text-center mt-4 text-gray-600 hover:text-gray-800">
                    Cancel
                </a>
            </form>
        </div>
    </div>
    
    <script src="https://js.stripe.com/v3/"></script>
    <script>
        const stripe = Stripe('{{ config('cashier.key') }}');
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        
        cardElement.mount('#card-element');
        
        cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        const form = document.getElementById('payment-method-form');
        const submitButton = document.getElementById('submit-button');
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            const { setupIntent, error } = await stripe.confirmCardSetup(
                '{{ $intent->client_secret }}',
                {
                    payment_method: {
                        card: cardElement,
                    }
                }
            );
            
            if (error) {
                document.getElementById('card-errors').textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Update Payment Method';
            } else {
                // Submit to server
                fetch('{{ route('billing.update-payment-method') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        paymentMethod: setupIntent.payment_method
                    })
                })
                .then(response => response.json())
                .then(data => {
                    window.location.href = '{{ route('billing') }}';
                });
            }
        });
    </script>
</x-app-layout>
```

---

### Article Gate Views

**Preview View (Anonymous Users)**
```blade
<!-- resources/views/articles/preview.blade.php -->

<x-app-layout>
    <article class="max-w-3xl mx-auto px-4 py-12">
        <header class="mb-8">
            <h1 class="text-4xl font-bold mb-4">{{ $article->title }}</h1>
            @if($article->subtitle)
                <p class="text-xl text-gray-600 mb-4">{{ $article->subtitle }}</p>
            @endif
            <div class="flex items-center text-sm text-gray-600">
                <span>{{ $article->published_at->format('F j, Y') }}</span>
                <span class="mx-2">•</span>
                <span>{{ $article->read_time_minutes }} min read</span>
            </div>
        </header>
        
        @if($article->hero_image_url)
            <img src="{{ $article->hero_image_url }}" alt="{{ $article->title }}" class="w-full rounded-lg mb-8">
        @endif
        
        <div class="prose prose-lg max-w-none">
            {!! $article->getPreviewHtml() !!}
        </div>
        
        <!-- Paywall Overlay -->
        <div class="relative -mt-32">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white h-32"></div>
        </div>
        
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 text-center">
            <h3 class="text-2xl font-bold mb-2">Want to keep reading?</h3>
            <p class="text-gray-700 mb-6">Create a free account to access this article and {{ $article->remainingArticleCount() }} more this month.</p>
            
            <a href="{{ route('register') }}" class="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
                Create Free Account
            </a>
            
            <p class="text-sm text-gray-600 mt-4">
                Already have an account? <a href="{{ route('login') }}" class="text-blue-500 hover:text-blue-600">Sign in</a>
            </p>
        </div>
    </article>
</x-app-layout>
```

**Upgrade Prompt (Free User Hit Limit)**
```blade
<!-- resources/views/articles/upgrade-prompt.blade.php -->

<x-app-layout>
    <article class="max-w-3xl mx-auto px-4 py-12">
        <header class="mb-8">
            <h1 class="text-4xl font-bold mb-4">{{ $article->title }}</h1>
            @if($article->subtitle)
                <p class="text-xl text-gray-600 mb-4">{{ $article->subtitle }}</p>
            @endif
        </header>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-semibold text-yellow-800">You've reached your free article limit</h3>
                    <p class="mt-2 text-sm text-yellow-700">
                        You've read {{ $articlesRead }} of your 3 free articles this month. Upgrade to Pro for unlimited access.
                    </p>
                </div>
            </div>
        </div>
        
        <div class="bg-white border-2 border-blue-500 rounded-lg p-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Unlock Unlimited Access</h2>
            
            <div class="inline-block mb-6">
                <p class="text-5xl font-bold">$9<span class="text-xl text-gray-600">/month</span></p>
                <p class="text-sm text-gray-600">or $90/year (save 17%)</p>
            </div>
            
            <ul class="text-left max-w-sm mx-auto mb-8 space-y-3">
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Unlimited articles</span>
                </li>
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Comments and discussions</span>
                </li>
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Bookmark library</span>
                </li>
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>7-day free trial</span>
                </li>
            </ul>
            
            <a href="{{ route('pricing') }}" class="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-lg">
                Start Free Trial
            </a>
            
            <p class="text-sm text-gray-600 mt-4">Cancel anytime. No questions asked.</p>
        </div>
        
        <div class="mt-8 text-center">
            <a href="{{ route('blog.index') }}" class="text-blue-500 hover:text-blue-600">
                ← Back to all articles
            </a>
        </div>
    </article>
</x-app-layout>
```

**Tier Gate (Pro User Viewing Premium Content)**
```blade
<!-- resources/views/articles/tier-gate.blade.php -->

<x-app-layout>
    <article class="max-w-3xl mx-auto px-4 py-12">
        <header class="mb-8">
            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full mb-4">
                Premium Content
            </span>
            <h1 class="text-4xl font-bold mb-4">{{ $article->title }}</h1>
            @if($article->subtitle)
                <p class="text-xl text-gray-600 mb-4">{{ $article->subtitle }}</p>
            @endif
        </header>
        
        @if($article->hero_image_url)
            <img src="{{ $article->hero_image_url }}" alt="{{ $article->title }}" class="w-full rounded-lg mb-8">
        @endif
        
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-8 text-center">
            <svg class="w-16 h-16 text-purple-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
            </svg>
            
            <h2 class="text-3xl font-bold mb-2">This is Premium Content</h2>
            <p class="text-gray-700 mb-6">
                You're currently on the {{ ucfirst($userTier) }} plan. Upgrade to Premium to access this article and exclusive features.
            </p>
            
            <div class="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
                <p class="text-4xl font-bold mb-2">$29<span class="text-lg text-gray-600">/month</span></p>
                <p class="text-sm text-gray-600 mb-4">or $290/year</p>
                
                <ul class="text-left space-y-2 text-sm">
                    <li class="flex items-center">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Audio versions of all articles
                    </li>
                    <li class="flex items-center">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Early access to new content
                    </li>
                    <li class="flex items-center">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Monthly office hours
                    </li>
                    <li class="flex items-center">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Template library access
                    </li>
                </ul>
            </div>
            
            <a href="{{ route('pricing') }}" class="inline-block px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-lg">
                Upgrade to Premium
            </a>
        </div>
    </article>
</x-app-layout>
```

---

### Article Model Helper Methods

```php
// app/Models/Article.php

public function getPreviewHtml(): string
{
    $markdown = new \League\CommonMark\CommonMarkConverter();
    $lines = explode("\n\n", $this->content);
    
    // Get first 3 paragraphs
    $preview = implode("\n\n", array_slice($lines, 0, 3));
    
    return $markdown->convert($preview);
}

public function remainingArticleCount(): int
{
    // Count total published articles that require Pro or above
    return static::where('status', 'published')
        ->whereIn('required_tier', ['pro', 'premium'])
        ->count();
}
```

---

### Stripe Webhook Setup

**In Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/stripe/webhook`
3. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

**Verify webhook in routes:**
```php
// app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'stripe/webhook',
];
```

---

### Seeder for Subscription Tiers

```php
// database/seeders/SubscriptionTierSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionTier;

class SubscriptionTierSeeder extends Seeder
{
    public function run()
    {
        SubscriptionTier::create([
            'name' => 'Pro Monthly',
            'slug' => 'pro-monthly',
            'stripe_price_id' => env('STRIPE_PRO_MONTHLY_PRICE_ID'),
            'price_cents' => 900,
            'interval' => 'month',
            'features' => json_encode([
                'Unlimited articles',
                'Comments and @mentions',
                'Bookmark library',
                'Reading progress tracking',
                'Priority email support'
            ]),
            'sort_order' => 1,
        ]);
        
        SubscriptionTier::create([
            'name' => 'Pro Yearly',
            'slug' => 'pro-yearly',
            'stripe_price_id' => env('STRIPE_PRO_YEARLY_PRICE_ID'),
            'price_cents' => 9000,
            'interval' => 'year',
            'features' => json_encode([
                'Unlimited articles',
                'Comments and @mentions',
                'Bookmark library',
                'Reading progress tracking',
                'Priority email support',
                'Save 17% vs monthly'
            ]),
            'sort_order' => 2,
        ]);
        
        SubscriptionTier::create([
            'name' => 'Premium Monthly',
            'slug' => 'premium-monthly',
            'stripe_price_id' => env('STRIPE_PREMIUM_MONTHLY_PRICE_ID'),
            'price_cents' => 2900,
            'interval' => 'month',
            'features' => json_encode([
                'Everything in Pro',
                'Audio versions of articles',
                'Early access (48hrs)',
                'Monthly office hours',
                'Template library access',
                'Private community'
            ]),
            'sort_order' => 3,
        ]);
        
        SubscriptionTier::create([
            'name' => 'Premium Yearly',
            'slug' => 'premium-yearly',
            'stripe_price_id' => env('STRIPE_PREMIUM_YEARLY_PRICE_ID'),
            'price_cents' => 29000,
            'interval' => 'year',
            'features' => json_encode([
                'Everything in Pro',
                'Audio versions of articles',
                'Early access (48hrs)',
                'Monthly office hours',
                'Template library access',
                'Private community',
                'Save 17% vs monthly'
            ]),
            'sort_order' => 4,
        ]);
    }
}
```

---

## Testing Subscription Flow

### Local Testing with Stripe Test Mode

1. **Use test credit cards:**
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0025 0000 3155`
   - Declined: `4000 0000 0000 9995`
   - Use any future expiry date and any CVC

2. **Test webhook locally:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/stripe/webhook

# Copy webhook signing secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Trigger test events:**
```bash
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

---

## Open Questions & Future Enhancements

**V1 Scope (Ship First):**
- Basic blog with auth gate ✓
- Laravel Cashier integration ✓
- Free tier (3 articles/month) ✓
- Pro tier (unlimited articles, comments) ✓
- Premium tier (audio, early access, templates) ✓
- Subscription management portal ✓
- Email notifications
- Admin CMS

**V2 Considerations:**
- **Gift subscriptions** (buy Pro/Premium for someone else)
- **Team accounts** (one subscription, multiple users for companies)
- **Coupon codes** (promotional discounts, affiliate revenue share)
- **Annual vs monthly toggle** with savings visualization
- **Pause subscription** (3-month pause for Pro users)
- **Content bundles** (pay per article pack: $5 for 10 articles)
- **Lifetime access tier** (one-time payment for permanent access)
- **Search with Algolia/Meilisearch** (better than SQL LIKE queries)
- **Audio versions** (embed for each article, leverage your vocal work)
- **Collaborative drafts** (invite co-authors)
- **Newsletter-only posts** (exclusive to email subscribers)
- **RSS feed** for logged-in users
- **Reading streaks** ("You've read 7 days in a row!")
- **Social proof** on paywalled articles ("Join 1,247 readers")
- **Referral program** (get 1 month free for each referral)
- **Student discount** (50% off with .edu email)
- **Annual review** (personalized reading stats at year end)

---

## Revenue Optimization Strategies

### Pricing Psychology
- **Anchor high, sell middle:** Premium at $29 makes Pro at $9 look reasonable
- **Annual savings:** 17% discount incentivizes upfront payment (better cash flow)
- **Trial period:** 7 days converts better than no trial, but not so long they forget
- **Free tier value:** 3 articles hits sweet spot between taste and limitation

### Conversion Funnels to Track
1. **Anonymous → Free account:** % who sign up after hitting preview gate
2. **Free → Trial:** % who start trial after hitting 3-article limit
3. **Trial → Paid:** % who convert after 7-day trial
4. **Monthly → Annual:** % who upgrade billing frequency
5. **Pro → Premium:** % who upgrade tiers

### Pricing Experiments to Run
- A/B test 3 vs 5 free articles per month
- Test removing trial entirely (higher intent subscribers)
- Experiment with $10/mo Pro pricing vs $9/mo
- Try $19/mo Premium vs $29/mo
- Offer annual-only at $99 vs monthly option

---

## Email Automation Sequences

### Trial Start Sequence
**Day 0 (Immediate):**
- Subject: "Welcome to your 7-day trial 🎉"
- Content: How to get the most value, link to most popular articles

**Day 2:**
- Subject: "Have you seen these yet?"
- Content: 3 curated articles based on signup source/interests

**Day 4:**
- Subject: "Your trial ends in 3 days"
- Content: Testimonial + reminder of what they'll lose access to

**Day 6:**
- Subject: "Last chance: Trial ends tomorrow"
- Content: One-click to upgrade, emphasize no credit card hassle

**Day 8 (if didn't convert):**
- Subject: "We miss you already"
- Content: Special offer (15% off first month) to come back

### Active Subscriber Sequence
**Monthly:**
- Subject: "This month in [Research/Systems/Creative]"
- Content: Roundup of new articles, comment highlights, upcoming content

**Quarterly:**
- Subject: "Your reading stats for Q[X]"
- Content: Articles read, hours spent, favorite topics, reading streak

### Churn Prevention Sequence
**When subscription cancelled:**
- Immediate: Survey asking why they're leaving
- 3 days before access ends: "Is there anything we can do?"
- Day access ends: "Your bookmarks are waiting" (offer to pause instead)
- 30 days after churn: "Here's what you've missed" (re-engagement)

### Payment Failed Sequence
**Immediately:**
- Subject: "Payment issue with your subscription"
- Content: Update payment method link, access ends in 3 days

**Day 2:**
- Subject: "Action needed: Update payment method"
- Content: More urgent tone, emphasize loss of access

**Day 3:**
- Subject: "Final reminder: Your subscription will be cancelled"
- Content: Last chance to update card

**Post-cancellation:**
- Subject: "Your subscription was cancelled due to payment failure"
- Content: Easy reactivation link, no re-trial needed

---

## Analytics Dashboard for Admin

### Key Metrics to Track

**Revenue Metrics:**
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (CLV)
- Churn rate (monthly and annual)

**Growth Metrics:**
- New free signups (by source)
- Free → Trial conversion rate
- Trial → Paid conversion rate
- Monthly → Annual upgrade rate
- Pro → Premium upgrade rate

**Engagement Metrics:**
- Articles read per user (by tier)
- Comments per user
- Bookmark rate
- Return visit rate (7-day, 30-day)
- Reading streak distribution

**Content Performance:**
- Top articles by views (by tier)
- Articles driving most signups
- Articles driving most upgrades
- Average time on article
- Completion rate (scroll depth)

### Sample Analytics Queries

```php
// MRR Calculation
$mrr = User::whereHas('subscription', function($q) {
    $q->where('stripe_status', 'active');
})->get()->sum(function($user) {
    $subscription = $user->subscription('default');
    $price = $subscription->asStripeSubscription()->plan->amount;
    $interval = $subscription->asStripeSubscription()->plan->interval;
    
    return $interval === 'year' ? $price / 12 : $price;
}) / 100; // Convert from cents

// Churn Rate (last 30 days)
$startCount = User::whereHas('subscription', function($q) {
    $q->where('created_at', '<=', now()->subDays(30));
})->count();

$churned = User::whereHas('subscription', function($q) {
    $q->whereBetween('ends_at', [now()->subDays(30), now()])
      ->whereNull('stripe_status', 'active');
})->count();

$churnRate = ($churned / $startCount) * 100;

// Trial conversion rate
$trialsStarted = User::whereHas('subscription', function($q) {
    $q->whereBetween('trial_ends_at', [now()->subDays(30), now()]);
})->count();

$trialsConverted = User::whereHas('subscription', function($q) {
    $q->whereBetween('trial_ends_at', [now()->subDays(30), now()])
      ->where('stripe_status', 'active');
})->count();

$conversionRate = ($trialsConverted / $trialsStarted) * 100;
```

---

## Admin CMS Updates for Tiered Content

### Article Editor Additions

```blade
<!-- In article create/edit form -->

<div class="mb-6">
    <label class="block text-sm font-semibold mb-2">Access Level</label>
    <select name="required_tier" class="w-full border rounded p-2">
        <option value="free" {{ old('required_tier', $article->required_tier) === 'free' ? 'selected' : '' }}>
            Free (Everyone)
        </option>
        <option value="pro" {{ old('required_tier', $article->required_tier) === 'pro' ? 'selected' : '' }}>
            Pro & Premium Only
        </option>
        <option value="premium" {{ old('required_tier', $article->required_tier) === 'premium' ? 'selected' : '' }}>
            Premium Only
        </option>
    </select>
    <p class="text-sm text-gray-600 mt-1">
        Free users get 3 Pro articles/month. Premium content requires Premium subscription.
    </p>
</div>

<div class="mb-6">
    <label class="flex items-center">
        <input type="checkbox" name="is_premium_preview" value="1" 
               {{ old('is_premium_preview', $article->is_premium_preview) ? 'checked' : '' }}
               class="mr-2">
        <span class="text-sm font-semibold">Allow preview for Premium content</span>
    </label>
    <p class="text-sm text-gray-600 ml-6">
        Show first 3 paragraphs even for Premium articles (drives upgrades)
    </p>
</div>

<!-- Audio version upload (Premium feature) -->
@if($article->required_tier === 'premium')
<div class="mb-6">
    <label class="block text-sm font-semibold mb-2">Audio Version (Optional)</label>
    <input type="file" name="audio_file" accept="audio/*" class="w-full">
    
    @if($article->audio_url)
        <div class="mt-2">
            <p class="text-sm text-gray-600">Current audio:</p>
            <audio controls src="{{ $article->audio_url }}" class="w-full mt-1"></audio>
            <label class="flex items-center mt-2">
                <input type="checkbox" name="remove_audio" value="1" class="mr-2">
                <span class="text-sm">Remove audio file</span>
            </label>
        </div>
    @endif
</div>
@endif
```

### Analytics Panel in Admin

```blade
<!-- resources/views/admin/analytics.blade.php -->

<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        
        <!-- Revenue Overview -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-600 mb-1">MRR</p>
                <p class="text-3xl font-bold">${{ number_format($mrr, 0) }}</p>
                <p class="text-sm text-green-600 mt-1">↑ {{ $mrrGrowth }}% vs last month</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-600 mb-1">Total Subscribers</p>
                <p class="text-3xl font-bold">{{ $totalSubscribers }}</p>
                <p class="text-sm text-gray-600 mt-1">
                    {{ $proCount }} Pro / {{ $premiumCount }} Premium
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-600 mb-1">Churn Rate</p>
                <p class="text-3xl font-bold">{{ number_format($churnRate, 1) }}%</p>
                <p class="text-sm {{ $churnRate < 5 ? 'text-green-600' : 'text-red-600' }} mt-1">
                    {{ $churnRate < 5 ? 'Good' : 'Needs attention' }}
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-600 mb-1">Trial Conversion</p>
                <p class="text-3xl font-bold">{{ number_format($trialConversion, 0) }}%</p>
                <p class="text-sm text-gray-600 mt-1">{{ $activeTrials }} active trials</p>
            </div>
        </div>
        
        <!-- Conversion Funnel -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-bold mb-4">Conversion Funnel (Last 30 Days)</h2>
            
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-semibold">Anonymous Visitors</span>
                        <span class="text-sm font-semibold">{{ number_format($visitors) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-blue-500 h-4 rounded-full" style="width: 100%"></div>
                    </div>
                </div>
                
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-semibold">Free Signups</span>
                        <span class="text-sm font-semibold">{{ number_format($signups) }} ({{ number_format(($signups/$visitors)*100, 1) }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-blue-500 h-4 rounded-full" style="width: {{ ($signups/$visitors)*100 }}%"></div>
                    </div>
                </div>
                
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-semibold">Started Trials</span>
                        <span class="text-sm font-semibold">{{ number_format($trials) }} ({{ number_format(($trials/$signups)*100, 1) }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-blue-500 h-4 rounded-full" style="width: {{ ($trials/$visitors)*100 }}%"></div>
                    </div>
                </div>
                
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-semibold">Paid Subscribers</span>
                        <span class="text-sm font-semibold">{{ number_format($paid) }} ({{ number_format(($paid/$trials)*100, 1) }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-green-500 h-4 rounded-full" style="width: {{ ($paid/$visitors)*100 }}%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Top Articles -->
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Top Articles by Views</h2>
                <div class="space-y-3">
                    @foreach($topArticlesByViews as $article)
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <a href="{{ route('articles.show', $article->slug) }}" class="text-blue-500 hover:text-blue-600 font-semibold">
                                {{ Str::limit($article->title, 50) }}
                            </a>
                            <p class="text-xs text-gray-600">
                                <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ $article->required_tier }}</span>
                            </p>
                        </div>
                        <span class="text-sm font-semibold ml-4">{{ number_format($article->view_count) }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Articles Driving Conversions</h2>
                <div class="space-y-3">
                    @foreach($topArticlesByConversions as $article)
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <a href="{{ route('articles.show', $article->slug) }}" class="text-blue-500 hover:text-blue-600 font-semibold">
                                {{ Str::limit($article->title, 50) }}
                            </a>
                        </div>
                        <span class="text-sm font-semibold ml-4">{{ $article->conversions }} signups</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
```

---

## Migration Files Summary

Here are all the migrations you'll need to run:

```bash
# 1. Install Cashier migrations
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate

# 2. Create custom migration for subscription features
php artisan make:migration add_subscription_fields_to_users_table
php artisan make:migration create_subscription_tiers_table
php artisan make:migration add_tier_to_articles_table
php artisan make:migration create_article_reads_table
php artisan migrate

# 3. Seed subscription tiers
php artisan db:seed --class=SubscriptionTierSeeder
```

**Migration: add_subscription_fields_to_users_table**
```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('stripe_id')->nullable()->index()->after('id');
        $table->string('pm_type')->nullable()->after('stripe_id');
        $table->string('pm_last_four', 4)->nullable()->after('pm_type');
        $table->timestamp('trial_ends_at')->nullable()->after('pm_last_four');
    });
}
```

**Migration: create_subscription_tiers_table**
```php
public function up()
{
    Schema::create('subscription_tiers', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->string('stripe_price_id');
        $table->integer('price_cents');
        $table->enum('interval', ['month', 'year']);
        $table->json('features');
        $table->boolean('is_active')->default(true);
        $table->integer('sort_order')->default(0);
        $table->timestamps();
    });
}
```

**Migration: add_tier_to_articles_table**
```php
public function up()
{
    Schema::table('articles', function (Blueprint $table) {
        $table->enum('required_tier', ['free', 'pro', 'premium'])->default('free')->after('status');
        $table->boolean('is_premium_preview')->default(false)->after('required_tier');
        $table->string('audio_url')->nullable()->after('hero_image_url');
    });
}
```

**Migration: create_article_reads_table**
```php
public function up()
{
    Schema::create('article_reads', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('article_id')->constrained()->onDelete('cascade');
        $table->integer('progress_percent')->default(0);
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
        
        $table->unique(['user_id', 'article_id']);
    });
}
```

---

## Environment Variables Needed

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_KEY=pk_test_your_key_here
STRIPE_SECRET=sk_test_your_secret_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxx

# Cashier Settings
CASHIER_CURRENCY=usd
CASHIER_CURRENCY_LOCALE=en_US
```

---

## Final Implementation Checklist

### Phase 1: Core Subscription (Week 1-2)
- [ ] Install and configure Laravel Cashier
- [ ] Run all migrations
- [ ] Create Stripe products and prices
- [ ] Build User model subscription methods
- [ ] Create subscription tier seeder
- [ ] Build pricing page
- [ ] Build checkout flow
- [ ] Test trial creation
- [ ] Test payment processing
- [ ] Configure webhook handling

### Phase 2: Content Gating (Week 3)
- [ ] Update Article model with tier methods
- [ ] Create article preview views
- [ ] Create upgrade prompt views
- [ ] Create tier gate views
- [ ] Implement article read tracking
- [ ] Test free tier 3-article limit
- [ ] Test Pro unlimited access
- [ ] Test Premium exclusive content

### Phase 3: Billing Portal (Week 4)
- [ ] Build billing dashboard
- [ ] Build payment method update page
- [ ] Implement subscription cancellation
- [ ] Implement subscription resumption
- [ ] Add invoice downloads
- [ ] Test all billing operations
- [ ] Add cancellation feedback survey

### Phase 4: Admin & Analytics (Week 5)
- [ ] Build analytics dashboard
- [ ] Track MRR and growth metrics
- [ ] Add conversion funnel visualization
- [ ] Create content performance reports
- [ ] Add subscription management to admin
- [ ] Build churn analysis tools

### Phase 5: Email Automation (Week 6)
- [ ] Set up email service (Mailgun/Postmark)
- [ ] Create trial start sequence
- [ ] Create upgrade reminder sequence
- [ ] Create payment failed sequence
- [ ] Create churn prevention sequence
- [ ] Build monthly digest
- [ ] Add unsubscribe management

### Phase 6: Polish & Launch (Week 7)
- [ ] Write 5-10 seed articles
- [ ] Test complete user journeys
- [ ] Load test with simulated traffic
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Create help documentation
- [ ] Prepare launch announcement
- [ ] Set up Google Analytics / Fathom
- [ ] Go live!

---

## Support & Maintenance

**Regular Tasks:**
- Monitor webhook health (daily)
- Review failed payments (daily)
- Analyze churn cohorts (weekly)
- Review top-performing content (weekly)
- Audit trial conversion rates (weekly)
- Update pricing experiments (monthly)
- Review and respond to cancellation feedback (monthly)
- Financial reconciliation with Stripe (monthly)

**Emergency Procedures:**
- Webhook failure: Check Stripe dashboard, verify endpoint URL, check logs
- Payment processing issues: Pause new trials, notify affected users, investigate with Stripe support
- Mass subscription failures: Likely webhook issue, manually sync with Stripe API

---

This PRD now includes complete Laravel Cashier integration with Stripe, tiered subscriptions, content gating, billing portal, analytics, and email automation. You have everything needed to build a production-ready subscription blog platform.

**Next steps:** Start with Phase 1 (Core Subscription), test thoroughly with Stripe test mode, then progressively add each phase. Let me know which section you want to tackle first!

**Technical Debt to Avoid:**
- Don't build custom auth—use Laravel Breeze/Fortify
- Don't skip email verification—prevents spam comments
- Don't store images in database—use S3 or local storage with symlinks
- Don't over-engineer tags—simple many-to-many is fine

---

## Success Criteria for V1 Launch

**Minimum Viable:**
- [ ] 5 published articles ready
- [ ] Anonymous users can preview articles
- [ ] Registration flow works, redirects back to article
- [ ] Logged-in users see full content
- [ ] Commenting system functional
- [ ] Email notifications sending
- [ ] Admin can create/edit/publish articles
- [ ] Mobile responsive

**Nice to Have:**
- [ ] Analytics dashboard showing view counts
- [ ] Weekly digest email setup
- [ ] Bookmarking with reading list
- [ ] Search functionality

**Launch Checklist:**
- [ ] Seed 3-5 articles from existing work (repurpose case studies, insights)
- [ ] Set up transactional email (Mailgun, Postmark, or AWS SES)
- [ ] Configure caching strategy
- [ ] Add SSL certificate
- [ ] Set up backup strategy for database
- [ ] Write privacy policy (mention email usage, comment data)
- [ ] Create 1-page help doc ("How to comment, bookmark, manage email preferences")

---

## Design Principles

**For Anonymous Users:**
- Make value obvious immediately (strong headlines, clear excerpts)
- Low-friction signup (email + password, that's it)
- No credit card, no phone number, no survey

**For Logged-In Users:**
- Distraction-free reading (clean typography, ample whitespace)
- Fast navigation (sticky header, quick links to dashboard)
- Sense of progress (reading list, completion %, comment history)

**For You (Admin):**
- Don't make publishing feel like work (simple editor, keyboard shortcuts)
- Surface what matters (which articles drive signups?)
- Batch tasks (schedule multiple articles, queue emails)

---

## Next Steps

1. **Audit your Laravel Work OS setup** - Confirm user authentication, roles, and email config are working
2. **Create database migrations** for articles, tags, bookmarks, comments, article_reads
3. **Build Article model** with relationships (User, Tags, Comments, Bookmarks)
4. **Create public blog routes + Blade views** (index, show with preview gate)
5. **Add admin routes + CMS** (resourceful controller for articles)
6. **Implement comment system** (polymorphic or dedicated comments table)
7. **Set up email notifications** (queued jobs for digests)
8. **Seed 3-5 articles** from your existing portfolio content
9. **Test complete flow:** anonymous → signup → read → comment → email
10. **Launch and promote** (share on LinkedIn, add to portfolio site)

---

**Questions or clarifications needed before you start building?**
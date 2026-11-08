<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title', 120);
            $table->string('subtitle', 200)->nullable();
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('excerpt', 200);
            $table->string('hero_image_path')->nullable();
            $table->string('category', 32);
            $table->string('status', 32)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('read_time_minutes')->default(0);
            $table->string('meta_description', 160)->nullable();
            $table->string('visibility', 32)->default('preview');
            $table->string('required_tier', 16)->default('free');
            $table->boolean('is_premium_preview')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['category', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

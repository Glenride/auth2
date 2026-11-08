<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleRead extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleReadFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'article_id',
        'progress_percent',
        'last_read_at',
        'completed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'article_id' => 'integer',
        'progress_percent' => 'integer',
        'last_read_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function markCompleted(): void
    {
        $this->forceFill([
            'progress_percent' => 100,
            'completed_at' => now(),
            'last_read_at' => now(),
        ])->save();
    }
}

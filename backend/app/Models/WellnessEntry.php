<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WellnessEntry extends Model
{
    protected $fillable = [
        'user_id',
        'entry_date',
        'rating',
        'symptoms',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
            'symptoms' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

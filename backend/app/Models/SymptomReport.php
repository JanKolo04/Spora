<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymptomReport extends Model
{
    protected $fillable = [
        'user_id',
        'report_date',
        'severity',
        'symptoms',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
            'symptoms' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

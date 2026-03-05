<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationReminder extends Model
{
    protected $fillable = [
        'user_id',
        'medication_name',
        'dosage',
        'remind_at',
        'days_of_week',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'days_of_week' => 'array',
            'is_active' => 'boolean',
            'remind_at' => 'datetime:H:i',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

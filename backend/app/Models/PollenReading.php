<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollenReading extends Model
{
    protected $fillable = ['pollen_id', 'concentration', 'level', 'region', 'reading_date'];

    protected function casts(): array
    {
        return [
            'reading_date' => 'date',
        ];
    }

    public function pollen(): BelongsTo
    {
        return $this->belongsTo(Pollen::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pollen extends Model
{
    protected $fillable = ['name', 'icon', 'description'];

    public function readings(): HasMany
    {
        return $this->hasMany(PollenReading::class);
    }

    public function latestReading()
    {
        return $this->hasOne(PollenReading::class)->latestOfMany('reading_date');
    }

    public function allergicUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}

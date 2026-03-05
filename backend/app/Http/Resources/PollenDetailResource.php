<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollenDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'description' => $this->description,
            'readings' => $this->readings->map(function ($reading) {
                return [
                    'id' => $reading->id,
                    'concentration' => $reading->concentration,
                    'quantity' => $reading->quantity,
                    'multiplier' => $reading->multiplier,
                    'result' => $reading->result,
                    'pollen_percentage' => $reading->pollen_percentage,
                    'level' => $reading->level,
                    'region' => $reading->region,
                    'reading_date' => $reading->reading_date->toDateString(),
                ];
            }),
        ];
    }
}

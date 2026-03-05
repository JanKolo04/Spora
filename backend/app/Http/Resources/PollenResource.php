<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'description' => $this->description,
            'latest_reading' => $this->whenLoaded('latestReading', function () {
                return $this->latestReading ? [
                    'concentration' => $this->latestReading->concentration,
                    'quantity' => $this->latestReading->quantity,
                    'multiplier' => $this->latestReading->multiplier,
                    'result' => $this->latestReading->result,
                    'pollen_percentage' => $this->latestReading->pollen_percentage,
                    'level' => $this->latestReading->level,
                    'region' => $this->latestReading->region,
                    'reading_date' => $this->latestReading->reading_date->toDateString(),
                ] : null;
            }),
        ];
    }
}

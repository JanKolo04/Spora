<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WellnessEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entry_date' => $this->entry_date->toDateString(),
            'rating' => $this->rating,
            'symptoms' => $this->symptoms,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}

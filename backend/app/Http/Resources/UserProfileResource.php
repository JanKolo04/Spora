<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'weight' => $this->weight,
            'height' => $this->height,
            'allergen_ids' => $this->whenLoaded('allergens', fn () => $this->allergens->pluck('id')),
        ];
    }
}

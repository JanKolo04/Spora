<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicationReminderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'medication_name' => $this->medication_name,
            'dosage' => $this->dosage,
            'remind_at' => $this->remind_at->format('H:i'),
            'days_of_week' => $this->days_of_week,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}

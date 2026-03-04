<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SymptomReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'report_date' => $this->report_date->format('Y-m-d'),
            'severity' => $this->severity,
            'symptoms' => $this->symptoms,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MedicationReminderResource;
use Illuminate\Http\Request;

class MedicationReminderController extends Controller
{
    public function index(Request $request)
    {
        $reminders = $request->user()
            ->medicationReminders()
            ->orderBy('remind_at')
            ->get();

        return MedicationReminderResource::collection($reminders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medication_name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'remind_at' => 'required|date_format:H:i',
            'days_of_week' => 'required|array|min:1',
            'days_of_week.*' => 'integer|between:0,6',
        ]);

        $reminder = $request->user()->medicationReminders()->create($validated);

        return new MedicationReminderResource($reminder);
    }

    public function update(Request $request, int $id)
    {
        $reminder = $request->user()->medicationReminders()->findOrFail($id);

        $validated = $request->validate([
            'medication_name' => 'sometimes|required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'remind_at' => 'sometimes|required|date_format:H:i',
            'days_of_week' => 'sometimes|required|array|min:1',
            'days_of_week.*' => 'integer|between:0,6',
            'is_active' => 'sometimes|boolean',
        ]);

        $reminder->update($validated);

        return new MedicationReminderResource($reminder);
    }

    public function destroy(Request $request, int $id)
    {
        $reminder = $request->user()->medicationReminders()->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Przypomnienie zostało usunięte.']);
    }
}

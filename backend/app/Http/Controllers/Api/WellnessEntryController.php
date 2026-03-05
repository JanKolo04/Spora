<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WellnessEntryResource;
use Illuminate\Http\Request;

class WellnessEntryController extends Controller
{
    public function index(Request $request)
    {
        $entries = $request->user()
            ->wellnessEntries()
            ->orderByDesc('entry_date')
            ->paginate(20);

        return WellnessEntryResource::collection($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entry_date' => 'required|date',
            'rating' => 'required|integer|between:1,5',
            'symptoms' => 'nullable|array',
            'symptoms.*' => 'string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $entry = $request->user()->wellnessEntries()->updateOrCreate(
            ['entry_date' => $validated['entry_date']],
            $validated
        );

        return new WellnessEntryResource($entry);
    }

    public function show(Request $request, int $id)
    {
        $entry = $request->user()->wellnessEntries()->findOrFail($id);

        return new WellnessEntryResource($entry);
    }

    public function destroy(Request $request, int $id)
    {
        $entry = $request->user()->wellnessEntries()->findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Wpis został usunięty.']);
    }
}

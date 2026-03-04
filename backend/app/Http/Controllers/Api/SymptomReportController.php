<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SymptomReportResource;
use Illuminate\Http\Request;

class SymptomReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = $request->user()
            ->symptomReports()
            ->orderByDesc('report_date')
            ->paginate(20);

        return SymptomReportResource::collection($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_date' => 'required|date',
            'severity' => 'required|string|in:niski,średni,wysoki,bardzo wysoki',
            'symptoms' => 'required|array|min:1',
            'symptoms.*' => 'string',
            'notes' => 'nullable|string|max:1000',
        ]);

        $report = $request->user()->symptomReports()->create($validated);

        return new SymptomReportResource($report);
    }

    public function destroy(Request $request, int $id)
    {
        $report = $request->user()->symptomReports()->findOrFail($id);
        $report->delete();

        return response()->json(['message' => 'Raport usunięty.']);
    }
}

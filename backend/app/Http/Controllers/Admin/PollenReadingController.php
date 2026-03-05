<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pollen;
use App\Models\PollenReading;
use Illuminate\Http\Request;

class PollenReadingController extends Controller
{
    public function index()
    {
        $readings = PollenReading::with('pollen')
            ->orderByDesc('reading_date')
            ->paginate(20);

        return view('admin.readings.index', compact('readings'));
    }

    public function create()
    {
        $pollens = Pollen::orderBy('name')->get();
        return view('admin.readings.create', compact('pollens'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pollen_id' => 'required|exists:pollens,id',
            'concentration' => 'required|integer|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'multiplier' => 'nullable|numeric|min:0',
            'pollen_percentage' => 'nullable|numeric|min:0|max:100',
            'level' => 'required|in:niski,średni,wysoki,bardzo wysoki',
            'region' => 'required|string|max:255',
            'reading_date' => 'required|date',
        ]);

        if (isset($validated['quantity']) && isset($validated['multiplier'])) {
            $validated['result'] = round($validated['quantity'] * $validated['multiplier'], 2);
        }

        PollenReading::create($validated);

        return redirect()->route('admin.readings.index')->with('success', 'Odczyt został dodany.');
    }

    public function edit(PollenReading $reading)
    {
        $pollens = Pollen::orderBy('name')->get();
        return view('admin.readings.edit', compact('reading', 'pollens'));
    }

    public function update(Request $request, PollenReading $reading)
    {
        $validated = $request->validate([
            'pollen_id' => 'required|exists:pollens,id',
            'concentration' => 'required|integer|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'multiplier' => 'nullable|numeric|min:0',
            'pollen_percentage' => 'nullable|numeric|min:0|max:100',
            'level' => 'required|in:niski,średni,wysoki,bardzo wysoki',
            'region' => 'required|string|max:255',
            'reading_date' => 'required|date',
        ]);

        if (isset($validated['quantity']) && isset($validated['multiplier'])) {
            $validated['result'] = round($validated['quantity'] * $validated['multiplier'], 2);
        } else {
            $validated['result'] = null;
        }

        $reading->update($validated);

        return redirect()->route('admin.readings.index')->with('success', 'Odczyt został zaktualizowany.');
    }

    public function destroy(PollenReading $reading)
    {
        $reading->delete();
        return redirect()->route('admin.readings.index')->with('success', 'Odczyt został usunięty.');
    }
}

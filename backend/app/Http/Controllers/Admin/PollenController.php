<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pollen;
use Illuminate\Http\Request;

class PollenController extends Controller
{
    public function index()
    {
        $pollens = Pollen::withCount('readings')->orderBy('name')->get();
        return view('admin.pollens.index', compact('pollens'));
    }

    public function create()
    {
        return view('admin.pollens.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:10',
            'description' => 'nullable|string',
        ]);

        Pollen::create($validated);

        return redirect()->route('admin.pollens.index')->with('success', 'Pyłek został dodany.');
    }

    public function edit(Pollen $pollen)
    {
        return view('admin.pollens.edit', compact('pollen'));
    }

    public function update(Request $request, Pollen $pollen)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:10',
            'description' => 'nullable|string',
        ]);

        $pollen->update($validated);

        return redirect()->route('admin.pollens.index')->with('success', 'Pyłek został zaktualizowany.');
    }

    public function destroy(Pollen $pollen)
    {
        $pollen->delete();
        return redirect()->route('admin.pollens.index')->with('success', 'Pyłek został usunięty.');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PollenResource;
use App\Http\Resources\PollenDetailResource;
use App\Models\Pollen;
use Illuminate\Http\Request;

class PollenController extends Controller
{
    public function index(Request $request)
    {
        $query = Pollen::with(['latestReading']);

        if ($request->has('region')) {
            $region = $request->input('region');
            $query->whereHas('readings', function ($q) use ($region) {
                $q->where('region', $region);
            })->with(['latestReading' => function ($q) use ($region) {
                $q->where('region', $region);
            }]);
        }

        $pollens = $query->get();

        return PollenResource::collection($pollens);
    }

    public function show(Pollen $pollen)
    {
        $pollen->load(['readings' => function ($q) {
            $q->orderByDesc('reading_date')->limit(30);
        }]);

        return new PollenDetailResource($pollen);
    }
}

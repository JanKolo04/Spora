<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pollen;
use App\Models\PollenReading;

class DashboardController extends Controller
{
    public function index()
    {
        $pollensCount = Pollen::count();
        $readingsCount = PollenReading::count();
        $latestReadings = PollenReading::with('pollen')
            ->orderByDesc('reading_date')
            ->limit(10)
            ->get();

        return view('admin.dashboard', compact('pollensCount', 'readingsCount', 'latestReadings'));
    }
}

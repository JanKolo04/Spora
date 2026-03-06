<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pollen;
use App\Models\PollenReading;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $pollensCount = Pollen::count();
        $readingsCount = PollenReading::count();
        $todayReadingsCount = PollenReading::whereDate('reading_date', today())->count();
        $regionsCount = PollenReading::distinct('region')->count('region');

        $latestReadings = PollenReading::with('pollen')
            ->orderByDesc('reading_date')
            ->limit(10)
            ->get();

        $topPollens = Pollen::withCount('readings')
            ->with('latestReading')
            ->having('readings_count', '>', 0)
            ->orderByDesc('readings_count')
            ->limit(6)
            ->get();

        $levelDistribution = PollenReading::selectRaw('level, count(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        $last7Days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            return [
                'date' => $date->format('d.m'),
                'count' => PollenReading::whereDate('reading_date', $date)->count(),
                'avg_concentration' => (int) PollenReading::whereDate('reading_date', $date)->avg('concentration'),
            ];
        });

        $highAlertReadings = PollenReading::with('pollen')
            ->whereIn('level', ['wysoki', 'bardzo wysoki'])
            ->whereDate('reading_date', '>=', today()->subDays(3))
            ->orderByDesc('concentration')
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact(
            'pollensCount',
            'readingsCount',
            'todayReadingsCount',
            'regionsCount',
            'latestReadings',
            'topPollens',
            'levelDistribution',
            'last7Days',
            'highAlertReadings',
        ));
    }
}

<?php

namespace App\Http\Controllers\Api;

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
        })->values();

        $topPollens = Pollen::withCount('readings')
            ->with('latestReading')
            ->has('readings')
            ->orderByDesc('readings_count')
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'icon' => $p->icon,
                'readings_count' => $p->readings_count,
                'latest_level' => $p->latestReading?->level,
                'latest_concentration' => $p->latestReading?->concentration,
            ]);

        $highAlerts = PollenReading::with('pollen')
            ->whereIn('level', ['wysoki', 'bardzo wysoki'])
            ->whereDate('reading_date', '>=', today()->subDays(3))
            ->orderByDesc('concentration')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'pollen_name' => $r->pollen->name,
                'pollen_icon' => $r->pollen->icon,
                'concentration' => $r->concentration,
                'level' => $r->level,
                'region' => $r->region,
                'reading_date' => $r->reading_date->format('d.m.Y'),
            ]);

        return response()->json([
            'data' => [
                'pollens_count' => $pollensCount,
                'readings_count' => $readingsCount,
                'today_readings_count' => $todayReadingsCount,
                'level_distribution' => $levelDistribution,
                'last_7_days' => $last7Days,
                'top_pollens' => $topPollens,
                'high_alerts' => $highAlerts,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pollen;
use App\Models\PollenReading;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $region = $request->input('region');

        $readingsQuery = fn () => $region ? PollenReading::where('region', $region) : PollenReading::query();

        $pollensCount = Pollen::count();
        $readingsCount = $readingsQuery()->count();
        $todayReadingsCount = $readingsQuery()->whereDate('reading_date', today())->count();

        $levelDistribution = $readingsQuery()->selectRaw('level, count(*) as count')
            ->groupBy('level')
            ->pluck('count', 'level')
            ->toArray();

        $last7Days = collect(range(6, 0))->map(function ($daysAgo) use ($readingsQuery) {
            $date = Carbon::today()->subDays($daysAgo);
            $query = $readingsQuery()->whereDate('reading_date', $date);
            return [
                'date' => $date->format('d.m'),
                'count' => (clone $query)->count(),
                'avg_concentration' => (int) (clone $query)->avg('concentration'),
            ];
        })->values();

        $topPollensQuery = Pollen::with('latestReading');
        if ($region) {
            $topPollensQuery->withCount(['readings' => fn ($q) => $q->where('region', $region)])
                ->with(['latestReading' => fn ($q) => $q->where('region', $region)])
                ->whereHas('readings', fn ($q) => $q->where('region', $region));
        } else {
            $topPollensQuery->withCount('readings')->has('readings');
        }

        $topPollens = $topPollensQuery
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

        $highAlertsQuery = PollenReading::with('pollen')
            ->whereIn('level', ['wysoki', 'bardzo wysoki'])
            ->whereDate('reading_date', '>=', today()->subDays(3))
            ->orderByDesc('concentration')
            ->limit(5);

        if ($region) {
            $highAlertsQuery->where('region', $region);
        }

        $highAlerts = $highAlertsQuery->get()
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

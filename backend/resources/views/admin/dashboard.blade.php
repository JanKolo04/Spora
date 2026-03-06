@extends('layouts.app')

@section('content')
<style>
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    .animate-fade-up { animation: fadeInUp 0.6s ease-out both; }
    .animate-fade-left { animation: fadeInLeft 0.6s ease-out both; }
    .animate-scale { animation: scaleIn 0.5s ease-out both; }
    .animate-slide-down { animation: slideDown 0.5s ease-out both; }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .delay-5 { animation-delay: 0.5s; }
    .delay-6 { animation-delay: 0.6s; }

    .stat-card {
        border: none;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
        position: relative;
    }
    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        pointer-events: none;
    }
    .stat-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    .stat-card .card-body {
        padding: 1.5rem;
    }
    .stat-card .stat-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
    }
    .stat-card .stat-value {
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.1;
    }
    .stat-card .stat-label {
        font-size: 0.85rem;
        opacity: 0.85;
        font-weight: 500;
    }

    .section-card {
        border: none;
        border-radius: 16px;
        box-shadow: 0 2px 20px rgba(0,0,0,0.06);
        transition: all 0.3s ease;
        overflow: hidden;
    }
    .section-card:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }
    .section-card .card-header {
        background: white;
        border-bottom: 2px solid #f0f0f0;
        padding: 1.2rem 1.5rem;
        font-weight: 700;
        font-size: 1.05rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .section-card .card-body {
        padding: 1.5rem;
    }

    .pollen-card {
        border: 2px solid #f0f0f0;
        border-radius: 14px;
        padding: 1.2rem;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
        position: relative;
        overflow: hidden;
    }
    .pollen-card:hover {
        border-color: #4CAF50;
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
    }
    .pollen-card .pollen-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        display: block;
        transition: transform 0.3s ease;
    }
    .pollen-card:hover .pollen-icon {
        transform: scale(1.2);
    }
    .pollen-card .pollen-name {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 0.3rem;
        color: #333;
    }
    .pollen-card .pollen-readings {
        font-size: 0.8rem;
        color: #888;
    }

    .level-bar {
        height: 10px;
        border-radius: 5px;
        transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    .level-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }

    .alert-card {
        border: none;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }
    .alert-card:hover {
        transform: translateX(6px);
    }
    .alert-card.level-wysoki {
        background: #fff3e0;
        border-left-color: #FF9800;
    }
    .alert-card.level-bardzo-wysoki {
        background: #ffebee;
        border-left-color: #F44336;
    }
    .alert-card .alert-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
    }
    .alert-card .alert-info {
        flex: 1;
    }
    .alert-card .alert-name {
        font-weight: 700;
        font-size: 0.95rem;
    }
    .alert-card .alert-detail {
        font-size: 0.8rem;
        color: #666;
    }

    .reading-row {
        transition: all 0.3s ease;
        border-radius: 8px;
    }
    .reading-row:hover {
        background-color: #f8fdf8 !important;
        transform: scale(1.01);
    }

    .badge-level {
        padding: 0.4em 0.8em;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.78rem;
        letter-spacing: 0.3px;
    }

    .welcome-section {
        background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 50%, #1B5E20 100%);
        border-radius: 20px;
        padding: 2.5rem;
        color: white;
        position: relative;
        overflow: hidden;
    }
    .welcome-section::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
    }
    .welcome-section::after {
        content: '';
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(255,255,255,0.03);
    }
    .welcome-section h1 {
        font-weight: 800;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    }
    .welcome-section p {
        opacity: 0.9;
        font-size: 1rem;
        margin: 0;
    }

    .chart-container {
        position: relative;
        height: 260px;
    }

    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #aaa;
    }
    .empty-state .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
</style>

<div class="container">
    {{-- Welcome --}}
    <div class="welcome-section animate-fade-up mb-4">
        <h1>Witaj w Spora</h1>
        <p>Panel monitorowania stezen pylkow &mdash; {{ now()->translatedFormat('l, d F Y') }}</p>
    </div>

    {{-- Stat cards --}}
    <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
            <div class="stat-card card text-white animate-scale delay-1" style="background: linear-gradient(135deg, #4CAF50, #2E7D32);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="stat-icon">🌿</div>
                    </div>
                    <div class="stat-value">{{ $pollensCount }}</div>
                    <div class="stat-label">Rodzaje pylkow</div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="stat-card card text-white animate-scale delay-2" style="background: linear-gradient(135deg, #2196F3, #1565C0);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="stat-icon">📊</div>
                    </div>
                    <div class="stat-value">{{ $readingsCount }}</div>
                    <div class="stat-label">Wszystkie odczyty</div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="stat-card card text-white animate-scale delay-3" style="background: linear-gradient(135deg, #FF9800, #E65100);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="stat-icon">📅</div>
                    </div>
                    <div class="stat-value">{{ $todayReadingsCount }}</div>
                    <div class="stat-label">Odczyty dzisiaj</div>
                </div>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="stat-card card text-white animate-scale delay-4" style="background: linear-gradient(135deg, #9C27B0, #6A1B9A);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="stat-icon">📍</div>
                    </div>
                    <div class="stat-value">{{ $regionsCount }}</div>
                    <div class="stat-label">Regiony</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        {{-- Chart: last 7 days --}}
        <div class="col-lg-8">
            <div class="section-card card animate-fade-up delay-3">
                <div class="card-header">
                    📈 Odczyty z ostatnich 7 dni
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        {{-- Level distribution --}}
        <div class="col-lg-4">
            <div class="section-card card animate-fade-up delay-4">
                <div class="card-header">
                    🎯 Rozklad poziomow
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="levelChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        {{-- Top pollens --}}
        <div class="col-lg-8">
            <div class="section-card card animate-fade-up delay-4">
                <div class="card-header">
                    🏆 Najbardziej pylace
                </div>
                <div class="card-body">
                    @if($topPollens->isEmpty())
                        <div class="empty-state">
                            <div class="empty-icon">🌱</div>
                            <p>Brak danych o pylkach.</p>
                        </div>
                    @else
                        <div class="row g-3">
                            @foreach($topPollens as $i => $pollen)
                                <div class="col-6 col-md-4">
                                    <div class="pollen-card animate-scale delay-{{ $i + 1 }}">
                                        @if($i === 0)
                                            <span style="position:absolute;top:8px;right:8px;font-size:1.2rem;">👑</span>
                                        @endif
                                        <span class="pollen-icon">{{ $pollen->icon }}</span>
                                        <div class="pollen-name">{{ $pollen->name }}</div>
                                        <div class="pollen-readings">{{ $pollen->readings_count }} {{ trans_choice('odczyt|odczyty|odczytow', $pollen->readings_count) }}</div>
                                        @if($pollen->latestReading)
                                            @php
                                                $badgeClass = match($pollen->latestReading->level) {
                                                    'niski' => 'bg-success',
                                                    'średni' => 'bg-warning text-dark',
                                                    'wysoki' => 'bg-orange',
                                                    'bardzo wysoki' => 'bg-danger',
                                                    default => 'bg-secondary',
                                                };
                                            @endphp
                                            <span class="badge badge-level {{ $badgeClass }} mt-2">{{ $pollen->latestReading->level }}</span>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>

        {{-- High alerts --}}
        <div class="col-lg-4">
            <div class="section-card card animate-fade-up delay-5">
                <div class="card-header">
                    ⚠️ Alerty (ostatnie 3 dni)
                </div>
                <div class="card-body p-3">
                    @if($highAlertReadings->isEmpty())
                        <div class="empty-state">
                            <div class="empty-icon">✅</div>
                            <p>Brak alertow &mdash; wszystko w normie!</p>
                        </div>
                    @else
                        @foreach($highAlertReadings as $i => $reading)
                            <div class="alert-card level-{{ $reading->level === 'bardzo wysoki' ? 'bardzo-wysoki' : $reading->level }} animate-fade-left delay-{{ $i + 1 }}">
                                <div class="alert-icon">{{ $reading->pollen->icon }}</div>
                                <div class="alert-info">
                                    <div class="alert-name">{{ $reading->pollen->name }}</div>
                                    <div class="alert-detail">{{ $reading->concentration }} ziaren/m³ &middot; {{ $reading->region }}</div>
                                    <div class="alert-detail">{{ $reading->reading_date->format('d.m.Y') }}</div>
                                </div>
                                @php
                                    $alertBadge = $reading->level === 'bardzo wysoki' ? 'bg-danger' : 'bg-orange';
                                @endphp
                                <span class="badge badge-level {{ $alertBadge }}">{{ $reading->level }}</span>
                            </div>
                        @endforeach
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- Level distribution bars --}}
    <div class="section-card card animate-fade-up delay-5 mb-4">
        <div class="card-header">
            📊 Statystyki poziomow stezen
        </div>
        <div class="card-body">
            @php
                $levels = [
                    'niski' => ['color' => '#4CAF50', 'label' => 'Niski'],
                    'średni' => ['color' => '#FFC107', 'label' => 'Sredni'],
                    'wysoki' => ['color' => '#FF9800', 'label' => 'Wysoki'],
                    'bardzo wysoki' => ['color' => '#F44336', 'label' => 'Bardzo wysoki'],
                ];
                $maxLevel = max(array_values($levelDistribution) ?: [1]);
            @endphp
            @foreach($levels as $key => $info)
                @php $count = $levelDistribution[$key] ?? 0; @endphp
                <div class="d-flex align-items-center mb-3">
                    <div style="width: 130px; font-weight: 600; font-size: 0.9rem; color: #555;">{{ $info['label'] }}</div>
                    <div class="flex-grow-1 me-3">
                        <div style="background: #f0f0f0; border-radius: 5px; height: 10px; overflow: hidden;">
                            <div class="level-bar" style="width: 0%; background: {{ $info['color'] }};" data-width="{{ $maxLevel > 0 ? ($count / $maxLevel * 100) : 0 }}%"></div>
                        </div>
                    </div>
                    <div style="width: 50px; text-align: right; font-weight: 700; color: #333;">{{ $count }}</div>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Latest readings table --}}
    <div class="section-card card animate-fade-up delay-6 mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>🕐 Ostatnie odczyty</span>
            <a href="{{ route('admin.readings.index') }}" class="btn btn-sm btn-outline-success" style="border-radius:8px;">
                Zobacz wszystkie →
            </a>
        </div>
        <div class="card-body p-0">
            @if($latestReadings->isEmpty())
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Brak odczytow.</p>
                </div>
            @else
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead>
                            <tr style="background: #fafafa;">
                                <th style="padding: 1rem 1.5rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; border: none;">Pylek</th>
                                <th style="padding: 1rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; border: none;">Region</th>
                                <th style="padding: 1rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; border: none;">Stezenie</th>
                                <th style="padding: 1rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; border: none;">Poziom</th>
                                <th style="padding: 1rem 1.5rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; border: none;">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($latestReadings as $reading)
                                <tr class="reading-row">
                                    <td style="padding: 1rem 1.5rem; border-color: #f5f5f5; vertical-align: middle;">
                                        <span style="font-size: 1.3rem; margin-right: 8px;">{{ $reading->pollen->icon }}</span>
                                        <strong>{{ $reading->pollen->name }}</strong>
                                    </td>
                                    <td style="padding: 1rem; border-color: #f5f5f5; vertical-align: middle; color: #666;">{{ $reading->region }}</td>
                                    <td style="padding: 1rem; border-color: #f5f5f5; vertical-align: middle;">
                                        <strong>{{ $reading->concentration }}</strong> <span style="color:#999;font-size:0.85rem;">ziaren/m³</span>
                                    </td>
                                    <td style="padding: 1rem; border-color: #f5f5f5; vertical-align: middle;">
                                        @php
                                            $badgeClass = match($reading->level) {
                                                'niski' => 'bg-success',
                                                'średni' => 'bg-warning text-dark',
                                                'wysoki' => 'bg-orange',
                                                'bardzo wysoki' => 'bg-danger',
                                                default => 'bg-secondary',
                                            };
                                        @endphp
                                        <span class="badge badge-level {{ $badgeClass }}">{{ $reading->level }}</span>
                                    </td>
                                    <td style="padding: 1rem 1.5rem; border-color: #f5f5f5; vertical-align: middle; color: #666;">{{ $reading->reading_date->format('d.m.Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Animate level bars
    setTimeout(() => {
        document.querySelectorAll('.level-bar').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 500);

    // Weekly chart
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: {!! json_encode($last7Days->pluck('date')) !!},
                datasets: [
                    {
                        label: 'Liczba odczytow',
                        data: {!! json_encode($last7Days->pluck('count')) !!},
                        backgroundColor: 'rgba(76, 175, 80, 0.8)',
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Srednie stezenie',
                        data: {!! json_encode($last7Days->pluck('avg_concentration')) !!},
                        type: 'line',
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#FF9800',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20, font: { weight: '600' } }
                    },
                    tooltip: {
                        backgroundColor: '#333',
                        titleFont: { weight: '700' },
                        cornerRadius: 10,
                        padding: 12,
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: '600' } }
                    },
                    y: {
                        position: 'left',
                        beginAtZero: true,
                        ticks: { precision: 0, font: { weight: '600' } },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        title: { display: true, text: 'Odczyty', font: { weight: '700' } }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        grid: { drawOnChartArea: false },
                        ticks: { font: { weight: '600' } },
                        title: { display: true, text: 'ziaren/m³', font: { weight: '700' } }
                    }
                }
            }
        });
    }

    // Level distribution chart
    const levelCtx = document.getElementById('levelChart');
    if (levelCtx) {
        const levelData = @json($levelDistribution);
        new Chart(levelCtx, {
            type: 'doughnut',
            data: {
                labels: ['Niski', 'Sredni', 'Wysoki', 'Bardzo wysoki'],
                datasets: [{
                    data: [
                        levelData['niski'] || 0,
                        levelData['średni'] || 0,
                        levelData['wysoki'] || 0,
                        levelData['bardzo wysoki'] || 0,
                    ],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.85)',
                        'rgba(255, 193, 7, 0.85)',
                        'rgba(255, 152, 0, 0.85)',
                        'rgba(244, 67, 54, 0.85)',
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 10,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeOutQuart',
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 15, font: { weight: '600', size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: '#333',
                        cornerRadius: 10,
                        padding: 12,
                    }
                }
            }
        });
    }
});
</script>
@endsection

@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Dashboard</h2>

    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card text-white bg-success">
                <div class="card-body">
                    <h5 class="card-title">Rodzaje pyłków</h5>
                    <p class="card-text display-4">{{ $pollensCount }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-white bg-info">
                <div class="card-body">
                    <h5 class="card-title">Odczyty</h5>
                    <p class="card-text display-4">{{ $readingsCount }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">Ostatnie odczyty</div>
        <div class="card-body">
            @if($latestReadings->isEmpty())
                <p class="text-muted">Brak odczytów.</p>
            @else
                <table class="table">
                    <thead>
                        <tr>
                            <th>Pyłek</th>
                            <th>Region</th>
                            <th>Stężenie</th>
                            <th>Poziom</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($latestReadings as $reading)
                            <tr>
                                <td>{{ $reading->pollen->icon }} {{ $reading->pollen->name }}</td>
                                <td>{{ $reading->region }}</td>
                                <td>{{ $reading->concentration }} ziaren/m³</td>
                                <td>
                                    @php
                                        $badgeClass = match($reading->level) {
                                            'niski' => 'bg-success',
                                            'średni' => 'bg-warning',
                                            'wysoki' => 'bg-orange',
                                            'bardzo wysoki' => 'bg-danger',
                                            default => 'bg-secondary',
                                        };
                                    @endphp
                                    <span class="badge {{ $badgeClass }}">{{ $reading->level }}</span>
                                </td>
                                <td>{{ $reading->reading_date->format('d.m.Y') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>
</div>
@endsection

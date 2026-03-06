@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-secondary">← Wróć</a>
            <h2 class="mb-0">Odczyty stężeń</h2>
        </div>
        <a href="{{ route('admin.readings.create') }}" class="btn btn-success">Dodaj odczyt</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="card">
        <div class="card-body table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Pyłek</th>
                        <th>Region</th>
                        <th>Stężenie</th>
                        <th>Ilość</th>
                        <th>Przelicznik</th>
                        <th>Wynik</th>
                        <th>% pylenia</th>
                        <th>Poziom</th>
                        <th>Data</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($readings as $reading)
                        <tr>
                            <td>{{ $reading->pollen->icon }} {{ $reading->pollen->name }}</td>
                            <td>{{ $reading->region }}</td>
                            <td>{{ $reading->concentration }} ziaren/m³</td>
                            <td>{{ $reading->quantity ?? '-' }}</td>
                            <td>{{ $reading->multiplier ?? '-' }}</td>
                            <td>{{ $reading->result ?? '-' }}</td>
                            <td>{{ $reading->pollen_percentage !== null ? $reading->pollen_percentage . '%' : '-' }}</td>
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
                            <td>
                                <a href="{{ route('admin.readings.edit', $reading) }}" class="btn btn-sm btn-primary">Edytuj</a>
                                <form action="{{ route('admin.readings.destroy', $reading) }}" method="POST" class="d-inline" onsubmit="return confirm('Czy na pewno chcesz usunąć?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-danger">Usuń</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="10" class="text-muted">Brak odczytów.</td></tr>
                    @endforelse
                </tbody>
            </table>
            {{ $readings->links() }}
        </div>
    </div>
</div>
@endsection

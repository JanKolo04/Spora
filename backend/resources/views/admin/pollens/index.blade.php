@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Rodzaje pyłków</h2>
        <a href="{{ route('admin.pollens.create') }}" class="btn btn-success">Dodaj pyłek</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="card">
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>Ikona</th>
                        <th>Nazwa</th>
                        <th>Opis</th>
                        <th>Odczyty</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($pollens as $pollen)
                        <tr>
                            <td>{{ $pollen->icon }}</td>
                            <td>{{ $pollen->name }}</td>
                            <td>{{ Str::limit($pollen->description, 50) }}</td>
                            <td>{{ $pollen->readings_count }}</td>
                            <td>
                                <a href="{{ route('admin.pollens.edit', $pollen) }}" class="btn btn-sm btn-primary">Edytuj</a>
                                <form action="{{ route('admin.pollens.destroy', $pollen) }}" method="POST" class="d-inline" onsubmit="return confirm('Czy na pewno chcesz usunąć?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-danger">Usuń</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="text-muted">Brak pyłków.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

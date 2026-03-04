@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Dodaj pyłek</h2>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.pollens.store') }}" method="POST">
                @csrf
                <div class="mb-3">
                    <label for="name" class="form-label">Nazwa</label>
                    <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" required>
                    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="icon" class="form-label">Ikona (emoji)</label>
                    <input type="text" class="form-control @error('icon') is-invalid @enderror" id="icon" name="icon" value="{{ old('icon', '🌿') }}">
                    @error('icon') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Opis</label>
                    <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="3">{{ old('description') }}</textarea>
                    @error('description') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <a href="{{ route('admin.pollens.index') }}" class="btn btn-secondary">Anuluj</a>
                <button type="submit" class="btn btn-success">Zapisz</button>
            </form>
        </div>
    </div>
</div>
@endsection

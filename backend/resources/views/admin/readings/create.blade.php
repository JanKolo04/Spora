@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Dodaj odczyt</h2>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.readings.store') }}" method="POST">
                @csrf
                <div class="mb-3">
                    <label for="pollen_id" class="form-label">Pyłek</label>
                    <select class="form-select @error('pollen_id') is-invalid @enderror" id="pollen_id" name="pollen_id" required>
                        <option value="">-- Wybierz pyłek --</option>
                        @foreach($pollens as $pollen)
                            <option value="{{ $pollen->id }}" {{ old('pollen_id') == $pollen->id ? 'selected' : '' }}>
                                {{ $pollen->icon }} {{ $pollen->name }}
                            </option>
                        @endforeach
                    </select>
                    @error('pollen_id') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="region" class="form-label">Region</label>
                    <input type="text" class="form-control @error('region') is-invalid @enderror" id="region" name="region" value="{{ old('region') }}" required>
                    @error('region') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="concentration" class="form-label">Stężenie (ziaren/m³)</label>
                    <input type="number" class="form-control @error('concentration') is-invalid @enderror" id="concentration" name="concentration" value="{{ old('concentration') }}" min="0" required>
                    @error('concentration') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="level" class="form-label">Poziom</label>
                    <select class="form-select @error('level') is-invalid @enderror" id="level" name="level" required>
                        <option value="">-- Wybierz poziom --</option>
                        @foreach(['niski', 'średni', 'wysoki', 'bardzo wysoki'] as $level)
                            <option value="{{ $level }}" {{ old('level') == $level ? 'selected' : '' }}>{{ ucfirst($level) }}</option>
                        @endforeach
                    </select>
                    @error('level') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="reading_date" class="form-label">Data odczytu</label>
                    <input type="date" class="form-control @error('reading_date') is-invalid @enderror" id="reading_date" name="reading_date" value="{{ old('reading_date', date('Y-m-d')) }}" required>
                    @error('reading_date') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <a href="{{ route('admin.readings.index') }}" class="btn btn-secondary">Anuluj</a>
                <button type="submit" class="btn btn-success">Zapisz</button>
            </form>
        </div>
    </div>
</div>
@endsection

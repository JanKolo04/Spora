@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Edytuj odczyt</h2>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.readings.update', $reading) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="mb-3">
                    <label for="pollen_id" class="form-label">Pyłek</label>
                    <select class="form-select @error('pollen_id') is-invalid @enderror" id="pollen_id" name="pollen_id" required>
                        @foreach($pollens as $pollen)
                            <option value="{{ $pollen->id }}" {{ old('pollen_id', $reading->pollen_id) == $pollen->id ? 'selected' : '' }}>
                                {{ $pollen->icon }} {{ $pollen->name }}
                            </option>
                        @endforeach
                    </select>
                    @error('pollen_id') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="region" class="form-label">Region</label>
                    <input type="text" class="form-control @error('region') is-invalid @enderror" id="region" name="region" value="{{ old('region', $reading->region) }}" required>
                    @error('region') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="concentration" class="form-label">Stężenie (ziaren/m³)</label>
                    <input type="number" class="form-control @error('concentration') is-invalid @enderror" id="concentration" name="concentration" value="{{ old('concentration', $reading->concentration) }}" min="0" required>
                    @error('concentration') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="quantity" class="form-label">Ilość</label>
                        <input type="number" step="0.01" class="form-control @error('quantity') is-invalid @enderror" id="quantity" name="quantity" value="{{ old('quantity', $reading->quantity) }}" min="0">
                        @error('quantity') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="multiplier" class="form-label">Przelicznik</label>
                        <input type="number" step="0.0001" class="form-control @error('multiplier') is-invalid @enderror" id="multiplier" name="multiplier" value="{{ old('multiplier', $reading->multiplier) }}" min="0">
                        @error('multiplier') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="result_display" class="form-label">Wynik (auto)</label>
                        <input type="text" class="form-control" id="result_display" value="{{ $reading->result }}" readonly disabled>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="pollen_percentage" class="form-label">Procent pylenia (%)</label>
                    <input type="number" step="0.01" class="form-control @error('pollen_percentage') is-invalid @enderror" id="pollen_percentage" name="pollen_percentage" value="{{ old('pollen_percentage', $reading->pollen_percentage) }}" min="0" max="100">
                    @error('pollen_percentage') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="level" class="form-label">Poziom</label>
                    <select class="form-select @error('level') is-invalid @enderror" id="level" name="level" required>
                        @foreach(['niski', 'średni', 'wysoki', 'bardzo wysoki'] as $level)
                            <option value="{{ $level }}" {{ old('level', $reading->level) == $level ? 'selected' : '' }}>{{ ucfirst($level) }}</option>
                        @endforeach
                    </select>
                    @error('level') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <div class="mb-3">
                    <label for="reading_date" class="form-label">Data odczytu</label>
                    <input type="date" class="form-control @error('reading_date') is-invalid @enderror" id="reading_date" name="reading_date" value="{{ old('reading_date', $reading->reading_date->format('Y-m-d')) }}" required>
                    @error('reading_date') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                <a href="{{ route('admin.readings.index') }}" class="btn btn-secondary">Anuluj</a>
                <button type="submit" class="btn btn-primary">Zapisz zmiany</button>
            </form>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const qty = document.getElementById('quantity');
        const mul = document.getElementById('multiplier');
        const res = document.getElementById('result_display');
        function calc() {
            const q = parseFloat(qty.value);
            const m = parseFloat(mul.value);
            res.value = (!isNaN(q) && !isNaN(m)) ? (q * m).toFixed(2) : '';
        }
        qty.addEventListener('input', calc);
        mul.addEventListener('input', calc);
    });
</script>
@endsection

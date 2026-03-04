# Spora - Project Rules

## Project Overview
Spora to aplikacja do monitorowania stężeń pyłków. Składa się z panelu administracyjnego (Laravel 12) i aplikacji mobilnej (React Native / Expo).

## Architecture

### Backend (`backend/`)
- **Laravel 12**, PHP ^8.2
- **SQLite** — jedyna baza danych (session, cache, queue też w DB)
- Panel admina: Blade + Bootstrap 5, pod `/admin`, za middleware `auth`
- API mobilne: Sanctum (token-based), pod `/api`, read-only dla użytkowników
- Seeder tworzy admina: `admin@spora.pl` / `password`
- Docker: multi-stage build (Node → PHP 8.4-cli), port 8000

### Mobile (`mobile/`)
- **React Native** z **Expo** (~55) i **expo-router** (file-based routing)
- **TypeScript** (strict mode)
- Tokeny w `expo-secure-store`, axios z interceptorem Bearer
- API URL: `http://localhost:8000/api` (tylko dev)

## Workflow
- **Po zakończeniu każdego prompta automatycznie commituj zmiany** (git add + git commit). Nie pytaj o pozwolenie — po prostu commituj.
- Commit messages po angielsku, krótkie, w stylu conventional commits (feat:, fix:, chore:, refactor:, etc.)

## Conventions

### General
- Język aplikacji: **polski** (UI, enumy, komunikaty flash, walidacja)
- Indent: 4 spacje, LF, UTF-8, trim trailing whitespace
- Nie dodawaj docstringów, komentarzy ani type annotations do kodu, którego nie zmieniasz

### Backend (Laravel)
- Kontrolery admina w `App\Http\Controllers\Admin\`, API w `App\Http\Controllers\Api\`
- Routy admina: prefix `admin`, name `admin.*`, middleware `auth`
- Routy API: prefix `api`, middleware `auth:sanctum` (oprócz login/register)
- Modele: `Pollen` (hasMany readings), `PollenReading` (belongsTo pollen)
- Enum poziomu pyłku: `niski`, `średni`, `wysoki`, `bardzo wysoki`
- Flash messages po mutacjach w adminie (po polsku)
- Paginacja: 20 elementów na stronę
- API responses: przez `JsonResource` klasy (`PollenResource`, `PollenDetailResource`)
- Rejestracja wyłączona w web routes (`Auth::routes(['register' => false])`)
- Redirect po zalogowaniu: `/admin` (ustawiony w kontrolerach auth i `RedirectIfAuthenticated::redirectUsing`)

### Mobile (React Native)
- Kolor główny: `#4CAF50` (zielony)
- Style: `StyleSheet.create()` inline, brak biblioteki UI
- Kolory poziomów: niski=#4CAF50, średni=#FFC107, wysoki=#FF9800, bardzo wysoki=#F44336
- Auth flow: `AuthContext` → sprawdza SecureStore token → waliduje przez `GET /api/user`
- Routing: `(auth)/` dla logowania, `(tabs)/` dla zalogowanych, `pollen/[id]` dla szczegółów

## Commands

### Backend
```bash
cd backend
composer install && npm install && npm run build   # setup
php artisan serve                                   # dev server
php artisan migrate --force && php artisan db:seed  # DB setup
docker compose up --build                           # Docker
```

### Mobile
```bash
cd mobile
npm install        # dependencies
npx expo start    # dev server
```

## Key Files
- `backend/routes/web.php` — admin routes
- `backend/routes/api.php` — API routes
- `backend/app/Models/Pollen.php`, `PollenReading.php` — domain models
- `backend/database/seeders/AdminSeeder.php` — admin user seed
- `mobile/services/api.ts` — API client + interfaces
- `mobile/contexts/AuthContext.tsx` — auth state
- `mobile/app/` — expo-router pages

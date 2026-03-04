<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PollenController;
use App\Http\Controllers\Admin\PollenReadingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect('/admin')
        : redirect()->route('login');
});

Auth::routes(['register' => false]);

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('pollens', PollenController::class)->except('show');
    Route::resource('readings', PollenReadingController::class)->except('show');
});

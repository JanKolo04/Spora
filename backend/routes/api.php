<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PollenController;
use App\Http\Controllers\Api\SymptomReportController;
use App\Http\Controllers\Api\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/pollens', [PollenController::class, 'index']);
    Route::get('/pollens/{pollen}', [PollenController::class, 'show']);

    Route::put('/profile', [UserProfileController::class, 'update']);
    Route::put('/profile/allergens', [UserProfileController::class, 'updateAllergens']);

    Route::get('/symptom-reports', [SymptomReportController::class, 'index']);
    Route::post('/symptom-reports', [SymptomReportController::class, 'store']);
    Route::delete('/symptom-reports/{id}', [SymptomReportController::class, 'destroy']);
});

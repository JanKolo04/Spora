<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicationReminderController;
use App\Http\Controllers\Api\PollenController;
use App\Http\Controllers\Api\SymptomReportController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\WellnessEntryController;
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

    Route::get('/medication-reminders', [MedicationReminderController::class, 'index']);
    Route::post('/medication-reminders', [MedicationReminderController::class, 'store']);
    Route::put('/medication-reminders/{id}', [MedicationReminderController::class, 'update']);
    Route::delete('/medication-reminders/{id}', [MedicationReminderController::class, 'destroy']);

    Route::get('/wellness-entries', [WellnessEntryController::class, 'index']);
    Route::post('/wellness-entries', [WellnessEntryController::class, 'store']);
    Route::get('/wellness-entries/{id}', [WellnessEntryController::class, 'show']);
    Route::delete('/wellness-entries/{id}', [WellnessEntryController::class, 'destroy']);
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserProfileController extends Controller
{
    public function update(Request $request)
    {
        Log::info('Profile update - raw body', [
            'all' => $request->all(),
            'headers' => $request->headers->all(),
            'user_id' => $request->user()?->id,
        ]);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'date_of_birth' => 'nullable|date',
            'weight' => 'nullable|numeric|min:0|max:999',
            'height' => 'nullable|integer|min:0|max:300',
            'region' => 'nullable|string|max:255',
        ]);

        Log::info('Profile update - validated', ['validated' => $validated]);

        $request->user()->update($validated);
        $request->user()->refresh();
        $request->user()->load('allergens');

        Log::info('Profile update - after save', [
            'user_region' => $request->user()->region,
            'user_id' => $request->user()->id,
        ]);

        return new UserProfileResource($request->user());
    }

    public function updateAllergens(Request $request)
    {
        $validated = $request->validate([
            'allergen_ids' => 'present|array',
            'allergen_ids.*' => 'exists:pollens,id',
        ]);

        $request->user()->allergens()->sync($validated['allergen_ids']);
        $request->user()->load('allergens');

        return new UserProfileResource($request->user());
    }
}

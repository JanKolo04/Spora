<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserProfileResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'date_of_birth' => 'nullable|date',
            'weight' => 'nullable|numeric|min:0|max:999',
            'height' => 'nullable|integer|min:0|max:300',
            'allergen_ids' => 'nullable|array',
            'region' => 'nullable|string|max:255',
            'allergen_ids.*' => 'exists:pollens,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'height' => $validated['height'] ?? null,
            'region' => $validated['region'] ?? null,
        ]);

        if (! empty($validated['allergen_ids'])) {
            $user->allergens()->sync($validated['allergen_ids']);
        }

        $token = $user->createToken('mobile')->plainTextToken;
        $user->load('allergens');

        return response()->json([
            'user' => new UserProfileResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Nieprawidłowe dane logowania.'],
            ]);
        }

        $token = $user->createToken('mobile')->plainTextToken;
        $user->load('allergens');

        return response()->json([
            'user' => new UserProfileResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Wylogowano pomyślnie.']);
    }

    public function user(Request $request)
    {
        $request->user()->load('allergens');

        return new UserProfileResource($request->user());
    }
}

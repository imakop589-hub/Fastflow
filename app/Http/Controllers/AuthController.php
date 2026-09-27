<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'active') {
            return $this->errorResponse('Your account is ' . $user->status . '. Please contact support.', null, 403);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        AuditLogService::log(
            action: 'login',
            module: 'auth',
            recordType: 'User',
            recordId: $user->id,
            description: "User {$user->email} logged in successfully",
            userId: $user->id
        );

        return $this->successResponse([
            'user' => new UserResource($user->load('roles.permissions')),
            'token' => $token,
        ], 'Logged in successfully');
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'status' => 'active',
        ]);

        $roleSlug = $validated['role'] ?? 'customer';
        $role = Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        AuditLogService::log(
            action: 'register',
            module: 'auth',
            recordType: 'User',
            recordId: $user->id,
            description: "New user registered with role: {$roleSlug}",
            userId: $user->id
        );

        return $this->successResponse([
            'user' => new UserResource($user->load('roles')),
            'token' => $token,
        ], 'Registration successful', 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()?->delete();

            AuditLogService::log(
                action: 'logout',
                module: 'auth',
                recordType: 'User',
                recordId: $user->id,
                description: "User {$user->email} logged out",
                userId: $user->id
            );
        }

        return $this->successResponse(null, 'Logged out successfully');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles.permissions', 'primaryRestaurant']);

        $permissions = $user->hasRole('super-admin')
            ? ['*']
            : $user->roles->flatMap(fn($r) => $r->permissions->pluck('slug'))->unique()->values();

        return $this->successResponse([
            'user' => new UserResource($user),
            'permissions' => $permissions,
            'primary_restaurant_id' => $user->primaryRestaurant?->id,
        ], 'User profile retrieved');
    }
}

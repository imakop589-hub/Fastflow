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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate user and issue personal access token.
     */
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

    /**
     * Register a new user with strictly bounded self-registration roles.
     * Privileged system roles (super-admin, admin, manager, staff, rider, etc.) are strictly prohibited.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $roleSlug = $validated['role'] ?? 'customer';

        // Explicitly whitelist allowable public self-registration roles
        $allowedPublicRoles = ['customer', 'restaurant-owner'];
        if (! in_array($roleSlug, $allowedPublicRoles, true)) {
            return $this->errorResponse('Unauthorized or invalid role selected for self-registration.', null, 422);
        }

        // Verify the role exists in the database before proceeding
        $role = Role::where('slug', $roleSlug)->first();
        if (! $role) {
            return $this->errorResponse("The requested registration role '{$roleSlug}' is not configured in the database.", null, 500);
        }

        // Atomically create user and attach verified role
        $user = DB::transaction(function () use ($validated, $role) {
            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'status' => 'active',
            ]);

            $newUser->roles()->attach($role->id);

            return $newUser;
        });

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

    /**
     * Log out authenticated user by revoking current personal access token.
     */
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

    /**
     * Retrieve authenticated user profile, permissions, and primary restaurant.
     */
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

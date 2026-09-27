<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('roles');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('slug', $request->query('role'));
            });
        }

        $users = $query->latest()->paginate(15);

        return $this->successResponse([
            'users' => UserResource::collection($users),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ], 'Users retrieved successfully');
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return $this->successResponse(
            new UserResource($user->load(['roles.permissions', 'ownedRestaurants', 'staffEmployment'])),
            'User details retrieved'
        );
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'status' => ['sometimes', 'in:active,inactive,suspended'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $changes = array_diff_assoc($validated, $user->only(array_keys($validated)));
        $user->update($validated);

        if (isset($validated['roles']) && $request->user()->hasRole('super-admin')) {
            $user->roles()->sync($validated['roles']);
        }

        AuditLogService::log(
            action: 'user_updated',
            module: 'users',
            recordType: 'User',
            recordId: $user->id,
            description: "User #{$user->id} updated",
            changes: $changes
        );

        return $this->successResponse(new UserResource($user->fresh('roles')), 'User updated successfully');
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        if ($user->hasRole('super-admin')) {
            return $this->errorResponse('Super Admin account cannot be deleted', null, 403);
        }

        $userId = $user->id;
        $user->delete();

        AuditLogService::log(
            action: 'user_deleted',
            module: 'users',
            recordType: 'User',
            recordId: $userId,
            description: "User #{$userId} deleted"
        );

        return $this->successResponse(null, 'User deleted successfully');
    }
}

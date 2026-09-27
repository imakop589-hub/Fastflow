<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all()->groupBy('module');

        return $this->successResponse([
            'roles' => $roles,
            'permissions' => $permissions,
        ], 'Roles and permissions retrieved');
    }

    public function updatePermissions(Request $request, Role $role): JsonResponse
    {
        $this->authorize('update', $role);

        if ($role->slug === 'super-admin') {
            return $this->errorResponse('Super Admin permissions cannot be altered', null, 403);
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permissions']);

        AuditLogService::log(
            action: 'role_permissions_updated',
            module: 'roles',
            recordType: 'Role',
            recordId: $role->id,
            description: "Permissions updated for role {$role->name}"
        );

        return $this->successResponse($role->load('permissions'), 'Role permissions updated successfully');
    }
}

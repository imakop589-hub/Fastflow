<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create System Roles
        $roles = [
            'super-admin' => ['name' => 'Super Admin', 'description' => 'Unrestricted system-wide authority', 'is_system' => true],
            'admin' => ['name' => 'Admin', 'description' => 'System administrator with operational access', 'is_system' => true],
            'restaurant-owner' => ['name' => 'Restaurant Owner', 'description' => 'Owner of a restaurant vendor account', 'is_system' => true],
            'restaurant-manager' => ['name' => 'Restaurant Manager', 'description' => 'Manager managing day-to-day restaurant profile and staff', 'is_system' => true],
            'restaurant-staff' => ['name' => 'Restaurant Staff', 'description' => 'Staff member assigned to an individual restaurant', 'is_system' => true],
            'customer' => ['name' => 'Customer', 'description' => 'End customer ordering food on marketplace', 'is_system' => true],
            'rider' => ['name' => 'Rider', 'description' => 'Delivery driver / rider (Phase 3 readiness)', 'is_system' => true],
        ];

        $createdRoles = [];
        foreach ($roles as $slug => $data) {
            $createdRoles[$slug] = Role::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'is_system' => $data['is_system'],
                ]
            );
        }

        // 2. Create Granular Permissions
        $permissions = [
            // Admin permissions
            ['name' => 'View Dashboard', 'slug' => 'dashboard.view', 'module' => 'dashboard'],
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Update Users', 'slug' => 'users.update', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],
            ['name' => 'View Roles', 'slug' => 'roles.view', 'module' => 'roles'],
            ['name' => 'Create Roles', 'slug' => 'roles.create', 'module' => 'roles'],
            ['name' => 'Update Roles', 'slug' => 'roles.update', 'module' => 'roles'],
            ['name' => 'Delete Roles', 'slug' => 'roles.delete', 'module' => 'roles'],
            ['name' => 'View Restaurants', 'slug' => 'restaurants.view', 'module' => 'restaurants'],
            ['name' => 'Create Restaurants', 'slug' => 'restaurants.create', 'module' => 'restaurants'],
            ['name' => 'Update Restaurants', 'slug' => 'restaurants.update', 'module' => 'restaurants'],
            ['name' => 'Delete Restaurants', 'slug' => 'restaurants.delete', 'module' => 'restaurants'],
            ['name' => 'Approve Restaurants', 'slug' => 'restaurants.approve', 'module' => 'restaurants'],
            ['name' => 'Reject Restaurants', 'slug' => 'restaurants.reject', 'module' => 'restaurants'],
            ['name' => 'Suspend Restaurants', 'slug' => 'restaurants.suspend', 'module' => 'restaurants'],
            ['name' => 'View Settings', 'slug' => 'settings.view', 'module' => 'settings'],
            ['name' => 'Update Settings', 'slug' => 'settings.update', 'module' => 'settings'],
            ['name' => 'View Audit Logs', 'slug' => 'audit_logs.view', 'module' => 'audit_logs'],

            // Restaurant Owner & Staff Permissions
            ['name' => 'View Own Restaurant Profile', 'slug' => 'restaurant_profile.view', 'module' => 'restaurant_profile'],
            ['name' => 'Update Own Restaurant Profile', 'slug' => 'restaurant_profile.update', 'module' => 'restaurant_profile'],
            ['name' => 'View Restaurant Staff', 'slug' => 'restaurant_staff.view', 'module' => 'restaurant_staff'],
            ['name' => 'Create Restaurant Staff', 'slug' => 'restaurant_staff.create', 'module' => 'restaurant_staff'],
            ['name' => 'Update Restaurant Staff', 'slug' => 'restaurant_staff.update', 'module' => 'restaurant_staff'],
            ['name' => 'Delete Restaurant Staff', 'slug' => 'restaurant_staff.delete', 'module' => 'restaurant_staff'],

            // Future Phases Foundation Permissions
            ['name' => 'View Menu', 'slug' => 'menu.view', 'module' => 'menu'],
            ['name' => 'Create Menu', 'slug' => 'menu.create', 'module' => 'menu'],
            ['name' => 'Update Menu', 'slug' => 'menu.update', 'module' => 'menu'],
            ['name' => 'Delete Menu', 'slug' => 'menu.delete', 'module' => 'menu'],
            ['name' => 'View Orders', 'slug' => 'orders.view', 'module' => 'orders'],
            ['name' => 'Manage Orders', 'slug' => 'orders.manage', 'module' => 'orders'],
        ];

        $createdPermissions = [];
        foreach ($permissions as $perm) {
            $createdPermissions[$perm['slug']] = Permission::firstOrCreate(
                ['slug' => $perm['slug']],
                [
                    'name' => $perm['name'],
                    'module' => $perm['module'],
                    'description' => "Allows user to {$perm['name']}",
                ]
            );
        }

        // 3. Assign Permissions to Roles
        // Super Admin has all permissions (handled via gate/policy wildcard)
        $createdRoles['super-admin']->permissions()->sync(array_column($createdPermissions, 'id'));

        // Admin
        $adminPermSlugs = [
            'dashboard.view', 'users.view', 'users.create', 'users.update',
            'roles.view', 'restaurants.view', 'restaurants.create', 'restaurants.update',
            'restaurants.approve', 'restaurants.reject', 'restaurants.suspend',
            'settings.view', 'audit_logs.view'
        ];
        $createdRoles['admin']->permissions()->sync(
            collect($adminPermSlugs)->map(fn($s) => $createdPermissions[$s]->id ?? null)->filter()->all()
        );

        // Restaurant Owner
        $ownerPermSlugs = [
            'restaurant_profile.view', 'restaurant_profile.update',
            'restaurant_staff.view', 'restaurant_staff.create', 'restaurant_staff.update', 'restaurant_staff.delete',
            'menu.view', 'menu.create', 'menu.update', 'menu.delete',
            'orders.view', 'orders.manage'
        ];
        $createdRoles['restaurant-owner']->permissions()->sync(
            collect($ownerPermSlugs)->map(fn($s) => $createdPermissions[$s]->id ?? null)->filter()->all()
        );

        // Restaurant Manager
        $managerPermSlugs = [
            'restaurant_profile.view', 'restaurant_profile.update',
            'restaurant_staff.view',
            'menu.view', 'menu.update',
            'orders.view', 'orders.manage'
        ];
        $createdRoles['restaurant-manager']->permissions()->sync(
            collect($managerPermSlugs)->map(fn($s) => $createdPermissions[$s]->id ?? null)->filter()->all()
        );

        // Restaurant Staff
        $staffPermSlugs = [
            'restaurant_profile.view',
            'orders.view'
        ];
        $createdRoles['restaurant-staff']->permissions()->sync(
            collect($staffPermSlugs)->map(fn($s) => $createdPermissions[$s]->id ?? null)->filter()->all()
        );
    }
}

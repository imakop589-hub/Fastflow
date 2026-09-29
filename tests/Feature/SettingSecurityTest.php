<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_with_permission_can_view_and_update_settings(): void
    {
        $permView = Permission::create(['name' => 'View Settings', 'slug' => 'settings.view', 'module' => 'settings']);
        $permUpdate = Permission::create(['name' => 'Update Settings', 'slug' => 'settings.update', 'module' => 'settings']);

        $roleAdmin = Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $roleAdmin->permissions()->attach([$permView->id, $permUpdate->id]);

        $admin = User::factory()->create();
        $admin->roles()->attach($roleAdmin->id);

        Setting::create(['key' => 'app_name', 'value' => 'Fastflow Marketplace', 'group' => 'general', 'type' => 'string']);

        $token = $admin->createToken('test')->plainTextToken;

        // View settings
        $viewRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/settings');
        $viewRes->assertStatus(200);

        // Update setting
        $updateRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/v1/admin/settings', [
                'settings' => [
                    ['key' => 'app_name', 'value' => 'Fastflow Enterprise', 'group' => 'general'],
                ],
            ]);
        $updateRes->assertStatus(200);

        $this->assertEquals('Fastflow Enterprise', Setting::get('app_name'));
    }

    public function test_unauthorized_user_cannot_view_or_update_settings(): void
    {
        $roleCustomer = Role::create(['name' => 'Customer', 'slug' => 'customer']);
        $customer = User::factory()->create();
        $customer->roles()->attach($roleCustomer->id);

        $token = $customer->createToken('test')->plainTextToken;

        $viewRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/settings');
        $viewRes->assertStatus(403);

        $updateRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/v1/admin/settings', [
                'settings' => [
                    ['key' => 'app_name', 'value' => 'Hacked App Name'],
                ],
            ]);
        $updateRes->assertStatus(403);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Restaurant;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_approve_pending_restaurant(): void
    {
        $superAdmin = User::factory()->create();
        $superAdminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin']);
        $superAdmin->roles()->attach($superAdminRole->id);

        $owner = User::factory()->create();
        $restaurant = Restaurant::factory()->pending()->create(['owner_id' => $owner->id]);

        $token = $superAdmin->createToken('admin')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/admin/restaurants/{$restaurant->id}/approve");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.approval_status', 'approved');

        $this->assertDatabaseHas('restaurants', [
            'id' => $restaurant->id,
            'approval_status' => 'approved',
        ]);
    }

    public function test_unapproved_restaurant_is_not_visible_on_public_marketplace(): void
    {
        $owner = User::factory()->create();
        $pendingRestaurant = Restaurant::factory()->pending()->create([
            'owner_id' => $owner->id,
            'name' => 'Hidden Secret Kitchen',
            'slug' => 'hidden-secret-kitchen',
        ]);

        $approvedRestaurant = Restaurant::factory()->create([
            'owner_id' => $owner->id,
            'name' => 'Public Approved Cafe',
            'slug' => 'public-approved-cafe',
            'approval_status' => 'approved',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/v1/restaurants');

        $response->assertStatus(200);
        $names = collect($response->json('data.restaurants'))->pluck('name')->all();

        $this->assertContains('Public Approved Cafe', $names);
        $this->assertNotContains('Hidden Secret Kitchen', $names);
    }
}

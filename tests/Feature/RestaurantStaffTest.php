<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantStaffTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected Restaurant $restaurant;
    protected string $ownerToken;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard roles
        Role::create(['name' => 'Restaurant Owner', 'slug' => 'restaurant-owner']);
        Role::create(['name' => 'Restaurant Manager', 'slug' => 'restaurant-manager']);
        Role::create(['name' => 'Restaurant Staff', 'slug' => 'restaurant-staff']);

        $this->owner = User::factory()->create();
        $this->owner->roles()->attach(Role::where('slug', 'restaurant-owner')->first()->id);

        $this->restaurant = Restaurant::factory()->create([
            'owner_id' => $this->owner->id,
            'name' => 'Pizza Palace',
        ]);

        $this->ownerToken = $this->owner->createToken('test')->plainTextToken;
    }

    public function test_owner_can_create_valid_staff_member(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->postJson("/api/v1/owner/restaurants/{$this->restaurant->id}/staff", [
                'name' => 'Staff Member One',
                'email' => 'staff1@example.com',
                'password' => 'Password123!',
                'role' => 'staff',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Staff Member One')
            ->assertJsonPath('data.role', 'staff');

        $this->assertDatabaseHas('users', ['email' => 'staff1@example.com']);
        $this->assertDatabaseHas('restaurant_staff', [
            'restaurant_id' => $this->restaurant->id,
            'role' => 'staff',
        ]);

        $createdUser = User::where('email', 'staff1@example.com')->first();
        $this->assertTrue($createdUser->roles->contains('slug', 'restaurant-staff'));
    }

    public function test_owner_can_create_valid_manager(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->postJson("/api/v1/owner/restaurants/{$this->restaurant->id}/staff", [
                'name' => 'Manager Alex',
                'email' => 'alex.mgr@example.com',
                'password' => 'Password123!',
                'role' => 'manager',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.role', 'manager');

        $createdUser = User::where('email', 'alex.mgr@example.com')->first();
        $this->assertTrue($createdUser->roles->contains('slug', 'restaurant-manager'));
    }

    public function test_staff_creation_fails_when_role_slug_is_invalid(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->postJson("/api/v1/owner/restaurants/{$this->restaurant->id}/staff", [
                'name' => 'Hacker Joe',
                'email' => 'hacker@example.com',
                'password' => 'Password123!',
                'role' => 'super-admin', // Not allowed by FormRequest validation
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'hacker@example.com']);
    }

    public function test_staff_creation_fails_and_rolls_back_if_role_missing_in_database(): void
    {
        // Delete restaurant-staff role from database
        Role::where('slug', 'restaurant-staff')->delete();

        $response = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->postJson("/api/v1/owner/restaurants/{$this->restaurant->id}/staff", [
                'name' => 'Orphan Candidate',
                'email' => 'orphan@example.com',
                'password' => 'Password123!',
                'role' => 'staff',
            ]);

        // Returns 500 error and creates no user
        $response->assertStatus(500);
        $this->assertDatabaseMissing('users', ['email' => 'orphan@example.com']);
        $this->assertDatabaseMissing('restaurant_staff', ['role' => 'staff']);
    }

    public function test_owner_cannot_add_staff_to_another_owners_restaurant(): void
    {
        $otherOwner = User::factory()->create();
        $otherRestaurant = Restaurant::factory()->create([
            'owner_id' => $otherOwner->id,
            'name' => 'Foreign Kitchen',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->postJson("/api/v1/owner/restaurants/{$otherRestaurant->id}/staff", [
                'name' => 'Injected Staff',
                'email' => 'injected@example.com',
                'password' => 'Password123!',
                'role' => 'staff',
            ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', ['email' => 'injected@example.com']);
    }

    public function test_owner_can_toggle_staff_status_and_delete_staff(): void
    {
        $staffUser = User::factory()->create();
        $staff = RestaurantStaff::create([
            'restaurant_id' => $this->restaurant->id,
            'user_id' => $staffUser->id,
            'role' => 'staff',
            'status' => 'active',
        ]);

        // Toggle status to inactive
        $toggleRes = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->putJson("/api/v1/owner/staff/{$staff->id}/toggle-status");

        $toggleRes->assertStatus(200);
        $this->assertEquals('inactive', $staff->fresh()->status);

        // Delete staff
        $delRes = $this->withHeader('Authorization', "Bearer {$this->ownerToken}")
            ->deleteJson("/api/v1/owner/staff/{$staff->id}");

        $delRes->assertStatus(200);
        $this->assertDatabaseMissing('restaurant_staff', ['id' => $staff->id]);
    }
}

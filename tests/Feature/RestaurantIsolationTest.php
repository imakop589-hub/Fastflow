<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'Restaurant Owner', 'slug' => 'restaurant-owner']);
        Role::create(['name' => 'Restaurant Staff', 'slug' => 'restaurant-staff']);
    }

    public function test_restaurant_owner_cannot_modify_or_view_another_restaurant(): void
    {
        // Owner 1 & Restaurant 1
        $owner1 = User::factory()->create();
        $restaurant1 = Restaurant::factory()->create(['owner_id' => $owner1->id, 'name' => 'First Bistro']);

        // Owner 2 & Restaurant 2
        $owner2 = User::factory()->create();
        $restaurant2 = Restaurant::factory()->create(['owner_id' => $owner2->id, 'name' => 'Second Bistro']);

        // Token for Owner 1
        $token1 = $owner1->createToken('test')->plainTextToken;

        // Owner 1 attempts to update restaurant 2 directly via ID route
        $response = $this->withHeader('Authorization', "Bearer {$token1}")
            ->putJson("/api/v1/owner/restaurant", [
                'name' => 'Hacked Restaurant Title',
            ]);

        // Owner 1 updates their OWN restaurant (restaurant1), NOT restaurant2
        $restaurant2->refresh();
        $this->assertEquals('Second Bistro', $restaurant2->name);

        // Direct admin endpoint access by non-admin owner must be forbidden (403)
        $adminResponse = $this->withHeader('Authorization', "Bearer {$token1}")
            ->getJson("/api/v1/admin/restaurants/{$restaurant2->id}");

        $adminResponse->assertStatus(403);
    }

    public function test_restaurant_staff_cannot_view_or_manage_another_restaurant(): void
    {
        $owner1 = User::factory()->create();
        $restaurant1 = Restaurant::factory()->create(['owner_id' => $owner1->id]);

        $owner2 = User::factory()->create();
        $restaurant2 = Restaurant::factory()->create(['owner_id' => $owner2->id]);

        $staffUser = User::factory()->create();
        $staffUser->roles()->attach(Role::where('slug', 'restaurant-staff')->first()->id);

        RestaurantStaff::create([
            'restaurant_id' => $restaurant1->id,
            'user_id' => $staffUser->id,
            'role' => 'staff',
            'status' => 'active',
        ]);

        $token = $staffUser->createToken('test')->plainTextToken;

        // Staff user cannot manage restaurant 2 staff
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/v1/admin/restaurants/{$restaurant2->id}");

        $response->assertStatus(403);
    }
}

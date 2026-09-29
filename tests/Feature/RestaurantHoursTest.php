<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\RestaurantHour;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantHoursTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected Restaurant $restaurant;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Restaurant Owner', 'slug' => 'restaurant-owner']);

        $this->owner = User::factory()->create();
        $this->owner->roles()->attach(Role::where('slug', 'restaurant-owner')->first()->id);
        $this->token = $this->owner->createToken('test')->plainTextToken;

        $this->restaurant = Restaurant::factory()->create([
            'owner_id' => $this->owner->id,
            'name' => 'Grill House',
        ]);
    }

    private function generateValidSevenDays(): array
    {
        $hours = [];
        for ($i = 1; $i <= 7; $i++) {
            $hours[] = [
                'day_of_week' => $i,
                'is_open' => true,
                'open_time' => '10:00',
                'close_time' => '22:00',
            ];
        }
        return $hours;
    }

    public function test_owner_can_update_valid_seven_day_hours(): void
    {
        $hours = $this->generateValidSevenDays();

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/v1/owner/restaurants/{$this->restaurant->id}/hours", [
                'hours' => $hours,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseCount('restaurant_hours', 7);
        $this->assertDatabaseHas('restaurant_hours', [
            'restaurant_id' => $this->restaurant->id,
            'day_of_week' => 1,
            'is_open' => true,
        ]);
    }

    public function test_hours_update_fails_if_days_are_less_than_seven(): void
    {
        // Only 5 days submitted
        $hours = [
            ['day_of_week' => 1, 'is_open' => true, 'open_time' => '10:00', 'close_time' => '22:00'],
            ['day_of_week' => 2, 'is_open' => true, 'open_time' => '10:00', 'close_time' => '22:00'],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/v1/owner/restaurants/{$this->restaurant->id}/hours", [
                'hours' => $hours,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('hours');
    }

    public function test_hours_update_fails_with_duplicate_day_of_week(): void
    {
        $hours = $this->generateValidSevenDays();
        // Introduce duplicate day 1 replacing day 7
        $hours[6]['day_of_week'] = 1;

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/v1/owner/restaurants/{$this->restaurant->id}/hours", [
                'hours' => $hours,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('hours');
    }

    public function test_hours_update_fails_if_open_time_is_after_close_time(): void
    {
        $hours = $this->generateValidSevenDays();
        // Invert times on day 3: 23:00 to 09:00
        $hours[2]['open_time'] = '23:00';
        $hours[2]['close_time'] = '09:00';

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/v1/owner/restaurants/{$this->restaurant->id}/hours", [
                'hours' => $hours,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('hours');
    }

    public function test_owner_cannot_update_hours_of_another_restaurant(): void
    {
        $otherOwner = User::factory()->create();
        $otherRestaurant = Restaurant::factory()->create([
            'owner_id' => $otherOwner->id,
            'name' => 'Other Grill',
        ]);

        $hours = $this->generateValidSevenDays();

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/v1/owner/restaurants/{$otherRestaurant->id}/hours", [
                'hours' => $hours,
            ]);

        $response->assertStatus(403);
    }
}

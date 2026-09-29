<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\City;
use App\Models\Country;
use App\Models\Restaurant;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationValidationTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected string $token;
    protected Country $countryPK;
    protected Country $countryUS;
    protected City $cityLahore;
    protected City $cityNewYork;
    protected Area $areaGulberg;
    protected Area $areaManhattan;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Restaurant Owner', 'slug' => 'restaurant-owner']);

        $this->owner = User::factory()->create();
        $this->owner->roles()->attach(Role::where('slug', 'restaurant-owner')->first()->id);
        $this->token = $this->owner->createToken('test')->plainTextToken;

        // Country 1 & Cities / Areas
        $this->countryPK = Country::create(['name' => 'Pakistan', 'iso2' => 'PK', 'phone_code' => '+92']);
        $this->cityLahore = City::create(['country_id' => $this->countryPK->id, 'name' => 'Lahore', 'slug' => 'lahore']);
        $this->areaGulberg = Area::create(['city_id' => $this->cityLahore->id, 'name' => 'Gulberg', 'slug' => 'gulberg']);

        // Country 2 & Cities / Areas
        $this->countryUS = Country::create(['name' => 'United States', 'iso2' => 'US', 'phone_code' => '+1']);
        $this->cityNewYork = City::create(['country_id' => $this->countryUS->id, 'name' => 'New York', 'slug' => 'new-york']);
        $this->areaManhattan = Area::create(['city_id' => $this->cityNewYork->id, 'name' => 'Manhattan', 'slug' => 'manhattan']);
    }

    public function test_valid_location_hierarchy_passes_validation(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/v1/owner/restaurant', [
                'name' => 'Authentic Lahore Eatery',
                'description' => 'Great traditional cuisine',
                'phone' => '+92-300-1234567',
                'email' => 'contact@lahoreeatery.pk',
                'address' => 'Main Boulevard, Gulberg III',
                'country_id' => $this->countryPK->id,
                'city_id' => $this->cityLahore->id,
                'area_id' => $this->areaGulberg->id,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('restaurants', [
            'name' => 'Authentic Lahore Eatery',
            'country_id' => $this->countryPK->id,
            'city_id' => $this->cityLahore->id,
            'area_id' => $this->areaGulberg->id,
            'city' => 'Lahore',
            'area' => 'Gulberg',
        ]);
    }

    public function test_mismatched_country_and_city_fails_validation(): void
    {
        // Submitting Pakistan country with New York city
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/v1/owner/restaurant', [
                'name' => 'Mismatched Eatery',
                'phone' => '+92-300-1234567',
                'email' => 'mismatch@example.com',
                'address' => '123 Fake Street',
                'country_id' => $this->countryPK->id,
                'city_id' => $this->cityNewYork->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('city_id');
    }

    public function test_mismatched_city_and_area_fails_validation(): void
    {
        // Submitting Lahore city with Manhattan area
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/v1/owner/restaurant', [
                'name' => 'Mismatched Area Eatery',
                'phone' => '+92-300-1234567',
                'email' => 'mismatch_area@example.com',
                'address' => '123 Fake Street',
                'country_id' => $this->countryPK->id,
                'city_id' => $this->cityLahore->id,
                'area_id' => $this->areaManhattan->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('area_id');
    }
}

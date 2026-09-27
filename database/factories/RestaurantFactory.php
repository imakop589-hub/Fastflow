<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\City;
use App\Models\Country;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        $name = fake()->company() . ' Eatery';
        return [
            'owner_id' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'logo' => null,
            'cover_image' => null,
            'description' => fake()->paragraph(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'address' => fake()->streetAddress(),
            'country_id' => Country::factory(),
            'city_id' => City::factory(),
            'area_id' => Area::factory(),
            'city' => fake()->city(),
            'area' => fake()->streetName(),
            'postal_code' => fake()->postcode(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'status' => Restaurant::STATUS_ACTIVE,
            'approval_status' => Restaurant::APPROVAL_APPROVED,
            'approved_at' => now(),
            'minimum_order_amount' => fake()->randomElement([10.00, 15.00, 20.00]),
            'delivery_time_min' => 20,
            'delivery_time_max' => 45,
            'delivery_fee' => fake()->randomElement([1.99, 2.50, 3.99]),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'approval_status' => Restaurant::APPROVAL_PENDING,
            'approved_at' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'approval_status' => Restaurant::APPROVAL_REJECTED,
            'rejection_reason' => 'Failed health verification checklist.',
            'approved_at' => null,
        ]);
    }
}

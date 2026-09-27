<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\RestaurantHour;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantHourFactory extends Factory
{
    protected $model = RestaurantHour::class;

    public function definition(): array
    {
        return [
            'restaurant_id' => Restaurant::factory(),
            'day_of_week' => fake()->numberBetween(1, 7),
            'is_open' => true,
            'open_time' => '10:00:00',
            'close_time' => '22:00:00',
            'first_open' => '10:00:00',
            'first_close' => '14:00:00',
            'second_open' => '17:00:00',
            'second_close' => '22:00:00',
        ];
    }
}

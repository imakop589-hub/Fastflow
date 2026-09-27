<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class CountryFactory extends Factory
{
    protected $model = Country::class;

    public function definition(): array
    {
        return [
            'name' => fake()->country(),
            'code' => strtoupper(fake()->unique()->lexify('??')),
            'phone_code' => '+' . fake()->numberBetween(1, 999),
            'currency_code' => fake()->currencyCode(),
            'currency_symbol' => '$',
            'is_active' => true,
        ];
    }
}

<?php

namespace App\Http\Requests\Owner;

use App\Models\Restaurant;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantHoursRequest extends FormRequest
{
    /**
     * Canonical target restaurant resolution.
     */
    public function getTargetRestaurant(): ?Restaurant
    {
        $restaurant = $this->route('restaurant');
        if ($restaurant instanceof Restaurant) {
            return $restaurant;
        }
        if (is_numeric($restaurant) || is_string($restaurant)) {
            return Restaurant::find($restaurant);
        }

        $restaurantId = $this->input('restaurant_id') ?? $this->query('restaurant_id');
        if ($restaurantId) {
            return Restaurant::find($restaurantId);
        }

        return $this->user()?->primaryRestaurant;
    }

    public function authorize(): bool
    {
        $restaurant = $this->getTargetRestaurant();
        return $restaurant !== null && $this->user()->can('update', $restaurant);
    }

    public function rules(): array
    {
        return [
            'restaurant_id' => ['nullable', 'exists:restaurants,id'],
            'hours' => ['required', 'array', 'size:7', function ($attribute, $value, $fail) {
                if (! is_array($value)) {
                    return;
                }

                $days = array_column($value, 'day_of_week');
                if (count(array_unique($days)) !== 7) {
                    $fail('Each day of the week (1 to 7) must be specified exactly once without duplicates.');
                    return;
                }

                foreach ($value as $item) {
                    $day = $item['day_of_week'] ?? '?';
                    if (! empty($item['is_open'])) {
                        if (empty($item['open_time']) && empty($item['first_open'])) {
                            $fail("Day {$day} is marked open but does not specify opening hours.");
                        }

                        if (! empty($item['open_time']) && ! empty($item['close_time'])) {
                            if ($item['open_time'] >= $item['close_time']) {
                                $fail("Day {$day} opening time ({$item['open_time']}) must be earlier than closing time ({$item['close_time']}).");
                            }
                        }

                        if (! empty($item['first_open']) && ! empty($item['first_close'])) {
                            if ($item['first_open'] >= $item['first_close']) {
                                $fail("Day {$day} first opening time ({$item['first_open']}) must be earlier than first closing time ({$item['first_close']}).");
                            }
                        }

                        if (! empty($item['second_open']) && ! empty($item['second_close'])) {
                            if ($item['second_open'] >= $item['second_close']) {
                                $fail("Day {$day} second opening time ({$item['second_open']}) must be earlier than second closing time ({$item['second_close']}).");
                            }
                        }
                    }
                }
            }],
            'hours.*.day_of_week' => ['required', 'integer', 'between:1,7'],
            'hours.*.is_open' => ['required', 'boolean'],
            'hours.*.open_time' => ['nullable', 'date_format:H:i'],
            'hours.*.close_time' => ['nullable', 'date_format:H:i'],
            'hours.*.first_open' => ['nullable', 'date_format:H:i'],
            'hours.*.first_close' => ['nullable', 'date_format:H:i'],
            'hours.*.second_open' => ['nullable', 'date_format:H:i'],
            'hours.*.second_close' => ['nullable', 'date_format:H:i'],
        ];
    }
}

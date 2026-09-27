<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantHoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        $restaurant = $this->route('restaurant') ?? $this->user()?->primaryRestaurant;
        return $restaurant && $this->user()->can('update', $restaurant);
    }

    public function rules(): array
    {
        return [
            'hours' => ['required', 'array', 'size:7'],
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

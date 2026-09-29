<?php

namespace App\Http\Requests\Owner;

use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CreateStaffRequest extends FormRequest
{
    /**
     * Resolve the target restaurant canonically from route parameter, input body, or primary restaurant fallback.
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
        return $restaurant !== null && $this->user()->can('create', [RestaurantStaff::class, $restaurant]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', Password::min(8)],
            'role' => ['required', 'in:manager,staff'],
            'restaurant_id' => ['nullable', 'exists:restaurants,id'],
        ];
    }
}

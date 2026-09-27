<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CreateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        $restaurant = $this->route('restaurant') ?? $this->user()?->primaryRestaurant;
        return $restaurant && $this->user()->can('create', [\App\Models\RestaurantStaff::class, $restaurant]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', Password::min(8)],
            'role' => ['required', 'in:manager,staff'],
        ];
    }
}

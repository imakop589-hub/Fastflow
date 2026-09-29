<?php

namespace App\Http\Requests\Owner;

use App\Models\Area;
use App\Models\City;
use Illuminate\Foundation\Http\FormRequest;

class RestaurantApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:150'],
            'address' => ['required', 'string', 'max:300'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'area_id' => ['nullable', 'exists:areas,id'],
            'city' => ['nullable', 'string', 'max:100'],
            'area' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'delivery_time_min' => ['nullable', 'integer', 'min:5', 'max:180'],
            'delivery_time_max' => ['nullable', 'integer', 'gte:delivery_time_min', 'max:240'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'logo' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'cover_image' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
        ];
    }

    /**
     * Enforce geographic relational hierarchy integrity.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $countryId = $this->input('country_id');
            $cityId = $this->input('city_id');
            $areaId = $this->input('area_id');

            if ($cityId) {
                $city = City::find($cityId);
                if ($city && $countryId && (int) $city->country_id !== (int) $countryId) {
                    $validator->errors()->add('city_id', 'The selected city does not belong to the selected country.');
                }
            }

            if ($areaId) {
                $area = Area::find($areaId);
                if ($area && $cityId && (int) $area->city_id !== (int) $cityId) {
                    $validator->errors()->add('area_id', 'The selected area does not belong to the selected city.');
                }
            }
        });
    }
}

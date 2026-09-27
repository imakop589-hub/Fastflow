<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isOwnerOrAdmin = $user && ($user->hasRole(['super-admin', 'admin']) || (int) $user->id === (int) $this->owner_id);

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'description' => $this->description,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'city' => $this->city ?? $this->cityRef?->name,
            'area' => $this->area ?? $this->areaRef?->name,
            'postal_code' => $this->postal_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'approval_status' => $this->approval_status,
            'minimum_order_amount' => (float) $this->minimum_order_amount,
            'delivery_time_min' => (int) $this->delivery_time_min,
            'delivery_time_max' => (int) $this->delivery_time_max,
            'delivery_fee' => (float) $this->delivery_fee,
            'hours' => $this->hours->map(fn($hour) => [
                'id' => $hour->id,
                'day_of_week' => $hour->day_of_week,
                'day_name' => $hour->day_name,
                'is_open' => (bool) $hour->is_open,
                'open_time' => $hour->open_time,
                'close_time' => $hour->close_time,
                'first_open' => $hour->first_open,
                'first_close' => $hour->first_close,
                'second_open' => $hour->second_open,
                'second_close' => $hour->second_close,
            ]),
            'created_at' => $this->created_at?->toISOString(),
        ];

        // Owner/Admin specific fields
        if ($isOwnerOrAdmin) {
            $data['rejection_reason'] = $this->rejection_reason;
            $data['owner_id'] = $this->owner_id;
            $data['owner_name'] = $this->owner?->name;
            $data['owner_email'] = $this->owner?->email;
            $data['country_id'] = $this->country_id;
            $data['city_id'] = $this->city_id;
            $data['area_id'] = $this->area_id;
            $data['approved_at'] = $this->approved_at?->toISOString();
        }

        return $data;
    }
}

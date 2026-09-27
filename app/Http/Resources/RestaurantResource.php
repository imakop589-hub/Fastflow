<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'description' => $this->description,
            'city' => $this->city ?? $this->cityRef?->name,
            'area' => $this->area ?? $this->areaRef?->name,
            'minimum_order_amount' => (float) $this->minimum_order_amount,
            'delivery_time_min' => (int) $this->delivery_time_min,
            'delivery_time_max' => (int) $this->delivery_time_max,
            'delivery_fee' => (float) $this->delivery_fee,
            'status' => $this->status,
            'approval_status' => $this->approval_status,
        ];
    }
}

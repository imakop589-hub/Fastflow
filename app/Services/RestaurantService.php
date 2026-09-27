<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\RestaurantHour;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RestaurantService
{
    /**
     * Allowed image extensions and mime types.
     */
    protected const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    public function createApplication(User $owner, array $data): Restaurant
    {
        return DB::transaction(function () use ($owner, $data) {
            $restaurant = Restaurant::create([
                'owner_id' => $owner->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']) . '-' . Str::lower(Str::random(4)),
                'description' => $data['description'] ?? null,
                'phone' => $data['phone'],
                'email' => $data['email'],
                'address' => $data['address'],
                'country_id' => $data['country_id'] ?? null,
                'city_id' => $data['city_id'] ?? null,
                'area_id' => $data['area_id'] ?? null,
                'city' => $data['city'] ?? null,
                'area' => $data['area'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'status' => Restaurant::STATUS_ACTIVE,
                'approval_status' => Restaurant::APPROVAL_PENDING,
                'minimum_order_amount' => $data['minimum_order_amount'] ?? 10.00,
                'delivery_time_min' => $data['delivery_time_min'] ?? 25,
                'delivery_time_max' => $data['delivery_time_max'] ?? 45,
                'delivery_fee' => $data['delivery_fee'] ?? 2.50,
            ]);

            // Seed default 7-day hours (10:00 to 22:00)
            $this->initializeDefaultHours($restaurant);

            AuditLogService::log(
                action: 'restaurant_created',
                module: 'restaurants',
                recordType: 'Restaurant',
                recordId: $restaurant->id,
                description: "New restaurant application submitted: {$restaurant->name}",
                userId: $owner->id
            );

            return $restaurant;
        });
    }

    public function initializeDefaultHours(Restaurant $restaurant): void
    {
        for ($day = 1; $day <= 7; $day++) {
            RestaurantHour::firstOrCreate(
                [
                    'restaurant_id' => $restaurant->id,
                    'day_of_week' => $day,
                ],
                [
                    'is_open' => true,
                    'open_time' => '10:00:00',
                    'close_time' => '22:00:00',
                    'first_open' => '10:00:00',
                    'first_close' => '14:00:00',
                    'second_open' => '17:00:00',
                    'second_close' => '22:00:00',
                ]
            );
        }
    }

    public function approve(Restaurant $restaurant, User $admin): Restaurant
    {
        $restaurant->update([
            'approval_status' => Restaurant::APPROVAL_APPROVED,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        AuditLogService::log(
            action: 'restaurant_approved',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Restaurant #{$restaurant->id} ({$restaurant->name}) approved by Admin {$admin->name}",
            userId: $admin->id
        );

        return $restaurant;
    }

    public function reject(Restaurant $restaurant, string $reason, User $admin): Restaurant
    {
        $restaurant->update([
            'approval_status' => Restaurant::APPROVAL_REJECTED,
            'rejection_reason' => $reason,
        ]);

        AuditLogService::log(
            action: 'restaurant_rejected',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Restaurant #{$restaurant->id} rejected. Reason: {$reason}",
            userId: $admin->id
        );

        return $restaurant;
    }

    public function requestChanges(Restaurant $restaurant, string $notes, User $admin): Restaurant
    {
        $restaurant->update([
            'approval_status' => Restaurant::APPROVAL_CHANGES_REQUESTED,
            'rejection_reason' => $notes,
        ]);

        AuditLogService::log(
            action: 'restaurant_changes_requested',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Changes requested for restaurant #{$restaurant->id}: {$notes}",
            userId: $admin->id
        );

        return $restaurant;
    }

    public function toggleStatus(Restaurant $restaurant, string $newStatus, User $user): Restaurant
    {
        $oldStatus = $restaurant->status;
        $restaurant->update(['status' => $newStatus]);

        AuditLogService::log(
            action: 'restaurant_status_updated',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Status changed from {$oldStatus} to {$newStatus}",
            userId: $user->id
        );

        return $restaurant;
    }

    public function storeImage(UploadedFile $file, string $folder = 'restaurants'): string
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES, true)) {
            throw new \InvalidArgumentException('Invalid file type. Only JPG, PNG, and WebP are allowed.');
        }

        if ($file->getSize() > 2 * 1024 * 1024) { // 2MB max
            throw new \InvalidArgumentException('Image file size exceeds maximum 2MB limit.');
        }

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return Storage::disk('public')->putFileAs($folder, $file, $filename);
    }
}

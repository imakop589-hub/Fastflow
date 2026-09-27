<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RestaurantPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('restaurants.view');
    }

    public function view(User $user, Restaurant $restaurant): bool
    {
        // Admin with permission
        if ($user->hasPermission('restaurants.view')) {
            return true;
        }

        // Restaurant owner of this specific restaurant
        if ($restaurant->isOwnedBy($user)) {
            return true;
        }

        // Restaurant staff belonging to this specific restaurant
        if ($user->staffEmployment && (int) $user->staffEmployment->restaurant_id === (int) $restaurant->id) {
            return $user->staffEmployment->status === 'active';
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('restaurants.create') || $user->hasRole('restaurant-owner');
    }

    public function update(User $user, Restaurant $restaurant): bool
    {
        if ($user->hasPermission('restaurants.update')) {
            return true;
        }

        // Owner can update their own restaurant
        if ($restaurant->isOwnedBy($user)) {
            return true;
        }

        // Restaurant manager can update basic profile if permitted
        if ($user->staffEmployment && (int) $user->staffEmployment->restaurant_id === (int) $restaurant->id) {
            return $user->staffEmployment->role === 'manager' && $user->staffEmployment->status === 'active';
        }

        return false;
    }

    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $user->hasPermission('restaurants.delete');
    }

    public function approve(User $user): bool
    {
        return $user->hasPermission('restaurants.approve');
    }

    public function reject(User $user): bool
    {
        return $user->hasPermission('restaurants.reject');
    }

    public function suspend(User $user): bool
    {
        return $user->hasPermission('restaurants.suspend');
    }
}

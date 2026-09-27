<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RestaurantStaffPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user, Restaurant $restaurant): bool
    {
        if ($user->hasPermission('restaurant_staff.view')) {
            return true;
        }

        return $restaurant->isOwnedBy($user);
    }

    public function view(User $user, RestaurantStaff $staff): bool
    {
        if ($user->hasPermission('restaurant_staff.view')) {
            return true;
        }

        return $staff->restaurant->isOwnedBy($user) || (int) $user->id === (int) $staff->user_id;
    }

    public function create(User $user, Restaurant $restaurant): bool
    {
        if ($user->hasPermission('restaurant_staff.create')) {
            return true;
        }

        return $restaurant->isOwnedBy($user);
    }

    public function update(User $user, RestaurantStaff $staff): bool
    {
        if ($user->hasPermission('restaurant_staff.update')) {
            return true;
        }

        return $staff->restaurant->isOwnedBy($user);
    }

    public function delete(User $user, RestaurantStaff $staff): bool
    {
        if ($user->hasPermission('restaurant_staff.delete')) {
            return true;
        }

        return $staff->restaurant->isOwnedBy($user);
    }
}

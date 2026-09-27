<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\CreateStaffRequest;
use App\Http\Resources\RestaurantStaffResource;
use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RestaurantStaffController extends Controller
{
    public function index(Request $request, ?Restaurant $restaurant = null): JsonResponse
    {
        $user = $request->user();

        if (! $restaurant) {
            $restaurantId = $request->query('restaurant_id');
            $restaurant = $restaurantId 
                ? Restaurant::find($restaurantId)
                : $user->primaryRestaurant;
        }

        if (! $restaurant) {
            return $this->errorResponse('Restaurant not found', null, 404);
        }

        $this->authorize('viewAny', [RestaurantStaff::class, $restaurant]);

        $staff = RestaurantStaff::with('user')
            ->where('restaurant_id', $restaurant->id)
            ->latest()
            ->get();

        return $this->successResponse(RestaurantStaffResource::collection($staff), 'Staff members retrieved');
    }

    public function store(CreateStaffRequest $request, ?Restaurant $restaurant = null): JsonResponse
    {
        $user = $request->user();

        if (! $restaurant) {
            $restaurantId = $request->input('restaurant_id') ?? $request->query('restaurant_id');
            $restaurant = $restaurantId 
                ? Restaurant::find($restaurantId)
                : $user->primaryRestaurant;
        }

        if (! $restaurant) {
            return $this->errorResponse('Restaurant not found', null, 404);
        }

        $this->authorize('create', [RestaurantStaff::class, $restaurant]);

        $staffRecord = DB::transaction(function () use ($validated, $restaurant, $user) {
            $staffUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'status' => 'active',
            ]);

            // Assign role
            $roleSlug = $validated['role'] === 'manager' ? 'restaurant-manager' : 'restaurant-staff';
            $role = Role::where('slug', $roleSlug)->first();
            if ($role) {
                $staffUser->roles()->attach($role->id);
            }

            $staff = RestaurantStaff::create([
                'restaurant_id' => $restaurant->id,
                'user_id' => $staffUser->id,
                'role' => $validated['role'],
                'status' => 'active',
            ]);

            AuditLogService::log(
                action: 'staff_created',
                module: 'staff',
                recordType: 'RestaurantStaff',
                recordId: $staff->id,
                description: "Staff member {$staffUser->name} created for restaurant {$restaurant->name}",
                userId: $user->id
            );

            return $staff;
        });

        return $this->successResponse(
            new RestaurantStaffResource($staffRecord->load('user')),
            'Staff member added successfully',
            201
        );
    }

    public function toggleStatus(Request $request, RestaurantStaff $staff): JsonResponse
    {
        $this->authorize('update', $staff);

        $newStatus = $staff->status === 'active' ? 'inactive' : 'active';
        $staff->update(['status' => $newStatus]);

        AuditLogService::log(
            action: 'staff_updated',
            module: 'staff',
            recordType: 'RestaurantStaff',
            recordId: $staff->id,
            description: "Staff status updated to {$newStatus}",
            userId: $request->user()->id
        );

        return $this->successResponse(new RestaurantStaffResource($staff->load('user')), "Staff status changed to {$newStatus}");
    }

    public function destroy(Request $request, RestaurantStaff $staff): JsonResponse
    {
        $this->authorize('delete', $staff);

        $staffId = $staff->id;
        $staffUser = $staff->user;

        DB::transaction(function () use ($staff, $staffUser, $request, $staffId) {
            $staff->delete();
            $staffUser?->delete();

            AuditLogService::log(
                action: 'staff_deleted',
                module: 'staff',
                recordType: 'RestaurantStaff',
                recordId: $staffId,
                description: "Staff member #{$staffId} removed",
                userId: $request->user()->id
            );
        });

        return $this->successResponse(null, 'Staff member removed successfully');
    }
}

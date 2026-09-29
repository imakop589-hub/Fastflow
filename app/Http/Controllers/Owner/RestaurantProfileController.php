<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\RestaurantApplicationRequest;
use App\Http\Requests\Owner\UpdateRestaurantProfileRequest;
use App\Http\Resources\RestaurantDetailResource;
use App\Models\Restaurant;
use App\Services\AuditLogService;
use App\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantProfileController extends Controller
{
    public function __construct(
        protected RestaurantService $restaurantService
    ) {}

    /**
     * List all restaurants owned by the authenticated owner.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurants = $user->ownedRestaurants()
            ->with(['hours', 'staff.user', 'cityRef', 'areaRef'])
            ->latest()
            ->get();

        return $this->successResponse(
            RestaurantDetailResource::collection($restaurants),
            'Owned restaurants retrieved successfully'
        );
    }

    /**
     * Get the authenticated owner's restaurant profile.
     * Supports specific restaurant parameter, query restaurant_id, or fallback to primary restaurant.
     */
    public function show(Request $request, ?Restaurant $restaurant = null): JsonResponse
    {
        $user = $request->user();

        if (! $restaurant) {
            $restaurantId = $request->query('restaurant_id');
            $restaurant = $restaurantId 
                ? Restaurant::find($restaurantId)
                : $user->primaryRestaurant;
        }

        if (! $restaurant) {
            return $this->errorResponse('No restaurant found for this account. Please submit an application.', null, 404);
        }

        $this->authorize('view', $restaurant);

        return $this->successResponse(
            new RestaurantDetailResource($restaurant->load(['hours', 'staff.user', 'cityRef', 'areaRef'])),
            'Restaurant profile retrieved'
        );
    }

    /**
     * Submit a new restaurant onboarding application.
     * Multi-vendor architecture: an owner can operate multiple restaurants/branches.
     */
    public function store(RestaurantApplicationRequest $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $validated['logo'] = $this->restaurantService->storeImage($request->file('logo'), 'logos');
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $this->restaurantService->storeImage($request->file('cover_image'), 'covers');
        }

        $restaurant = $this->restaurantService->createApplication($user, $validated);

        return $this->successResponse(
            new RestaurantDetailResource($restaurant->load('hours')),
            'Restaurant application submitted successfully and is pending review',
            201
        );
    }

    /**
     * Update the authenticated owner's restaurant profile.
     * Guaranteed IDOR safe: always asserts authorization on target restaurant.
     */
    public function update(UpdateRestaurantProfileRequest $request, ?Restaurant $restaurant = null): JsonResponse
    {
        $user = $request->user();

        if (! $restaurant) {
            $restaurant = $request->getTargetRestaurant();
        }

        if (! $restaurant) {
            return $this->errorResponse('Restaurant not found', null, 404);
        }

        $this->authorize('update', $restaurant);

        $validated = $request->validated();
        unset($validated['restaurant_id']);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $this->restaurantService->storeImage($request->file('logo'), 'logos');
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $this->restaurantService->storeImage($request->file('cover_image'), 'covers');
        }

        $changes = array_diff_assoc($validated, $restaurant->only(array_keys($validated)));
        $restaurant->update($validated);

        AuditLogService::log(
            action: 'restaurant_updated',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Restaurant profile updated by owner {$user->name}",
            changes: $changes,
            userId: $user->id
        );

        return $this->successResponse(
            new RestaurantDetailResource($restaurant->fresh(['hours', 'staff.user', 'cityRef', 'areaRef'])),
            'Restaurant profile updated successfully'
        );
    }
}

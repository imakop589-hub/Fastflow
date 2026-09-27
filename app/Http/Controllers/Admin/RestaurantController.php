<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RestaurantApprovalRequest;
use App\Http\Resources\RestaurantDetailResource;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function __construct(
        protected RestaurantService $restaurantService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Restaurant::class);

        $query = Restaurant::with(['owner', 'cityRef', 'areaRef']);

        if ($request->filled('approval_status')) {
            $query->where('approval_status', $request->query('approval_status'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $restaurants = $query->latest()->paginate(15);

        return $this->successResponse([
            'restaurants' => RestaurantDetailResource::collection($restaurants),
            'pagination' => [
                'total' => $restaurants->total(),
                'per_page' => $restaurants->perPage(),
                'current_page' => $restaurants->currentPage(),
                'last_page' => $restaurants->lastPage(),
            ],
        ], 'Restaurants retrieved successfully');
    }

    public function show(Restaurant $restaurant): JsonResponse
    {
        $this->authorize('view', $restaurant);

        return $this->successResponse(
            new RestaurantDetailResource($restaurant->load(['owner', 'hours', 'staff.user', 'cityRef', 'areaRef'])),
            'Restaurant details retrieved'
        );
    }

    public function approve(Request $request, Restaurant $restaurant): JsonResponse
    {
        $this->authorize('approve', $restaurant);

        $restaurant = $this->restaurantService->approve($restaurant, $request->user());

        return $this->successResponse(new RestaurantDetailResource($restaurant), 'Restaurant approved successfully');
    }

    public function reject(RestaurantApprovalRequest $request, Restaurant $restaurant): JsonResponse
    {
        $this->authorize('reject', $restaurant);

        $reason = $request->input('reason', 'Application did not meet marketplace requirements.');
        $restaurant = $this->restaurantService->reject($restaurant, $reason, $request->user());

        return $this->successResponse(new RestaurantDetailResource($restaurant), 'Restaurant rejected');
    }

    public function requestChanges(RestaurantApprovalRequest $request, Restaurant $restaurant): JsonResponse
    {
        $this->authorize('reject', $restaurant);

        $notes = $request->input('reason', 'Please revise your details and re-submit.');
        $restaurant = $this->restaurantService->requestChanges($restaurant, $notes, $request->user());

        return $this->successResponse(new RestaurantDetailResource($restaurant), 'Changes requested from restaurant owner');
    }

    public function suspend(Request $request, Restaurant $restaurant): JsonResponse
    {
        $this->authorize('suspend', $restaurant);

        $restaurant = $this->restaurantService->toggleStatus($restaurant, Restaurant::STATUS_SUSPENDED, $request->user());

        return $this->successResponse(new RestaurantDetailResource($restaurant), 'Restaurant suspended');
    }

    public function activate(Request $request, Restaurant $restaurant): JsonResponse
    {
        $this->authorize('suspend', $restaurant);

        $restaurant = $this->restaurantService->toggleStatus($restaurant, Restaurant::STATUS_ACTIVE, $request->user());

        return $this->successResponse(new RestaurantDetailResource($restaurant), 'Restaurant reactivated');
    }
}

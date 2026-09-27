<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\RestaurantDetailResource;
use App\Http\Resources\RestaurantResource;
use App\Models\City;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Restaurant::marketplaceVisible()
            ->with(['cityRef', 'areaRef']);

        if ($request->filled('city')) {
            $query->where(function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->query('city') . '%')
                  ->orWhereHas('cityRef', function ($cq) use ($request) {
                      $cq->where('slug', $request->query('city'))
                         ->orWhere('name', 'like', '%' . $request->query('city') . '%');
                  });
            });
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $restaurants = $query->latest()->paginate(12);

        return $this->successResponse([
            'restaurants' => RestaurantResource::collection($restaurants),
            'pagination' => [
                'total' => $restaurants->total(),
                'per_page' => $restaurants->perPage(),
                'current_page' => $restaurants->currentPage(),
                'last_page' => $restaurants->lastPage(),
            ],
        ], 'Public restaurants retrieved');
    }

    public function show(string $slug): JsonResponse
    {
        $restaurant = Restaurant::marketplaceVisible()
            ->where('slug', $slug)
            ->with(['hours', 'cityRef', 'areaRef'])
            ->first();

        if (! $restaurant) {
            return $this->errorResponse('Restaurant not found or is currently unavailable', null, 404);
        }

        return $this->successResponse(
            new RestaurantDetailResource($restaurant),
            'Restaurant details retrieved'
        );
    }
}

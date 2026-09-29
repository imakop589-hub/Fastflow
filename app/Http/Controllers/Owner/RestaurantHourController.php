<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\UpdateRestaurantHoursRequest;
use App\Models\Restaurant;
use App\Models\RestaurantHour;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestaurantHourController extends Controller
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

        $this->authorize('view', $restaurant);

        $hours = $restaurant->hours()->orderBy('day_of_week')->get();

        return $this->successResponse($hours, 'Opening hours retrieved');
    }

    public function update(UpdateRestaurantHoursRequest $request, ?Restaurant $restaurant = null): JsonResponse
    {
        $user = $request->user();

        if (! $restaurant) {
            $restaurant = $request->getTargetRestaurant();
        }

        if (! $restaurant) {
            return $this->errorResponse('Restaurant not found', null, 404);
        }

        $this->authorize('update', $restaurant);

        $hoursData = $request->validated()['hours'];

        DB::transaction(function () use ($restaurant, $hoursData) {
            foreach ($hoursData as $dayItem) {
                RestaurantHour::updateOrCreate(
                    [
                        'restaurant_id' => $restaurant->id,
                        'day_of_week' => $dayItem['day_of_week'],
                    ],
                    [
                        'is_open' => $dayItem['is_open'],
                        'open_time' => $dayItem['open_time'] ?? null,
                        'close_time' => $dayItem['close_time'] ?? null,
                        'first_open' => $dayItem['first_open'] ?? null,
                        'first_close' => $dayItem['first_close'] ?? null,
                        'second_open' => $dayItem['second_open'] ?? null,
                        'second_close' => $dayItem['second_close'] ?? null,
                    ]
                );
            }
        });

        AuditLogService::log(
            action: 'restaurant_hours_updated',
            module: 'restaurants',
            recordType: 'Restaurant',
            recordId: $restaurant->id,
            description: "Opening hours updated for restaurant {$restaurant->name}",
            userId: $user->id
        );

        return $this->successResponse(
            $restaurant->hours()->orderBy('day_of_week')->get(),
            'Opening hours updated successfully'
        );
    }
}

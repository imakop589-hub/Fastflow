<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Restaurant;
use App\Models\RestaurantStaff;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $totalUsers = User::count();
        $activeRestaurants = Restaurant::where('status', Restaurant::STATUS_ACTIVE)
            ->where('approval_status', Restaurant::APPROVAL_APPROVED)
            ->count();
        $pendingApplications = Restaurant::where('approval_status', Restaurant::APPROVAL_PENDING)->count();
        $activeStaff = RestaurantStaff::where('status', 'active')->count();

        $recentLogs = AuditLog::with('user')
            ->latest('created_at')
            ->limit(5)
            ->get();

        return $this->successResponse([
            'metrics' => [
                'total_users' => $totalUsers,
                'active_restaurants' => $activeRestaurants,
                'pending_applications' => $pendingApplications,
                'active_staff' => $activeStaff,
            ],
            'system_status' => [
                'environment' => config('app.env'),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'database' => 'Connected',
                'cache' => 'Operational',
            ],
            'recent_activity' => $recentLogs,
        ], 'Admin dashboard metrics retrieved');
    }
}

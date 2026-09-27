<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Setting::class);

        $query = Setting::query();

        if ($request->filled('group')) {
            $query->where('group', $request->query('group'));
        }

        $settings = $query->get();

        return $this->successResponse(SettingResource::collection($settings), 'Settings retrieved');
    }

    public function update(UpdateSettingRequest $request): JsonResponse
    {
        $this->authorize('update', Setting::class);

        $items = $request->input('settings', []);
        $updated = [];

        foreach ($items as $item) {
            $setting = Setting::set(
                key: $item['key'],
                value: $item['value'],
                group: $item['group'] ?? 'general'
            );
            $updated[] = $setting;
        }

        AuditLogService::log(
            action: 'settings_updated',
            module: 'settings',
            recordType: 'Setting',
            description: 'System settings updated'
        );

        return $this->successResponse(SettingResource::collection($updated), 'Settings updated successfully');
    }
}

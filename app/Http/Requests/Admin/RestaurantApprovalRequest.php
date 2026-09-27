<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RestaurantApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('restaurants.approve') ?? false;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject,changes_requested'],
            'reason' => ['required_if:action,reject,changes_requested', 'nullable', 'string', 'max:500'],
        ];
    }
}

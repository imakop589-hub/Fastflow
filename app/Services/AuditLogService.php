<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogService
{
    /**
     * Sanitized fields that must NEVER be logged.
     */
    protected static array $redactedKeys = [
        'password',
        'password_confirmation',
        'secret',
        'api_key',
        'token',
        'remember_token',
        'access_token',
        'card_number',
        'cvv',
    ];

    public static function log(
        string $action,
        string $module,
        ?string $recordType = null,
        ?int $recordId = null,
        ?string $description = null,
        ?array $changes = null,
        ?int $userId = null
    ): AuditLog {
        $sanitizedChanges = $changes ? self::sanitizeChanges($changes) : null;

        return AuditLog::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'module' => $module,
            'record_type' => $recordType,
            'record_id' => $recordId,
            'description' => $description,
            'changes' => $sanitizedChanges,
            'ip_address' => Request::ip() ?? '127.0.0.1',
            'user_agent' => Request::userAgent(),
            'created_at' => now(),
        ]);
    }

    protected static function sanitizeChanges(array $changes): array
    {
        $sanitized = [];
        foreach ($changes as $key => $value) {
            if (in_array(strtolower($key), self::$redactedKeys, true)) {
                $sanitized[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $sanitized[$key] = self::sanitizeChanges($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
}

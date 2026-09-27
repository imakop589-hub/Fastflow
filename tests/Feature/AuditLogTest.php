<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_redacts_passwords_and_tokens(): void
    {
        $user = User::factory()->create();

        AuditLogService::log(
            action: 'test_action',
            module: 'auth',
            recordType: 'User',
            recordId: $user->id,
            description: 'Testing security redaction',
            changes: [
                'name' => 'New Name',
                'password' => 'plaintext_secret_123',
                'token' => 'super_secret_bearer_token',
            ],
            userId: $user->id
        );

        $log = AuditLog::first();

        $this->assertNotNull($log);
        $this->assertEquals('[REDACTED]', $log->changes['password']);
        $this->assertEquals('[REDACTED]', $log->changes['token']);
        $this->assertEquals('New Name', $log->changes['name']);
    }
}

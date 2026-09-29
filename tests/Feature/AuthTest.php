<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'Customer', 'slug' => 'customer']);
        Role::create(['name' => 'Restaurant Owner', 'slug' => 'restaurant-owner']);
        Role::create(['name' => 'Super Admin', 'slug' => 'super-admin']);
        Role::create(['name' => 'Admin', 'slug' => 'admin']);
    }

    public function test_user_can_register_as_customer(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'role' => 'customer',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user', 'token']]);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        $user = User::where('email', 'john@example.com')->first();
        $this->assertTrue($user->roles->contains('slug', 'customer'));
    }

    public function test_user_can_register_as_restaurant_owner(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Merchant Bob',
            'email' => 'bob@merchant.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'role' => 'restaurant-owner',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $user = User::where('email', 'bob@merchant.com')->first();
        $this->assertTrue($user->roles->contains('slug', 'restaurant-owner'));
    }

    public function test_user_cannot_escalate_to_privileged_roles_via_registration(): void
    {
        $privilegedRoles = ['super-admin', 'admin', 'restaurant-manager', 'restaurant-staff', 'rider'];

        foreach ($privilegedRoles as $role) {
            $response = $this->postJson('/api/v1/auth/register', [
                'name' => 'Attacker',
                'email' => "attacker_{$role}@example.com",
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'role' => $role,
            ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors('role');

            $this->assertDatabaseMissing('users', ['email' => "attacker_{$role}@example.com"]);
        }
    }

    public function test_registration_fails_safely_when_role_missing_in_database(): void
    {
        Role::where('slug', 'customer')->delete();

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'role' => 'customer',
        ]);

        $response->assertStatus(500);
        $this->assertDatabaseMissing('users', ['email' => 'jane@example.com']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-pass',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_nonexistent_account_login_fails(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'suspended@example.com',
            'password' => bcrypt('password123'),
            'status' => 'suspended',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'suspended@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertCount(0, $user->tokens);
    }

    public function test_protected_endpoint_denies_unauthenticated_request(): void
    {
        $response = $this->getJson('/api/v1/me');
        $response->assertStatus(401);
    }
}

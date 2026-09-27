<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('DemoSecret@2026!');

        // 1. Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@foodbrio.local'],
            [
                'name' => 'Farhan Qureshi (Super Admin)',
                'phone' => '+92-300-1112233',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $superAdminRole = Role::where('slug', 'super-admin')->first();
        if ($superAdminRole) {
            $superAdmin->roles()->syncWithoutDetaching([$superAdminRole->id]);
        }

        // 2. Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@foodbrio.local'],
            [
                'name' => 'Ayesha Khan (Operations Admin)',
                'phone' => '+92-300-2223344',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // 3. Restaurant Owners
        $ownerRole = Role::where('slug', 'restaurant-owner')->first();

        // Owner 1: Urban Spoon
        $owner1 = User::firstOrCreate(
            ['email' => 'owner.urbanspoon@foodbrio.local'],
            [
                'name' => 'Tariq Mehmood',
                'phone' => '+92-300-3334455',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if ($ownerRole) {
            $owner1->roles()->syncWithoutDetaching([$ownerRole->id]);
        }

        // Owner 2: Green Bowl
        $owner2 = User::firstOrCreate(
            ['email' => 'owner.greenbowl@foodbrio.local'],
            [
                'name' => 'Sara Danish',
                'phone' => '+92-300-4445566',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if ($ownerRole) {
            $owner2->roles()->syncWithoutDetaching([$ownerRole->id]);
        }

        // Owner 3: Daily Grill
        $owner3 = User::firstOrCreate(
            ['email' => 'owner.dailygrill@foodbrio.local'],
            [
                'name' => 'Bilal Ahmed',
                'phone' => '+92-300-5556677',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if ($ownerRole) {
            $owner3->roles()->syncWithoutDetaching([$ownerRole->id]);
        }

        // 4. Restaurant Staff
        $staffRole = Role::where('slug', 'restaurant-staff')->first();
        $staff1 = User::firstOrCreate(
            ['email' => 'staff.urbanspoon@foodbrio.local'],
            [
                'name' => 'Hamza Ali (Kitchen Lead)',
                'phone' => '+92-300-6667788',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if ($staffRole) {
            $staff1->roles()->syncWithoutDetaching([$staffRole->id]);
        }

        // 5. Customer demo
        $customerRole = Role::where('slug', 'customer')->first();
        $customer = User::firstOrCreate(
            ['email' => 'customer@foodbrio.local'],
            [
                'name' => 'Zainab Siddiqui',
                'phone' => '+92-300-7778899',
                'password' => $defaultPassword,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if ($customerRole) {
            $customer->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}

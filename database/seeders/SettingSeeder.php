<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'app_name', 'value' => 'Fastflow Marketplace', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'support_email', 'value' => 'support@fastflow.local', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'support_phone', 'value' => '+92-800-FASTFLOW', 'group' => 'general', 'type' => 'string', 'is_public' => true],
            ['key' => 'copyright_text', 'value' => '© 2026 Fastflow Multi-Vendor Marketplace. All rights reserved.', 'group' => 'general', 'type' => 'string', 'is_public' => true],

            // Branding
            ['key' => 'brand_tagline', 'value' => 'Flavors from the best restaurants delivered to your doorstep.', 'group' => 'branding', 'type' => 'string', 'is_public' => true],
            ['key' => 'primary_color', 'value' => '#ea580c', 'group' => 'branding', 'type' => 'string', 'is_public' => true],
            ['key' => 'logo_url', 'value' => '/images/logo.svg', 'group' => 'branding', 'type' => 'string', 'is_public' => true],

            // Localization & Currency
            ['key' => 'default_country', 'value' => 'PK', 'group' => 'localization', 'type' => 'string', 'is_public' => true],
            ['key' => 'default_currency', 'value' => 'USD', 'group' => 'currency', 'type' => 'string', 'is_public' => true],
            ['key' => 'currency_symbol', 'value' => '$', 'group' => 'currency', 'type' => 'string', 'is_public' => true],
            ['key' => 'currency_position', 'value' => 'left', 'group' => 'currency', 'type' => 'string', 'is_public' => true],
            ['key' => 'timezone', 'value' => 'UTC', 'group' => 'localization', 'type' => 'string', 'is_public' => false],

            // Delivery & Order Policies
            ['key' => 'default_delivery_radius_km', 'value' => '10', 'group' => 'delivery', 'type' => 'integer', 'is_public' => true],
            ['key' => 'minimum_order_enabled', 'value' => 'true', 'group' => 'delivery', 'type' => 'boolean', 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                    'type' => $setting['type'],
                    'is_public' => $setting['is_public'],
                ]
            );
        }
    }
}

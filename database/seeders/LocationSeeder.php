<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pakistan (Demo Country)
        $pakistan = Country::firstOrCreate(
            ['code' => 'PK'],
            [
                'name' => 'Pakistan',
                'phone_code' => '+92',
                'currency_code' => 'PKR',
                'currency_symbol' => 'Rs',
                'is_active' => true,
            ]
        );

        // Cities & Areas
        $locations = [
            'Lahore' => [
                'latitude' => 31.5204,
                'longitude' => 74.3587,
                'areas' => [
                    ['name' => 'Gulberg III', 'slug' => 'gulberg-iii', 'postal_code' => '54660'],
                    ['name' => 'DHA Phase 5', 'slug' => 'dha-phase-5', 'postal_code' => '54792'],
                    ['name' => 'Model Town', 'slug' => 'model-town', 'postal_code' => '54700'],
                    ['name' => 'Johar Town', 'slug' => 'johar-town', 'postal_code' => '54770'],
                ],
            ],
            'Karachi' => [
                'latitude' => 24.8607,
                'longitude' => 67.0011,
                'areas' => [
                    ['name' => 'Clifton Block 4', 'slug' => 'clifton-block-4', 'postal_code' => '75600'],
                    ['name' => 'DHA Phase 6', 'slug' => 'dha-phase-6-karachi', 'postal_code' => '75500'],
                    ['name' => 'Gulshan-e-Iqbal', 'slug' => 'gulshan-e-iqbal', 'postal_code' => '75300'],
                ],
            ],
            'Islamabad' => [
                'latitude' => 33.6844,
                'longitude' => 73.0479,
                'areas' => [
                    ['name' => 'F-7 Markaz', 'slug' => 'f-7-markaz', 'postal_code' => '44000'],
                    ['name' => 'F-11 Markaz', 'slug' => 'f-11-markaz', 'postal_code' => '44011'],
                    ['name' => 'Blue Area', 'slug' => 'blue-area', 'postal_code' => '44020'],
                ],
            ],
        ];

        foreach ($locations as $cityName => $cityData) {
            $city = City::firstOrCreate(
                [
                    'country_id' => $pakistan->id,
                    'slug' => strtolower($cityName),
                ],
                [
                    'name' => $cityName,
                    'latitude' => $cityData['latitude'],
                    'longitude' => $cityData['longitude'],
                    'is_active' => true,
                ]
            );

            foreach ($cityData['areas'] as $areaData) {
                Area::firstOrCreate(
                    [
                        'city_id' => $city->id,
                        'slug' => $areaData['slug'],
                    ],
                    [
                        'name' => $areaData['name'],
                        'postal_code' => $areaData['postal_code'],
                        'latitude' => $cityData['latitude'],
                        'longitude' => $cityData['longitude'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}

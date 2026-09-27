<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\City;
use App\Models\Country;
use App\Models\Restaurant;
use App\Models\RestaurantHour;
use App\Models\RestaurantStaff;
use App\Models\User;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $pakistan = Country::where('code', 'PK')->first();
        $lahore = City::where('slug', 'lahore')->first();
        $gulberg = Area::where('slug', 'gulberg-iii')->first();
        $islamabad = City::where('slug', 'islamabad')->first();
        $f7 = Area::where('slug', 'f-7-markaz')->first();
        $karachi = City::where('slug', 'karachi')->first();
        $clifton = Area::where('slug', 'clifton-block-4')->first();

        $owner1 = User::where('email', 'owner.urbanspoon@foodbrio.local')->first();
        $owner2 = User::where('email', 'owner.greenbowl@foodbrio.local')->first();
        $owner3 = User::where('email', 'owner.dailygrill@foodbrio.local')->first();
        $staff1 = User::where('email', 'staff.urbanspoon@foodbrio.local')->first();

        // 1. Urban Spoon (Approved & Active)
        if ($owner1) {
            $urbanSpoon = Restaurant::firstOrCreate(
                ['slug' => 'urban-spoon'],
                [
                    'owner_id' => $owner1->id,
                    'name' => 'Urban Spoon',
                    'logo' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
                    'cover_image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                    'description' => 'Artisanal fusion bistro featuring hand-crafted sourdough burgers, charred peri-peri steaks, and stone-baked thin crust pizzas.',
                    'phone' => '+92-42-35712345',
                    'email' => 'contact@urbanspoon.pk',
                    'address' => '42-C/II, M.M. Alam Road, Gulberg III',
                    'country_id' => $pakistan?->id,
                    'city_id' => $lahore?->id,
                    'area_id' => $gulberg?->id,
                    'city' => 'Lahore',
                    'area' => 'Gulberg III',
                    'postal_code' => '54660',
                    'latitude' => 31.5135,
                    'longitude' => 74.3528,
                    'status' => Restaurant::STATUS_ACTIVE,
                    'approval_status' => Restaurant::APPROVAL_APPROVED,
                    'approved_at' => now()->subDays(30),
                    'minimum_order_amount' => 15.00,
                    'delivery_time_min' => 25,
                    'delivery_time_max' => 40,
                    'delivery_fee' => 2.50,
                ]
            );

            $this->createHours($urbanSpoon);

            if ($staff1) {
                RestaurantStaff::firstOrCreate(
                    [
                        'restaurant_id' => $urbanSpoon->id,
                        'user_id' => $staff1->id,
                    ],
                    [
                        'role' => 'staff',
                        'status' => 'active',
                    ]
                );
            }
        }

        // 2. Green Bowl (Approved & Active)
        if ($owner2) {
            $greenBowl = Restaurant::firstOrCreate(
                ['slug' => 'green-bowl'],
                [
                    'owner_id' => $owner2->id,
                    'name' => 'Green Bowl',
                    'logo' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
                    'cover_image' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
                    'description' => 'Wholesome organic salads, cold-pressed vitality juices, and macro-balanced quinoa protein bowls prepared fresh every morning.',
                    'phone' => '+92-51-2651122',
                    'email' => 'hello@greenbowl.pk',
                    'address' => 'Shop 8, Beverly Centre, F-7 Markaz',
                    'country_id' => $pakistan?->id,
                    'city_id' => $islamabad?->id,
                    'area_id' => $f7?->id,
                    'city' => 'Islamabad',
                    'area' => 'F-7 Markaz',
                    'postal_code' => '44000',
                    'latitude' => 33.7208,
                    'longitude' => 73.0583,
                    'status' => Restaurant::STATUS_ACTIVE,
                    'approval_status' => Restaurant::APPROVAL_APPROVED,
                    'approved_at' => now()->subDays(15),
                    'minimum_order_amount' => 12.00,
                    'delivery_time_min' => 20,
                    'delivery_time_max' => 35,
                    'delivery_fee' => 1.99,
                ]
            );

            $this->createHours($greenBowl);
        }

        // 3. Daily Grill (Pending Application - ready for Admin approval demonstration)
        if ($owner3) {
            $dailyGrill = Restaurant::firstOrCreate(
                ['slug' => 'daily-grill'],
                [
                    'owner_id' => $owner3->id,
                    'name' => 'Daily Grill',
                    'logo' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80',
                    'cover_image' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
                    'description' => 'Charcoal skewers, smoked beef brisket burgers, and barbecue ribs slow-cooked over seasoned hickory wood.',
                    'phone' => '+92-21-35876655',
                    'email' => 'orders@dailygrill.pk',
                    'address' => 'Plot 14-B, Khayaban-e-Shamsheer, Clifton Block 4',
                    'country_id' => $pakistan?->id,
                    'city_id' => $karachi?->id,
                    'area_id' => $clifton?->id,
                    'city' => 'Karachi',
                    'area' => 'Clifton Block 4',
                    'postal_code' => '75600',
                    'latitude' => 24.8145,
                    'longitude' => 67.0342,
                    'status' => Restaurant::STATUS_ACTIVE,
                    'approval_status' => Restaurant::APPROVAL_PENDING,
                    'minimum_order_amount' => 18.00,
                    'delivery_time_min' => 35,
                    'delivery_time_max' => 55,
                    'delivery_fee' => 3.50,
                ]
            );

            $this->createHours($dailyGrill);
        }
    }

    protected function createHours(Restaurant $restaurant): void
    {
        for ($day = 1; $day <= 7; $day++) {
            RestaurantHour::firstOrCreate(
                [
                    'restaurant_id' => $restaurant->id,
                    'day_of_week' => $day,
                ],
                [
                    'is_open' => true,
                    'open_time' => '11:00:00',
                    'close_time' => '23:00:00',
                    'first_open' => '11:00:00',
                    'first_close' => '15:00:00',
                    'second_open' => '18:00:00',
                    'second_close' => '23:00:00',
                ]
            );
        }
    }
}

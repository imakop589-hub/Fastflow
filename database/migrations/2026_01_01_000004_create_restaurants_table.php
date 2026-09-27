<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->text('address');
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('city')->nullable(); // Plaintext fallback
            $table->string('area')->nullable(); // Plaintext fallback
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->enum('approval_status', ['pending', 'approved', 'rejected', 'changes_requested'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->decimal('minimum_order_amount', 8, 2)->default(0.00);
            $table->unsignedInteger('delivery_time_min')->default(20);
            $table->unsignedInteger('delivery_time_max')->default(45);
            $table->decimal('delivery_fee', 8, 2)->default(0.00);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('owner_id');
            $table->index(['status', 'approval_status']);
            $table->index('slug');
            $table->index('city_id');
            $table->index('area_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};

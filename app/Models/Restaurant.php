<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Restaurant extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_SUSPENDED = 'suspended';

    public const APPROVAL_PENDING = 'pending';
    public const APPROVAL_APPROVED = 'approved';
    public const APPROVAL_REJECTED = 'rejected';
    public const APPROVAL_CHANGES_REQUESTED = 'changes_requested';

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'logo',
        'cover_image',
        'description',
        'phone',
        'email',
        'address',
        'country_id',
        'city_id',
        'area_id',
        'city',
        'area',
        'postal_code',
        'latitude',
        'longitude',
        'status',
        'approval_status',
        'rejection_reason',
        'minimum_order_amount',
        'delivery_time_min',
        'delivery_time_max',
        'delivery_fee',
        'approved_at',
    ];

    protected $casts = [
        'minimum_order_amount' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'delivery_time_min' => 'integer',
        'delivery_time_max' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'approved_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Restaurant $restaurant) {
            if (empty($restaurant->slug)) {
                $restaurant->slug = Str::slug($restaurant->name) . '-' . Str::random(5);
            }
        });

        // Ensure canonical relational location is synchronized with display columns
        static::saving(function (Restaurant $restaurant) {
            if ($restaurant->city_id) {
                $city = City::find($restaurant->city_id);
                if ($city) {
                    $restaurant->city = $city->name;
                }
            }
            if ($restaurant->area_id) {
                $area = Area::find($restaurant->area_id);
                if ($area) {
                    $restaurant->area = $area->name;
                }
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function cityRef(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function areaRef(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function hours(): HasMany
    {
        return $this->hasMany(RestaurantHour::class)->orderBy('day_of_week');
    }

    public function staff(): HasMany
    {
        return $this->hasMany(RestaurantStaff::class);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('approval_status', self::APPROVAL_APPROVED);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeMarketplaceVisible(Builder $query): Builder
    {
        return $query->where('approval_status', self::APPROVAL_APPROVED)
                     ->where('status', self::STATUS_ACTIVE);
    }

    public function isApproved(): bool
    {
        return $this->approval_status === self::APPROVAL_APPROVED;
    }

    public function isOwnedBy(User $user): bool
    {
        return (int) $this->owner_id === (int) $user->id;
    }
}

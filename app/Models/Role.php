<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function givePermissionTo(Permission|string $permission): void
    {
        $perm = is_string($permission)
            ? Permission::firstOrCreate(['slug' => $permission], ['name' => ucwords(str_replace('.', ' ', $permission)), 'module' => 'system'])
            : $permission;

        $this->permissions()->syncWithoutDetaching([$perm->id]);
    }
}

# FoodBrio Marketplace — Developer Guidelines

## Coding Standards & Conventions
- **PHP**: PSR-12 coding standard enforced via Laravel Pint (`./vendor/bin/pint`).
- **Authorization**: Always use Form Requests and Policies (`$this->authorize(...)`). Never rely on client-side permission checks alone.
- **Data Protection**: Sensitive attributes must never appear in `AuditLog` records or API responses. Use `AuditLogService` which auto-redacts sensitive keys.
- **IDOR Safeguards**: Never query records by raw ID passed from request inputs without asserting tenant or owner relationship (`isOwnedBy()`).

---

## Testing Commands
```bash
# Run all feature tests
php artisan test

# Run isolated security test suite
php artisan test --filter=RestaurantIsolationTest
```

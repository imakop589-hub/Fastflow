# Fastflow Marketplace — Developer Guidelines

## Canonical Technology Stack
- **Backend**: Laravel 11.x (PHP 8.2+) with MySQL/MariaDB & Sanctum Token Authentication
- **Frontend**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4
- **API Standard**: RESTful `/api/v1` with uniform JSON envelope structure
- **Architecture**: Domain-driven service & policy isolation preventing IDOR and cross-vendor data exposure

## Coding Standards & Conventions
- **PHP**: PSR-12 coding standard enforced via Laravel Pint (`./vendor/bin/pint`).
- **Frontend**: Strict TypeScript (`tsc --noEmit`), modular functional React components with hooks.
- **Authorization**: Always use Form Requests and Policies (`$this->authorize(...)`). Never rely on client-side permission checks alone.
- **Data Protection**: Sensitive attributes must never appear in `AuditLog` records or API responses. Use `AuditLogService` which auto-redacts sensitive keys.
- **IDOR Safeguards**: Never query records by raw ID passed from request inputs without asserting tenant or owner relationship (`isOwnedBy()`).

---

## Testing Commands
```bash
# Run all PHP backend feature tests
php artisan test

# Run isolated security test suite
php artisan test --filter=RestaurantIsolationTest

# Typecheck and validate React 19 frontend
npm run lint

# Compile production assets
npm run build
```

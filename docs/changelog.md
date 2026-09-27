# FoodBrio Marketplace — Changelog

## [1.0.0-phase1] - 2026-09-27
### Phase 1: Foundation, Database, Authentication & Admin/Restaurant Core

#### Added
- Laravel 11.x backend architecture with Sanctum API token authentication.
- Complete database migration schema:
  - Users, Roles, Permissions, Role-User & Permission-Role pivots.
  - Countries, Cities, Areas (Pakistan seeded demo data).
  - Restaurants with multi-status workflow (Pending, Approved, Rejected, Changes Requested).
  - 7-Day Restaurant Opening Hours with split shift capability.
  - Restaurant Staff association with tenant isolation.
  - System Settings store with grouped configurations.
  - Automated Audit Logging with credential & token redaction.
- Full Eloquent models with query scopes (`approved`, `active`, `marketplaceVisible`).
- Policy-driven authorization with explicit IDOR protection.
- RESTful API v1 endpoints with consistent JSON resource formatting.
- Unit & Feature test suite for auth, approval workflows, tenant isolation, and audit logging.
- Multi-role administrative dashboard and merchant self-service portal.

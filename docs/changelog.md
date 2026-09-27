# FoodBrio Marketplace — Changelog

## [1.0.0-phase1] - 2026-09-27
### Phase 1: Foundation, Database, Authentication & Admin/Restaurant Core

#### Added
- Laravel 11.x backend architecture with Sanctum API token authentication.
- React 19 + TypeScript + Vite 8 + Tailwind CSS v4 frontend architecture.
- Complete database migration schema:
  - Users, Roles, Permissions, Role-User & Permission-Role pivots.
  - Countries, Cities, Areas (Pakistan seeded demo data).
  - Restaurants with multi-status workflow (Pending, Approved, Rejected, Changes Requested, Suspended).
  - 7-Day Restaurant Opening Hours with split shift capability.
  - Restaurant Staff association with tenant isolation.
  - System Settings store with grouped configurations.
  - Automated Audit Logging with credential & token redaction.
- Full Eloquent models with query scopes (`approved`, `active`, `marketplaceVisible`).
- Policy-driven authorization with explicit IDOR protection.
- RESTful API v1 endpoints with consistent JSON resource formatting.
- Unit & Feature test suite for auth, approval workflows, tenant isolation, and audit logging.
- Multi-role administrative dashboard and merchant self-service portal.

#### Audit & Corrections Applied
- **Frontend Stack Resolution**: Reconciled documentation mismatch to accurately specify `React 19 + TypeScript + Vite + Tailwind CSS` across all docs, reports, and licenses. Converted template layouts to TypeScript React (`.tsx`).
- **Location Data Model**: Designated `city_id` and `area_id` as canonical relational source of truth with automatic Eloquent model hooks (`saving`) to prevent data desynchronization between relational IDs and plaintext display columns.
- **Multi-Restaurant Architecture**: Removed artificial single-restaurant restriction on owner accounts. Implemented 1-to-many portfolio management, parameterized owner endpoints (`/owner/restaurants/{id}`), and interactive merchant store switcher.
- **Security & IDOR Hardening**: Added explicit tests and validation ensuring Owner A cannot mutate Owner B's venues, hours, or staff, with an 8-point live verification suite.

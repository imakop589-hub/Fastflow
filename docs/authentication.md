# Fastflow Marketplace — Authentication Architecture

## Overview
Fastflow uses **Laravel Sanctum** token-based authentication paired with standard Bcrypt/Argon2id password hashing.

### Demo Seed Accounts
| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `superadmin@fastflow.local` | `DemoSecret@2026!` | All system modules & settings |
| **Operations Admin**| `admin@fastflow.local` | `DemoSecret@2026!` | Restaurant approvals & user reviews |
| **Owner (Urban Spoon)** | `owner.urbanspoon@fastflow.local` | `DemoSecret@2026!` | Urban Spoon profile, hours, staff |
| **Owner (Green Bowl)** | `owner.greenbowl@fastflow.local` | `DemoSecret@2026!` | Green Bowl profile, hours, staff |
| **Owner (Daily Grill)** | `owner.dailygrill@fastflow.local` | `DemoSecret@2026!` | Pending application state |
| **Restaurant Staff** | `staff.urbanspoon@fastflow.local` | `DemoSecret@2026!` | Urban Spoon order/profile view |
| **Customer** | `customer@fastflow.local` | `DemoSecret@2026!` | Marketplace browsing |

*Note: For production deployments, change these passwords immediately via the Admin dashboard or `php artisan tinker`.*

---

## Authentication Endpoints
- `POST /api/v1/auth/login`: Rate-limited (10 requests/minute/IP), validates credentials, issues Sanctum bearer token, logs audit event.
- `POST /api/v1/auth/register`: Creates new user with customer or restaurant-owner role, returns token.
- `POST /api/v1/auth/logout`: Revokes token, invalidates session.
- `GET /api/v1/me`: Returns sanitized user details with permitted abilities and assigned primary restaurant.

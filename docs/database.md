# FoodBrio Marketplace — Database Architecture

## ERD & Schema Overview

### 1. `users`
- Primary user accounts (Super Admin, Admins, Owners, Managers, Staff, Customers, Riders).
- Soft deletes enabled (`deleted_at`).

### 2. `roles`, `permissions`, `role_user`, `permission_role`
- Strict normalized RBAC tables with unique composite keys preventing duplicate relationships.

### 3. `countries`, `cities`, `areas`
- Normalized geographical foundation. Seeded with demo cities (Lahore, Karachi, Islamabad) and areas (Gulberg, DHA, F-7, Clifton).

### 4. `restaurants`
- Main merchant model. Includes `owner_id` (foreign key to `users`), location references (`country_id`, `city_id`, `area_id`), financial constraints (`minimum_order_amount`, `delivery_fee`), timing buffers (`delivery_time_min`, `delivery_time_max`), and audit status flags (`approval_status`, `status`, `approved_at`, `rejection_reason`).
- Soft deletes enabled.

### 5. `restaurant_hours`
- 7 day schedules with split shifts support (`day_of_week` 1-7, `open_time`, `close_time`, `first_open`, `first_close`, `second_open`, `second_close`).

### 6. `restaurant_staff`
- Pivot model joining `restaurant_id` with `user_id`. Constrained with unique index `(restaurant_id, user_id)`.

### 7. `settings`
- Key-value configuration store with group tagging (`general`, `branding`, `currency`, `delivery`, `tax`, `seo`) and `is_public` boolean privacy flag.

### 8. `audit_logs`
- Immutably tracks security-sensitive operations with user attribution, IP, browser user agent, and automated sanitization of sensitive fields.

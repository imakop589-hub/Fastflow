# Fastflow Marketplace — Roles & Permissions (RBAC)

## RBAC Model
The platform implements a pure Role-Based Access Control model backed by 4 tables:
- `roles`
- `permissions`
- `role_user` (pivot)
- `permission_role` (pivot)

Permissions are decoupled from users and attached strictly to roles, avoiding permission duplication.

---

## Roles Hierarchy
1. **Super Admin**
   - Unrestricted root authority. Bypasses individual checks via Policy `before()` gate.
2. **Admin**
   - Manages users, reviews incoming restaurant applications, approves/rejects listings, views audit logs.
3. **Restaurant Owner**
   - Has full authority over their assigned restaurant: profile, operating hours, and staff accounts.
   - Enforced by `RestaurantPolicy` and IDOR prevention guards.
4. **Restaurant Manager**
   - Can view and update restaurant profile and operating hours, view staff.
5. **Restaurant Staff**
   - Scoped strictly to viewing the assigned restaurant and operating shifts.
6. **Customer**
   - Marketplace public browsing, order placement (Phase 2).
7. **Rider**
   - Delivery dispatch and route handling (Phase 3).

---

## Granular Permissions Catalog
```
dashboard.view
users.view | users.create | users.update | users.delete
roles.view | roles.create | roles.update | roles.delete
restaurants.view | restaurants.create | restaurants.update | restaurants.delete
restaurants.approve | restaurants.reject | restaurants.suspend
restaurant_profile.view | restaurant_profile.update
restaurant_staff.view | restaurant_staff.create | restaurant_staff.update | restaurant_staff.delete
settings.view | settings.update
audit_logs.view
menu.view | menu.create | menu.update | menu.delete (Foundation)
orders.view | orders.manage (Foundation)
```

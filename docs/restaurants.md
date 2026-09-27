# Fastflow Marketplace — Restaurant Engine & Workflows

## Restaurant Lifecycle & Status Workflow

```
[Owner Registers & Submits Application]
                 │
                 ▼
          PENDING APPROVAL (Hidden from Public Marketplace)
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[Admin Rejects]     [Admin Approves]
      │                     │
REJECTED / CHANGES          ▼
   REQUESTED             APPROVED & ACTIVE (Live on Marketplace)
                            │
                            ▼
                    [Admin May Suspend]
                            │
                        SUSPENDED (Temporarily Hidden)
```

---

## Operating Hours & Split Shifts
Each restaurant contains 7 records in `restaurant_hours` (Monday to Sunday):
- `is_open`: Boolean toggle
- `open_time`, `close_time`: Standard operating window
- `first_open`, `first_close`, `second_open`, `second_close`: Split hours architecture (e.g. Lunch 11:00-15:00, Dinner 18:00-23:00)

---

## Restaurant Staff Isolation & IDOR Security
- Every staff member belongs to exactly ONE restaurant via the `restaurant_staff` pivot table (`user_id`, `restaurant_id`, `role`, `status`).
- Restaurant owners cannot view, create, edit, or remove staff from any other restaurant.
- In URL path tampering tests (e.g., trying to modify another restaurant by substituting IDs), `RestaurantPolicy` and server-side request bindings strictly forbid unauthorized mutations and return `403 Forbidden`.

---

## Multi-Restaurant Owner Architecture
- The system supports a 1-to-many relationship between Owners and Restaurants (`User hasMany Restaurants`).
- A single restaurant owner account can register and manage multiple restaurants, branches, or distinct culinary brands.
- In the merchant portal, owners can switch between their active restaurants via a portfolio switcher or by supplying `restaurant_id`.
- Server-side authorization ensures that an owner can only view and manage restaurants belonging to their account (`isOwnedBy($user)`), preventing cross-owner IDOR.

---

## Location Single Source of Truth
- Relational foreign keys (`city_id` and `area_id` referencing `cities` and `areas`) serve as the single source of truth for geographical assignment.
- Plaintext `city` and `area` columns are automatically synchronized upon model save hooks and accessors to maintain display compatibility without state divergence.

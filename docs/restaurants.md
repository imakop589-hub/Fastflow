# FoodBrio Marketplace — Restaurant Engine & Workflows

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

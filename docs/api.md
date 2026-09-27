# FoodBrio Marketplace — API v1 Documentation

All requests and responses use JSON. Sensitive secrets (passwords, tokens, database keys) are strictly filtered out by API Resources.

## Standard Response Schema
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

## Error Response Schema
```json
{
  "success": false,
  "message": "Validation or execution error message",
  "errors": {
    "field": ["Specific error detail"]
  }
}
```

---

## Endpoint Catalog

### 1. Authentication
- `POST /api/v1/auth/login` (email, password)
- `POST /api/v1/auth/register` (name, email, password, password_confirmation, phone, role)
- `POST /api/v1/auth/logout` [Bearer Token required]
- `GET /api/v1/me` [Bearer Token required]

### 2. Public Marketplace
- `GET /api/v1/restaurants`: List approved, active restaurants (Supports `search`, `city`, and `page`)
- `GET /api/v1/restaurants/{slug}`: Single restaurant public profile with operating hours

### 3. Merchant / Restaurant Owner
- `GET /api/v1/owner/restaurants`: List all owned restaurants in merchant portfolio
- `GET /api/v1/owner/restaurant`: Primary/default owner restaurant profile
- `GET /api/v1/owner/restaurants/{id}`: Specific owned restaurant profile (IDOR protected)
- `POST /api/v1/owner/restaurant`: Submit onboarding application (supports multiple applications per owner)
- `PUT /api/v1/owner/restaurant`: Update primary restaurant basic details
- `PUT /api/v1/owner/restaurants/{id}`: Update specific owned restaurant profile (IDOR protected)
- `GET /api/v1/owner/hours`: Retrieve 7-day schedule for primary restaurant
- `GET /api/v1/owner/restaurants/{id}/hours`: Retrieve 7-day schedule for specific owned restaurant
- `PUT /api/v1/owner/hours`: Save 7-day schedule for primary restaurant
- `PUT /api/v1/owner/restaurants/{id}/hours`: Save 7-day schedule for specific owned restaurant
- `GET /api/v1/owner/staff`: List staff assigned to primary restaurant
- `GET /api/v1/owner/restaurants/{id}/staff`: List staff assigned to specific owned restaurant
- `POST /api/v1/owner/staff`: Add staff member to primary restaurant
- `POST /api/v1/owner/restaurants/{id}/staff`: Add staff member to specific owned restaurant
- `PUT /api/v1/owner/staff/{id}/toggle-status`: Activate/Deactivate staff member
- `DELETE /api/v1/owner/staff/{id}`: Delete staff member

### 4. Admin Portal
- `GET /api/v1/admin/dashboard`: Metrics and system telemetry
- `GET /api/v1/admin/restaurants`: Paginated restaurant directory with filter toggles
- `GET /api/v1/admin/restaurants/{id}`: Full restaurant audit profile
- `POST /api/v1/admin/restaurants/{id}/approve`: Approve application
- `POST /api/v1/admin/restaurants/{id}/reject`: Reject with audit explanation
- `POST /api/v1/admin/restaurants/{id}/request-changes`: Request revisions
- `POST /api/v1/admin/restaurants/{id}/suspend`: Temporarily suspend restaurant
- `POST /api/v1/admin/restaurants/{id}/activate`: Restore suspended restaurant
- `GET /api/v1/admin/users`: Searchable users list
- `GET /api/v1/admin/roles`: Roles & permissions matrix
- `GET /api/v1/admin/settings`: System settings
- `PUT /api/v1/admin/settings`: Update system settings
- `GET /api/v1/admin/audit-logs`: Audit trail records

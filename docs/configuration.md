# Fastflow Marketplace — Configuration Guide

## Configuration Files Overview

| File | Purpose |
|---|---|
| `.env` | Environment secrets, database credentials, mailer, and URLs |
| `config/app.php` | Timezone, locale, providers, application encryption cipher |
| `config/database.php` | MySQL/MariaDB database driver and read/write cluster parameters |
| `config/sanctum.php` | API token expiration limits and stateful domains |
| `config/filesystems.php` | Public and local disk mappings for media storage |

---

## System Settings Table

Fastflow stores dynamic operational configuration in the `settings` database table, cached for optimal response performance:

```php
// Reading a setting with fallback:
$currency = \App\Models\Setting::get('default_currency', 'USD');

// Storing a setting programmatically:
\App\Models\Setting::set('app_name', 'Fastflow Marketplace', 'general', 'string', true);
```

### Supported Groups
- `general`: App name, support email, phone, copyright
- `branding`: Logos, favicon, color theme, hero slogan
- `localization`: Country code, default language, timezone
- `currency`: Default ISO currency, symbol, prefix/suffix formatting
- `delivery`: Default service radius (km), minimum basket requirements
- `tax`: Tax identification and percentage rates (prepared for Phase 2)
- `seo`: Default meta titles, keywords, OpenGraph images

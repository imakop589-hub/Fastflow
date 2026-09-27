# FoodBrio Marketplace — Installation Guide

## System Requirements
- **PHP**: 8.2 or higher
- **Web Server**: Nginx or Apache with `mod_rewrite` enabled
- **Database**: MySQL 8.0+ or MariaDB 10.5+
- **Extensions**: `BCMath`, `Ctype`, `cURL`, `DOM`, `Fileinfo`, `JSON`, `Mbstring`, `OpenSSL`, `PCRE`, `PDO`, `PDO_MySQL`, `Tokenizer`, `XML`
- **Node.js**: 20.x or 22.x LTS with npm
- **Composer**: 2.6+

---

## 1. Setup & Dependencies

```bash
# Clone the repository
git clone https://github.com/your-vendor/foodbrio-marketplace.git
cd foodbrio-marketplace

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies
npm install
```

---

## 2. Environment Configuration

```bash
# Copy sample environment configuration
cp .env.example .env

# Generate application cryptographic encryption key
php artisan key:generate
```

Configure your `.env` database parameters:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foodbrio_db
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_secure_password
```

---

## 3. Database Migration & Demo Data Seeding

Execute all database schema migrations and load initial RBAC roles, demo locations, and sample restaurant records:

```bash
php artisan migrate --seed
```

This provisions:
- Super Admin account: `superadmin@foodbrio.local` (Password: `DemoSecret@2026!`)
- Operations Admin: `admin@foodbrio.local` (Password: `DemoSecret@2026!`)
- Demo Restaurant Owners (Urban Spoon, Green Bowl, Daily Grill)

---

## 4. Storage Link & Asset Compilation

```bash
# Create symbolic link for public file uploads
php artisan storage:link

# Compile production frontend assets
npm run build
```

---

## 5. Running in Development

```bash
# Terminal 1: Laravel Backend
php artisan serve --port=8000

# Terminal 2: Vite Dev Server
npm run dev
```
Navigate to `http://localhost:8000` or the Vite dev URL.

# Vjay's Bike Parts & Accessories - Laravel Backend API

This backend provides a clean RESTful API for the Vjay's Bike Parts inventory system built with Laravel 11.

---

## Architecture & Structure

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php          # 6-digit PIN auth, register, reset
│   │           ├── ProductController.php       # Products CRUD & inventory status
│   │           ├── StockMovementController.php # Stock in / stock out operations
│   │           ├── DashboardController.php     # Valuation, volume, & restock queue
│   │           └── AuditLogController.php      # Audit verification ledger
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── StockMovement.php
│       └── AuditLog.php
├── database/
│   └── migrations/
│       ├── 2024_01_01_000001_create_users_table.php
│       ├── 2024_01_01_000002_create_products_table.php
│       ├── 2024_01_01_000003_create_stock_movements_table.php
│       └── 2024_01_01_000004_create_audit_logs_table.php
├── routes/
│   └── api.php                                 # Clean grouped API routes
├── .env.example
└── composer.json
```

---

## Quick Start Setup

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup Database & Run Migrations
The backend is configured for **MySQL**:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vjays_bike
DB_USERNAME=root
DB_PASSWORD=root
```

To run or reset migrations:
```bash
php artisan migrate
```

To start MySQL Server manually if needed:
```bash
./start_mysql.bat
```

### 4. Serve the API
```bash
php artisan serve --port=8000
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register phone number |
| `POST` | `/api/auth/create-pin` | Set 6-digit secure PIN |
| `POST` | `/api/auth/login` | Authenticate with PIN |
| `POST` | `/api/auth/forgot-pin/send-code` | Request 6-digit verification code to phone |
| `POST` | `/api/auth/forgot-pin/verify-code` | Verify 6-digit phone code |
| `POST` | `/api/auth/forgot-pin/reset-pin` | Reset PIN with verified phone code |
| `POST` | `/api/auth/reset-pin` | Reset forgotten PIN (backwards compatible) |
| `GET` | `/api/products` | List all parts (supports `?category=` and `?search=`) |
| `POST` | `/api/products` | Create new part in catalog |
| `GET` | `/api/products/{id}` | Get part details |
| `PUT` | `/api/products/{id}` | Update part specifications |
| `DELETE` | `/api/products/{id}` | Delete part from catalog |
| `GET` | `/api/stock-movements` | List all movement history |
| `POST` | `/api/stock-movements/in` | Floor stock in intake |
| `POST` | `/api/stock-movements/out` | Floor stock out dispatch |
| `GET` | `/api/dashboard/stats` | Stock valuation, catalog breadth, inflow/dispatch |
| `GET` | `/api/dashboard/restock-queue` | Products under safety buffer threshold |
| `GET` | `/api/dashboard/recent-movements`| 5 most recent floor operations |
| `GET` | `/api/audit-logs` | Immutable audit log ledger |

---

## Connecting Frontend to Backend

In `src/services/api.ts`, update `BASE_URL`:
```typescript
const BASE_URL = 'http://localhost:8000/api';
```
Or configure Vite proxy in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

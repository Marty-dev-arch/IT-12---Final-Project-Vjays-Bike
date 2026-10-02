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

---

## 🐘 Vercel Postgres & Real-Time Dashboard Monitoring

The system is fully configured to run with **Vercel Postgres (powered by Neon)** in serverless production on Vercel, allowing you to monitor and query all your data live from the Vercel Dashboard!

### 1. Create your Database in Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to your **Project** -> click the **Storage** tab.
3. Click **Create Database** -> Select **Postgres** (or **Neon**).
4. Click **Create & Continue** and link it to your project environments (Production, Preview, Development).
5. Vercel automatically exposes the connection environment variables (`POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, etc.).

### 2. Initialize Database & Migrate Data
Choose any of the following 3 seamless methods:

#### Method A: Instant SQL in Vercel Dashboard (Zero Terminal Required)
1. Open your Vercel Dashboard -> **Storage** -> Click your Postgres Database.
2. Click the **Query** tab in the sidebar.
3. Open `backend/database/vercel_postgres_init.sql` from this repository.
4. Copy the entire SQL content and paste it into the Vercel Query editor.
5. Click **Run Query**. All tables (`products`, `stock_movements`, `audit_logs`, `restock_schedules`, `users`, etc.) will be created with sample inventory and sequences initialized!

#### Method B: One-Click Web Migration Endpoint
Visit your deployed API endpoint in your browser or Postman:
```
https://<your-vercel-domain>/api/system/migrate?secret=<MIGRATE_SECRET_KEY_OR_APP_KEY>&seed=true
```
This triggers `Artisan::call('migrate')` directly in the serverless container and responds with JSON migration confirmation!

#### Method C: Local Artisan CLI
Pull your Vercel env or copy `POSTGRES_URL` into `backend/.env`:
```env
DB_CONNECTION=pgsql
DB_URL="postgres://default:password@ep-...postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```
Then run:
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## 📈 Monitoring Your Data in Real-Time in Vercel Dashboard

Once connected, you can monitor your inventory, counter sales, and audit trails directly from Vercel:

1. **Live Data Browser**:
   - In Vercel -> **Storage** -> Your Database -> Click **Data** tab.
   - Select any table (`products`, `stock_movements`, `audit_logs`, `restock_schedules`).
   - Every time a stock intake or dispatch happens in the app, you can view the newly created records immediately in the table viewer.

2. **Real-Time SQL Query Console**:
   - In Vercel -> **Storage** -> Your Database -> Click **Query** tab.
   - Run live analytical queries directly:
     ```sql
     -- Check inventory valuation & current stock levels
     SELECT name, sku, quantity, price, (quantity * price) AS total_value 
     FROM products 
     ORDER BY quantity ASC;

     -- View real-time audit trail of floor operations
     SELECT action, type, details, created_at 
     FROM audit_logs 
     ORDER BY created_at DESC 
     LIMIT 15;

     -- Check stock movement volume
     SELECT type, SUM(quantity) as total_units 
     FROM stock_movements 
     GROUP BY type;
     ```

3. **Database Health Endpoint**:
   - Query `https://<your-vercel-domain>/api/system/db-status` at any time to verify live database connectivity and record counts.


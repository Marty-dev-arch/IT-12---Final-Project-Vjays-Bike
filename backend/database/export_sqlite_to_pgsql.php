<?php
/**
 * SQLite to PostgreSQL Exporter & SQL Generator
 * Designed by SQL-Pro & Backend Developer Agents
 */

$sqliteFile = __DIR__ . '/database.sqlite';
$outputSqlFile = __DIR__ . '/vercel_postgres_init.sql';

if (!file_exists($sqliteFile)) {
    echo "SQLite database not found at {$sqliteFile}\n";
    exit(1);
}

$pdo = new PDO('sqlite:' . $sqliteFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "-- =========================================================================\n";
$sql .= "-- Vjay's Bike Parts & Accessories - Vercel PostgreSQL Production Schema & Data\n";
$sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
$sql .= "-- Compatible with: Vercel Postgres / Neon PostgreSQL (v14+ / v15+ / v16+)\n";
$sql .= "-- =========================================================================\n\n";

$sql .= "BEGIN;\n\n";

// 1. Users Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 1. Table: users\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS users (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    name VARCHAR(255) NOT NULL DEFAULT 'Vjay',\n";
$sql .= "    phone VARCHAR(255) NOT NULL UNIQUE,\n";
$sql .= "    pin_hash VARCHAR(255) NULL,\n";
$sql .= "    role VARCHAR(255) NOT NULL DEFAULT 'owner',\n";
$sql .= "    remember_token VARCHAR(100) NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";

// 2. Products Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 2. Table: products\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS products (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    name VARCHAR(255) NOT NULL,\n";
$sql .= "    sku VARCHAR(100) NOT NULL UNIQUE,\n";
$sql .= "    category VARCHAR(255) NOT NULL,\n";
$sql .= "    brand VARCHAR(255) NULL,\n";
$sql .= "    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,\n";
$sql .= "    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,\n";
$sql .= "    quantity INTEGER NOT NULL DEFAULT 0,\n";
$sql .= "    min_stock INTEGER NOT NULL DEFAULT 5,\n";
$sql .= "    max_capacity INTEGER NULL DEFAULT 5,\n";
$sql .= "    location VARCHAR(255) NOT NULL DEFAULT 'Warehouse Shelf A1',\n";
$sql .= "    status VARCHAR(50) NOT NULL DEFAULT 'out-of-stock' CHECK (status IN ('in-stock', 'low-stock', 'critical', 'out-of-stock')),\n";
$sql .= "    image VARCHAR(255) NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);\n\n";

// 3. Stock Movements Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 3. Table: stock_movements\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS stock_movements (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,\n";
$sql .= "    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,\n";
$sql .= "    type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),\n";
$sql .= "    quantity INTEGER NOT NULL,\n";
$sql .= "    reason VARCHAR(255) NULL,\n";
$sql .= "    notes TEXT NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at);\n\n";

// 4. Audit Logs Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 4. Table: audit_logs\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS audit_logs (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    product_id BIGINT NULL REFERENCES products(id) ON DELETE SET NULL,\n";
$sql .= "    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,\n";
$sql .= "    action VARCHAR(255) NOT NULL,\n";
$sql .= "    type VARCHAR(50) NOT NULL CHECK (type IN ('stock-in', 'stock-out', 'adjustment', 'verification')),\n";
$sql .= "    details TEXT NOT NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_audit_logs_product ON audit_logs(product_id);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_audit_logs_type ON audit_logs(type);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);\n\n";

// 5. Restock Schedules Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 5. Table: restock_schedules\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS restock_schedules (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    product_id BIGINT NULL REFERENCES products(id) ON DELETE SET NULL,\n";
$sql .= "    product_name VARCHAR(255) NOT NULL,\n";
$sql .= "    scheduled_date DATE NOT NULL,\n";
$sql .= "    target_quantity INTEGER NOT NULL DEFAULT 1,\n";
$sql .= "    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),\n";
$sql .= "    notes TEXT NULL,\n";
$sql .= "    auto_restocked_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_restock_schedules_date ON restock_schedules(scheduled_date);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_restock_schedules_status ON restock_schedules(status);\n\n";

// 6. Pin Reset Codes Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 6. Table: pin_reset_codes\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS pin_reset_codes (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    phone VARCHAR(255) NOT NULL,\n";
$sql .= "    code VARCHAR(6) NOT NULL,\n";
$sql .= "    expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,\n";
$sql .= "    verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_pin_reset_phone ON pin_reset_codes(phone);\n\n";

// 7. Personal Access Tokens Table (Laravel Sanctum)
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 7. Table: personal_access_tokens\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS personal_access_tokens (\n";
$sql .= "    id BIGSERIAL PRIMARY KEY,\n";
$sql .= "    tokenable_type VARCHAR(255) NOT NULL,\n";
$sql .= "    tokenable_id BIGINT NOT NULL,\n";
$sql .= "    name VARCHAR(255) NOT NULL,\n";
$sql .= "    token VARCHAR(64) NOT NULL UNIQUE,\n";
$sql .= "    abilities TEXT NULL,\n";
$sql .= "    last_used_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    expires_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,\n";
$sql .= "    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_tokens_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);\n\n";

// 8. Sessions Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 8. Table: sessions\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS sessions (\n";
$sql .= "    id VARCHAR(255) PRIMARY KEY,\n";
$sql .= "    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,\n";
$sql .= "    ip_address VARCHAR(45) NULL,\n";
$sql .= "    user_agent TEXT NULL,\n";
$sql .= "    payload TEXT NOT NULL,\n";
$sql .= "    last_activity INTEGER NOT NULL\n";
$sql .= ");\n\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);\n";
$sql .= "CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity);\n\n";

// 9. Laravel Migrations Table
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- 9. Table: migrations\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "CREATE TABLE IF NOT EXISTS migrations (\n";
$sql .= "    id SERIAL PRIMARY KEY,\n";
$sql .= "    migration VARCHAR(255) NOT NULL,\n";
$sql .= "    batch INTEGER NOT NULL\n";
$sql .= ");\n\n";

// Now dump data from SQLite tables
$tables = ['users', 'products', 'stock_movements', 'audit_logs', 'restock_schedules', 'pin_reset_codes', 'personal_access_tokens', 'migrations'];

foreach ($tables as $tbl) {
    try {
        $stmt = $pdo->query("SELECT * FROM \"{$tbl}\"");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($rows) === 0) {
            continue;
        }

        $sql .= "-- -----------------------------------------------------\n";
        $sql .= "-- Data: {$tbl} (" . count($rows) . " rows)\n";
        $sql .= "-- -----------------------------------------------------\n";

        foreach ($rows as $row) {
            $cols = array_keys($row);
            $escapedCols = array_map(function($c) { return '"' . $c . '"'; }, $cols);
            $escapedVals = array_map(function($val) {
                if ($val === null) return 'NULL';
                if (is_numeric($val)) return $val;
                return "'" . str_replace("'", "''", $val) . "'";
            }, array_values($row));

            $sql .= "INSERT INTO \"{$tbl}\" (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $escapedVals) . ") ON CONFLICT DO NOTHING;\n";
        }
        $sql .= "\n";

        // If table has serial id, update sequence
        if (in_array('id', $cols) && $tbl !== 'sessions') {
            $seqName = $tbl === 'migrations' ? "migrations_id_seq" : "{$tbl}_id_seq";
            $sql .= "SELECT setval('{$seqName}', COALESCE((SELECT MAX(id) FROM \"{$tbl}\"), 1));\n\n";
        }
    } catch (Exception $e) {
        // table might not exist in sqlite yet
    }
}

// Add catalog products if products table was empty or has fewer than standard catalog
$sql .= "-- -----------------------------------------------------\n";
$sql .= "-- Catalog Seed: Ensure standard bike parts catalog exists\n";
$sql .= "-- -----------------------------------------------------\n";
$sql .= "INSERT INTO products (name, sku, category, brand, price, cost_price, quantity, min_stock, max_capacity, location, status, image, created_at, updated_at)\n";
$sql .= "VALUES\n";
$sql .= "('Mechanical Disc Brake Caliper', 'BLD-180-01', 'braking-system', 'BOLIDS', 650.00, 420.00, 12, 5, 25, 'Warehouse shelf a1', 'in-stock', '/images/products/bolids-disc-brake-caliper.jpg', NOW(), NOW()),\n";
$sql .= "('Disc Brake Pads with Spring', 'PAD-DSK-01', 'braking-system', 'Universal', 180.00, 95.00, 24, 8, 50, 'Warehouse shelf a2', 'in-stock', '/images/products/universal-disc-brake-pads.jpg', NOW(), NOW()),\n";
$sql .= "('CN-HG53 9-Speed Chain (116L)', 'CN-HG53-01', 'drivetrain-chains', 'Shimano', 400.00, 280.00, 15, 5, 30, 'Warehouse shelf b1', 'in-stock', '/images/products/shimano-cn-hg53-chain.jpg', NOW(), NOW()),\n";
$sql .= "('Bicycle Cassette', 'BCK-CAS-01', 'drivetrain-chains', 'BUCKLOS', 850.00, 560.00, 8, 4, 20, 'Warehouse shelf b2', 'in-stock', '/images/products/bucklos-bicycle-cassette.jpg', NOW(), NOW()),\n";
$sql .= "('13T CNC Jockey Wheel Pulley', 'MRC-13T-01', 'drivetrain-chains', 'MEROCA', 165.00, 90.00, 20, 6, 40, 'Warehouse shelf b3', 'in-stock', '/images/products/meroca-13t-jockey-wheel.jpg', NOW(), NOW()),\n";
$sql .= "('R-500 1x Crankset with Chainring', 'RGS-R500-01', 'drivetrain-chains', 'RAGUSA', 1250.00, 850.00, 12, 4, 25, 'Warehouse shelf b4', 'in-stock', '/images/products/ragusa-r500-crankset.jpg', NOW(), NOW()),\n";
$sql .= "('6061-T6 Alloy Handlebar (31.8mm)', 'INSP-HB-01', 'handle-bar-handle-grip', 'INSPEED', 650.00, 420.00, 14, 5, 30, 'Warehouse shelf c1', 'in-stock', '/images/products/inspeed-alloy-handlebar.jpg', NOW(), NOW()),\n";
$sql .= "('Dual Lock-On Handlebar Grips (Purple)', 'GRP-LCK-PRP-01', 'handle-bar-handle-grip', 'Universal', 280.00, 150.00, 22, 8, 45, 'Warehouse shelf c2', 'in-stock', '/images/products/universal-purple-lock-on-grips.jpg', NOW(), NOW())\n";
$sql .= "ON CONFLICT (sku) DO NOTHING;\n\n";

$sql .= "SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));\n\n";

// Register all standard migrations in migrations table if not already tracked
$migrationsList = [
    '2024_01_01_000001_create_users_table',
    '2024_01_01_000002_create_products_table',
    '2024_01_01_000003_create_stock_movements_table',
    '2024_01_01_000004_create_audit_logs_table',
    '2024_01_01_000005_create_restock_schedules_table',
    '2024_01_01_000006_create_pin_reset_codes_table',
    '2026_09_30_224329_create_personal_access_tokens_table',
    '2026_09_30_224652_create_sessions_table'
];

foreach ($migrationsList as $idx => $m) {
    $batch = 1;
    $sql .= "INSERT INTO migrations (migration, batch) VALUES ('{$m}', {$batch}) ON CONFLICT DO NOTHING;\n";
}

$sql .= "\nCOMMIT;\n";

file_put_contents($outputSqlFile, $sql);
echo "PostgreSQL production initialization SQL generated successfully at:\n{$outputSqlFile}\n";
echo "Total bytes: " . strlen($sql) . "\n";

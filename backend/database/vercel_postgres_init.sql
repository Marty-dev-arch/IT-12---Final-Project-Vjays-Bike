-- =========================================================================
-- Vjay's Bike Parts & Accessories - Vercel PostgreSQL Production Schema & Data
-- Generated: 2026-10-02 00:30:38
-- Compatible with: Vercel Postgres / Neon PostgreSQL (v14+ / v15+ / v16+)
-- =========================================================================

BEGIN;

-- -----------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Vjay',
    phone VARCHAR(255) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'owner',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

-- -----------------------------------------------------
-- 2. Table: products
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 5,
    max_capacity INTEGER NULL DEFAULT 5,
    location VARCHAR(255) NOT NULL DEFAULT 'Warehouse Shelf A1',
    status VARCHAR(50) NOT NULL DEFAULT 'out-of-stock' CHECK (status IN ('in-stock', 'low-stock', 'critical', 'out-of-stock')),
    image VARCHAR(255) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- -----------------------------------------------------
-- 3. Table: stock_movements
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
    quantity INTEGER NOT NULL,
    reason VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at);

-- -----------------------------------------------------
-- 4. Table: audit_logs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NULL REFERENCES products(id) ON DELETE SET NULL,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('stock-in', 'stock-out', 'adjustment', 'verification')),
    details TEXT NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_product ON audit_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_type ON audit_logs(type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- -----------------------------------------------------
-- 5. Table: restock_schedules
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS restock_schedules (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NULL REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    target_quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT NULL,
    auto_restocked_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_restock_schedules_date ON restock_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_restock_schedules_status ON restock_schedules(status);

-- -----------------------------------------------------
-- 6. Table: pin_reset_codes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pin_reset_codes (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_pin_reset_phone ON pin_reset_codes(phone);

-- -----------------------------------------------------
-- 7. Table: personal_access_tokens
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    expires_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_tokens_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);

-- -----------------------------------------------------
-- 8. Table: sessions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity);

-- -----------------------------------------------------
-- 9. Table: migrations
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- -----------------------------------------------------
-- Data: products (1 rows)
-- -----------------------------------------------------
INSERT INTO "products" ("id", "name", "sku", "category", "brand", "price", "cost_price", "quantity", "min_stock", "max_capacity", "location", "status", "image", "created_at", "updated_at") VALUES (15, 'Mechanical Disc Brake Caliper', 'BLD-180-01', 'braking-system', 'BOLIDS', 500, 400, 5, 2, 5, 'Warehouse shelf a1', 'in-stock', '/images/products/bolids-disc-brake-caliper.jpg', '2026-10-01 11:46:10', '2026-10-01 11:46:10') ON CONFLICT DO NOTHING;

SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM "products"), 1));

-- -----------------------------------------------------
-- Data: stock_movements (1 rows)
-- -----------------------------------------------------
INSERT INTO "stock_movements" ("id", "product_id", "user_id", "type", "quantity", "reason", "notes", "created_at", "updated_at") VALUES (9, 15, NULL, 'in', 5, NULL, 'Initial catalog registration intake', '2026-10-01 11:46:10', '2026-10-01 11:46:10') ON CONFLICT DO NOTHING;

SELECT setval('stock_movements_id_seq', COALESCE((SELECT MAX(id) FROM "stock_movements"), 1));

-- -----------------------------------------------------
-- Data: audit_logs (11 rows)
-- -----------------------------------------------------
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (9, NULL, NULL, 'Created Product', 'verification', 'Initial inventory for Mechanical Disc Brake Caliper (SKU: BLD-180-01) created with 7 units at ₱66.00', '2026-10-01 09:23:56', '2026-10-01 09:23:56') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (10, NULL, NULL, 'Deleted Product', 'adjustment', 'Removed product Mechanical Disc Brake Caliper (SKU: BLD-180-01, Brand: BOLIDS, Category: drivetrain-chains) with remaining stock 7', '2026-10-01 09:24:19', '2026-10-01 09:24:19') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (11, NULL, NULL, 'Created Product', 'verification', 'Initial inventory for Mechanical Disc Brake Caliper (SKU: BLD-180-01) created with 5 units at ₱55.00', '2026-10-01 09:29:36', '2026-10-01 09:29:36') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (12, NULL, NULL, 'Deleted Product', 'adjustment', 'Removed product Mechanical Disc Brake Caliper (SKU: BLD-180-01, Brand: BOLIDS, Category: braking-system) with remaining stock 5', '2026-10-01 11:30:48', '2026-10-01 11:30:48') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (13, NULL, NULL, 'Created Product', 'verification', 'Initial inventory for Mechanical Disc Brake Caliper (SKU: BLD-180-01) created with 5 units at ₱500.00', '2026-10-01 11:33:27', '2026-10-01 11:33:27') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (14, NULL, NULL, 'Stock Dispatched', 'stock-out', 'Dispatched -3 units (Workshop Repair). Updated stock: 2. [Product: Mechanical Disc Brake Caliper, SKU: BLD-180-01, Brand: BOLIDS, Category: braking-system]', '2026-10-01 11:40:46', '2026-10-01 11:42:50') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (15, NULL, NULL, 'Auto Restock Executed', 'stock-in', 'Automated restock of +10 units completed for Mechanical Disc Brake Caliper (SKU: BLD-180-01). Previous stock: 2, new stock: 12.', '2026-10-01 11:41:38', '2026-10-01 11:41:38') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (16, NULL, NULL, 'Deleted Product', 'adjustment', 'Removed product Mechanical Disc Brake Caliper (SKU: BLD-180-01, Brand: BOLIDS, Category: braking-system) with remaining stock 12', '2026-10-01 11:42:50', '2026-10-01 11:42:50') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (17, NULL, NULL, 'Created Product', 'verification', 'Initial inventory for Mechanical Disc Brake Caliper (SKU: BLD-180-01) created with 5 units at ₱6.00', '2026-10-01 11:43:20', '2026-10-01 11:43:20') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (18, NULL, NULL, 'Deleted Product', 'adjustment', 'Removed product Mechanical Disc Brake Caliper (SKU: BLD-180-01, Brand: BOLIDS, Category: braking-system) with remaining stock 5', '2026-10-01 11:43:58', '2026-10-01 11:43:58') ON CONFLICT DO NOTHING;
INSERT INTO "audit_logs" ("id", "product_id", "user_id", "action", "type", "details", "created_at", "updated_at") VALUES (19, 15, NULL, 'Created Product', 'verification', 'Initial inventory for Mechanical Disc Brake Caliper (SKU: BLD-180-01) created with 5 units at ₱500.00', '2026-10-01 11:46:10', '2026-10-01 11:46:10') ON CONFLICT DO NOTHING;

SELECT setval('audit_logs_id_seq', COALESCE((SELECT MAX(id) FROM "audit_logs"), 1));

-- -----------------------------------------------------
-- Data: restock_schedules (1 rows)
-- -----------------------------------------------------
INSERT INTO "restock_schedules" ("id", "product_id", "product_name", "scheduled_date", "target_quantity", "status", "notes", "auto_restocked_at", "created_at", "updated_at") VALUES (1, NULL, 'Mechanical Disc Brake Caliper', '2026-10-01 00:00:00', 10, 'completed', NULL, '2026-10-01 11:41:38', '2026-10-01 11:41:38', '2026-10-01 11:41:38') ON CONFLICT DO NOTHING;

SELECT setval('restock_schedules_id_seq', COALESCE((SELECT MAX(id) FROM "restock_schedules"), 1));

-- -----------------------------------------------------
-- Data: migrations (8 rows)
-- -----------------------------------------------------
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (1, '2024_01_01_000001_create_users_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (2, '2024_01_01_000002_create_products_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (3, '2024_01_01_000003_create_stock_movements_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (4, '2024_01_01_000004_create_audit_logs_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (5, '2024_01_01_000005_create_restock_schedules_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (6, '2024_01_01_000006_create_pin_reset_codes_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (7, '2026_09_30_224329_create_personal_access_tokens_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO "migrations" ("id", "migration", "batch") VALUES (8, '2026_09_30_224652_create_sessions_table', 1) ON CONFLICT DO NOTHING;

SELECT setval('migrations_id_seq', COALESCE((SELECT MAX(id) FROM "migrations"), 1));

-- -----------------------------------------------------
-- Catalog Seed: Ensure standard bike parts catalog exists
-- -----------------------------------------------------
INSERT INTO products (name, sku, category, brand, price, cost_price, quantity, min_stock, max_capacity, location, status, image, created_at, updated_at)
VALUES
('Mechanical Disc Brake Caliper', 'BLD-180-01', 'braking-system', 'BOLIDS', 650.00, 420.00, 12, 5, 25, 'Warehouse shelf a1', 'in-stock', '/images/products/bolids-disc-brake-caliper.jpg', NOW(), NOW()),
('Disc Brake Pads with Spring', 'PAD-DSK-01', 'braking-system', 'Universal', 180.00, 95.00, 24, 8, 50, 'Warehouse shelf a2', 'in-stock', '/images/products/universal-disc-brake-pads.jpg', NOW(), NOW()),
('CN-HG53 9-Speed Chain (116L)', 'CN-HG53-01', 'drivetrain-chains', 'Shimano', 400.00, 280.00, 15, 5, 30, 'Warehouse shelf b1', 'in-stock', '/images/products/shimano-cn-hg53-chain.jpg', NOW(), NOW()),
('Bicycle Cassette', 'BCK-CAS-01', 'drivetrain-chains', 'BUCKLOS', 850.00, 560.00, 8, 4, 20, 'Warehouse shelf b2', 'in-stock', '/images/products/bucklos-bicycle-cassette.jpg', NOW(), NOW()),
('13T CNC Jockey Wheel Pulley', 'MRC-13T-01', 'drivetrain-chains', 'MEROCA', 165.00, 90.00, 20, 6, 40, 'Warehouse shelf b3', 'in-stock', '/images/products/meroca-13t-jockey-wheel.jpg', NOW(), NOW()),
('R-500 1x Crankset with Chainring', 'RGS-R500-01', 'drivetrain-chains', 'RAGUSA', 1250.00, 850.00, 12, 4, 25, 'Warehouse shelf b4', 'in-stock', '/images/products/ragusa-r500-crankset.jpg', NOW(), NOW()),
('6061-T6 Alloy Handlebar (31.8mm)', 'INSP-HB-01', 'handle-bar-handle-grip', 'INSPEED', 650.00, 420.00, 14, 5, 30, 'Warehouse shelf c1', 'in-stock', '/images/products/inspeed-alloy-handlebar.jpg', NOW(), NOW()),
('Dual Lock-On Handlebar Grips (Purple)', 'GRP-LCK-PRP-01', 'handle-bar-handle-grip', 'Universal', 280.00, 150.00, 22, 8, 45, 'Warehouse shelf c2', 'in-stock', '/images/products/universal-purple-lock-on-grips.jpg', NOW(), NOW())
ON CONFLICT (sku) DO NOTHING;

SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));

INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000001_create_users_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000002_create_products_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000003_create_stock_movements_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000004_create_audit_logs_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000005_create_restock_schedules_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2024_01_01_000006_create_pin_reset_codes_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2026_09_30_224329_create_personal_access_tokens_table', 1) ON CONFLICT DO NOTHING;
INSERT INTO migrations (migration, batch) VALUES ('2026_09_30_224652_create_sessions_table', 1) ON CONFLICT DO NOTHING;

COMMIT;

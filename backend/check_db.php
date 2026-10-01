<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\RestockSchedule;
use App\Models\AuditLog;

echo "=== PRODUCTS (" . Product::count() . ") ===\n";
foreach (Product::all() as $p) {
    echo "ID: {$p->id} | SKU: {$p->sku} | Name: {$p->name}\n";
}

echo "\n=== AUDIT LOGS (" . AuditLog::count() . ") ===\n";
foreach (AuditLog::latest()->take(10)->get() as $log) {
    echo "[{$log->created_at}] {$log->action}: {$log->details}\n";
}

echo "\n=== STOCK MOVEMENTS (" . StockMovement::count() . ") ===\n";
foreach (StockMovement::latest()->take(10)->get() as $sm) {
    echo "[{$sm->created_at}] ID: {$sm->id} | Product ID: {$sm->product_id} | Qty: {$sm->quantity} | Notes: {$sm->notes}\n";
}

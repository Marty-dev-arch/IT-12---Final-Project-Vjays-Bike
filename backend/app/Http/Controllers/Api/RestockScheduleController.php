<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\RestockSchedule;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestockScheduleController extends Controller
{
    /**
     * Display a listing of restock schedules.
     */
    public function index()
    {
        $schedules = RestockSchedule::with('product')
            ->orderBy('scheduled_date', 'asc')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => (string) $s->id,
                    'productId' => (string) $s->product_id,
                    'productName' => $s->product_name ?: ($s->product?->name ?? 'Unknown Part'),
                    'sku' => $s->product?->sku ?? 'N/A',
                    'targetQuantity' => (int) ($s->target_quantity ?? 1),
                    'scheduledDate' => $s->scheduled_date,
                    'notes' => $s->notes ?? '',
                    'status' => $s->status,
                    'createdAt' => $s->created_at?->toIso8601String() ?? now()->toIso8601String(),
                ];
            });

        return response()->json($schedules);
    }

    /**
     * Store a newly created schedule.
     * If the scheduled date is today or already due, automatically execute restock!
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required',
            'scheduled_date' => 'required',
            'target_quantity' => 'nullable|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $pId = $validated['product_id'];
        $product = Product::where('id', $pId)
            ->orWhere('sku', $pId)
            ->orWhere('name', $pId)
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found for schedule',
            ], 404);
        }

        $targetQty = $validated['target_quantity'] ?? 1;
        $scheduledDate = $validated['scheduled_date'];
        $todayStr = now()->toDateString();

        return DB::transaction(function () use ($product, $scheduledDate, $targetQty, $validated, $todayStr) {
            $isDue = $scheduledDate <= $todayStr;

            $schedule = RestockSchedule::create([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'scheduled_date' => $scheduledDate,
                'target_quantity' => $targetQty,
                'status' => $isDue ? 'completed' : 'scheduled',
                'notes' => $validated['notes'] ?? null,
                'auto_restocked_at' => $isDue ? now() : null,
            ]);

            // Dynamic capacity expansion logic:
            // When adding a restocking schedule (e.g. current stock is 2, planned restock is 10),
            // the stock capacity level expands to 2 + 10 = 12 so that restocked units fit cleanly
            // (moving with 12/12 instead of being capped or overflowing as 12/5).
            $newPlannedCapacity = $product->quantity + $targetQty;
            $product->max_capacity = max($product->max_capacity ?? 0, $newPlannedCapacity);

            $restocked = false;

            // Automatically execute restock if due today or past due
            if ($isDue) {
                $oldQty = $product->quantity;
                $product->quantity += $targetQty;
                $product->max_capacity = max($product->max_capacity ?? 0, $product->quantity);
                $product->recalculateStatus();

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'in',
                    'quantity' => $targetQty,
                    'reason' => 'Automated Scheduled Restock',
                    'notes' => "Automatic restock executed for schedule #{$schedule->id} ({$scheduledDate})",
                ]);

                AuditLog::create([
                    'product_id' => $product->id,
                    'action' => 'Auto Restock Executed',
                    'type' => 'stock-in',
                    'details' => "Automated restock of +{$targetQty} units completed for {$product->name} (SKU: {$product->sku}). Previous stock: {$oldQty}, new stock: {$product->quantity}.",
                ]);

                $restocked = true;
            } else {
                $product->save();
            }

            return response()->json([
                'message' => $restocked 
                    ? "Restock scheduled for today. Automated restock of {$targetQty} units was executed immediately."
                    : "Restock schedule created. Product stock capacity expanded to {$product->max_capacity} units.",
                'schedule' => $schedule->load('product'),
                'auto_restocked' => $restocked,
                'product' => $product,
            ], 201);
        });
    }

    /**
     * Process all due restock schedules and automatically increment inventory.
     */
    public function autoProcessDue()
    {
        $todayStr = now()->toDateString();

        $dueSchedules = RestockSchedule::where('status', 'scheduled')
            ->where('scheduled_date', '<=', $todayStr)
            ->with('product')
            ->get();

        if ($dueSchedules->isEmpty()) {
            return response()->json([
                'message' => 'No pending schedules due for automated restock today.',
                'processed_count' => 0,
                'processed' => [],
            ]);
        }

        $processed = [];

        DB::transaction(function () use ($dueSchedules, &$processed) {
            foreach ($dueSchedules as $sched) {
                $product = $sched->product;
                if (!$product) {
                    $sched->update(['status' => 'cancelled']);
                    continue;
                }

                $qty = $sched->target_quantity > 0 ? $sched->target_quantity : 1;
                $oldQty = $product->quantity;
                $product->quantity += $qty;
                $product->max_capacity = max($product->max_capacity ?? 0, $product->quantity);
                $product->recalculateStatus();

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'in',
                    'quantity' => $qty,
                    'reason' => 'Automated Scheduled Restock',
                    'notes' => "Automated scheduled restock executed on {$sched->scheduled_date}",
                ]);

                AuditLog::create([
                    'product_id' => $product->id,
                    'action' => 'Auto Restock Executed',
                    'type' => 'stock-in',
                    'details' => "Automated restock of +{$qty} units completed for {$product->name}. Stock adjusted from {$oldQty} to {$product->quantity}.",
                ]);

                $sched->update([
                    'status' => 'completed',
                    'auto_restocked_at' => now(),
                ]);

                $processed[] = [
                    'schedule_id' => $sched->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity_added' => $qty,
                    'new_stock' => $product->quantity,
                    'scheduled_date' => $sched->scheduled_date,
                ];
            }
        });

        return response()->json([
            'message' => "Successfully auto-restocked " . count($processed) . " scheduled item(s).",
            'processed_count' => count($processed),
            'processed' => $processed,
        ]);
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(Request $request, $id)
    {
        $sku = $request->query('sku');
        $productName = $request->query('product_name');

        $schedule = RestockSchedule::where('id', $id)
            ->when($sku, fn($q) => $q->orWhere('sku', $sku))
            ->when($productName, fn($q) => $q->orWhere('product_name', $productName))
            ->first();

        if ($schedule) {
            $schedule->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Schedule removed successfully.',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with('product')->latest();

        if ($request->has('type') && in_array($request->type, ['in', 'out'])) {
            $query->where('type', $request->type);
        }

        $movements = $query->get()->map(function ($m) {
            return [
                'id' => (string) $m->id,
                'productId' => (string) $m->product_id,
                'productName' => $m->product?->name ?? 'Unknown Part',
                'sku' => $m->product?->sku ?? 'N/A',
                'image' => $m->product?->image,
                'type' => $m->type,
                'quantity' => $m->quantity,
                'timestamp' => $m->created_at->format('M d, Y h:i A'),
                'notes' => $m->notes,
            ];
        });

        return response()->json($movements);
    }

    public function stockIn(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $pId = $validated['product_id'];
            $product = Product::lockForUpdate()
                ->where('id', $pId)
                ->orWhere('sku', $pId)
                ->orWhere('name', $pId)
                ->first();

            if (!$product) {
                throw ValidationException::withMessages([
                    'product_id' => ['Product not found in database.'],
                ]);
            }

            $product->quantity += $validated['quantity'];
            $product->max_capacity = max($product->max_capacity ?? 0, $product->quantity);
            $product->recalculateStatus();

            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => 'in',
                'quantity' => $validated['quantity'],
                'notes' => $validated['notes'] ?? 'Floor Restock Intake',
                'user_id' => $request->user()?->id,
            ]);

            AuditLog::create([
                'product_id' => $product->id,
                'user_id' => $request->user()?->id,
                'action' => 'Stock Received',
                'type' => 'stock-in',
                'details' => "Received +{$validated['quantity']} units. Updated stock: {$product->quantity}.",
            ]);

            return response()->json([
                'message' => 'Stock in processed successfully',
                'product' => $product,
                'movement' => $movement,
            ], 201);
        });
    }

    public function stockOut(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $pId = $validated['product_id'];
            $product = Product::lockForUpdate()
                ->where('id', $pId)
                ->orWhere('sku', $pId)
                ->orWhere('name', $pId)
                ->first();

            if (!$product) {
                throw ValidationException::withMessages([
                    'product_id' => ['Product not found in database.'],
                ]);
            }

            if ($product->quantity < $validated['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => ["Insufficient stock. Available units: {$product->quantity}"],
                ]);
            }

            $product->quantity -= $validated['quantity'];
            $product->recalculateStatus();

            $reason = $validated['reason'] ?? 'Workshop Repair';
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => 'out',
                'quantity' => $validated['quantity'],
                'reason' => $reason,
                'notes' => "[{$reason}] " . ($validated['notes'] ?? ''),
                'user_id' => $request->user()?->id,
            ]);

            AuditLog::create([
                'product_id' => $product->id,
                'user_id' => $request->user()?->id,
                'action' => 'Stock Dispatched',
                'type' => 'stock-out',
                'details' => "Dispatched -{$validated['quantity']} units ({$reason}). Updated stock: {$product->quantity}.",
            ]);

            return response()->json([
                'message' => 'Stock out processed successfully',
                'product' => $product,
                'movement' => $movement,
            ], 201);
        });
    }
}

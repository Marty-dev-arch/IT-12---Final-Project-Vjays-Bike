<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\RestockSchedule;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
                  ->orWhere('brand', 'like', "%{$s}%");
            });
        }

        $products = $query->orderBy('name')->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'category' => ['required', 'string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:1'],
            'max_capacity' => ['nullable', 'integer', 'min:1'],
            'location' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = new Product($validated);
            $product->quantity = $validated['quantity'] ?? 0;
            $product->min_stock = $validated['min_stock'] ?? 5;
            $product->max_capacity = $validated['max_capacity'] ?? ($product->quantity > 0 ? $product->quantity : 5);
            $product->location = $validated['location'] ?? 'Warehouse Shelf A1';
            $product->image = $validated['image'] ?? null;
            $product->recalculateStatus();

            // Create initial stock movement if quantity > 0
            if ($product->quantity > 0) {
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'in',
                    'quantity' => $product->quantity,
                    'notes' => 'Initial catalog registration intake',
                    'user_id' => $request->user()?->id,
                ]);
            }

            // Log event in Audit Log
            AuditLog::create([
                'product_id' => $product->id,
                'user_id' => $request->user()?->id,
                'action' => 'Created Product',
                'type' => 'verification',
                'details' => "Initial inventory for {$product->name} (SKU: {$product->sku}) created with {$product->quantity} units at ₱{$product->price}",
            ]);

            return response()->json($product, 201);
        });
    }

    public function show($id)
    {
        $product = Product::where('id', $id)->orWhere('sku', $id)->firstOrFail();
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('id', $id)->orWhere('sku', $id)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string'],
            'brand' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'cost_price' => ['sometimes', 'numeric', 'min:0'],
            'min_stock' => ['sometimes', 'integer', 'min:1'],
            'max_capacity' => ['sometimes', 'integer', 'min:1'],
            'location' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
        ]);

        $product->update($validated);
        $product->recalculateStatus();

        AuditLog::create([
            'product_id' => $product->id,
            'user_id' => $request->user()?->id,
            'action' => 'Updated Product Info',
            'type' => 'adjustment',
            'details' => "Updated details for {$product->name} (SKU: {$product->sku})",
        ]);

        return response()->json($product);
    }

    public function destroy(Request $request, $id)
    {
        $sku = $request->query('sku');
        $name = $request->query('name');

        $query = Product::where('id', $id)
            ->orWhere('sku', $id)
            ->orWhere('name', $id);

        if ($sku) {
            $query->orWhere('sku', $sku);
        }
        if ($name) {
            $query->orWhere('name', $name);
        }

        $product = $query->first();

        // If not found yet, try fuzzy search or strip prefixes
        if (!$product && $name) {
            $product = Product::where('name', 'like', '%' . trim($name) . '%')->first();
        }
        if (!$product && $sku) {
            $product = Product::where('sku', 'like', '%' . trim($sku) . '%')->first();
        }

        if (!$product) {
            return response()->json([
                'success' => true,
                'message' => 'Product was not found or already deleted from database',
            ]);
        }

        // Preserve all audit logs and annotate them with product info so history remains intact
        AuditLog::where('product_id', $product->id)->each(function ($log) use ($product) {
            if (!str_contains($log->details, $product->sku)) {
                $log->details = "{$log->details} [Product: {$product->name}, SKU: {$product->sku}, Brand: {$product->brand}, Category: {$product->category}]";
                $log->save();
            }
        });

        // Record the deletion event in the audit trail:
        AuditLog::create([
            'product_id' => null,
            'user_id' => $request->user()?->id,
            'action' => 'Deleted Product',
            'type' => 'adjustment',
            'details' => "Removed product {$product->name} (SKU: {$product->sku}, Brand: {$product->brand}, Category: {$product->category}) with remaining stock {$product->quantity}",
        ]);

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product and associated records permanently deleted from MySQL database',
            'id' => $product->id,
            'sku' => $product->sku,
        ]);
    }

    public function destroyAll(Request $request)
    {
        $category = $request->query('category');
        $query = Product::query();
        if ($category && $category !== 'all') {
            $altCat = str_replace('-', ' ', $category);
            $slugCat = str_replace(' ', '-', strtolower($category));
            $query->where(function ($q) use ($category, $altCat, $slugCat) {
                $q->where('category', $category)
                  ->orWhere('category', $altCat)
                  ->orWhere('category', $slugCat);
            });
        }

        $products = $query->get();
        $count = $products->count();
        $productIds = $products->pluck('id')->toArray();
        $productNames = $products->pluck('name')->toArray();

        if ($count > 0) {
            StockMovement::whereIn('product_id', $productIds)->delete();
            RestockSchedule::whereIn('product_id', $productIds)
                ->orWhereIn('product_name', $productNames)
                ->delete();

            // Retain all audit logs and annotate them with product info
            foreach ($products as $p) {
                AuditLog::where('product_id', $p->id)->each(function ($log) use ($p) {
                    if (!str_contains($log->details, $p->sku)) {
                        $log->details = "{$log->details} [Product: {$p->name}, SKU: {$p->sku}, Brand: {$p->brand}, Category: {$p->category}]";
                        $log->save();
                    }
                });
            }

            // Record bulk removal in database audit_logs table
            AuditLog::create([
                'product_id' => null,
                'user_id' => $request->user()?->id,
                'action' => $category === 'all' ? 'Deleted All Products' : 'Deleted Category Products',
                'type' => 'adjustment',
                'details' => "Bulk removed {$count} products from catalog and database" . ($category && $category !== 'all' ? " (Category: {$category})" : ""),
            ]);

            Product::whereIn('id', $productIds)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully removed {$count} products from MySQL database",
            'deleted_count' => $count,
        ]);
    }
}

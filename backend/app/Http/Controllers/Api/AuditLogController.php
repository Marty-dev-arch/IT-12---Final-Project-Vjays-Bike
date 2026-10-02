<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with(['product', 'user'])->latest();

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('action', 'like', "%{$s}%")
                  ->orWhere('details', 'like', "%{$s}%");
            });
        }

        $logs = $query->get()->map(function ($log) {
            $productName = $log->product?->name;
            $sku = $log->product?->sku;
            $brand = $log->product?->brand;
            $category = $log->product?->category;

            // If product was deleted, extract product name and SKU from details
            if (!$productName && preg_match('/(?:product|for)\s+([^(]+)\s*\(SKU:\s*([^,)\n]+)/i', $log->details, $matches)) {
                $productName = trim($matches[1]);
                $sku = trim($matches[2]);
            }
            if (!$brand && preg_match('/Brand:\s*([^,)\n]+)/i', $log->details, $mBrand)) {
                $brand = trim($mBrand[1]);
            }
            if (!$category && preg_match('/Category:\s*([^,)\n]+)/i', $log->details, $mCat)) {
                $category = trim($mCat[1]);
            }

            return [
                'id' => (string) $log->id,
                'action' => $log->action,
                'productName' => $productName ?: ($log->action === 'Deleted All Products' ? 'All Products' : 'Inventory System'),
                'sku' => $sku ?: 'SYS-LOG',
                'brand' => $brand ?: 'Generic',
                'category' => $category ?: 'General',
                'details' => $log->details,
                'user' => $log->user?->name ?? 'Vjay (Owner)',
                'timestamp' => $log->created_at->format('M d, Y h:i A'),
                'type' => $log->type,
            ];
        });

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'in:stock-in,stock-out,adjustment,verification'],
            'details' => ['required', 'string'],
            'product_name' => ['nullable', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100'],
        ]);

        $log = AuditLog::create([
            'action' => $validated['action'],
            'type' => $validated['type'] ?? 'adjustment',
            'details' => $validated['details'],
            'user_id' => $request->user()?->id,
        ]);

        return response()->json($log, 201);
    }
}


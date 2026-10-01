<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        $products = Product::all();
        $today = Carbon::today();

        $stockValuation = $products->sum(function ($p) {
            return $p->cost_price * $p->quantity;
        });

        $catalogBreadth = $products->count();
        $physicalStockVolume = $products->sum('quantity');

        $inflowToday = StockMovement::where('type', 'in')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        $dispatchedToday = StockMovement::where('type', 'out')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        return response()->json([
            'stockValuation' => (float) $stockValuation,
            'catalogBreadth' => (int) $catalogBreadth,
            'physicalStockVolume' => (int) $physicalStockVolume,
            'maxCapacity' => max(100, $physicalStockVolume + 50),
            'inflowToday' => (int) $inflowToday,
            'dispatchedToday' => (int) $dispatchedToday,
        ]);
    }

    public function getRestockQueue()
    {
        $queue = Product::whereColumn('quantity', '<=', 'min_stock')
            ->orderBy('quantity')
            ->get();

        return response()->json($queue);
    }

    public function getRecentMovements()
    {
        $movements = StockMovement::with('product')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => (string) $m->id,
                    'productId' => (string) $m->product_id,
                    'productName' => $m->product?->name ?? 'Unknown Part',
                    'sku' => $m->product?->sku ?? 'N/A',
                    'type' => $m->type,
                    'quantity' => $m->quantity,
                    'timestamp' => $m->created_at->format('M d, Y h:i A'),
                    'notes' => $m->notes,
                ];
            });

        return response()->json($movements);
    }
}

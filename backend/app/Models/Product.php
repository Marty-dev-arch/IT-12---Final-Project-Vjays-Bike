<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'category',
        'brand',
        'price',
        'cost_price',
        'quantity',
        'min_stock',
        'max_capacity',
        'location',
        'status',
        'image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'quantity' => 'integer',
        'min_stock' => 'integer',
        'max_capacity' => 'integer',
    ];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function recalculateStatus(): string
    {
        // Dynamic capacity adjustment: ensure max_capacity moves up if quantity increases
        if ($this->quantity > ($this->max_capacity ?? 0)) {
            $this->max_capacity = $this->quantity;
        }

        if ($this->quantity <= 0) {
            $status = 'out-of-stock';
        } elseif ($this->quantity <= ceil($this->min_stock * 0.5)) {
            $status = 'critical';
        } elseif ($this->quantity <= $this->min_stock) {
            $status = 'low-stock';
        } else {
            $status = 'in-stock';
        }

        $this->status = $status;
        $this->save();

        return $status;
    }
}

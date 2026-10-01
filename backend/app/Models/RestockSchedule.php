<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestockSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'product_name',
        'scheduled_date',
        'target_quantity',
        'status',
        'notes',
        'auto_restocked_at',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'target_quantity' => 'integer',
        'auto_restocked_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

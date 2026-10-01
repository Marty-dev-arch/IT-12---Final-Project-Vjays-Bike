<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('category'); // braking-system, drivetrain-chains, gears-sprockets, wheels-tires, accessories
            $table->string('brand')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('cost_price', 10, 2)->default(0.00);
            $table->integer('quantity')->default(0);
            $table->integer('min_stock')->default(5);
            $table->integer('max_capacity')->nullable()->default(5);
            $table->string('location')->default('Warehouse Shelf A1');
            $table->enum('status', ['in-stock', 'low-stock', 'critical', 'out-of-stock'])->default('out-of-stock');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

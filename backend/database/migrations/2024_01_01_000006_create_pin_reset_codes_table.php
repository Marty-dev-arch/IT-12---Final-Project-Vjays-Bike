<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pin_reset_codes', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->string('code', 6);
            $table->string('status', 50)->default('sent');
            $table->string('channel', 50)->default('sms');
            $table->text('message')->nullable();
            $table->text('gateway_response')->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pin_reset_codes');
    }
};

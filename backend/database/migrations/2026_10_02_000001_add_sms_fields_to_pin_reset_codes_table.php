<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pin_reset_codes', function (Blueprint $table) {
            if (!Schema::hasColumn('pin_reset_codes', 'status')) {
                $table->string('status', 50)->default('sent')->after('code');
            }
            if (!Schema::hasColumn('pin_reset_codes', 'channel')) {
                $table->string('channel', 50)->default('sms')->after('status');
            }
            if (!Schema::hasColumn('pin_reset_codes', 'message')) {
                $table->text('message')->nullable()->after('channel');
            }
            if (!Schema::hasColumn('pin_reset_codes', 'gateway_response')) {
                $table->text('gateway_response')->nullable()->after('message');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pin_reset_codes', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('pin_reset_codes', 'gateway_response')) {
                $columnsToDrop[] = 'gateway_response';
            }
            if (Schema::hasColumn('pin_reset_codes', 'message')) {
                $columnsToDrop[] = 'message';
            }
            if (Schema::hasColumn('pin_reset_codes', 'channel')) {
                $columnsToDrop[] = 'channel';
            }
            if (Schema::hasColumn('pin_reset_codes', 'status')) {
                $columnsToDrop[] = 'status';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};

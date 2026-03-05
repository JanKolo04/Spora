<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pollen_readings', function (Blueprint $table) {
            $table->decimal('quantity', 10, 2)->nullable()->after('concentration');
            $table->decimal('multiplier', 8, 4)->nullable()->after('quantity');
            $table->decimal('result', 12, 2)->nullable()->after('multiplier');
            $table->decimal('pollen_percentage', 5, 2)->nullable()->after('result');
        });
    }

    public function down(): void
    {
        Schema::table('pollen_readings', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'multiplier', 'result', 'pollen_percentage']);
        });
    }
};

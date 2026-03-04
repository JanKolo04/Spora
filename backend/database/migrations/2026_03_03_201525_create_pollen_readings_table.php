<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pollen_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pollen_id')->constrained('pollens')->cascadeOnDelete();
            $table->integer('concentration');
            $table->enum('level', ['niski', 'średni', 'wysoki', 'bardzo wysoki']);
            $table->string('region');
            $table->date('reading_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pollen_readings');
    }
};

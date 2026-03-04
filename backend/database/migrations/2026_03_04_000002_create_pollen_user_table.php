<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pollen_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pollen_id')->constrained('pollens')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'pollen_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pollen_user');
    }
};

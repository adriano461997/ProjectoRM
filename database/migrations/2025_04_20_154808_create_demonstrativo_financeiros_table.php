<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('demonstrativo_financeiros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subcategoria_id');
            $table->decimal('valor');
            $table->date('data');
            $table->foreignId('filiar_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demonstrativo_financeiros');
    }
};

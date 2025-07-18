<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sub_tipos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->unsignedBigInteger('tipo_receita_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_tipos');
    }
};

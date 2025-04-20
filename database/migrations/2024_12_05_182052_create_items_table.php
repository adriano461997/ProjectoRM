<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('quantidade')->nullable();
            $table->bigInteger('unidade')->nullable();
            $table->foreignId('categorias_id');
            $table->decimal('preco', 32,2)->nullable();
            $table->bigInteger("afiliar_id")->index();
            $table->bigInteger("tipo_receita_id")->index()->nullable();
            $table->date("data_inicio");
            $table->date("data_fim");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};

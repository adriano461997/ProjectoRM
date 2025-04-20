<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lancamentos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('codigo');
            $table->unsignedBigInteger('exercicio_id');
            $table->unsignedBigInteger('tipo_documento_id')->nullable();
            $table->string('descricao')->nullable();
            $table->unsignedBigInteger('objecto_id')->nullable();
            $table->string('objecto_type')->nullable();
            $table->unsignedBigInteger('diario_id')->nullable();
            $table->date('data_lancamento')->nullable();
            $table->timestamps();
            $table->index('diario_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lancamentos');
    }
};

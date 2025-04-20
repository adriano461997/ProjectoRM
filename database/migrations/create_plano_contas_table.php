<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('plano_contas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo');
            $table->integer('tipo')->default(0);
            $table->unsignedBigInteger('classe_id');
            $table->string('nome');
            $table->unsignedBigInteger('ref_id')->nullable();
            $table->unsignedBigInteger('empresa_id')->nullable();
            $table->unsignedBigInteger('entregadora_id')->nullable();
            $table->unsignedBigInteger('titulo_id')->nullable();
            $table->unsignedBigInteger('conta_mae_id')->nullable();
            $table->timestamps();

            $table->index('codigo');
            $table->index('empresa_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plano_contas');
    }
};

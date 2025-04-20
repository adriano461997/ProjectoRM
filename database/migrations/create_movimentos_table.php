<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('movimentos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('conta_id');
            $table->decimal('debito', 32, 2)->nullable();
            $table->decimal('credito', 32, 2)->nullable();
            $table->integer('tipo_cambio')->nullable();
            $table->decimal('cambio', 32, 2)->default(0.00);
            $table->unsignedBigInteger('exercicio_id');
            $table->unsignedBigInteger('lancamento_id');
            $table->timestamps();
            $table->index('conta_id');
            $table->index('exercicio_id');
            $table->index('lancamento_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimentos');
    }
};

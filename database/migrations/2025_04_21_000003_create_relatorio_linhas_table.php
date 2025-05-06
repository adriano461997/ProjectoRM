<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('relatorio_linhas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relatorio_grupo_id')->constrained('relatorio_grupos')->onDelete('cascade');
            $table->integer('ordem')->default(0);
            $table->string('tipo_linha');
            $table->string('texto')->nullable();
            $table->foreignId('subcategoria_id')->nullable()->constrained('subcategorias')->onDelete('set null');
            $table->string('formula')->nullable();
            $table->boolean('is_totalizador')->default(false);
            $table->boolean('is_totalizador_geral')->default(false);
            $table->boolean('negrito')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('relatorio_linhas');
    }
};

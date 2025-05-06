<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('relatorio_linhas');
        Schema::dropIfExists('relatorio_grupos');
    }

    public function down(): void
    {
        // Não recria as tabelas, pois a lógica foi removida permanentemente
    }
};

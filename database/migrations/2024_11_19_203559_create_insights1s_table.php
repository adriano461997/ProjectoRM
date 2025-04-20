<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('insights1s', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->decimal(column: "total_vendas", total: 32, places: 2);
            $table->decimal(column: "total_lucro", total: 32, places: 2);
            $table->decimal(column: "total_caixas", total: 32, places: 2);
            $table->integer("quantidade_vendias")->default(0);
            $table->integer("quantidade_compradas")->default(0);
            $table->string("carros")->nullable();
            $table->bigInteger("filiar_id")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insights1s');
    }
};

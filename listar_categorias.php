<?php

// Definir o diretório raiz do projeto Laravel
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Categorias;
use App\Models\Subcategorias;

echo "=================================================================\n";
echo "                     LISTA DE CATEGORIAS                          \n";
echo "=================================================================\n";

$categorias = Categorias::orderBy('tipo_receita_id')->orderBy('id')->get();

foreach ($categorias as $categoria) {
    $tipoReceita = $categoria->tipo_receita_id == 1 ? 'RECEITA' : 'DESPESA';
    
    echo "\nCATEGORIA: {$categoria->nome} (ID: {$categoria->id}) - Tipo: {$tipoReceita}\n";
    echo "----------------------------------------------------------------\n";
    
    $subcategorias = Subcategorias::where('categoria_id', $categoria->id)->get();
    
    if ($subcategorias->count() > 0) {
        foreach ($subcategorias as $subcategoria) {
            echo "    - {$subcategoria->nome} (ID: {$subcategoria->id})\n";
        }
    } else {
        echo "    (Nenhuma subcategoria encontrada)\n";
    }
    
    echo "\n";
}

echo "=================================================================\n";
echo "              TOTAL: " . $categorias->count() . " categorias encontradas\n";
echo "=================================================================\n";

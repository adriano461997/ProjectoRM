<?php

namespace App\Console\Commands;

use App\Models\Categorias;
use App\Models\Filiar;
use Illuminate\Console\Command;

class AdicionarRelatoriosCommand extends Command
{
    protected $signature = 'adicionar:relatorios';
    protected $description = 'Command description';

    public function handle(): void
    {
        $this->info('A gerar relatórios...');
        $empresas = Filiar::get();
        $categorias = Categorias::get();
        foreach ($empresas as $empresa) {
            $this->info('A gerar para ' . $empresa->nome);
            foreach ($categorias as $categoria) {
                $this->info('A gerar para categoria: ' . $categoria->nome);
                for ($i = 0; $i < 10; $i++) {
                    $categoria->items()->create([
                        'quantidade' => rand(1, 100),
                        'unidade' => rand(1, 100),
                        'preco' => rand(10000, 1000000),
                        'data_inicio' => now()->subDays(3),
                        'data_fim' => now(),
                        'afiliar_id' => $empresa->id,
                        'tipo_receita_id' => rand(1, 2),
                    ]);
                }
            }
        }
        $this->info('Relatórios gerados com sucesso!');
    }
}

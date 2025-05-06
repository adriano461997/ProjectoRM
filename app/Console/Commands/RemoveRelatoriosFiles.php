<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RemoveRelatoriosFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'relatorios:remove';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all files related to the Relatorios functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Removendo arquivos relacionados a relatórios...');

        // Controladores a serem removidos
        $controllers = [
            'app/Http/Controllers/RelatorioController.php',
            'app/Http/Controllers/RelatorioAdminController.php',
            'app/Http/Controllers/RelatorioPDFController.php',
            'app/Http/Controllers/RelatorioArquivoController.php',
            'app/Http/Controllers/DemonstrativoFinanceiroReportController.php',
        ];

        // Modelos a serem removidos
        $models = [
            'app/Models/Relatorio.php',
            'app/Models/RelatorioGrupo.php',
            'app/Models/RelatorioLinha.php',
            'app/Models/RelatorioArquivo.php',
        ];

        // Views a serem removidas (pastas inteiras)
        $viewFolders = [
            'resources/views/relatorios',
        ];

        // Arquivos React a serem removidos (pastas inteiras)
        $reactFolders = [
            'resources/js/Pages/relatorios',
        ];

        // Traits a serem removidos
        $traits = [
            'app/Traits/TipoRelatorioTrait.php',
        ];

        // Migrações relacionadas a relatórios que já foram executadas
        // (não precisamos removê-las, apenas adicionar uma migração para excluir as tabelas)

        // Remover controladores
        foreach ($controllers as $controller) {
            $path = base_path($controller);
            if (File::exists($path)) {
                File::delete($path);
                $this->info("Controlador removido: {$controller}");
            } else {
                $this->warn("Controlador não encontrado: {$controller}");
            }
        }

        // Remover modelos
        foreach ($models as $model) {
            $path = base_path($model);
            if (File::exists($path)) {
                File::delete($path);
                $this->info("Modelo removido: {$model}");
            } else {
                $this->warn("Modelo não encontrado: {$model}");
            }
        }

        // Remover pastas de views
        foreach ($viewFolders as $folder) {
            $path = base_path($folder);
            if (File::isDirectory($path)) {
                File::deleteDirectory($path);
                $this->info("Pasta de views removida: {$folder}");
            } else {
                $this->warn("Pasta de views não encontrada: {$folder}");
            }
        }

        // Remover pastas de componentes React
        foreach ($reactFolders as $folder) {
            $path = base_path($folder);
            if (File::isDirectory($path)) {
                File::deleteDirectory($path);
                $this->info("Pasta de componentes React removida: {$folder}");
            } else {
                $this->warn("Pasta de componentes React não encontrada: {$folder}");
            }
        }

        // Remover traits
        foreach ($traits as $trait) {
            $path = base_path($trait);
            if (File::exists($path)) {
                File::delete($path);
                $this->info("Trait removido: {$trait}");
            } else {
                $this->warn("Trait não encontrado: {$trait}");
            }
        }

        $this->info('Remoção de arquivos de relatórios concluída!');
        $this->info('Para finalizar a remoção, execute as migrações para remover as tabelas:');
        $this->info('php artisan migrate');
    }
}

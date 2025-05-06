<?php
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ContasController;
use App\Http\Controllers\DemonstrativoFinanceiroController;
use App\Http\Controllers\DemonstrativoFinanceiroReportController;
use App\Http\Controllers\EmpresasController;
use App\Http\Controllers\ExerciciosController;
use App\Http\Controllers\FiliarCategoriaController;
use App\Http\Controllers\FiliarController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\MovimentosController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelatorioAdminController;
use App\Http\Controllers\RelatorioArquivoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\RelatorioPDFController;
use App\Http\Controllers\ResumoController;
use App\Http\Controllers\SubcategoriasController;
use App\Http\Controllers\UsuariosController;
use App\Http\Controllers\RelatoriosController;
use App\Http\Middleware\CheckAdminMiddleware;
use App\Http\Middleware\CheckFiliarMiddleware;
use App\Http\Middleware\ShareFiliarPropsMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    Route::get("/escolher", [IndexController::class, "escolher"])->name("escolher");

    Route::prefix("contabilidade")->group(function () {

        Route::prefix('exercicios')->group(function(){
            Route::get('/', [ExerciciosController::class, 'index']);
            Route::post('/criar', [ExerciciosController::class, 'store']);
            Route::post('/activar/{exercicio_id}', [ExerciciosController::class, 'activar']);
            Route::post('/editar/{exercicios_id}', [ExerciciosController::class, 'update']);
            Route::post('/eliminar/{exercicios_id}', [ExerciciosController::class, 'destroy']);
        });

        Route::prefix('contas')->group(function(){
            Route::get('/', [ContasController::class, 'index']);
            Route::post('/criar', [ContasController::class, 'store']);
            Route::post('/editar/{contas_id}', [ContasController::class, 'update']);
            Route::post('/eliminar/{contas_id}', [ContasController::class, 'destroy']);
        });

        Route::prefix('movimentos')->group(function(){
            Route::get('/', [MovimentosController::class, 'index']);
            Route::post('/contas', [MovimentosController::class, 'contas']);
            Route::get('/eouc/pesquisar_contas', [MovimentosController::class, 'pesquisar_contas']);
            Route::get('/criar', [MovimentosController::class, 'create']);
            Route::post('/criar', [MovimentosController::class, 'store']);
            Route::get('/editar/{lancamento_id}', [MovimentosController::class, 'edit']);
            Route::post('/editar/{lancamento_id}', [MovimentosController::class, 'update']);
            Route::post('/eliminar/{lancamento_id}', [MovimentosController::class, 'destroy']);
        });

    });

    Route::prefix("/f/{slug}")->middleware([CheckFiliarMiddleware::class, ShareFiliarPropsMiddleware::class])->group(function (){
        Route::get("/", [FiliarController::class, "index"])->name("filiar.index");

        // Demonstrativo Financeiro routes
        Route::prefix('demonstrativo-financeiro')->group(function(){
            Route::get('/', [DemonstrativoFinanceiroController::class, 'index'])->name('demonstrativo-financeiro.index');
            Route::get('/adicionar', [DemonstrativoFinanceiroController::class, 'create'])->name('demonstrativo-financeiro.add');
            Route::post('/adicionar', [DemonstrativoFinanceiroController::class, 'store'])->name('demonstrativo-financeiro.add_post');
            Route::get('/{id}/editar', [DemonstrativoFinanceiroController::class, 'edit'])->name('demonstrativo-financeiro.editar');
            Route::post('/{id}/editar', [DemonstrativoFinanceiroController::class, 'update'])->name('demonstrativo-financeiro.editar_post');
            Route::post('/{id}/eliminar', [DemonstrativoFinanceiroController::class, 'destroy'])->name('demonstrativo-financeiro.eliminar');
            Route::get('/subcategorias', [DemonstrativoFinanceiroController::class, 'getSubcategorias'])->name('demonstrativo-financeiro.subcategorias');
        });

        Route::prefix("/c/{c_slug}")->group(function (){
            Route::get("/", [FiliarCategoriaController::class, "index"])->name("filiar.categoria.index");
            Route::get("/adicionar", [FiliarCategoriaController::class, "create"])->name("filiar.categoria.add");
            Route::post("/adicionar", [FiliarCategoriaController::class, "store"])->name("filiar.categoria.add_post");
            Route::get("/{cat_id}/editar", [FiliarCategoriaController::class, "edit"])->name("filiar.categoria.editar");
            Route::post("/{cat_id}/editar", [FiliarCategoriaController::class, "update"])->name("filiar.categoria.editar_post");
            Route::post("/{cat_id}/eliminar", [FiliarCategoriaController::class, "destroy"])->name("filiar.categoria.eliminar");
        });
    });

    Route::middleware([CheckAdminMiddleware::class])->group(function(){

        Route::get('/', [IndexController::class, "index"])->name("dashboard");

        // Rotas para Demonstrativo Financeiro - Relatório
        Route::prefix('demonstrativo-financeiro')->group(function(){
            Route::get('/relatorio', [DemonstrativoFinanceiroReportController::class, 'index'])->name('demonstrativo-financeiro.report');
            Route::get('/relatorio/pdf', [DemonstrativoFinanceiroReportController::class, 'generatePdf'])->name('demonstrativo-financeiro.pdf');
        });

        // Rotas para sistema geral de relatórios
        Route::prefix('relatorios')->group(function(){
            Route::get('/', [RelatoriosController::class, 'index'])->name('relatorios.index');
            Route::get('/pdf', [RelatoriosController::class, 'generatePdf'])->name('relatorios.pdf');
        });

        Route::prefix("/resumo")->group(function(){
            Route::get("/", [ResumoController::class, "index"])->name("resumo.index");
        });

        Route::prefix("categorias")->group(function(){
            Route::get('/', [CategoriasController::class, "index"])->name("categorias.index");
            Route::get('/adicionar', [CategoriasController::class, "create"])->name("categorias.add");
            Route::post('/adicionar', [CategoriasController::class, "store"])->name("categorias.add_post");
            Route::get('/{cat_id}/editar', [CategoriasController::class, "edit"])->name("categorias.editar");
            Route::post('/{cat_id}/editar', [CategoriasController::class, "update"])->name("categorias.editar_post");
            Route::post('/{cat_id}/eliminar', [CategoriasController::class, "destroy"])->name("categorias.eliminar");

            // Subcategorias routes
            Route::get('/{categoria_id}/subcategorias', [SubcategoriasController::class, "index"])->name("categorias.subcategorias.index");
            Route::get('/{categoria_id}/subcategorias/adicionar', [SubcategoriasController::class, "create"])->name("categorias.subcategorias.add");
            Route::post('/{categoria_id}/subcategorias/adicionar', [SubcategoriasController::class, "store"])->name("categorias.subcategorias.add_post");
            Route::get('/{categoria_id}/subcategorias/{id}/editar', [SubcategoriasController::class, "edit"])->name("categorias.subcategorias.editar");
            Route::post('/{categoria_id}/subcategorias/{id}/editar', [SubcategoriasController::class, "update"])->name("categorias.subcategorias.editar_post");
            Route::post('/{categoria_id}/subcategorias/{id}/eliminar', [SubcategoriasController::class, "destroy"])->name("categorias.subcategorias.eliminar");
            Route::post('/{categoria_id}/subcategorias/order', [SubcategoriasController::class, "updateOrder"])->name("categorias.subcategorias.order");
        });

        Route::prefix("empresas")->group(function(){
            Route::get('/', [EmpresasController::class, "index"])->name("empresas.index");
            Route::get('/adicionar', [EmpresasController::class, "create"])->name("empresas.add");
            Route::post('/adicionar', [EmpresasController::class, "store"])->name("empresas.add_post");
            Route::get('/{empresa_id}/editar', [EmpresasController::class, "edit"])->name("empresas.editar");
            Route::post('/{empresa_id}/editar', [EmpresasController::class, "update"])->name("empresas.editar_post");
            Route::post('/{empresa_id}/eliminar', [EmpresasController::class, "destroy"])->name("empresas.eliminar");
        });

        Route::prefix("usuarios")->group(function(){
            Route::get('/', [UsuariosController::class, "index"])->name("usuarios.index");
            Route::get('/adicionar', [UsuariosController::class, "create"])->name("usuarios.add");
            Route::post('/adicionar', [UsuariosController::class, "store"])->name("usuarios.add_post");
            Route::get('/{usuario_id}/editar', [UsuariosController::class, "edit"])->name("usuarios.editar");
            Route::post('/{usuario_id}/editar', [UsuariosController::class, "update"])->name("usuarios.editar_post");
            Route::post('/{usuario_id}/eliminar', [UsuariosController::class, "destroy"])->name("usuarios.eliminar");
        });

    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

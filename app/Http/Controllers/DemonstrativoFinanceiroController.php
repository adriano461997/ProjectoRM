<?php
namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\DemonstrativoFinanceiro;
use App\Models\Subcategorias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DemonstrativoFinanceiroController extends Controller
{
    function index()
    {
        $query = DemonstrativoFinanceiro::with(['subcategoria.categoria'])
            ->where('filiar_id', request()->filiar->id)
            ->orderBy('data', 'desc');

        // Filtro por data
        if (request('data_inicio') && request('data_fim')) {
            $query->whereBetween('data', [request('data_inicio'), request('data_fim')]);
        } elseif (request('data_inicio')) {
            $query->where('data', '>=', request('data_inicio'));
        } elseif (request('data_fim')) {
            $query->where('data', '<=', request('data_fim'));
        }

        // Filtro por categoria
        if (request('categoria_id') && request('categoria_id') !== 'all') {
            $query->whereHas('subcategoria', function ($q) {
                $q->where('categoria_id', request('categoria_id'));
            });
        }

        // Filtro por subcategoria
        if (request('subcategoria_id') && request('subcategoria_id') !== 'all') {
            $query->where('subcategoria_id', request('subcategoria_id'));
        }

        $items = $query->paginate(50, ["*"], "p");

        // Obter todas as categorias para o filtro
        $categorias = Categorias::orderBy('nome')->get();
        
        // Obter subcategorias baseadas na categoria selecionada
        $subcategorias = [];
        if (request('categoria_id')) {
            $subcategorias = Subcategorias::where('categoria_id', request('categoria_id'))
                ->orderBy('nome')
                ->get();
        }

        return inertia("demonstrativo-financeiro/index", [
            "items" => $items,
            "categorias" => $categorias,
            "subcategorias" => $subcategorias,
            "filtros" => [
                "data_inicio" => request('data_inicio'),
                "data_fim" => request('data_fim'),
                "categoria_id" => request('categoria_id'),
                "subcategoria_id" => request('subcategoria_id'),
            ]
        ]);
    }

    function create(Request $request)
    {
        $categorias = Categorias::orderBy('nome')->get();
        
        $subcategorias = [];
        if ($request->categoria_id) {
            $subcategorias = Subcategorias::where('categoria_id', $request->categoria_id)
                ->orderBy('nome')
                ->get();
        }
        
        return inertia("demonstrativo-financeiro/adicionar", [
            "mode" => "add",
            "categorias" => $categorias,
            "subcategorias" => $subcategorias,
            "categoria_id" => $request->categoria_id
        ]);
    }

    function store(Request $request)
    {
        $data = $request->validate([
            "subcategoria_id" => ["required", "exists:subcategorias,id"],
            "valor" => ["required", "numeric"],
            "data" => ["required", "date"],
        ]);

        $data["filiar_id"] = $request->filiar->id;

        DemonstrativoFinanceiro::create($data);

        return redirect()->route("demonstrativo-financeiro.index", [$request->filiar->slug]);
    }

    function edit(Request $request, $id)
    {
        $item = DemonstrativoFinanceiro::findOrFail($id);
        
        // Verificar se o demonstrativo pertence à filiar atual
        if ($item->filiar_id !== $request->filiar->id) {
            abort(403, 'Não autorizado');
        }
        
        $categorias = Categorias::orderBy('nome')->get();
        
        // Obter a categoria do item
        $categoria_id = $item->subcategoria->categoria_id;
        
        $subcategorias = Subcategorias::where('categoria_id', $categoria_id)
            ->orderBy('nome')
            ->get();

        return inertia("demonstrativo-financeiro/adicionar", [
            "mode" => "editar",
            "item" => $item,
            "categorias" => $categorias,
            "subcategorias" => $subcategorias,
            "categoria_id" => $categoria_id
        ]);
    }

    function update(Request $request, $id)
    {
        $item = DemonstrativoFinanceiro::findOrFail($id);
        
        // Verificar se o demonstrativo pertence à filiar atual
        if ($item->filiar_id !== $request->filiar->id) {
            abort(403, 'Não autorizado');
        }

        $data = $request->validate([
            "subcategoria_id" => ["required", "exists:subcategorias,id"],
            "valor" => ["required", "numeric"],
            "data" => ["required", "date"],
        ]);

        $item->update($data);

        return redirect()->route("demonstrativo-financeiro.index", [$request->filiar->slug]);
    }

    function destroy(Request $request, $id)
    {
        $item = DemonstrativoFinanceiro::findOrFail($id);
        
        // Verificar se o demonstrativo pertence à filiar atual
        if ($item->filiar_id !== $request->filiar->id) {
            abort(403, 'Não autorizado');
        } 
        
        $item->delete();
        
        return redirect()->route("demonstrativo-financeiro.index", [$request->filiar->slug]);
    }
    
    function getSubcategorias(Request $request)
    {
        $categoria_id = $request->categoria_id;
        
        $subcategorias = Subcategorias::where('categoria_id', $categoria_id)
            ->orderBy('nome')
            ->get();
            
        return response()->json($subcategorias);
    }
}

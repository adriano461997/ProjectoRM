<?php
namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Subcategorias;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubcategoriasController extends Controller
{
    function index($categoria_id){
        $categoria = Categorias::with('tipo_receita:id,nome')->findOrFail($categoria_id);
        
        $items = Subcategorias::where('categoria_id', $categoria_id)
            ->orderBy("order", "asc");

        if(request("q")){
            $items->where("nome", "like", "%".request("q")."%");
        }
        
        if(request("tipo") && request("tipo") !== "all"){
            $items->where("tipo", request("tipo"));
        }

        $items = $items->paginate(50, ["*"], "p");

        return inertia("categorias/subcategorias/index", [
            "items" => $items,
            "categoria" => $categoria,
            "query" => [
                "q" => request("q"),
                "tipo" => request("tipo")
            ]
        ]);
    }

    function create(Request $request, $categoria_id){
        $categoria = Categorias::findOrFail($categoria_id);
        
        return inertia("categorias/subcategorias/adicionar", [
            "mode" => "add",
            "categoria" => $categoria
        ]);
    }

    function store(Request $request, $categoria_id){
        $categoria = Categorias::findOrFail($categoria_id);

        $data = $request->validate([
            "nome" => ["required", "max:255"],
            "conta" => ["required", "max:255"],
            "tipo" => ["required", "integer"],
        ]);

        // Get the highest order value for this category
        $maxOrder = Subcategorias::where('categoria_id', $categoria_id)->max('order') ?? 0;
        
        Subcategorias::create([
            "nome" => $data["nome"],
            "categoria_id" => $categoria_id,
            "conta" => $data["conta"],
            "tipo" => $data["tipo"],
            "order" => $maxOrder + 1,
        ]);

        return redirect()->route("categorias.subcategorias.index", $categoria_id);
    }

    function edit(Request $request, $categoria_id, $id){
        $categoria = Categorias::findOrFail($categoria_id);
        $item = Subcategorias::findOrFail($id);

        return inertia("categorias/subcategorias/adicionar", [
            "mode" => "editar",
            "item" => $item,
            "categoria" => $categoria
        ]);
    }

    function update(Request $request, $categoria_id, $id){
        $categoria = Categorias::findOrFail($categoria_id);
        $item = Subcategorias::findOrFail($id);

        $data = $request->validate([
            "nome" => ["required", "max:255"],
            "conta" => ["required", "max:255"],
            "tipo" => ["required", "integer"],
        ]);

        $item->update($data);

        return redirect()->route("categorias.subcategorias.index", $categoria_id);
    }

    function destroy(Request $request, $categoria_id, $id){
        $categoria = Categorias::findOrFail($categoria_id);
        $item = Subcategorias::findOrFail($id);
        $item->delete();
        
        return redirect()->route("categorias.subcategorias.index", $categoria_id);
    }
    
    function updateOrder(Request $request, $categoria_id) {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:subcategorias,id'],
            'items.*.order' => ['required', 'integer'],
        ]);
        
        foreach ($data['items'] as $item) {
            Subcategorias::where('id', $item['id'])->update(['order' => $item['order']]);
        }
        
        return response()->json(['success' => true]);
    }
}

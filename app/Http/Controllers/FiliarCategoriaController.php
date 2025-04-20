<?php
namespace App\Http\Controllers;
use App\Models\Categorias;
use App\Models\Items;
use App\Models\TipoReceita;
use Illuminate\Http\Request;

class FiliarCategoriaController extends Controller
{
    function index(Request $request, $s, $slug){

        /** @var Categorias $cat */
        $cat = Categorias::where("slug", $slug)->firstOrFail();

        $items = $cat->items()
            ->where("afiliar_id", $request->filiar->id)
            ->orderBy("id", "desc");

        /*
        if(request("q")){
            $items->where("nome", "like", "%".request("q")."%");
        }
        */

        $items = $items->paginate(30, ["*"], "p");

        return inertia("filiar/categorias/index", [
            "items"=> $items,
            "c"=> $cat,
        ]);
    }

    function create(Request $request, $s, $slug){
        $cat = Categorias::where("slug", $slug)->firstOrFail();
        $tipos = TipoReceita::get();
        return inertia("filiar/categorias/adicionar", [
            "mode"=> "add",
            "tipos"=> $tipos,
            "c"=> $cat,
        ]);
    }

    function store(Request $request, $s, $slug){
        $cat = Categorias::where("slug", $slug)->firstOrFail();

        $data = $request->validate([
            "unidade"=> ["required", "integer"],
            "quantidade"=> ["required", "integer"],
            //Valida dinheiro em regex
            "preco"=> ["required", "regex:/^\d+(\.\d{1,2})?$/"],
            "data_inicio"=> ["required", "date"],
            "data_fim"=> ["required", "date", "after:data_inicio"],
        ]);

        Items::create([
            "unidade"=> $data["unidade"],
            "quantidade"=> $data["quantidade"],
            "preco"=> $data["preco"],
            "data_inicio"=> $data["data_inicio"],
            "data_fim"=> $data["data_fim"],
            "categorias_id" => $cat->id,
            "tipo_receita_id"=> $cat->tipo_receita_id,
            "afiliar_id"=> $request->filiar->id,
        ]);

        return redirect()->route("filiar.categoria.index", [$s, $slug]);
    }

    function edit(Request $request, $s, $slug, $id){
        $cat = Categorias::where("slug", $slug)->firstOrFail();

        $item = $cat->items()->findOrFail($id);

        return inertia("filiar/categorias/adicionar", [
            "mode"=> "editar",
            "item"=> $item,
            "c"=> $cat,
        ]);
    }

    function update(Request $request, $s, $slug, $id){
        $cat = Categorias::where("slug", $slug)->firstOrFail();

        $item = $cat->items()->findOrFail($id);

        $data = $request->validate([
            "unidade"=> ["required", "integer"],
            "quantidade"=> ["required", "integer"],
            "preco"=> ["required", "regex:/^\d+(\.\d{1,2})?$/"],
            "data_inicio"=> ["required", "date"],
            "data_fim"=> ["required", "date", "after:data_inicio"],
        ]);

        $item->update($data);

        return redirect()->route("filiar.categoria.index", [$s, $slug]);
    }

    function destroy(Request $request, $s, $slug, $id){
        $cat = Categorias::where("slug", $slug)->firstOrFail();

        $item = $cat->items()->findOrFail($id);

        $item->delete();
        return redirect()->route("filiar.categoria.index", [$s, $slug]);
    }
}

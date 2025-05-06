<?php
namespace App\Http\Controllers;
use App\Models\Categorias;
use App\Models\TipoReceita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoriasController extends Controller
{
    function index(){
        $items = Categorias::
            with(["tipo_receita:id,nome", "subcategorias"])
            ->orderBy("id", "desc");

        if(request("q")){
            $items->where("nome", "like", "%".request("q")."%");
        }

        $items = $items->paginate(50, ["*"], "p");

        // Count subcategories for each category
        $items->getCollection()->transform(function ($item) {
            $item->subcategorias_count = $item->subcategorias->count();
            return $item;
        });

        return inertia("categorias/index", [
            "items"=> $items,
        ]);
    }

    function create(Request $request){
        $tipos = TipoReceita::get();
        return inertia("categorias/adicionar", [
            "mode"=> "add",
            "tipos"=> $tipos,
        ]);
    }

    function store(Request $request){

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "tipo_receita_id"=> ["required", "exists:tipo_receitas,id"],
            "descricao"=> ["nullable","required", "max:255"],
        ]);

        $slug = Str::slug($data["nome"], "-", "pt");
        $checkSlugExists = Categorias::where("slug", $slug)->count();
        if($checkSlugExists){
            $slug = $slug."-".uniqid();
        }

        $data["slug"] = $slug;

        Categorias::create([
            "nome"=> $data["nome"],
            "tipo_receita_id"=> $data["tipo_receita_id"],
            "slug"=> $data["slug"],
            "descricao"=> $data["descricao"],
        ]);

        return redirect()->route("categorias.index");
    }

    function edit(Request $request, $id){

        $item = Categorias::findOrFail($id);

        $tipos = TipoReceita::get();

        return inertia("categorias/adicionar", [
            "mode"=> "editar",
            "item"=> $item,
            "tipos"=> $tipos,
        ]);
    }

    function update(Request $request, $id){

        $item = Categorias::findOrFail($id);

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "tipo_receita_id"=> ["required", "exists:tipo_receitas,id"],
            "descricao"=> ["nullable","required", "max:255"],
        ]);

        $item->update($data);

        return redirect()->route("categorias.index");
    }

    function destroy(Request $request, $id){
        $item = Categorias::findOrFail($id);
        $item->delete();
        return redirect()->route("categorias.index");
    }
}

<?php
namespace App\Http\Controllers;
use App\Models\Categorias;
use App\Models\Filiar;
use App\Models\TipoReceita;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmpresasController extends Controller
{
    function index(){
        $items = Filiar::orderBy("id", "desc");

        if(request("q")){
            $items->where("nome", "like", "%".request("q")."%");
        }

        $items = $items->paginate(10, ["*"], "p");


        return inertia("empresas/index", [
            "items"=> $items,
        ]);
    }

    function create(Request $request){
        return inertia("empresas/adicionar", [
            "mode"=> "add",
        ]);
    }

    function store(Request $request){

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "telefone"=> ["required", "digits:9"],
            "endereco"=> ["required", "max:255"],
        ],[
            "telefone.digits"=> "O telefone deve ter 9 digitos",
            "nome.required"=> "O nome é obrigatório",
            "telefone.required"=> "O telefone é obrigatório",
            "endereco.required"=> "O endereço é obrigatório",
        ]);


        $data["slug"] = \Str::slug($data["nome"], "-", "pt");
        $checkSlugExists = Filiar::where("slug", $data["slug"])->count();
        if($checkSlugExists){
            $data["slug"] = $data["slug"]."-".uniqid();
        }

        Filiar::create($data);

        return redirect()->route("empresas.index");
    }

    function edit(Request $request, $id){

        $item = Filiar::findOrFail($id);

        return inertia("empresas/adicionar", [
            "mode"=> "editar",
            "item"=> $item,
        ]);
    }

    function update(Request $request, $id){

        $item = Filiar::findOrFail($id);

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "telefone"=> ["required", "digits:9"],
            "endereco"=> ["required", "max:255"],
        ],[
            "telefone.digits"=> "O telefone deve ter 9 digitos",
            "nome.required"=> "O nome é obrigatório",
            "telefone.required"=> "O telefone é obrigatório",
            "endereco.required"=> "O endereço é obrigatório",
        ]);

        $item->update($data);

        return redirect()->route("empresas.index");
    }

    function destroy(Request $request, $id){
        $item = Filiar::findOrFail($id);
        $item->delete();
        return redirect()->route("empresas.index");
    }
}

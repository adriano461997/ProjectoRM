<?php
namespace App\Http\Controllers;
use App\Models\Filiar;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuariosController extends Controller
{
    function index(){

        $items = User::
            with([
                "users_filiar",
                "users_filiar.filiar",
        ])->orderBy("id", "desc");

        if(request("q")){
            $items->where("name", "like", "%".request("q")."%");
        }

        $items = $items->paginate(10, ["*"], "p");

        return inertia("usuarios/index", [
            "items"=> $items,
        ]);
    }

    function create(Request $request){

        $empresas = Filiar::get();

        return inertia("usuarios/adicionar", [
            "mode"=> "add",
            "empresas"=> $empresas,
        ]);
    }

    function store(Request $request){

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "email"=> ["required", "unique:users"],
            "password"=> ["required", "min:6"],
            "empresas.*"=> ["required", "exists:filiars,id"],
            "admin"=> ["required", "int", "min:0", "max:1"],
        ],[
            "nome.required"=> "O nome é obrigatório",
            "email.required"=> "O email é obrigatório",
            "email.unique"=> "O email já está em uso",
            "empresas.*.id.required"=> "A empresa é obrigatória",
            "empresas.*.id.exists"=> "A empresa não existe",
            "admin.required"=> "O campo admin é obrigatório",
            "admin.int"=> "O campo admin deve ser um número",
            "admin.min"=> "O campo admin deve ser 0 ou 1",
            "admin.max"=> "O campo admin deve ser 0 ou 1",
        ]);

        /** @var User $user */
         $item = User::create([
            "name"=> $data["nome"],
            "email"=> $data["email"],
            "password"=> Hash::make($data["password"]),
             "admin"=> $request->admin,
         ]);

         if($request->empresas) {
             foreach ($request->empresas as $empresa) {
                 $item->users_filiar()->create([
                     "filiar_id" => $empresa,
                 ]);
             }
         }

        return redirect()->route("usuarios.index");
    }

    function edit(Request $request, $id){

        $item = User::findOrFail($id);

        $empresas = Filiar::get();

        return inertia("usuarios/adicionar", [
            "mode"=> "editar",
            "item"=> $item,
            "empresas"=> $empresas,
            "empresas_selected"=> $item->users_filiar()->pluck("filiar_id")->toArray(),
        ]);
    }

    function update(Request $request, $id){

        /** @var User $item */
        $item = User::findOrFail($id);

        $data = $request->validate([
            "nome"=> ["required", "max:255"],
            "email"=> ["required", Rule::unique("users")->ignore($id)],
            "password"=> ["nullable", "min:6"],
            "empresas.*"=> ["required", "exists:filiars,id"],
            "admin"=> ["required", "int", "min:0", "max:1"],
        ],[
            "nome.required"=> "O nome é obrigatório",
            "email.required"=> "O email é obrigatório",
            "email.unique"=> "O email já está em uso",
            "empresas.*.id.required"=> "A empresa é obrigatória",
            "empresas.*.id.exists"=> "A empresa não existe",
            "admin.required"=> "O campo admin é obrigatório",
            "admin.int"=> "O campo admin deve ser um número",
            "admin.min"=> "O campo admin deve ser 0 ou 1",
            "admin.max"=> "O campo admin deve ser 0 ou 1",
        ]);

        $ps = [];
        if($request->password){
           $ps = [
                "password"=> Hash::make($data["password"]),
            ];
        }

        $item->update([
            "name"=> $data["nome"],
            "email"=> $data["email"],
            "admin"=> (int)$data["admin"],
            ...$ps,
        ]);

        $item->users_filiar()->delete();

        if($request->empresas) {
            foreach ($request->empresas as $empresa) {
                $item->users_filiar()->create([
                    "filiar_id" => $empresa,
                ]);
            }
        }

        return redirect()->route("usuarios.index");
    }

    function destroy(Request $request, $id){
        $item = User::findOrFail($id);
        $item->delete();
        return redirect()->route("usuarios.index");
    }
}

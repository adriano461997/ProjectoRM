<?php
namespace App\Http\Controllers;
use App\Models\Filiar;
use App\Models\Items;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    function index(){

        /*
        $unidades = Items::whereDate("data_fim", "2024-12-16")->get();
        foreach ($unidades as $unidade) {
            $unidade->data_fim = Carbon::parse($unidade->data_fim)->setDay(16)->setMonth(12);
            $unidade->save();
        }
        */


        $data_inicial = Carbon::now()->subDays(7);
        $data_final = now();

        $quantidade = Items::where("data_inicio", ">", $data_inicial)->whereBetween("data_inicio", [$data_inicial, $data_final])->sum("quantidade");
        $unidade = Items::whereBetween("data_inicio", [$data_inicial, $data_final])->sum("unidade");
        $preco = Items::whereBetween("data_inicio", [$data_inicial, $data_final])->sum("preco");


        $empresas = Filiar::query();

        $empresas = $empresas->limit(5);

        $empresas = $empresas->get();

        return inertia("Index", [
            "quantidade"=> $quantidade,
            "unidade"=> $unidade,
            "preco"=> $preco,
            "empresas"=> $empresas,
        ]);
    }

    function escolher(Request $request){
        $user = $request->user();

        $empresas = $user->users_filiar()
            ->with([
                "filiar"
            ])
            ->get();

        return inertia("escolher", [
            "empresas"=> $empresas,
        ]);
    }
}

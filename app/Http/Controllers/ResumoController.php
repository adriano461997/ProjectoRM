<?php
namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Filiar;
use App\Models\Items;
use Illuminate\Http\Request;

class ResumoController extends Controller
{
    public function index(Request $request)
    {
        $not = -1;

        $data_inicial = now()->subDays(7);
        $data_final = now();

        if($request->has("de") && $request->has("ate")){
            $d_inicial = $request->de;
            $d_final = $request->ate;

            $di = \Carbon\Carbon::make($d_inicial);
            $df = \Carbon\Carbon::make($d_final);

            if($di && $di->isValid()){
                $data_inicial = $di;
            }

            if($df && $df->isValid()){
                $data_final = $df;
            }
        }

        $receitas = Items::where("tipo_receita_id", 1)->sum("preco");
        $despesas = Items::where("tipo_receita_id", 2)->sum("preco");

        //Calcula a precentagem
        $percentual = 0;
        if($receitas > 0){
            $percentual = ($despesas / $receitas) * 100;
        }

        $lucro = $receitas - $despesas;

        return inertia("resumo/index", [
            "data_inicial"=> $data_inicial,
            "data_final"=> $data_final,
            "total_receitas"=> $receitas,
            "total_despesas"=> $despesas,
            "p"=> $percentual,
            "empresas_data"=> Filiar::get(),
            "lucro"=> $lucro,
        ]);
    }
}

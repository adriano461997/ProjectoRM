<?php

namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Filiar;
use Illuminate\Http\Request;

class RelatorioController extends Controller
{
    public function index(Request $request, $slug)
    {
        $cat = Categorias::where("slug", $slug)->firstOrFail();

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

        $empresas = Filiar::query();

        $empresas_data = $empresas->clone()->get();

        if($request->a_id && $request->a_id != $not){
            $empresas = $empresas->where("id", $request->a_id);
        }

        $empresas = $empresas->get()->map(function($item) use($cat, $data_final, $data_inicial, $request, $not){

           $quantidade_total = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);
            $quantidade_total = $quantidade_total->where("afiliar_id", $item->id);
           $quantidade_total = $quantidade_total->sum("quantidade");

           $unidade_total = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);
           $unidade_total = $unidade_total->where("afiliar_id", $item->id);
          $unidade_total =  $unidade_total->sum("unidade");

            $precoTotal = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);
            $precoTotal = $precoTotal->where("afiliar_id", $item->id);
            $precoTotal = $precoTotal->sum("preco");

            return [
                ...$item->toArray(),
                "quantidade"=> $quantidade_total,
                "unidade"=> $unidade_total,
                "preco"=> $precoTotal,
            ];
       });

        $quantidade_total = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);
        if($request->a_id && $request->a_id != $not){
            $quantidade_total = $quantidade_total->where("afiliar_id", $request->a_id);
        }
        $quantidade_total = $quantidade_total->sum("quantidade");


        $unidade_total = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);
        if($request->a_id && $request->a_id != $not){
            $unidade_total = $unidade_total->where("afiliar_id", $request->a_id);
        }

            $unidade_total = $unidade_total->sum("unidade");

        $precoTotal = $cat->items()->whereBetween("data_inicio", [$data_inicial, $data_final]);

        if($request->a_id && $request->a_id != $not){
            $precoTotal = $precoTotal->where("afiliar_id", $request->a_id);
        }

       $precoTotal = $precoTotal->sum("preco");

        return inertia("relatorio/index", [
            "c"=> $cat,
            "quantidade"=> $quantidade_total,
            "unidade"=> $unidade_total,
            "preco"=> $precoTotal,
            "empresas"=> $empresas,
            "empresas_data"=> $empresas_data,
            "data_inicial"=> $data_inicial,
            "data_final"=> $data_final
        ]);
    }
}

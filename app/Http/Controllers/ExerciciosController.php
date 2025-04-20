<?php
namespace App\Http\Controllers;
use App\Helpers\CarbonTimezone;
use App\Models\Exercicios;
use Illuminate\Http\Request;

class ExerciciosController extends Controller
{
    public function index(Request $request)
    {

        $items = Exercicios::orderBy("id", "desc");

        if ($request->query('q')) {
            $items = $items->where('nome', 'like', '%' . $request->query('q') . '%');
        }

        $items = $items->paginate(20, '*', 'p');
        $items->getCollection()->transform(function(Exercicios $it) {
            return $it->toApp();
        });

        return inertia('contabilidade/exercicios/index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => ['required', 'max:255', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['required', 'date', 'after:data_inicio'],
        ],[
            'nome.required' => 'O nome é obrigatório',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres',
            'nome.string' => 'O nome tem de ser uma string',
            'data_inicio.required' => 'A data de início é obrigatória',
            'data_inicio.date' => 'A data de início tem de ser uma data',
            'data_fim.required' => 'A data de fim é obrigatória',
            'data_fim.date' => 'A data de fim tem de ser uma data',
            'data_fim.after' => 'A data de fim tem de ser depois da data de início',
        ]);

        /*
        $check = $empresa->exercicios()->cache()->where("data_inicio", "<=", $request->data_fim)->where("data_fim", ">=", $request->data_inicio)->exists();
        if ($check) {
            return response()->json([
                'estado' => 'erro',
                'texto' => 'Já existe um exercício que se sobrepõe a esta data. Por favor escolhe datas diferentes.'
            ]);
        }
        */

        $model = new Exercicios();
        $model->nome = $request->nome;
        $model->data_inicio = CarbonTimezone::make($request->data_inicio);
        $model->data_fim = CarbonTimezone::make($request->data_fim);
        $model->save();

        $data['payload'] = $model->toApp();
        $data['estado'] = 'ok';
        return response()->json($data);
    }

    public function update(Request $request, $slug, $id)
    {
        $model = Exercicios::findOrFail($id);

        $request->validate([
            'nome' => ['required', 'max:255', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['required', 'date', 'after:data_inicio'],
        ],[
            'nome.required' => 'O nome é obrigatório',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres',
            'nome.string' => 'O nome tem de ser uma string',
            'data_inicio.required' => 'A data de início é obrigatória',
            'data_inicio.date' => 'A data de início tem de ser uma data',
            'data_fim.required' => 'A data de fim é obrigatória',
            'data_fim.date' => 'A data de fim tem de ser uma data',
            'data_fim.after' => 'A data de fim tem de ser depois da data de início',
        ]);

        $model->nome = $request->nome;
        $model->data_inicio = CarbonTimezone::make($request->data_inicio);
        $model->data_fim = CarbonTimezone::make($request->data_fim);
        $model->save();

        $data['payload'] = $model->toApp();
        $data['estado'] = 'ok';
        return response()->json($data);
    }


    function activar(Request $request, $slug, $id)
    {

        $model = Exercicios::findOrFail($id);

        Exercicios::update([
            'activo' => false
        ]);

        $model->activo = true;
        $model->save();

        $data['estado'] = 'ok';
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $model = Exercicios::findOrFail($id);
        //$model->delete();
        $data['estado'] = 'ok';
        return response()->json($data);
    }
}

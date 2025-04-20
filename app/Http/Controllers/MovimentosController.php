<?php
namespace App\Http\Controllers;
use App\Models\Diario;
use App\Models\Exercicios;
use App\Models\Lancamentos;
use App\Models\Movimentos;
use App\Models\PlanoContas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MovimentosController extends Controller
{
    public function index(Request $request)
    {
        $items = Lancamentos::with([
                "exercicio"=> fn($q) => $q->select(["id", "nome"]),
                "diario"=> fn($q) => $q->select(["id", "nome", "codigo"]),
            ])
            ->orderBy('id', 'desc');

        /*
        if ($request->query('q')) {
            $items = $items->where('nome', 'like', '%' . $request->query('q') . '%');
        }
        */

        $items = $items->paginate(20, '*', 'p');
        $items->getCollection()->transform(function(Lancamentos $it) {
            return $it->toApp();
        });

        return inertia('contabilidade/movimentos/index', ['items' => $items]);
    }

    public function create(Request $request)
    {
        $diarios = Diario::get();
        $exercicios = Exercicios::select(["nome", "id"])->get();

        $ex = Exercicios::select(["id"])->where("activo", true)->first();

        return inertia('contabilidade/movimentos/eouc', [
            "diarios"=> $diarios,
            "exercicios"=> $exercicios,
            "ex"=> $ex,
            "mode"=> "add",
        ]);
    }

    public function pesquisar_contas(Request $request)
    {
        $contas = PlanoContas::select(["id", "nome", "codigo"])
            ->where("is_entregadora", false)
            ->limit(14)
            ->where("codigo", "like", "%{$request->query('q')}%")
            ->get();

        $data["estado"] = "ok";
        $data["data"] = $contas;
        return response()->json($data);
    }

    function contas(Request $request)
    {
        $contas = PlanoContas::select(["id", "nome", "codigo", "conta_mae_id", "entregadora_id"])
            ->orderBy("codigo", "asc")
            ->get();

        $data["estado"] = "ok";
        $data["data"] = $contas;
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'exercicio_id' => ['required', Rule::exists("exercicios", "id")],
            'diario_id' => ['required', Rule::exists("diarios", "id")],
            'data_lancamento' => ['required', 'date'],
            'descricao' => ['nullable', 'max:255', 'string'],
            'movimentos' => ['required', 'array', 'min:1'],
            'movimentos.*.conta_id' => ['required', Rule::exists("plano_contas", "codigo")],
            'movimentos.*.debito' => ['nullable', "numeric"],
            'movimentos.*.credito' => ['nullable', "numeric"],
        ],[
            'exercicio_id.required' => 'O exercício é obrigatório',
            'exercicio_id.exists' => 'O exercício não existe',
            'diario_id.required' => 'O diário é obrigatório',
            'diario_id.exists' => 'O diário não existe',
            'data_lancamento.required' => 'A data de lançamento é obrigatória',
            'data_lancamento.date' => 'A data de lançamento é inválida',
            'descricao.max' => 'A descrição é muito longa',
            'descricao.string' => 'A descrição é inválida',
            'movimentos.required' => 'Os movimentos são obrigatórios',
            'movimentos.array' => 'Os movimentos são inválidos',
            'movimentos.min' => 'Por favor adiciona elo menos 1 movimento',
            'movimentos.*.conta_id.required' => 'A conta é obrigatória',
            'movimentos.*.conta_id.exists' => 'A conta não existe',
            'movimentos.*.debito.required' => 'O valor do debito é obrigatório',
            'movimentos.*.credito.required' => 'O valor do credito é obrigatório',
        ]);

        $lancamentos = Lancamentos::select(["codigo"])->orderBy("id", "desc")->first();
        $numero = $lancamentos ? $lancamentos->codigo + 1 : 1;

        $model = new Lancamentos();
        $model->codigo = $numero;
        $model->exercicio_id = $request->exercicio_id;
        $model->descricao = $request->descricao;
        $model->diario_id = $request->diario_id;
        $model->data_lancamento = $request->data_lancamento;
        $model->save();

        $model->syncMovimentos($request->movimentos);

        $data['estado'] = 'ok';
        return response()->json($data);
    }


    public function edit(Request $request, $id)
    {
        /** @var Lancamentos $lancamento */
        $lancamento = Lancamentos::findOrFail($id);

        $movimentos = $lancamento->movimentos()->get()->map(function (Movimentos $c){
            return [
                "id"=> $c->id,
                "conta_id"=> $c->conta_id,
                "debito"=> $c->debito,
                "credito"=> $c->credito,
            ];
        });

        $diarios = Diario::get();
        $exercicios = Exercicios::select(["nome", "id"])->get();

        $ex = Exercicios::select(["id"])->where("activo", true)->first();

        return inertia('contabilidade/movimentos/eouc', [
            "diarios"=> $diarios,
            "exercicios"=> $exercicios,
            "mode"=> "editar",
            "item"=> $lancamento,
            "ex"=> $ex,
            "movimentos"=> $movimentos,
        ]);
    }

    public function update(Request $request, $id)
    {
        $model = Lancamentos::findOrFail($id);

        $request->validate([
            'exercicio_id' => ['required', Rule::exists("exercicios", "id")],
            'diario_id' => ['required', Rule::exists("diarios", "id")],
            'data_lancamento' => ['required', 'date'],
            'descricao' => ['nullable', 'max:255', 'string'],
            'movimentos' => ['required', 'array', 'min:1'],
            'movimentos.*.conta_id' => ['required', Rule::exists("plano_contas", "codigo")],
            'movimentos.*.debito' => ['nullable', "numeric"],
            'movimentos.*.credito' => ['nullable', "numeric"],
        ],[
            'exercicio_id.required' => 'O exercício é obrigatório',
            'exercicio_id.exists' => 'O exercício não existe',
            'diario_id.required' => 'O diário é obrigatório',
            'diario_id.exists' => 'O diário não existe',
            'data_lancamento.required' => 'A data de lançamento é obrigatória',
            'data_lancamento.date' => 'A data de lançamento é inválida',
            'descricao.max' => 'A descrição é muito longa',
            'descricao.string' => 'A descrição é inválida',
            'movimentos.required' => 'Os movimentos são obrigatórios',
            'movimentos.array' => 'Os movimentos são inválidos',
            'movimentos.min' => 'Por favor adiciona elo menos 1 movimento',
            'movimentos.*.conta_id.required' => 'A conta é obrigatória',
            'movimentos.*.conta_id.exists' => 'A conta não existe',
            'movimentos.*.debito.required' => 'O valor do debito é obrigatório',
            'movimentos.*.credito.required' => 'O valor do credito é obrigatório',
        ]);

        $model->exercicio_id = $request->exercicio_id;
        $model->descricao = $request->descricao;
        $model->diario_id = $request->diario_id;
        $model->data_lancamento = $request->data_lancamento;
        $model->save();
        $model->syncMovimentos($request->movimentos);
        $data['estado'] = 'ok';
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $model = new Lancamentos();
        $model->delete();
        $data['estado'] = 'ok';
        return response()->json($data);
    }
}

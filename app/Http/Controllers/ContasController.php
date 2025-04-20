<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Movimentos;
use App\Models\PlanoContas;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContasController extends Controller
{
    public function index(Request $request)
    {
        $items = PlanoContas::with([
                "classe"=> fn($q)=> $q->select(["id", "nome"]),
                //"entregadora"=> fn($q)=> $q->select(["id", "nome"])->cache(),
            ])
            //->where("classe_id", 8)
            ->orderBy("codigo", 'asc');
            //->orderBy(DB::raw('SUBSTRING(codigo, 1, 2)'), 'asc');

        if ($request->query('q')) {
            $items = $items->where(function ($query) use ($request) {
                $query->where('nome', 'like', '%' . $request->query('q') . '%')
                    ->orWhere('codigo', 'like', '%' . $request->query('q') . '%');
            });
        }

        $items = $items->paginate(50, ['*'], 'p');

        $items->getCollection()->transform(function(PlanoContas $it) {
            return $it->toApp();
        });

        return inertia('contabilidade/contas/index', [
            'items' => $items,
            'contas'=> inertia()->lazy(fn()=> PlanoContas::select(["id", "nome", "codigo"])->orderBy("codigo", "asc")->comempresa()->get()),
        ]);
    }

    public static function gerarProximoCodigo(PlanoContas $contaMae): string
    {
        // Busca a última conta filha desta conta mãe
        $ultimaFilha = PlanoContas::where('conta_mae_id', $contaMae->id)
            ->where('codigo', 'like', $contaMae->codigo . '%')
            ->orderBy('codigo', 'desc')
            ->first();
        if (!$ultimaFilha) {
            // Se não existe nenhuma filha, cria a primeira (0001)
            return $contaMae->codigo . '0001';
        }
        // Pega apenas a parte numérica após o código da conta mãe
        $ultimoNumero = substr($ultimaFilha->codigo, strlen($contaMae->codigo));
        // Incrementa em 1 e formata com zeros à esquerda
        $proximoNumero = str_pad((int)$ultimoNumero + 1, 4, '0', STR_PAD_LEFT);
        return $contaMae->codigo . $proximoNumero;
    }

    public function store(Request $request, $slug)
    {
        $request->validate([
            'nome' => ['required', 'max:255', 'string'],
            'int_id' => ['required', Rule::exists("logigate.plano_contas", "id")->whereNull("empresa_id")],
        ],[
            'nome.required'=> 'O nome é obrigatório',
            'nome.max'=> 'O nome não pode ter mais de 255 caracteres',
            'nome.string'=> 'O nome tem de ser uma string',
            'int_id.required' => 'A conta integradora é obrigatória',
            'int_id.exists' => 'A conta integradora não existe',
        ]);

        /** @var PlanoContas $contaMae $contaMae */
        $contaMae = PlanoContas::findOrFail($request->int_id);

        try {
            DB::beginTransaction();

            // Gera o próximo código disponível
            $novoCodigo = self::gerarProximoCodigo($contaMae);

            // Verifica se não existe nenhuma conta com este código
            if (PlanoContas::where('codigo', $novoCodigo)->exists()) {
                throw new Exception('Código de conta já existe: ' . $novoCodigo);
            }

            $model = new PlanoContas();
            $model->codigo = $novoCodigo;
            $model->classe_id = $contaMae->classe_id;
            $model->nome = $request->nome;
            $model->ref_id = $contaMae->id;
            $model->conta_mae_id = $contaMae->id;
            $model->entregadora_id = $contaMae->entregadora_id;
            $model->titulo_id = $contaMae->titulo_id;
            $model->tipo = PlanoContas::TIPO_MOVIMENTO;
            $model->save();

            DB::commit();

            $data['payload'] = $model->toApp();
            $data['estado'] = 'ok';
            return response()->json($data);

        } catch (Exception $e) {
            DB::rollBack();
            $data['estado'] = 'erro';
            $data['mensagem'] = 'Erro ao criar conta: ' . $e->getMessage();
            return response()->json($data, 422);
        }
    }

    public function update(Request $request, $slug, $id)
    {
        $model = PlanoContas::findOrFail($id);

        $request->validate([
            'nome' => ['required', 'max:255', 'string'],
        ],[
            'nome.required'=> 'O nome é obrigatório',
            'nome.max'=> 'O nome não pode ter mais de 255 caracteres',
            'nome.string'=> 'O nome tem de ser uma string',
        ]);

        $model->nome = $request->nome;
        $model->save();

        $data['payload'] = $model->toApp();
        $data['estado'] = 'ok';
        return response()->json($data);
    }

    public function destroy(Request $request, $slug, $id)
    {
        $model = PlanoContas::findOrFail($id);
        $exists = Movimentos::where("conta_id", $model->codigo)->exists();
        if($exists){
            $data["estado"] = "erro";
            $data["texto"] = "Não é possível eliminar esta conta uma vez que já foi usada para registar movimentos";
            return response()->json($data, 400);
        }
        $model->delete();
        $data['estado'] = 'ok';
        return response()->json($data);
    }
}

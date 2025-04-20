<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lancamentos extends Model
{
    protected $guarded = false;

    public function diario(): Diario|BelongsTo{
        return $this->belongsTo(Diario::class, "diario_id");
    }

    public function exercicio(): Exercicios|BelongsTo{
        return $this->belongsTo(Exercicios::class, "exercicio_id");
    }

    public function movimentos(): Movimentos|HasMany{
        return $this->hasMany(Movimentos::class, "lancamento_id");
    }

    public function objecto(){
        return $this->morphTo();
    }

    function syncMovimentos($movimentos) {
        $existingMovements = $this->movimentos()->pluck('id')->toArray();
        $updatedMovements = [];
        foreach ($movimentos as $movimento) {
            if (isset($movimento['id']) && in_array($movimento['id'], $existingMovements)) {
                $this->movimentos()->where('id', $movimento['id'])->update([
                    "conta_id" => $movimento["conta_id"],
                    "debito" => $movimento["debito"] ?? null,
                    "credito" => $movimento["credito"] ?? null,
                    "exercicio_id" => $this->exercicio_id,
                    "tipo_cambio" => 0,
                ]);
                $updatedMovements[] = $movimento['id'];
            } else {
                $newMovimento = $this->movimentos()->create([
                    "conta_id" => $movimento["conta_id"],
                    "debito" => $movimento["debito"] ?? null,
                    "credito" => $movimento["credito"] ?? null,
                    "exercicio_id" => $this->exercicio_id,
                    "tipo_cambio" => 0,
                    "lancamento_id"=> $this->id,
                    //"empresa_id"=> $this->empresa_id,
                ]);
                $updatedMovements[] = $newMovimento->id;
            }
        }
        $this->movimentos()->whereNotIn('id', $updatedMovements)->delete();
    }

    function formataCodigo(){
        return str_pad($this->codigo, 6, "0", STR_PAD_LEFT);
    }

    public function toApp(): array{
        $data = $this->toArray();
        $data["codigo_formatado"] = $this->formataCodigo();
        $data["diario"] = $this->diario?->toApp();
        $data["tipo_documento"] = $this->tipo_documento?->toApp();
        $data["exercicio"] = $this->exercicio?->toApp();
        return $data;
    }
}

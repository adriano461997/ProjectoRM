<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanoContas extends Model
{
    protected $guarded = false;

    const TIPO_ENTREGADORA = 0;
    const TIPO_TITULO = 1;
    const TIPO_MOVIMENTO = 2;

    function entregadora(): BelongsTo|PlanoContas{
        return $this->belongsTo(PlanoContas::class, "entregadora_id");
    }

    function classe(): BelongsTo|Classes{
        return $this->belongsTo(Classes::class, "classe_id");
    }

    function ref(): BelongsTo|PlanoContas
    {
        return $this->belongsTo(PlanoContas::class, "ref_id");
    }

    function toApp(): array{
        $data = $this->toArray();
        $data["classe"] = $this->classe;
        return $data;
    }
}

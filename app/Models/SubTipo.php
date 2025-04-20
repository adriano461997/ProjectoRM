<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubTipo extends Model
{
    protected $table = 'subtipos';

    protected $fillable = [
        'nome',
        'tipo_id'
    ];

    public function tipo_receita(): TipoReceita|BelongsTo
    {
        return $this->belongsTo(TipoReceita::class, "tipo_id");
    }

    function topApp(){
        $data = $this->toArray();
        return $data;
    }
}

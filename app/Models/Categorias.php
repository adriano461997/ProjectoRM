<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorias extends Model
{
    protected $guarded = false;

    function tipo_receita(): TipoReceita|BelongsTo{
        return $this->belongsTo(TipoReceita::class, 'tipo_receita_id');
    }

    function items(): Items|HasMany{
        return $this->hasMany(Items::class, "categorias_id");
    }

    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Movimentos extends Model
{
    protected $guarded = false;

    function lancamento(): BelongsTo|Lancamentos{
        return $this->belongsTo(Lancamentos::class, "lancamento_id");
    }

    function calculaSaldo(){
        $saldo = 0;
        $saldo += $this->debito;
        $saldo -= $this->credito;
        return $saldo;
    }

    function toApp(): array
    {
        $data = $this->toArray();
        return $data;
    }
}

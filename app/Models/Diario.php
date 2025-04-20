<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class Diario extends Model
{
    protected $guarded = false;

    function nomeFormatado(){
        return $this->codigo . " - " . $this->nome;
    }

    function toApp(): array
    {
        $data = $this->toArray();
        $data["nome"] = $this->nomeFormatado();
        return $data;
    }
}

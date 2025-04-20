<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Exercicios extends Model
{
    protected $guarded = false;

    protected $casts = [
        "data_inicio"=> "date",
        "data_fim"=> "date",
    ];

    function toApp(): array
    {
        $data = $this->toArray();
        return $data;
    }
}

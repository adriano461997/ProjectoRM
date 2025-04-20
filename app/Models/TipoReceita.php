<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoReceita extends Model
{
    protected $guarded = false;
    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

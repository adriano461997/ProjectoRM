<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permissoes extends Model
{
    protected $guarded = false;
    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

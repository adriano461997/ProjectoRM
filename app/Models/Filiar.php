<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiar extends Model
{
    protected $guarded = false;
    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

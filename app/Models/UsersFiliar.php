<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsersFiliar extends Model
{
    protected $guarded = false;

    function filiar(): BelongsTo|Filiar{
        return $this->belongsTo(Filiar::class, "filiar_id");
    }

    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Items extends Model
{
    protected $guarded = false;

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
    ];

    public function categorias(): BelongsTo
    {
        return $this->belongsTo(Categorias::class, "categorias_id");
    }

    function toApp(){
        $data = $this->toArray();
        return $data;
    }
}

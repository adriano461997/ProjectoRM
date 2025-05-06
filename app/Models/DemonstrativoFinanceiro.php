<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemonstrativoFinanceiro extends Model
{
    protected $guarded = false;

    public function subcategoria(): BelongsTo
    {
        return $this->belongsTo(Subcategorias::class, 'subcategoria_id');
    }

    public function filiar(): BelongsTo
    {
        return $this->belongsTo(Filiar::class);
    }

    protected function casts(): array
    {
        return [
            'data' => 'date',
        ];
    }
}

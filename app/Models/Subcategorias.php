<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subcategorias extends Model
{
    use HasFactory;
    
    protected $guarded = false;
    
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categorias::class, 'categoria_id');
    }
    
    public function toApp()
    {
        $data = $this->toArray();
        return $data;
    }
}

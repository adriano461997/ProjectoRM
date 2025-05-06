<?php
namespace Database\Factories;

use App\Models\Subcategorias;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubcategoriasFactory extends Factory
{
    protected $model = Subcategorias::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->unique()->word(),
            'categoria_id' => null, // será atribuído no seeder
            // Adicione outros campos necessários conforme o seu schema
        ];
    }
}

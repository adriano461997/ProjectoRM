<?php
namespace Database\Factories;

use App\Models\Categorias;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriasFactory extends Factory
{
    protected $model = Categorias::class;

    public function definition()
    {
        return [
            'nome' => $this->faker->unique()->word(),
            'slug' => $this->faker->unique()->slug(),
            // Adicione outros campos necessários conforme o seu schema
        ];
    }
}

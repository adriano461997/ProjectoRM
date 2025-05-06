<?php
namespace Database\Factories;

use App\Models\DemonstrativoFinanceiro;
use Illuminate\Database\Eloquent\Factories\Factory;

class DemonstrativoFinanceiroFactory extends Factory
{
    protected $model = DemonstrativoFinanceiro::class;

    public function definition()
    {
        return [
            'subcategoria_id' => null, // será definido no seeder
            'valor' => $this->faker->randomFloat(2, 10, 1000),
            'data' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'filiar_id' => 1, // pode ser ajustado conforme seed de filiais
        ];
    }
}

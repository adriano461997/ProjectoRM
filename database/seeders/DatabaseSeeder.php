<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\Categorias;
use App\Models\Subcategorias;
use App\Models\DemonstrativoFinanceiro;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // REMOVIDO: BLOCO DE FACTORY AUTOMÁTICO DE CATEGORIAS E SUBCATEGORIAS
        // Categorias::factory()
        //     ->count(20)
        //     ->create()
        //     ->each(function ($categoria) {
        //         Subcategorias::factory()
        //             ->count(25)
        //             ->create([
        //                 'categoria_id' => $categoria->id,
        //             ]);
        //     });
        // DADOS FIXOS DE CATEGORIAS E SUBCATEGORIAS

        $categorias = [
            [
                'nome' => 'RECEITA',
                'slug' => 'receita',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Vendas brutas',
                    'Menos retornos e descontos de vendas',
                ],
            ],
            [
                'nome' => 'CUSTO DAS VENDAS',
                'slug' => 'custo-das-vendas',
                'tipo_receita_id' => 2,
                'subcategorias' => [
                    'Início do inventário',
                    'Mais mercadorias adquiridas ou fabricadas',
                    'Total de mercadorias disponíveis',
                    'Menos inventário final',
                ],
            ],
            [
                'nome' => 'DESPESAS OPERACIONAIS - VENDAS',
                'slug' => 'despesas-operacionais-vendas',
                'tipo_receita_id' => 2,
                'subcategorias' => [
                    'Salários e remunerações',
                    'Comissões',
                    'Publicidade',
                    'Depreciação',
                    'Outros (por exemplo, taxas profissionais)',
                ],
            ],
            [
                'nome' => 'GERAL E ADMINISTRAÇÃO',
                'slug' => 'geral-e-administracao',
                'tipo_receita_id' => 2,
                'subcategorias' => [
                    'Salários e remunerações',
                    'Benefícios aos funcionários',
                    'Impostos sobre a folha de pagamento',
                    'Seguros',
                    'Aluguer',
                    'Serviços básicos',
                    'Depreciação e amortização',
                    'Itens de escritório',
                    'Viagens e entretenimento',
                    'Comissões',
                    'Manutenção e aluguel de equipamentos',
                    'Juros',
                    'Móveis e equipamentos',
                ],
            ],
            [
                'nome' => 'DESPESAS OPERACIONAIS TOTAIS',
                'slug' => 'despesas-operacionais-totais',
                'tipo_receita_id' => 2,
                'subcategorias' => [],
            ],
            [
                'nome' => 'RENDA LÍQUIDA ANTES DOS IMPOSTOS',
                'slug' => 'renda-liquida-antes-impostos',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Imposto sobre a renda',
                ],
            ],
            [
                'nome' => 'RENDA LÍQUIDA APÓS OS IMPOSTOS',
                'slug' => 'renda-liquida-apos-impostos',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Ganho ou perda extraordinária',
                    'Imposto de renda sobre ganho extraordinário',
                ],
            ],
            [
                'nome' => 'LUCRO LÍQUIDO (PERDA)',
                'slug' => 'lucro-liquido-perda',
                'tipo_receita_id' => 1,
                'subcategorias' => [],
            ],
        ];

        $faker = Faker::create(); // Aqui está o faker corretamente criado

        // Array adicional com as categorias do Balanço Patrimonial
        $categorias_balanco = [
            [
                'nome' => 'ATIVOS',
                'slug' => 'ativos',
                'tipo_receita_id' => 1,
                'subcategorias' => [],
            ],
            [
                'nome' => 'ATIVOS CIRCULANTES',
                'slug' => 'ativos-circulantes',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Caixa',
                    'Contas a receber',
                    'Estoque',
                    'Pagamentos antecipados',
                ],
            ],
            [
                'nome' => 'ATIVOS FIXOS (LONGO PRAZO)',
                'slug' => 'ativos-fixos-longo-prazo',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Terrenos e edifícios',
                    'Veículos, instalações e equipamentos',
                    'Móveis e equipamentos de escritório',
                    'Ativos intangíveis',
                ],
            ],
            [
                'nome' => 'OUTROS ATIVOS',
                'slug' => 'outros-ativos',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Investimentos de longo prazo',
                ],
            ],
            [
                'nome' => 'PASSIVOS E PATRIMÔNIO LÍQUIDO',
                'slug' => 'passivos-patrimonio-liquido',
                'tipo_receita_id' => 2,
                'subcategorias' => [],
            ],
            [
                'nome' => 'PASSIVOS CIRCULANTES',
                'slug' => 'passivos-circulantes',
                'tipo_receita_id' => 2,
                'subcategorias' => [
                    'Contas a pagar',
                    'Empréstimos de curto prazo',
                    'Imposto sobre vendas',
                    'Salários e remunerações acumulados',
                    'Receitas não obtidas',
                    'Empréstimos de longo prazo atual',
                ],
            ],
            [
                'nome' => 'PASSIVOS DE LONGO PRAZO',
                'slug' => 'passivos-longo-prazo',
                'tipo_receita_id' => 2,
                'subcategorias' => [
                    'Crédito de longo prazo',
                    'Crédito de vendas diferido',
                ],
            ],
            [
                'nome' => 'PATRIMÔNIO LÍQUIDO',
                'slug' => 'patrimonio-liquido',
                'tipo_receita_id' => 1,
                'subcategorias' => [
                    'Investimento do proprietário',
                    'Capital social',
                    'Lucros retidos',
                ],
            ],
        ];

        // Processamento do array original de categorias
        foreach ($categorias as $cat) {
            
            $categoria = Categorias::create([
                'nome' => $cat['nome'],
                'slug' => $cat['slug'],
                'tipo_receita_id' => $cat['tipo_receita_id'],
            
            ]);

            foreach ($cat['subcategorias'] as $sub) {
                $subcategoria = Subcategorias::create([
                    'nome' => $sub,
                    'categoria_id' => $categoria->id,
                    "conta"=> $faker->numberBetween(1000, 9999),
                    "tipo"=> $cat['tipo_receita_id'],
                ]);

                // Adiciona 2 lançamentos para cada subcategoria
                for ($i = 0; $i < 10; $i++) {
                    DemonstrativoFinanceiro::create([
                        'subcategoria_id' => $subcategoria->id,
                        'valor' => $faker->randomFloat(2, 10, 1000),
                        'data' => $faker->dateTimeBetween('-2 years', 'now'),
                        'filiar_id' => 1,
                    ]);
                }
            }

        }

        // Processamento do array de categorias do Balanço Patrimonial
        foreach ($categorias_balanco as $cat) {
            
            $categoria = Categorias::create([
                'nome' => $cat['nome'],
                'slug' => $cat['slug'],
                'tipo_receita_id' => $cat['tipo_receita_id'],
            
            ]);

            foreach ($cat['subcategorias'] as $sub) {
                
                $subcategoria = Subcategorias::create([
                    'nome' => $sub,
                    'categoria_id' => $categoria->id,
                    "conta"=> $faker->numberBetween(1000, 9999),
                    "tipo"=> $cat['tipo_receita_id'],
                ]);

                // Adiciona 2 lançamentos para cada subcategoria
                for ($i = 0; $i < 10; $i++) {
                    DemonstrativoFinanceiro::create([
                        'subcategoria_id' => $subcategoria->id,
                        'valor' => $faker->randomFloat(2, 10, 1000),
                        'data' => $faker->dateTimeBetween('-2 years', 'now'),
                        'filiar_id' => 1,
                    ]);
                }
            }

        }
    }
}

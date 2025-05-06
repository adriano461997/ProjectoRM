<?php

namespace App\Services\Reports;

use App\Models\Categorias;
use App\Models\Subcategorias;
use App\Models\DemonstrativoFinanceiro;
use App\Models\Filiar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DemonstracaoResultadosReportHandler implements ReportHandlerInterface
{
    /**
     * Gera os dados para o relatório
     *
     * @param int|null $empresaId
     * @param string $dataInicio
     * @param string $dataFim
     * @return array
     */
    public function generateReportData(?int $empresaId, string $dataInicio, string $dataFim): array
    {
        // Converter strings de data para objetos Carbon
        $startDate = Carbon::parse($dataInicio)->startOfDay();
        $endDate = Carbon::parse($dataFim)->endOfDay();
        
        // Obter anos no intervalo
        $years = [];
        $current = Carbon::parse($dataInicio)->startOfYear();
        $end = Carbon::parse($dataFim)->startOfYear();
        
        while ($current->lte($end)) {
            $years[] = $current->year;
            $current->addYear();
        }
        
        // Query base para filtrar os lançamentos financeiros
        $query = DemonstrativoFinanceiro::whereBetween('data', [$startDate, $endDate]);
        
        // Adicionar filtro de empresa se especificado
        if ($empresaId) {
            $query->where('filiar_id', $empresaId);
        }
        
        // Obter todos os lançamentos dentro do período e filial
        $lancamentos = $query->get();
        
        // Mapear subcategorias por ID para facilitar o acesso
        $subcategoriaIds = [
            'vendas_brutas' => 1, // ID da subcategoria "Vendas brutas"
            'menos_retornos' => 2, // ID da subcategoria "Menos retornos e descontos de vendas"
            'inicio_inventario' => 3, // ID da subcategoria "Início do inventário"
            'mais_mercadorias' => 4, // ID da subcategoria "Mais mercadorias adquiridas ou fabricadas"
            'mercadorias_disponiveis' => 5, // ID da subcategoria "Total de mercadorias disponíveis"
            'menos_inventario_final' => 6, // ID da subcategoria "Menos inventário final"
        ];
        
        // Mapear categorias por ID para facilitar o acesso
        $categoriaIds = [
            'receita' => 1, // ID da categoria "RECEITA"
            'custo_vendas' => 2, // ID da categoria "CUSTO DAS VENDAS"
            'despesas_operacionais_vendas' => 3, // ID da categoria "DESPESAS OPERACIONAIS - VENDAS"
            'geral_administracao' => 4, // ID da categoria "GERAL E ADMINISTRAÇÃO"
            'despesas_operacionais_totais' => 5, // ID da categoria "DESPESAS OPERACIONAIS TOTAIS"
            'renda_liquida_antes_impostos' => 6, // ID da categoria "RENDA LÍQUIDA ANTES DOS IMPOSTOS"
            'renda_liquida_apos_impostos' => 7, // ID da categoria "RENDA LÍQUIDA APÓS OS IMPOSTOS"
            'lucro_liquido_perda' => 8, // ID da categoria "LUCRO LÍQUIDO (PERDA)"
        ];
        
        // Inicializar estrutura de dados detalhados
        $detailedData = [];
        
        // 1. Inicializar todos os valores a zero para cada ano
        foreach ($years as $year) {
            // Receita
            $detailedData['vendas_brutas'][$year] = 0;
            $detailedData['menos_retornos'][$year] = 0;
            $detailedData['vendas_liquidas'][$year] = 0;
            
            // Custo das Vendas
            $detailedData['inicio_inventario'][$year] = 0;
            $detailedData['mais_mercadorias'][$year] = 0;
            $detailedData['total_mercadorias_disponiveis'][$year] = 0;
            $detailedData['menos_inventario_final'][$year] = 0;
            $detailedData['custo_total_mercadorias'][$year] = 0;
            $detailedData['lucro_bruto'][$year] = 0;
            
            // Despesas Operacionais - Vendas
            $detailedData['despesas_totais_vendas'][$year] = 0;
            
            // Geral e Administração
            $detailedData['despesas_gerais_totais_admin'][$year] = 0;
            
            // Totais e Lucros
            $detailedData['despesas_operacionais_totais'][$year] = 0;
            $detailedData['renda_liquida_antes_impostos'][$year] = 0;
            $detailedData['imposto_renda'][$year] = 0;
            $detailedData['renda_liquida_apos_impostos'][$year] = 0;
            $detailedData['ganho_perda_extraordinaria'][$year] = 0;
            $detailedData['imposto_ganho_extraordinario'][$year] = 0;
            $detailedData['lucro_liquido'][$year] = 0;
        }
        
        // 2. Processar dados de subcategorias específicas
        foreach ($years as $year) {
            $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
            $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
            
            // Ajustar ao período do relatório
            if ($yearStart->lt($startDate)) {
                $yearStart = $startDate;
            }
            if ($yearEnd->gt($endDate)) {
                $yearEnd = $endDate;
            }
            
            // Processar valores para subcategorias específicas
            foreach ($subcategoriaIds as $key => $subcategoriaId) {
                $valor = $lancamentos
                    ->where('subcategoria_id', $subcategoriaId)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $detailedData[$key][$year] = $valor;
            }
        }
        
        // 3. Processar subcategorias das categorias Despesas Operacionais - Vendas e Geral e Administração
        $detailedData['despesas_operacionais_vendas'] = [];
        $detailedData['geral_administracao'] = [];
        
        // Obter subcategorias de Despesas Operacionais - Vendas
        $despesasOperacionais = Subcategorias::where('categoria_id', $categoriaIds['despesas_operacionais_vendas'])->get();
        foreach ($despesasOperacionais as $subcategoria) {
            $valores = [];
            foreach ($years as $year) {
                $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
                
                // Ajustar ao período do relatório
                if ($yearStart->lt($startDate)) {
                    $yearStart = $startDate;
                }
                if ($yearEnd->gt($endDate)) {
                    $yearEnd = $endDate;
                }
                
                $valor = $lancamentos
                    ->where('subcategoria_id', $subcategoria->id)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $valores[$year] = $valor;
                $detailedData['despesas_totais_vendas'][$year] += $valor;
            }
            
            $detailedData['despesas_operacionais_vendas'][] = [
                'id' => $subcategoria->id,
                'nome' => $subcategoria->nome,
                'valores' => $valores
            ];
        }
        
        // Obter subcategorias de Geral e Administração
        $geralAdmin = Subcategorias::where('categoria_id', $categoriaIds['geral_administracao'])->get();
        foreach ($geralAdmin as $subcategoria) {
            $valores = [];
            foreach ($years as $year) {
                $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
                
                // Ajustar ao período do relatório
                if ($yearStart->lt($startDate)) {
                    $yearStart = $startDate;
                }
                if ($yearEnd->gt($endDate)) {
                    $yearEnd = $endDate;
                }
                
                $valor = $lancamentos
                    ->where('subcategoria_id', $subcategoria->id)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $valores[$year] = $valor;
                $detailedData['despesas_gerais_totais_admin'][$year] += $valor;
            }
            
            $detailedData['geral_administracao'][] = [
                'id' => $subcategoria->id,
                'nome' => $subcategoria->nome,
                'valores' => $valores
            ];
        }
        
        // 4. Obter subcategorias de outras categorias
        $imposto_renda = Subcategorias::where('categoria_id', $categoriaIds['renda_liquida_antes_impostos'])->first();
        $ganhoPerda = Subcategorias::where('categoria_id', $categoriaIds['renda_liquida_apos_impostos'])->where('nome', 'like', '%Ganho ou perda extraordinária%')->first();
        $impostoGanho = Subcategorias::where('categoria_id', $categoriaIds['renda_liquida_apos_impostos'])->where('nome', 'like', '%Imposto de renda sobre ganho extraordinário%')->first();
        
        if ($imposto_renda) {
            foreach ($years as $year) {
                $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
                
                // Ajustar ao período do relatório
                if ($yearStart->lt($startDate)) {
                    $yearStart = $startDate;
                }
                if ($yearEnd->gt($endDate)) {
                    $yearEnd = $endDate;
                }
                
                $valor = $lancamentos
                    ->where('subcategoria_id', $imposto_renda->id)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $detailedData['imposto_renda'][$year] = $valor;
            }
        }
        
        if ($ganhoPerda) {
            foreach ($years as $year) {
                $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
                
                // Ajustar ao período do relatório
                if ($yearStart->lt($startDate)) {
                    $yearStart = $startDate;
                }
                if ($yearEnd->gt($endDate)) {
                    $yearEnd = $endDate;
                }
                
                $valor = $lancamentos
                    ->where('subcategoria_id', $ganhoPerda->id)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $detailedData['ganho_perda_extraordinaria'][$year] = $valor;
            }
        }
        
        if ($impostoGanho) {
            foreach ($years as $year) {
                $yearStart = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfDay();
                
                // Ajustar ao período do relatório
                if ($yearStart->lt($startDate)) {
                    $yearStart = $startDate;
                }
                if ($yearEnd->gt($endDate)) {
                    $yearEnd = $endDate;
                }
                
                $valor = $lancamentos
                    ->where('subcategoria_id', $impostoGanho->id)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $detailedData['imposto_ganho_extraordinario'][$year] = $valor;
            }
        }
        
        // 5. Calcular valores derivados (como na imagem do relatório)
        foreach ($years as $year) {
            // VENDAS LÍQUIDAS = Vendas brutas - Menos retornos e descontos de vendas
            $detailedData['vendas_liquidas'][$year] = $detailedData['vendas_brutas'][$year] - $detailedData['menos_retornos'][$year];
            
            // TOTAL DE MERCADORIAS DISPONÍVEIS = Início do inventário + Mais mercadorias adquiridas ou fabricadas
            $detailedData['total_mercadorias_disponiveis'][$year] = $detailedData['inicio_inventario'][$year] + $detailedData['mais_mercadorias'][$year];
            
            // CUSTO TOTAL DAS MERCADORIAS VENDIDAS (CMV) = Total de mercadorias disponíveis - Menos inventário final
            $detailedData['custo_total_mercadorias'][$year] = $detailedData['total_mercadorias_disponiveis'][$year] - $detailedData['menos_inventario_final'][$year];
            
            // LUCRO BRUTO (PERDA) = VENDAS LÍQUIDAS - CUSTO TOTAL DAS MERCADORIAS VENDIDAS
            $detailedData['lucro_bruto'][$year] = $detailedData['vendas_liquidas'][$year] - $detailedData['custo_total_mercadorias'][$year];
            
            // DESPESAS OPERACIONAIS TOTAIS = DESPESAS TOTAIS DE VENDAS + DESPESAS GERAIS TOTAIS DE ADMINISTRAÇÃO
            $detailedData['despesas_operacionais_totais'][$year] = $detailedData['despesas_totais_vendas'][$year] + $detailedData['despesas_gerais_totais_admin'][$year];
            
            // RENDA LÍQUIDA ANTES DOS IMPOSTOS = LUCRO BRUTO - DESPESAS OPERACIONAIS TOTAIS
            $detailedData['renda_liquida_antes_impostos'][$year] = $detailedData['lucro_bruto'][$year] - $detailedData['despesas_operacionais_totais'][$year];
            
            // RENDA LÍQUIDA APÓS OS IMPOSTOS = RENDA LÍQUIDA ANTES DOS IMPOSTOS - Imposto sobre a renda
            $detailedData['renda_liquida_apos_impostos'][$year] = $detailedData['renda_liquida_antes_impostos'][$year] - $detailedData['imposto_renda'][$year];
            
            // LUCRO LÍQUIDO (PERDA) = RENDA LÍQUIDA APÓS OS IMPOSTOS + Ganho ou perda extraordinária - Imposto de renda sobre ganho extraordinário
            $detailedData['lucro_liquido'][$year] = 
                $detailedData['renda_liquida_apos_impostos'][$year] + 
                $detailedData['ganho_perda_extraordinaria'][$year] - 
                $detailedData['imposto_ganho_extraordinario'][$year];
        }
        
        // Montar estrutura de dados para o relatório
        return [
            'dataInicio' => $startDate->format('Y-m-d'),
            'dataFim' => $endDate->format('Y-m-d'),
            'years' => $years,
            'detailedData' => $detailedData
        ];
    }
    
    /**
     * Gera o PDF do relatório
     *
     * @param Request $request
     * @return mixed
     */
    public function generatePdf(Request $request)
    {
        $empresaId = $request->input('empresa_id');
        $dataInicio = $request->input('data_inicio');
        $dataFim = $request->input('data_fim');
        
        // Buscar dados para o PDF
        $reportData = $this->generateReportData($empresaId, $dataInicio, $dataFim);
        
        // Nome da empresa para o título
        if ($empresaId) {
            $empresa = Filiar::find($empresaId);
            $reportData['empresa'] = $empresa ? $empresa->nome : 'Todas as Empresas';
        } else {
            $reportData['empresa'] = 'Todas as Empresas';
        }
        
        // Gerar o PDF
        $pdf = PDF::loadView($this->getPdfView(), [
            'reportData' => $reportData
        ]);
        
        // Retornar o PDF como stream para visualização no navegador
        return $pdf->stream($this->getPdfFilename($dataInicio, $dataFim));
    }
    
    /**
     * Retorna o nome da view para renderizar o PDF
     *
     * @return string
     */
    public function getPdfView(): string
    {
        return 'pdf.demonstracao-resultados';
    }
    
    /**
     * Retorna o nome do arquivo PDF
     *
     * @param string $dataInicio
     * @param string $dataFim
     * @return string
     */
    public function getPdfFilename(string $dataInicio, string $dataFim): string
    {
        return "demonstracao_resultados_{$dataInicio}_{$dataFim}.pdf";
    }
}

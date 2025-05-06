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

class DeclaracaoRendimentosReportHandler implements ReportHandlerInterface
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
        ];
        
        // Mapear categorias por ID para facilitar o acesso
        $categoriaIds = [
            'receita' => 1, // ID da categoria "RECEITA"
            'custos_despesas' => 2, // ID da categoria "CUSTOS E DESPESAS"
            'outras_receitas_despesas' => 3, // ID da categoria "OUTRAS RECEITAS E DESPESAS"
        ];
        
        // Inicializar estrutura de dados detalhados
        $detailedData = [];
        
        // 1. Inicializar todos os valores a zero para cada ano
        foreach ($years as $year) {
            // Receita
            $detailedData['vendas_brutas'][$year] = 0;
            $detailedData['menos_retornos'][$year] = 0;
            $detailedData['vendas_liquidas'][$year] = 0;
            
            // Custos e Despesas
            $detailedData['total_custos_despesas'][$year] = 0;
            
            // Resultado Operacional
            $detailedData['resultado_operacional'][$year] = 0;
            
            // Outras Receitas e Despesas
            $detailedData['total_outras_receitas_despesas'][$year] = 0;
            
            // Resultado Final
            $detailedData['lucro_liquido'][$year] = 0;
        }
        
        // 2. Processar dados de subcategorias específicas da RECEITA
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
            
            // Processar valores para subcategorias específicas de RECEITA
            foreach ($subcategoriaIds as $key => $subcategoriaId) {
                $valor = $lancamentos
                    ->where('subcategoria_id', $subcategoriaId)
                    ->whereBetween('data', [$yearStart, $yearEnd])
                    ->sum('valor');
                
                $detailedData[$key][$year] = $valor;
            }
        }
        
        // 3. Processar subcategorias de CUSTOS E DESPESAS
        $detailedData['custos_despesas'] = [];
        
        // Obter subcategorias de CUSTOS E DESPESAS
        $custosDespesas = Subcategorias::where('categoria_id', $categoriaIds['custos_despesas'])->get();
        foreach ($custosDespesas as $subcategoria) {
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
                $detailedData['total_custos_despesas'][$year] += $valor;
            }
            
            $detailedData['custos_despesas'][] = [
                'id' => $subcategoria->id,
                'nome' => $subcategoria->nome,
                'valores' => $valores
            ];
        }
        
        // 4. Processar subcategorias de OUTRAS RECEITAS E DESPESAS
        $detailedData['outras_receitas_despesas'] = [];
        
        // Obter subcategorias de OUTRAS RECEITAS E DESPESAS
        $outrasReceitasDespesas = Subcategorias::where('categoria_id', $categoriaIds['outras_receitas_despesas'])->get();
        foreach ($outrasReceitasDespesas as $subcategoria) {
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
                $detailedData['total_outras_receitas_despesas'][$year] += $valor;
            }
            
            $detailedData['outras_receitas_despesas'][] = [
                'id' => $subcategoria->id,
                'nome' => $subcategoria->nome,
                'valores' => $valores
            ];
        }
        
        // 5. Calcular valores derivados
        foreach ($years as $year) {
            // VENDAS LÍQUIDAS = Vendas brutas - Menos retornos e descontos de vendas
            $detailedData['vendas_liquidas'][$year] = $detailedData['vendas_brutas'][$year] - $detailedData['menos_retornos'][$year];
            
            // RESULTADO OPERACIONAL = VENDAS LÍQUIDAS - TOTAL CUSTOS E DESPESAS
            $detailedData['resultado_operacional'][$year] = $detailedData['vendas_liquidas'][$year] - $detailedData['total_custos_despesas'][$year];
            
            // LUCRO LÍQUIDO DO PERÍODO = RESULTADO OPERACIONAL + TOTAL OUTRAS RECEITAS E DESPESAS
            $detailedData['lucro_liquido'][$year] = $detailedData['resultado_operacional'][$year] + $detailedData['total_outras_receitas_despesas'][$year];
        }
        
        // Se temos empresa, obter seu nome
        $empresa = null;
        if ($empresaId) {
            $empresa = Filial::find($empresaId);
        }
        
        // Montar estrutura de dados para o relatório
        return [
            'dataInicio' => $startDate->format('Y-m-d'),
            'dataFim' => $endDate->format('Y-m-d'),
            'empresa' => $empresa ? $empresa->nome : null,
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
        return 'pdf.declaracao-rendimentos';
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
        return "declaracao_rendimentos_{$dataInicio}_{$dataFim}.pdf";
    }
}

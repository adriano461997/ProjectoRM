<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\DemonstrativoFinanceiro;
use App\Models\Categorias;
use App\Models\Subcategorias;
use App\Models\Filiar;

class DemonstrativoFinanceiroReportController extends Controller
{
    /**
     * Exibe a página do relatório de demonstração financeira
     */
    public function index(Request $request)
    {
        // Obter filiais para o filtro
        $filiares = Filiar::all();
        
        // Obtém o ano atual ou o ano selecionado
        $year = $request->input('year', Carbon::now()->year);
        
        // Obtém a filial selecionada (se houver)
        $filiarId = $request->input('filiar_id');
        
        // Buscar dados básicos para exibição inicial (sem filtros detalhados)
        $reportData = $this->generateReportData($year, $filiarId);
        
        // Obter anos disponíveis (para o select de anos)
        $availableYears = $this->getAvailableYears();
        
        // Obter filial atual se selecionada
        $currentFiliar = null;
        if ($filiarId && $filiarId != 'all') {
            $currentFiliar = Filiar::find($filiarId);
        }
        
        return Inertia::render('demonstrativo-financeiro/report', [
            'reportData' => $reportData,
            'filiares' => $filiares,
            'year' => $year,
            'availableYears' => $availableYears,
            'filiarId' => $filiarId,
            'currentFiliar' => $currentFiliar
        ]);
    }
    
    /**
     * Gera o PDF do relatório
     */
    public function generatePdf(Request $request)
    {
        // Obtém o ano selecionado
        $year = $request->input('year', Carbon::now()->year);
        
        // Obtém a filial selecionada (se houver)
        $filiarId = $request->input('filiar_id');
        
        // Buscar dados para o PDF
        $reportData = $this->generateReportData($year, $filiarId);
        
        // Nome da filial para o título
        if ($filiarId && $filiarId != 'all') {
            $filiar = Filiar::find($filiarId);
            $reportData['filiar'] = $filiar ? $filiar->nome : 'Todas as Filiais';
        } else {
            $reportData['filiar'] = 'Todas as Filiais';
        }
        
        // Gerar o PDF
        $pdf = PDF::loadView('pdf.demonstrativo-financeiro', [
            'reportData' => $reportData,
            'year' => $year
        ]);
        
        // Retornar o PDF como stream para visualização no navegador
        return $pdf->stream('demonstrativo_financeiro_' . $year . '.pdf');
    }
    
    /**
     * Gera os dados do relatório com base nos parâmetros
     */
    private function generateReportData($year, $filiarId = null)
    {
        // Array de meses para o relatório (1 a 12)
        $months = range(1, 12);
        
        // Formatação de datas para o ano selecionado
        $startDate = Carbon::createFromDate($year, 1, 1)->startOfDay();
        $endDate = Carbon::createFromDate($year, 12, 31)->endOfDay();
        
        // Buscar categorias de receitas e despesas
        // Usando tipo_receita_id para filtrar: 1=receitas, 2=despesas
        $categoriasReceitas = Categorias::where('tipo_receita_id', 1)->with('subcategorias')->get();
        $categoriasDespesas = Categorias::where('tipo_receita_id', 2)->with('subcategorias')->get();
        

        // Query base para filtrar os lançamentos financeiros
        $query = DemonstrativoFinanceiro::whereBetween('data', [$startDate, $endDate]);
        
        // Adicionar filtro de filial se especificado
        if ($filiarId && $filiarId != 'all') {
            $query->where('filiar_id', $filiarId);
        }
        
        // Log para depuração - Ver a consulta SQL gerada
        \Log::info('SQL Query: ' . $query->toSql());
        \Log::info('Parâmetros de filtro: ', [
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'filiarId' => $filiarId
        ]);
        
        // Buscar todos os lançamentos do período
        $lancamentos = $query->get();
        
        // Log para verificar quantos registros foram encontrados
        \Log::info('Total de registros encontrados: ' . $lancamentos->count());
        
        // Processar receitas por mês e subcategoria
        $receitasPorMes = [];
        $totalReceitasAnual = 0;
        
        foreach ($categoriasReceitas as $categoria) {
            $subcategoriaData = [];
            
            foreach ($categoria->subcategorias as $subcategoria) {
                $valoresMensais = [];
                $totalSubcategoria = 0;
                
                foreach ($months as $month) {
                    $monthStart = Carbon::createFromDate($year, $month, 1)->startOfDay();
                    $monthEnd = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();
                    
                    // Filtrar lançamentos desta subcategoria no mês específico
                    $valorMes = $lancamentos
                        ->where('subcategoria_id', $subcategoria->id)
                        ->whereBetween('data', [$monthStart, $monthEnd])
                        ->sum('valor');
                    
                    $valoresMensais[$month] = $valorMes;
                    $totalSubcategoria += $valorMes;
                }
                
                $subcategoriaData[] = [
                    'id' => $subcategoria->id,
                    'nome' => $subcategoria->nome,
                    'valores' => $valoresMensais,
                    'total' => $totalSubcategoria
                ];
                
                $totalReceitasAnual += $totalSubcategoria;
            }
            
            $receitasPorMes[] = [
                'categoria' => $categoria->nome,
                'subcategorias' => $subcategoriaData
            ];
        }
        
        // Processar despesas por mês e subcategoria
        $despesasPorMes = [];
        $totalDespesasAnual = 0;
        
        foreach ($categoriasDespesas as $categoria) {
            $subcategoriaData = [];
            
            foreach ($categoria->subcategorias as $subcategoria) {
                $valoresMensais = [];
                $totalSubcategoria = 0;
                
                foreach ($months as $month) {
                    $monthStart = Carbon::createFromDate($year, $month, 1)->startOfDay();
                    $monthEnd = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();
                    
                    // Filtrar lançamentos desta subcategoria no mês específico
                    $valorMes = $lancamentos
                        ->where('subcategoria_id', $subcategoria->id)
                        ->whereBetween('data', [$monthStart, $monthEnd])
                        ->sum('valor');
                    
                    $valoresMensais[$month] = $valorMes;
                    $totalSubcategoria += $valorMes;
                }
                
                $subcategoriaData[] = [
                    'id' => $subcategoria->id,
                    'nome' => $subcategoria->nome,
                    'valores' => $valoresMensais,
                    'total' => $totalSubcategoria
                ];
                
                $totalDespesasAnual += $totalSubcategoria;
            }
            
            $despesasPorMes[] = [
                'categoria' => $categoria->nome,
                'subcategorias' => $subcategoriaData
            ];
        }
        
        // Calcular totais por mês (receitas e despesas)
        $totaisReceitasPorMes = [];
        $totaisDespesasPorMes = [];
        $lucroMensal = [];
        
        foreach ($months as $month) {
            $totalReceitasMes = 0;
            $totalDespesasMes = 0;
            
            // Somar todas as receitas do mês
            foreach ($receitasPorMes as $categoria) {
                foreach ($categoria['subcategorias'] as $subcategoria) {
                    $totalReceitasMes += $subcategoria['valores'][$month] ?? 0;
                }
            }
            
            // Somar todas as despesas do mês
            foreach ($despesasPorMes as $categoria) {
                foreach ($categoria['subcategorias'] as $subcategoria) {
                    $totalDespesasMes += $subcategoria['valores'][$month] ?? 0;
                }
            }
            
            $totaisReceitasPorMes[$month] = $totalReceitasMes;
            $totaisDespesasPorMes[$month] = $totalDespesasMes;
            $lucroMensal[$month] = $totalReceitasMes - $totalDespesasMes;
        }
        
        // Calcular lucro anual
        $lucroAnual = $totalReceitasAnual - $totalDespesasAnual;
        
        // Montar estrutura de dados para o relatório
        return [
            'year' => $year,
            'months' => $months,
            'receitas' => $receitasPorMes,
            'despesas' => $despesasPorMes,
            'totals' => [
                'receitas' => $totaisReceitasPorMes,
                'despesas' => $totaisDespesasPorMes,
                'lucro_mensal' => $lucroMensal,
                'receitas_anual' => $totalReceitasAnual,
                'despesas_anual' => $totalDespesasAnual,
                'lucro' => $lucroAnual
            ]
        ];
    }
    
    /**
     * Obtém os anos disponíveis para seleção no relatório
     */
    private function getAvailableYears()
    {
        // Podemos obter anos com registros no banco ou usar um intervalo predefinido
        // Aqui vamos usar um intervalo de 5 anos (ano atual - 2 até ano atual + 2)
        $currentYear = Carbon::now()->year;
        return range($currentYear - 2, $currentYear + 2);
    }
}

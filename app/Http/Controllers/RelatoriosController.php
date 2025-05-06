<?php

namespace App\Http\Controllers;

use App\Models\Filiar;
use App\Services\ReportHandlerFactory;
use App\Traits\ReportTypeTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class RelatoriosController extends Controller
{
    use ReportTypeTrait;
    
    protected $reportHandlerFactory;
    
    public function __construct(ReportHandlerFactory $reportHandlerFactory)
    {
        $this->reportHandlerFactory = $reportHandlerFactory;
    }
    
    /**
     * Exibe a página de seleção de relatórios
     */
    public function index(Request $request)
    {
        // Obter empresas para o filtro
        $empresas = Filiar::all();
        
        // Obter os tipos de relatório disponíveis
        $reportTypes = $this->getReportTypes();
        
        // Configurar datas padrão (mês atual)
        $dataInicio = $request->input('data_inicio', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $dataFim = $request->input('data_fim', Carbon::now()->endOfMonth()->format('Y-m-d'));
        
        return Inertia::render('relatorios/index', [
            'empresas' => $empresas,
            'reportTypes' => array_values($reportTypes),
            'dataInicio' => $dataInicio,
            'dataFim' => $dataFim,
            'selectedReportType' => '',
            'selectedEmpresaId' => 'all'
        ]);
    }
    
    /**
     * Gera o PDF do relatório selecionado
     */
    public function generatePdf(Request $request)
    {
        $request->validate([
            'report_type' => 'required|string',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
        ]);
        
        $reportType = $request->input('report_type');
        
        // Verificar se o tipo de relatório solicitado existe
        if (!$this->reportTypeExists($reportType)) {
            return redirect()->back()->withErrors([
                'report_type' => 'Tipo de relatório inválido'
            ]);
        }
        
        // Criar o manipulador apropriado para o tipo de relatório
        $handler = $this->reportHandlerFactory->createHandler($reportType);
        
        if (!$handler) {
            return redirect()->back()->withErrors([
                'report_type' => 'Não foi possível processar este relatório'
            ]);
        }
        
        // Gerar o PDF usando o manipulador específico
        return $handler->generatePdf($request);
    }
}

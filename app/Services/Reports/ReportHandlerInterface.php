<?php

namespace App\Services\Reports;

use Illuminate\Http\Request;

interface ReportHandlerInterface
{
    /**
     * Gera os dados para o relatório
     *
     * @param int|null $empresaId
     * @param string $dataInicio
     * @param string $dataFim
     * @return array
     */
    public function generateReportData(?int $empresaId, string $dataInicio, string $dataFim): array;
    
    /**
     * Gera o PDF do relatório
     *
     * @param Request $request
     * @return mixed
     */
    public function generatePdf(Request $request);
    
    /**
     * Retorna o nome da view para renderizar o PDF
     *
     * @return string
     */
    public function getPdfView(): string;
    
    /**
     * Retorna o nome do arquivo PDF
     *
     * @param string $dataInicio
     * @param string $dataFim
     * @return string
     */
    public function getPdfFilename(string $dataInicio, string $dataFim): string;
}

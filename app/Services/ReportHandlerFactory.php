<?php

namespace App\Services;

use App\Services\Reports\DemonstracaoResultadosReportHandler;
use App\Services\Reports\DeclaracaoRendimentosReportHandler;
use App\Traits\ReportTypeTrait;

class ReportHandlerFactory
{
    use ReportTypeTrait;

    /**
     * Cria uma instância do manipulador de relatório apropriado
     *
     * @param string $reportType
     * @return ReportHandlerInterface|null
     */
    public function createHandler(string $reportType)
    {
        if (!$this->reportTypeExists($reportType)) {
            return null;
        }

        $reportTypeConfig = $this->getReportType($reportType);
        $handlerClass = "\\App\\Services\\Reports\\{$reportTypeConfig['handler']}";

        if (!class_exists($handlerClass)) {
            return null;
        }

        return new $handlerClass();
    }
}

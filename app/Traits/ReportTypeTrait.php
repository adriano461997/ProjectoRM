<?php

namespace App\Traits;

trait ReportTypeTrait
{
    /**
     * Define os tipos de relatório disponíveis
     * 
     * @return array
     */
    public function getReportTypes(): array
    {
        return [
            'demonstracao-resultados' => [
                'id' => 'demonstracao-resultados',
                'name' => 'Demonstração de Resultados',
                'description' => 'Relatório com receitas, despesas e lucro do período',
                'view' => 'pdf.demonstracao-resultados',
                'handler' => 'DemonstracaoResultadosReportHandler',
            ],
            'declaracao-rendimentos' => [
                'id' => 'declaracao-rendimentos',
                'name' => 'Declaração de Rendimentos',
                'description' => 'Relatório com declaração de rendimentos do período',
                'view' => 'pdf.declaracao-rendimentos',
                'handler' => 'DeclaracaoRendimentosReportHandler',
            ],
        ];
    }
    
    /**
     * Obtém um tipo de relatório pelo ID
     * 
     * @param string $id
     * @return array|null
     */
    public function getReportType(string $id): ?array
    {
        $types = $this->getReportTypes();
        return $types[$id] ?? null;
    }
    
    /**
     * Verifica se um tipo de relatório existe
     * 
     * @param string $id
     * @return bool
     */
    public function reportTypeExists(string $id): bool
    {
        return isset($this->getReportTypes()[$id]);
    }
}

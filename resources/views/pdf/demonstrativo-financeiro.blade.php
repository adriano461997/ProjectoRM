<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demonstrativo de Resultados {{ $year }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 15px;
            font-size: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
        .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .meta-info {
            font-size: 9px;
            color: #666;
            text-align: right;
        }
        
        /* Grid de resumo */
        .summary-container {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .summary-container td {
            width: 33.33%;
            padding: 10px;
            vertical-align: top;
        }
        .summary-box {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            height: 70px;
        }
        .summary-box h3 {
            margin: 0 0 10px 0;
            font-size: 12px;
            font-weight: normal;
        }
        .summary-box p {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        .box-receitas {
            background-color: #e7f9e7;
        }
        .box-despesas {
            background-color: #f9e7e7;
        }
        .box-lucro {
            background-color: #e7f7f9;
        }
        .lucro-positivo {
            color: green;
        }
        .lucro-negativo {
            color: red;
        }
        
        /* Tabela */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9px;
        }
        .data-table th, .data-table td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            text-align: left;
        }
        .data-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 9px;
            text-align: center;
        }
        .right-align {
            text-align: right;
        }
        .categoria-header {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .receita-row {
            background-color: #f0fff0;
        }
        .despesa-row {
            background-color: #fff0f0;
        }
        .total-row {
            font-weight: bold;
            background-color: #f0f0f0;
        }
        .lucro-row {
            font-weight: bold;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        /* Gráficos */
        .charts-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .chart {
            width: 48%;
            height: 200px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
        }
        .chart-title {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">RM S.A.</div>
        <div class="report-title">Demonstração de Resultados (D.R) {{ $year }}</div>
        <div class="meta-info">
            <div>Filial: {{ $reportData['filiar'] ?? 'Todas as Filiais' }}</div>
            <div>Gerado em: {{ date('d/m/Y H:i:s') }}</div>
        </div>
    </div>
    
    <!-- Resumo em caixas -->
    <table class="summary-container">
        <tr>
            <td>
                <div class="summary-box box-receitas">
                    <h3>Faturamento Total</h3>
                    <p>
                        {{ number_format($reportData['totals']['receitas_anual'], 2, ',', '.') }} kz
                    </p>
                </div>
            </td>
            <td>
                <div class="summary-box box-despesas">
                    <h3>Despesas Total</h3>
                    <p>
                        {{ number_format($reportData['totals']['despesas_anual'], 2, ',', '.') }} kz
                    </p>
                </div>
            </td>
            <td>
                <div class="summary-box box-lucro">
                    <h3>Perdas/Lucros</h3>
                    <p class="{{ $reportData['totals']['lucro'] >= 0 ? 'lucro-positivo' : 'lucro-negativo' }}">
                        {{ number_format($reportData['totals']['lucro'], 2, ',', '.') }} kz
                    </p>
                </div>
            </td>
        </tr>
    </table>
    
    <!-- Tabela de demonstração de resultados -->
    <table class="data-table">
        <thead>
            <tr>
                <th>Descrição</th>
                @foreach($reportData['months'] as $month)
                    <th class="right-align">
                        @php
                            $monthNames = [
                                1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr',
                                5 => 'Mai', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
                                9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez'
                            ];
                        @endphp
                        {{ $monthNames[$month] }}
                    </th>
                @endforeach
                <th class="right-align">Total</th>
            </tr>
        </thead>
        <tbody>
            <!-- Receitas -->
            <tr>
                <td colspan="{{ count($reportData['months']) + 2 }}" class="categoria-header">Receitas</td>
            </tr>
            
            @foreach($reportData['receitas'] as $categoriaReceita)
                @foreach($categoriaReceita['subcategorias'] as $subcategoria)
                    <tr class="receita-row">
                        <td>{{ $subcategoria['nome'] }}</td>
                        @foreach($reportData['months'] as $month)
                            <td class="right-align">
                                {{ number_format($subcategoria['valores'][$month] ?? 0, 2, ',', '.') }}
                            </td>
                        @endforeach
                        <td class="right-align total-row">
                            {{ number_format($subcategoria['total'], 2, ',', '.') }}
                        </td>
                    </tr>
                @endforeach
            @endforeach
            
            <tr class="total-row">
                <td>Total Receitas</td>
                @foreach($reportData['months'] as $month)
                    <td class="right-align">
                        {{ number_format($reportData['totals']['receitas'][$month] ?? 0, 2, ',', '.') }}
                    </td>
                @endforeach
                <td class="right-align">
                    {{ number_format($reportData['totals']['receitas_anual'], 2, ',', '.') }}
                </td>
            </tr>
            
            <!-- Despesas -->
            <tr>
                <td colspan="{{ count($reportData['months']) + 2 }}" class="categoria-header">Despesas</td>
            </tr>
            
            @foreach($reportData['despesas'] as $categoriaDespesa)
                @foreach($categoriaDespesa['subcategorias'] as $subcategoria)
                    <tr class="despesa-row">
                        <td>{{ $subcategoria['nome'] }}</td>
                        @foreach($reportData['months'] as $month)
                            <td class="right-align">
                                {{ number_format($subcategoria['valores'][$month] ?? 0, 2, ',', '.') }}
                            </td>
                        @endforeach
                        <td class="right-align total-row">
                            {{ number_format($subcategoria['total'], 2, ',', '.') }}
                        </td>
                    </tr>
                @endforeach
            @endforeach
            
            <tr class="total-row">
                <td>Total Despesas</td>
                @foreach($reportData['months'] as $month)
                    <td class="right-align">
                        {{ number_format($reportData['totals']['despesas'][$month] ?? 0, 2, ',', '.') }}
                    </td>
                @endforeach
                <td class="right-align">
                    {{ number_format($reportData['totals']['despesas_anual'], 2, ',', '.') }}
                </td>
            </tr>
            
            <!-- Linha de lucro -->
            <tr class="lucro-row {{ $reportData['totals']['lucro'] >= 0 ? 'receita-row' : 'despesa-row' }}">
                <td>Lucro</td>
                @foreach($reportData['months'] as $month)
                    <td class="right-align">
                        {{ number_format($reportData['totals']['lucro_mensal'][$month] ?? 0, 2, ',', '.') }}
                    </td>
                @endforeach
                <td class="right-align">
                    {{ number_format($reportData['totals']['lucro'], 2, ',', '.') }}
                </td>
            </tr>
        </tbody>
    </table>
    
    <div class="meta-info">
        <p>Relatório gerado automaticamente pelo sistema. Os valores apresentados são baseados nos registros contábeis da empresa.</p>
    </div>
</body>
</html>

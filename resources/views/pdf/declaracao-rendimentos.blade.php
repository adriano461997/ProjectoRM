<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Declaração de Rendimentos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            line-height: 1.2;
            margin: 0;
            padding: 15px;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .header {
            margin-bottom: 15px;
        }
        .company-name {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 3px;
        }
        .report-title {
            font-weight: bold;
            font-size: 10px;
            text-align: center;
            margin-bottom: 10px;
            margin-top: 4px;
        }
        .company-details {
            font-size: 8px;
            margin-bottom: 2px;
        }
        .date-block {
            float: right;
            width: 200px;
            margin-top: -60px;
            margin-right: 10px;
        }
        .date-row {
            background-color: #333;
            color: white;
            padding: 2px 4px;
            margin-bottom: 2px;
            font-size: 8px;
        }
        .date-label {
            display: inline-block;
            width: 110px;
        }
        .bordered-box {
            border: 1px solid #000;
            padding: 3px;
            margin-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 3px;
            font-size: 8px;
            text-align: left;
        }
        thead {
            background-color: #f2f2f2;
        }
        .category {
            font-weight: bold;
            background-color: #e6e6e6;
        }
        .subcategory {
            padding-left: 15px;
        }
        .total-row {
            font-weight: bold;
            background-color: #f0f0f0;
        }
        .footer {
            font-size: 7px;
            text-align: center;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="report-title">2. DECLARAÇÃO DE RENDIMENTOS</div>
        
        <div class="bordered-box">
            <div class="company-name">{{ $reportData['empresa'] ?? 'EMPRESA' }}</div>
            <div class="company-details">Endereço / Bairro</div>
            <div class="company-details">Cidade, Estado / CEP</div>
            <div class="company-details">Telefone: 000-0000-0000</div>
        </div>
        
        <div class="date-block">
            <div class="date-row">
                <span class="date-label">DATA DA ELABORAÇÃO:</span>
                <span>{{ date('d/m/Y', strtotime($reportData['dataInicio'])) }}</span>
            </div>
            <div class="date-row">
                <span class="date-label">ANO DE INÍCIO:</span>
                <span>{{ $reportData['years'][0] ?? date('Y') }}</span>
            </div>
            <div class="date-row">
                <span class="date-label">ANO DE TÉRMINO:</span>
                <span>{{ end($reportData['years']) ?? date('Y') }}</span>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                @foreach($reportData['years'] ?? [] as $year)
                    <th class="text-right">{{ $year }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            <!-- RECEITA -->
            <tr class="category">
                <td colspan="1">RECEITA</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>
            
            <!-- Vendas brutas -->
            <tr>
                <td>Vendas brutas</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['vendas_brutas'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Menos retornos e descontos de vendas -->
            <tr>
                <td>Menos retornos e descontos de vendas</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['menos_retornos'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- VENDAS LÍQUIDAS -->
            <tr class="total-row">
                <td>VENDAS LÍQUIDAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['vendas_liquidas'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- CUSTOS E DESPESAS -->
            <tr class="category">
                <td colspan="1">CUSTOS E DESPESAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>

            <!-- Custos e Despesas Subcategorias -->
            @foreach($reportData['detailedData']['custos_despesas'] ?? [] as $item)
                <tr>
                    <td>{{ $item['nome'] }}</td>
                    @foreach($reportData['years'] ?? [] as $year)
                        <td class="text-right">
                            {{ number_format(($item['valores'][$year] ?? 0), 2, '.', ',') }}
                        </td>
                    @endforeach
                </tr>
            @endforeach

            <!-- TOTAL CUSTOS E DESPESAS -->
            <tr class="total-row">
                <td>TOTAL CUSTOS E DESPESAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['total_custos_despesas'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>

            <!-- RESULTADO OPERACIONAL -->
            <tr class="total-row">
                <td>RESULTADO OPERACIONAL</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['resultado_operacional'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>

            <!-- OUTRAS RECEITAS E DESPESAS -->
            <tr class="category">
                <td colspan="1">OUTRAS RECEITAS E DESPESAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>

            <!-- Outras Receitas e Despesas Subcategorias -->
            @foreach($reportData['detailedData']['outras_receitas_despesas'] ?? [] as $item)
                <tr>
                    <td>{{ $item['nome'] }}</td>
                    @foreach($reportData['years'] ?? [] as $year)
                        <td class="text-right">
                            {{ number_format(($item['valores'][$year] ?? 0), 2, '.', ',') }}
                        </td>
                    @endforeach
                </tr>
            @endforeach

            <!-- TOTAL OUTRAS RECEITAS E DESPESAS -->
            <tr class="total-row">
                <td>TOTAL OUTRAS RECEITAS E DESPESAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['total_outras_receitas_despesas'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>

            <!-- LUCRO LÍQUIDO DO PERÍODO -->
            <tr class="total-row">
                <td>LUCRO LÍQUIDO DO PERÍODO</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['lucro_liquido'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        Documento gerado em {{ date('d/m/Y H:i:s') }}
    </div>
</body>
</html>

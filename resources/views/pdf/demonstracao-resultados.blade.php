<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Demonstração de Resultados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 15px;
            font-size: 9px;
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
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 3px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-size: 8px;
        }
        td {
            font-size: 8px;
        }
        .category {
            font-weight: bold;
            background-color: #f0f0f0;
        }
        .subcategory {
            padding-left: 15px;
        }
        .total-row {
            font-weight: bold;
            background-color: #f0f0f0;
        }
        .revenue {
            color: #000;
        }
        .expense {
            color: #000;
        }
        .profit {
            font-weight: bold;
        }
        .profit.positive {
            color: #000;
        }
        .profit.negative {
            color: #000;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .bordered-box {
            border: 1px solid #000;
            padding: 3px;
            margin-bottom: 8px;
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
        <div class="report-title">1. DEMOSTRAÇÃO DE RESULTADOS modelo 2</div>
        
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
            
            <!-- CUSTO DAS VENDAS -->
            <tr class="category">
                <td colspan="1">CUSTO DAS VENDAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>
            
            <!-- Início do inventário -->
            <tr>
                <td>Início do inventário</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['inicio_inventario'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Mais mercadorias adquiridas ou fabricadas -->
            <tr>
                <td>Mais mercadorias adquiridas ou fabricadas</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['mais_mercadorias'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Menos inventário final -->
            <tr>
                <td>Menos inventário final</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['menos_inventario_final'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- CUSTO TOTAL DAS MERCADORIAS VENDIDAS (CMV) -->
            <tr class="total-row">
                <td>CUSTO TOTAL DAS MERCADORIAS VENDIDAS (CMV)</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['custo_total_mercadorias'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- LUCRO BRUTO (PERDA) -->
            <tr class="total-row">
                <td>LUCRO BRUTO (PERDA)</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['lucro_bruto'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- DESPESAS OPERACIONAIS -->
            <tr class="category">
                <td colspan="1">DESPESAS OPERACIONAIS - VENDAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>
            
            <!-- Despesas Operacionais - Vendas -->
            @foreach($reportData['detailedData']['despesas_operacionais_vendas'] ?? [] as $item)
                <tr>
                    <td>{{ $item['nome'] }}</td>
                    @foreach($reportData['years'] ?? [] as $year)
                        <td class="text-right">
                            {{ number_format(($item['valores'][$year] ?? 0), 2, '.', ',') }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
            
            <!-- DESPESAS TOTAIS DE VENDAS -->
            <tr class="total-row">
                <td>DESPESAS TOTAIS DE VENDAS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['despesas_totais_vendas'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- GERAL E ADMINISTRAÇÃO -->
            <tr class="category">
                <td colspan="1">GERAL E ADMINISTRAÇÃO</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td></td>
                @endforeach
            </tr>
            
            <!-- Geral e Administração subcategorias -->
            @foreach($reportData['detailedData']['geral_administracao'] ?? [] as $item)
                <tr>
                    <td>{{ $item['nome'] }}</td>
                    @foreach($reportData['years'] ?? [] as $year)
                        <td class="text-right">
                            {{ number_format(($item['valores'][$year] ?? 0), 2, '.', ',') }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
            
            <!-- DESPESAS GERAIS TOTAIS DE ADMINISTRAÇÃO -->
            <tr class="total-row">
                <td>DESPESAS GERAIS TOTAIS DE ADMINISTRAÇÃO</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['despesas_gerais_totais_admin'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- DESPESAS OPERACIONAIS TOTAIS -->
            <tr class="total-row">
                <td>DESPESAS OPERACIONAIS TOTAIS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['despesas_operacionais_totais'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- RENDA LÍQUIDA ANTES DOS IMPOSTOS -->
            <tr class="total-row">
                <td>RENDA LÍQUIDA ANTES DOS IMPOSTOS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['renda_liquida_antes_impostos'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Imposto sobre a renda -->
            <tr>
                <td>Imposto sobre a renda</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['imposto_renda'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- RENDA LÍQUIDA APÓS OS IMPOSTOS -->
            <tr class="total-row">
                <td>RENDA LÍQUIDA APÓS OS IMPOSTOS</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['renda_liquida_apos_impostos'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Ganho ou perda extraordinária -->
            <tr>
                <td>Ganho ou perda extraordinária</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['ganho_perda_extraordinaria'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- Imposto de renda sobre ganho extraordinário -->
            <tr>
                <td>Imposto de renda sobre ganho extraordinário</td>
                @foreach($reportData['years'] ?? [] as $year)
                    <td class="text-right">
                        {{ number_format(($reportData['detailedData']['imposto_ganho_extraordinario'][$year] ?? 0), 2, '.', ',') }}
                    </td>
                @endforeach
            </tr>
            
            <!-- LUCRO LÍQUIDO (PERDA) -->
            <tr class="total-row">
                <td>LUCRO LÍQUIDO (PERDA)</td>
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

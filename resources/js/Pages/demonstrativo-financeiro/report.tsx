import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function DemonstrativoFinanceiroReport({ auth, reportData, year, availableYears, filiares, filiarId, currentFiliar }: PageProps) {
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    router.get(route('demonstrativo-financeiro.report'), { 
      year: selectedYear,
      filiar_id: filiarId
    });
  };

  const handleFiliarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFiliar = e.target.value;
    router.get(route('demonstrativo-financeiro.report'), { 
      year: year,
      filiar_id: selectedFiliar
    });
  };

  const handleDownloadPdf = () => {
    window.open(route('demonstrativo-financeiro.pdf', { 
      ano: year,
      filial_id: filiarId 
    }), '_blank');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      currencyDisplay: 'symbol'
    }).format(value).replace('AOA', 'kz');
  };

  const isPositive = (value: number) => value >= 0;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Demonstração de Resultados {currentFiliar ? ` - ${currentFiliar.nome}` : ' - Todas as Filiais'}
        </h2>
      }
    >
      <Head title={`Demonstração de Resultados ${currentFiliar ? ` - ${currentFiliar.nome}` : ' - Todas as Filiais'}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col md:flex-row items-center space-x-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Filial:</span>
                    <select
                      value={filiarId}
                      onChange={handleFiliarChange}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="all">Todas</option>
                      {filiares.map((filiar: any) => (
                        <option key={filiar.id} value={filiar.id}>
                          {filiar.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Ano:</span>
                    <select
                      value={year}
                      onChange={handleYearChange}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {availableYears.map((y: number) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition"
                  >
                    Exportar PDF
                  </button>
                  <Link
                    href={route('dashboard')}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                  >
                    Voltar
                  </Link>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800">Faturamento Total</h3>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(reportData.totals.receitas_anual)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="text-lg font-medium text-red-800">Despesas Total</h3>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(reportData.totals.despesas_anual)}</p>
                </div>
                <div className={`p-4 ${isPositive(reportData.totals.lucro) ? 'bg-green-50' : 'bg-red-50'} rounded-lg`}>
                  <h3 className="text-lg font-medium text-gray-800">Perdas/Lucros</h3>
                  <p className={`text-2xl font-bold ${isPositive(reportData.totals.lucro) ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(reportData.totals.lucro)}
                  </p>
                </div>
              </div>

              {/* Se estiver mostrando todas as filiais, mostrar resumo por filial */}
              {reportData.showingAllFiliares && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">Resumo por Filial</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filial
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receitas
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Despesas
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lucro/Perda
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(reportData.filiarData).map(([filiarId, filiar]: [string, any]) => (
                          <tr key={filiarId} className="hover:bg-gray-50">
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {filiar.nome}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600">
                              {formatCurrency(filiar.totalReceitas)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600">
                              {formatCurrency(filiar.totalDespesas)}
                            </td>
                            <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${isPositive(filiar.totalLucro) ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(filiar.totalLucro)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tabela de Demonstração dos Resultados */}
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      {reportData.months.map((month: number) => (
                        <th key={month} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {monthNames[month - 1]}
                        </th>
                      ))}
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-green-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Proveito/Receita
                      </td>
                      {reportData.months.map((month: number) => (
                        <td key={month} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(reportData.totals.receitas[month] || 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(reportData.totals.receitas_anual)}
                      </td>
                    </tr>

                    <tr className="bg-red-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Despesas
                      </td>
                      {reportData.months.map((month: number) => (
                        <td key={month} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(reportData.totals.despesas[month] || 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(reportData.totals.despesas_anual)}
                      </td>
                    </tr>

                    <tr className="bg-red-50/70">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Despesas Financeiras
                      </td>
                      {reportData.months.map((month: number) => (
                        <td key={month} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(0)} {/* Placeholder - implementar lógica para despesas financeiras */}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(0)} {/* Placeholder - implementar lógica para despesas financeiras */}
                      </td>
                    </tr>

                    <tr className={`${isPositive(reportData.totals.lucro) ? 'bg-green-100' : 'bg-red-100'} font-bold`}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Lucro
                      </td>
                      {reportData.months.map((month: number) => (
                        <td 
                          key={month} 
                          className={`px-3 py-2 whitespace-nowrap text-sm ${isPositive(reportData.totals.lucro_mensal[month] || 0) ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {formatCurrency(reportData.totals.lucro_mensal[month] || 0)}
                        </td>
                      ))}
                      <td className={`px-3 py-2 whitespace-nowrap text-sm font-bold ${isPositive(reportData.totals.lucro) ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(reportData.totals.lucro)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

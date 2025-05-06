import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Calendar, ChevronDown, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ReportType {
    id: string;
    name: string;
    description: string;
}

export default function ImprimirRelatorios({ auth, empresas, reportTypes, dataInicio, dataFim, selectedReportType, selectedEmpresaId }: PageProps) {
    const [reportType, setReportType] = useState<string>(selectedReportType || '');
    const [empresaId, setEmpresaId] = useState<string>(selectedEmpresaId || 'all');
    const [startDate, setStartDate] = useState<string>(dataInicio || '');
    const [endDate, setEndDate] = useState<string>(dataFim || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!reportType) {
            newErrors.reportType = 'Selecione um tipo de relatório';
        }

        if (!startDate) {
            newErrors.startDate = 'A data de início é obrigatória';
        }

        if (!endDate) {
            newErrors.endDate = 'A data de fim é obrigatória';
        } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            newErrors.endDate = 'A data de fim deve ser posterior à data de início';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGeneratePdf = () => {
        if (!validateForm()) {
            return;
        }

        window.open(route('relatorios.pdf', {
            report_type: reportType,
            empresa_id: empresaId === 'all' ? null : empresaId,
            data_inicio: startDate,
            data_fim: endDate
        }), '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Imprimir Relatórios
                </h2>
            }
        >
            <Head title="Imprimir Relatórios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <FileText className="mr-2" />
                                        Gerar Relatório
                                    </CardTitle>
                                    <CardDescription>
                                        Selecione o tipo de relatório e o período desejado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="reportType">Tipo de Relatório</Label>
                                            <Select value={reportType} onValueChange={setReportType}>
                                                <SelectTrigger id="reportType" className={errors.reportType ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Selecione o tipo de relatório" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {reportTypes.map((type: ReportType) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.reportType && (
                                                <p className="text-red-500 text-xs mt-1">{errors.reportType}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="empresaId">Empresa</Label>
                                            <Select value={empresaId} onValueChange={setEmpresaId}>
                                                <SelectTrigger id="empresaId">
                                                    <SelectValue placeholder="Todas as Empresas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todas as Empresas</SelectItem>
                                                    {empresas.map((empresa: any) => (
                                                        <SelectItem key={empresa.id} value={empresa.id.toString()}>
                                                            {empresa.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Data de Início</Label>
                                            <div className="relative">
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className={`pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                                                />
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            </div>
                                            {errors.startDate && (
                                                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="endDate">Data de Fim</Label>
                                            <div className="relative">
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className={`pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                                                />
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            </div>
                                            {errors.endDate && (
                                                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button onClick={handleGeneratePdf}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Gerar PDF
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

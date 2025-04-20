import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Building2, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

// Dados simulados de custos operacionais
const operationalCosts = [
    {
        name: "Luanda Business Center",
        aluguel: 150000,
        utilidades: 45000,
        pessoal: 280000,
        manutencao: 35000,
        marketing: 45000,
        outros: 25000,
        totalCost: 580000,
        lastMonthCost: 550000,
        growth: 5.45
    },
    {
        name: "Viana Trade Hub",
        aluguel: 120000,
        utilidades: 35000,
        pessoal: 220000,
        manutencao: 28000,
        marketing: 38000,
        outros: 20000,
        totalCost: 461000,
        lastMonthCost: 480000,
        growth: -3.96
    },
    {
        name: "Talatona Commerce",
        aluguel: 180000,
        utilidades: 55000,
        pessoal: 320000,
        manutencao: 42000,
        marketing: 52000,
        outros: 30000,
        totalCost: 679000,
        lastMonthCost: 650000,
        growth: 4.46
    },
    {
        name: "Benfica Solutions",
        aluguel: 90000,
        utilidades: 28000,
        pessoal: 180000,
        manutencao: 22000,
        marketing: 25000,
        outros: 15000,
        totalCost: 360000,
        lastMonthCost: 340000,
        growth: 5.88
    },
    {
        name: "Kilamba Business Park",
        aluguel: 140000,
        utilidades: 42000,
        pessoal: 260000,
        manutencao: 32000,
        marketing: 42000,
        outros: 23000,
        totalCost: 539000,
        lastMonthCost: 520000,
        growth: 3.65
    }
];

// Cálculo de totais por categoria
const totalsByCategory = {
    aluguel: operationalCosts.reduce((acc, curr) => acc + curr.aluguel, 0),
    utilidades: operationalCosts.reduce((acc, curr) => acc + curr.utilidades, 0),
    pessoal: operationalCosts.reduce((acc, curr) => acc + curr.pessoal, 0),
    manutencao: operationalCosts.reduce((acc, curr) => acc + curr.manutencao, 0),
    marketing: operationalCosts.reduce((acc, curr) => acc + curr.marketing, 0),
    outros: operationalCosts.reduce((acc, curr) => acc + curr.outros, 0)
};

const costDistribution = Object.entries(totalsByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CostMetricsCard = ({ title, value, percentageChange, icon: Icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {typeof value === 'number' ?
                    value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })
                    : value}
            </div>
            {percentageChange && (
                <p className={`flex items-center text-xs ${percentageChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {percentageChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(percentageChange).toFixed(2)}% em relação ao mês anterior</span>
                </p>
            )}
        </CardContent>
    </Card>
);

const OperationalCostsDashboard = () => {
    const totalCost = operationalCosts.reduce((acc, curr) => acc + curr.totalCost, 0);
    const averageCost = totalCost / operationalCosts.length;
    const averageGrowth = operationalCosts.reduce((acc, curr) => acc + curr.growth, 0) / operationalCosts.length;

    return (
        <div className="space-y-6">
            {/* Métricas Principais */}

            <h1 className={"text-2xl mb-4"}>
                Custos Operacionais
            </h1>

            <div className="grid gap-4 md:grid-cols-3">
                <CostMetricsCard
                    title="Custo Total"
                    value={totalCost}
                    percentageChange={averageGrowth}
                    icon={DollarSign}
                />
                <CostMetricsCard
                    title="Custo Médio por Afiliada"
                    value={averageCost}
                    icon={Building2}
                />
                <CostMetricsCard
                    title="Maior Categoria de Custo"
                    value={`${Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0][0].toUpperCase()}`}
                    icon={TrendingDown}
                />
            </div>

            {/* Gráficos */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Gráfico de Barras Empilhadas - Custos por Afiliada */}
                <Card>
                    <CardHeader>
                        <CardTitle>Custos por Categoria e Afiliada</CardTitle>
                        <CardDescription>Distribuição de custos operacionais</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={operationalCosts}
                                margin={{top: 20, right: 30, left: 20, bottom: 60}}
                            >
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis/>
                                <Tooltip
                                    formatter={(value) => value.toLocaleString('pt-AO', {
                                        style: 'currency',
                                        currency: 'AOA'
                                    })}
                                />
                                <Legend/>
                                <Bar dataKey="aluguel" stackId="a" fill="#0088FE" name="Aluguel"/>
                                <Bar dataKey="utilidades" stackId="a" fill="#00C49F" name="Utilidades"/>
                                <Bar dataKey="pessoal" stackId="a" fill="#FFBB28" name="Pessoal"/>
                                <Bar dataKey="manutencao" stackId="a" fill="#FF8042" name="Manutenção"/>
                                <Bar dataKey="marketing" stackId="a" fill="#8884d8" name="Marketing"/>
                                <Bar dataKey="outros" stackId="a" fill="#82ca9d" name="Outros"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gráfico de Pizza - Distribuição Total de Custos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição Total de Custos</CardTitle>
                        <CardDescription>Proporção de cada categoria no custo total</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {costDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => value.toLocaleString('pt-AO', {
                                        style: 'currency',
                                        currency: 'AOA'
                                    })}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OperationalCostsDashboard;

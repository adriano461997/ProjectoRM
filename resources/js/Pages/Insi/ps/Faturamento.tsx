import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Dados simulados de faturamento
const revenueData = [
    {
        name: "Luanda Business Center",
        revenue: 850000,
        lastMonthRevenue: 820000,
        expenses: 320000,
        profit: 530000,
        growth: 3.66
    },
    {
        name: "Viana Trade Hub",
        revenue: 650000,
        lastMonthRevenue: 680000,
        expenses: 250000,
        profit: 400000,
        growth: -4.41
    },
    {
        name: "Talatona Commerce",
        revenue: 920000,
        lastMonthRevenue: 850000,
        expenses: 380000,
        profit: 540000,
        growth: 8.24
    },
    {
        name: "Benfica Solutions",
        revenue: 450000,
        lastMonthRevenue: 420000,
        expenses: 180000,
        profit: 270000,
        growth: 7.14
    },
    {
        name: "Kilamba Business Park",
        revenue: 780000,
        lastMonthRevenue: 750000,
        expenses: 300000,
        profit: 480000,
        growth: 4.00
    },
    {
        name: "Cacuaco Enterprise",
        revenue: 550000,
        lastMonthRevenue: 580000,
        expenses: 220000,
        profit: 330000,
        growth: -5.17
    },
    {
        name: "Maculusso Office Center",
        revenue: 880000,
        lastMonthRevenue: 820000,
        expenses: 350000,
        profit: 530000,
        growth: 7.32
    },
    {
        name: "Patriota Business Hub",
        revenue: 480000,
        lastMonthRevenue: 450000,
        expenses: 190000,
        profit: 290000,
        growth: 6.67
    },
    {
        name: "Maianga Trade Center",
        revenue: 720000,
        lastMonthRevenue: 690000,
        expenses: 280000,
        profit: 440000,
        growth: 4.35
    },
    {
        name: "Sambizanga Solutions",
        revenue: 620000,
        lastMonthRevenue: 590000,
        expenses: 240000,
        profit: 380000,
        growth: 5.08
    }
];

// Processamento dos dados
const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
const averageRevenue = totalRevenue / revenueData.length;
const totalProfit = revenueData.reduce((acc, curr) => acc + curr.profit, 0);
const averageGrowth = revenueData.reduce((acc, curr) => acc + curr.growth, 0) / revenueData.length;

const RevenueMetricsCard = ({ title, value, percentageChange, icon: Icon }) => (
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
                <p className={`flex items-center text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {percentageChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(percentageChange).toFixed(2)}% em relação ao mês anterior</span>
                </p>
            )}
        </CardContent>
    </Card>
);

const AffiliatesRevenue = () => {
    return (
        <div className="space-y-6">
            {/* Métricas Principais */}

            <h1 className={"text-2xl mb-4"}>
                Faturamento
            </h1>

            <div className="grid gap-4 md:grid-cols-3">
                <RevenueMetricsCard
                    title="Faturamento Total"
                    value={totalRevenue}
                    percentageChange={averageGrowth}
                    icon={DollarSign}
                />
                <RevenueMetricsCard
                    title="Lucro Total"
                    value={totalProfit}
                    icon={TrendingUp}
                />
                <RevenueMetricsCard
                    title="Média de Faturamento"
                    value={averageRevenue}
                    icon={DollarSign}
                />
            </div>

            {/* Gráficos */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Gráfico de Barras - Faturamento por Afiliada */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Faturamento por Afiliada</CardTitle>
                        <CardDescription>Comparativo de receita entre afiliadas</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => value.toLocaleString('pt-AO', {
                                        style: 'currency',
                                        currency: 'AOA'
                                    })}
                                />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gráfico de Linha - Crescimento */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Taxa de Crescimento</CardTitle>
                        <CardDescription>Crescimento percentual em relação ao mês anterior</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="growth"
                                    fill="#82ca9d"
                                    name="Crescimento (%)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AffiliatesRevenue;

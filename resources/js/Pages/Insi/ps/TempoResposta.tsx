import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const affiliatesData = [
    {
        name: "Luanda Business Center",
        location: "Rua Comandante Gika, Edifício Garden Towers, Torre B, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.5,
        reports: 20,
        averageResponseTime: 2.5
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        collaborations: 8,
        feedback: 4.0,
        reports: 15,
        averageResponseTime: 3.0
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        collaborations: 12,
        feedback: 4.8,
        reports: 25,
        averageResponseTime: 1.8
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        collaborations: 7,
        feedback: 3.9,
        reports: 10,
        averageResponseTime: 2.9
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        collaborations: 9,
        feedback: 4.2,
        reports: 18,
        averageResponseTime: 2.2
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        collaborations: 5,
        feedback: 3.8,
        reports: 12,
        averageResponseTime: 3.5
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        collaborations: 11,
        feedback: 4.7,
        reports: 22,
        averageResponseTime: 1.9
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        collaborations: 6,
        feedback: 4.1,
        reports: 14,
        averageResponseTime: 2.7
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.3,
        reports: 19,
        averageResponseTime: 2.4
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 4,
        feedback: 3.7,
        reports: 8,
        averageResponseTime: 3.2
    }
];

const totalResponseTime = affiliatesData.reduce((acc, curr) => acc + curr.averageResponseTime, 0);
const averageResponseTime = totalResponseTime / affiliatesData.length;
const highestResponseTime = Math.max(...affiliatesData.map(a => a.averageResponseTime));
const lowestResponseTime = Math.min(...affiliatesData.map(a => a.averageResponseTime));

const ResponseTimeMetricsCard = ({ title, value }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {value}
            </div>
        </CardContent>
    </Card>
);

const AverageResponseTimeChart = () => {
    return (
        <>
            <h1 className={"text-2xl mb-4"}>
                Tempo Médio de Resposta por Afiliada
            </h1>

            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <ResponseTimeMetricsCard
                    title="Total de Tempo de Resposta"
                    value={totalResponseTime.toFixed(2)}
                />
                <ResponseTimeMetricsCard
                    title="Média de Tempo de Resposta"
                    value={averageResponseTime.toFixed(2)}
                />
                <ResponseTimeMetricsCard
                    title="Maior Tempo de Resposta"
                    value={highestResponseTime.toFixed(2)}
                />
                <ResponseTimeMetricsCard
                    title="Menor Tempo de Resposta"
                    value={lowestResponseTime.toFixed(2)}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tempo Médio de Resposta</CardTitle>
                    <CardDescription>Gráfico de barras mostrando o tempo médio de resposta por afiliada</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={affiliatesData}
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
                            <Legend />
                            <Bar dataKey="averageResponseTime" fill="#82ca9d" name="Tempo Médio de Resposta" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default AverageResponseTimeChart;

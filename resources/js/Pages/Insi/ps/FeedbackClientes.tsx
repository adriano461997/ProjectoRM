import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const affiliatesData = [
    {
        name: "Luanda Business Center",
        location: "Rua Comandante Gika, Edifício Garden Towers, Torre B, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.5
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        collaborations: 8,
        feedback: 4.0
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        collaborations: 12,
        feedback: 4.8
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        collaborations: 7,
        feedback: 3.9
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        collaborations: 9,
        feedback: 4.2
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        collaborations: 5,
        feedback: 3.8
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        collaborations: 11,
        feedback: 4.7
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        collaborations: 6,
        feedback: 4.1
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.3
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 4,
        feedback: 3.7
    }
];

const totalFeedback = affiliatesData.reduce((acc, curr) => acc + curr.feedback, 0);
const averageFeedback = totalFeedback / affiliatesData.length;
const highestFeedback = Math.max(...affiliatesData.map(a => a.feedback));
const lowestFeedback = Math.min(...affiliatesData.map(a => a.feedback));

const FeedbackMetricsCard = ({ title, value }) => (
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

const FeedbackChart = () => {
    return (
        <>
            <h1 className={"text-2xl mb-4"}>
                Feedback dos Clientes por Afiliada
            </h1>

            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <FeedbackMetricsCard
                    title="Total de Feedback"
                    value={totalFeedback.toFixed(2)}
                />
                <FeedbackMetricsCard
                    title="Média de Feedback"
                    value={averageFeedback.toFixed(2)}
                />
                <FeedbackMetricsCard
                    title="Maior Feedback"
                    value={highestFeedback.toFixed(2)}
                />
                <FeedbackMetricsCard
                    title="Menor Feedback"
                    value={lowestFeedback.toFixed(2)}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feedback dos Clientes</CardTitle>
                    <CardDescription>Gráfico de barras mostrando o feedback dos clientes por afiliada</CardDescription>
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
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="feedback" fill="#82ca9d" name="Feedback" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default FeedbackChart;

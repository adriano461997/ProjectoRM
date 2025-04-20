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
        averageResponseTime: 2.5,
        taskCompletionRate: 0.95
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        collaborations: 8,
        feedback: 4.0,
        reports: 15,
        averageResponseTime: 3.0,
        taskCompletionRate: 0.90
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        collaborations: 12,
        feedback: 4.8,
        reports: 25,
        averageResponseTime: 1.8,
        taskCompletionRate: 0.98
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        collaborations: 7,
        feedback: 3.9,
        reports: 10,
        averageResponseTime: 2.9,
        taskCompletionRate: 0.85
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        collaborations: 9,
        feedback: 4.2,
        reports: 18,
        averageResponseTime: 2.2,
        taskCompletionRate: 0.92
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        collaborations: 5,
        feedback: 3.8,
        reports: 12,
        averageResponseTime: 3.5,
        taskCompletionRate: 0.88
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        collaborations: 11,
        feedback: 4.7,
        reports: 22,
        averageResponseTime: 1.9,
        taskCompletionRate: 0.97
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        collaborations: 6,
        feedback: 4.1,
        reports: 14,
        averageResponseTime: 2.7,
        taskCompletionRate: 0.89
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.3,
        reports: 19,
        averageResponseTime: 2.4,
        taskCompletionRate: 0.93
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 4,
        feedback: 3.7,
        reports: 8,
        averageResponseTime: 3.2,
        taskCompletionRate: 0.87
    }
];

const TaskCompletionRateChart = () => {
    return (
        <>
            <h1 className={"text-2xl mb-4"}>
                Taxa de Conclusão de Tarefas por Afiliada
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Taxa de Conclusão de Tarefas</CardTitle>
                    <CardDescription>Gráfico de barras mostrando a taxa de conclusão de tarefas por afiliada</CardDescription>
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
                            <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                            <Legend />
                            <Bar dataKey="taskCompletionRate" fill="#82ca9d" name="Taxa de Conclusão de Tarefas" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default TaskCompletionRateChart;

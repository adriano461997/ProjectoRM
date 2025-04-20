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
        reports: 20
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        collaborations: 8,
        feedback: 4.0,
        reports: 15
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        collaborations: 12,
        feedback: 4.8,
        reports: 25
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        collaborations: 7,
        feedback: 3.9,
        reports: 10
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        collaborations: 9,
        feedback: 4.2,
        reports: 18
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        collaborations: 5,
        feedback: 3.8,
        reports: 12
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        collaborations: 11,
        feedback: 4.7,
        reports: 22
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        collaborations: 6,
        feedback: 4.1,
        reports: 14
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10,
        feedback: 4.3,
        reports: 19
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 4,
        feedback: 3.7,
        reports: 8
    }
];

const ReportsChart = () => {
    return (
        <>
            <h1 className={"text-2xl mb-4"}>
                Número de Relatórios por Afiliada
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Número de Relatórios</CardTitle>
                    <CardDescription>Gráfico de barras mostrando o número de relatórios por afiliada</CardDescription>
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
                            <Bar dataKey="reports" fill="#8884d8" name="Relatórios" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default ReportsChart;

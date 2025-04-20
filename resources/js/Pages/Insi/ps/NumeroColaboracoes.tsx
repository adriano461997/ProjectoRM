import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const affiliatesData = [
    {
        name: "Luanda Business Center",
        location: "Rua Comandante Gika, Edifício Garden Towers, Torre B, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        collaborations: 8
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        collaborations: 12
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        collaborations: 7
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        collaborations: 9
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        collaborations: 5
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        collaborations: 11
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        collaborations: 6
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 10
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        collaborations: 4
    }
];

const CollaborationsChart = () => {
    return (
        <>
            <h1 className={"text-2xl mb-4"}>
                Número de Colaborações por Afiliada
            </h1>


            <Card>
                <CardHeader>
                    <CardTitle>Número de Colaborações</CardTitle>
                    <CardDescription>Gráfico de barras mostrando o número de colaborações por afiliada</CardDescription>
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
                            <Bar dataKey="collaborations" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default CollaborationsChart;

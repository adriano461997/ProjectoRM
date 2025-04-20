import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {affiliatesData, formataDinheiro} from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Expandindo os dados com métricas simuladas
const affiliatesWithMetrics = [
    {
        name: "Luanda Business Center",
        location: "Rua Comandante Gika, Edifício Garden Towers, Torre B, Luanda",
        createdAt: "24/11/2024",
        insights: 45,
        engagement: 85,
        region: "Centro"
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024",
        insights: 32,
        engagement: 78,
        region: "Sul"
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024",
        insights: 58,
        engagement: 92,
        region: "Sul"
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024",
        insights: 28,
        engagement: 65,
        region: "Leste"
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024",
        insights: 40,
        engagement: 88,
        region: "Centro"
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024",
        insights: 35,
        engagement: 72,
        region: "Norte"
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024",
        insights: 50,
        engagement: 95,
        region: "Centro"
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024",
        insights: 25,
        engagement: 68,
        region: "Oeste"
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024",
        insights: 42,
        engagement: 82,
        region: "Centro"
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024",
        insights: 38,
        engagement: 75,
        region: "Norte"
    }
];

export default function Dashboard(props: any) {
    return (
        <AuthenticatedLayout

        >
            <Head title="Dashboard" />

            <div>
                <h1 className={"text-2xl font-semibold"}>Dashboard</h1>
                <p className={"text-gray-500"}>
                    Relatórios dos últimos 7 dias
                </p>
            </div>

            <div className={"grid grid-cols-1 md:grid-cols-4 gap-3"}>
                <div className={"bg-white rounded-lg p-4 shadow"}>
                    <h2 className={"text-lg font-bold"}>Quantidade</h2>
                    <p className={"text-2xl font-bold"}>{props.quantidade}</p>
                </div>

                <div className={"bg-white rounded-lg p-4 shadow"}>
                    <h2 className={"text-lg font-bold"}>Unidades</h2>
                    <p className={"text-2xl font-bold"}>{props.unidade}</p>
                </div>

                <div className={"bg-white rounded-lg p-4 shadow"}>
                    <h2 className={"text-lg font-bold"}>Preço</h2>
                    <p className={"text-2xl font-bold"}>{formataDinheiro(props.preco)}</p>
                </div>

                <div className={"bg-white flex items-center rounded-lg p-4 shadow"}>
                    <h2 className={"text-lg font-bold"}>
                        Relatórios dos últimos 7 dias
                    </h2>
                </div>
            </div>


            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Top 5 Empresas</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={props.empresas}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <XAxis
                                dataKey="nome"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />

                            <Bar dataKey="insights" fill="#8884d8" />

                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


        </AuthenticatedLayout>
    );
}


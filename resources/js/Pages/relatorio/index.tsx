import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import dayjs from "dayjs";
import {formataDinheiro, formataNumero} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {useMemo} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// Dados simulados de custos operacionais

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard(props: any) {

    const form = useForm({
        de: props.query.de ? dayjs(props.query.de).format("YYYY-MM-DD") : dayjs(props.data_inicial).format("YYYY-MM-DD"),
        ate: props.query.ate ? dayjs(props.query.ate).format("YYYY-MM-DD") : dayjs(props.data_final).format("YYYY-MM-DD"),
        a_id: props.query.a_id || "",
    });

    const handleFiltrar = (e)=>{
        e.preventDefault();
        form.get(route("relatorio.index", [props.c.slug]), {
            de: form.data.de,
            ate: form.data.ate,
            a_id: form.data.a_id,
        });
    }

    const empresas = useMemo(()=>{
        return props.empresas.map((item)=>{
            return {
                ...item,
                preco: item.preco,
                quantidade: item.quantidade,
                unidades: item.unidade,
                value: 10,
            }
        })
    }, [props.empresas]);

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Dashboard", url: route("dashboard") },
                { label: "Relatórios", url: null },
                { label: props.c.nome, url: null }
            ]}
        >
            <Head title={props.c.nome} />


            <div>
                <div className="text-2xl font-bold text-gray-800">{props.c.nome}</div>
                <div className="text-sm text-gray-400">{props.c.descricao}</div>
            </div>
            <form onSubmit={handleFiltrar}>
                <div className="flex flex-col md:flex-row gap-3 mt-1">

                    <div className={"w-auto md:w-1/6"}>
                        <Label>De</Label>
                        <Input value={form.data.de} onChange={(e)=> form.setData("de", e.target.value)} type="date" />
                    </div>

                    <div className={"w-auto md:w-1/6"}>
                        <Label>Até</Label>
                        <Input max={dayjs().format("YYYY-MM-DD")} value={form.data.ate} onChange={(e)=> form.setData("ate", e.target.value)} type="date" />
                    </div>

                    <div className={"w-auto md:w-1/5 md:self-end"}>
                        <Select onValueChange={(value) => form.setData("a_id", value)} value={form.data.a_id}>
                            <SelectTrigger>
                                <SelectValue  placeholder={"Selecionar empresa"}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"-1"}>Todos</SelectItem>
                                {
                                    props.empresas_data.map((item, index) => (
                                        <SelectItem key={index} value={item.id.toString()}>{item.nome}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={"md:self-end self-center w-full md:w-auto"}>
                        <Button className={"w-full md:w-auto"}>
                            Filtrar
                        </Button>
                    </div>

                </div>
            </form>

            <div className={"grid grid-cols-1 gap-5 md:grid-cols-3 mb-5"}>
                <div className={"bg-white rounded-lg shadow-md"}>
                    <div className={"p-3"}>
                        <div className={"text-xl text-gray-400"}>Total</div>
                        <div className={"text-2xl font-bold text-gray-800"}>{formataDinheiro(props.preco)}</div>
                    </div>
                </div>

                <div className={"bg-white shadow-md"}>
                    <div className={"p-3"}>
                        <div className={"text-xl text-gray-400"}>Quantidade</div>
                        <div className={"text-2xl font-bold text-gray-800"}>{props.quantidade}</div>
                    </div>
                </div>

                <div className={"bg-white shadow-md"}>
                    <div className={"p-3"}>
                        <div className={"text-xl text-gray-400"}>Unidades</div>
                        <div className={"text-2xl font-bold text-gray-800"}>{props.unidade}</div>
                    </div>
                </div>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Comparações total de preços</CardTitle>
                    <CardDescription>
                        Comparação de preços total
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={empresas}
                            margin={{top: 20, right: 30, left: 20, bottom: 60}}
                        >

                            <XAxis
                                dataKey="nome"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />

                            <YAxis/>

                            <Tooltip
                                formatter={(value, name) => {
                                    if(name === "Preço") {
                                        return formataDinheiro(value);
                                    } else {
                                        return formataNumero(value);
                                    }
                                }}
                            />

                            <Legend />

                            <Bar dataKey="preco" stackId="a" fill="#00C49F" name="Preço"/>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>
                        Comparações de quantidades
                    </CardTitle>
                    <CardDescription>
                        Comparação de quantidades total
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={empresas}
                            margin={{top: 20, right: 30, left: 20, bottom: 60}}
                        >

                            <XAxis
                                dataKey="nome"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />

                            <YAxis/>

                            <Tooltip
                                formatter={(value, name) => {
                                    if(name === "Preço") {
                                        return formataDinheiro(value);
                                    } else {
                                        return formataNumero(value);
                                    }
                                }}
                            />

                            <Legend />

                            <Bar dataKey="quantidade" stackId="a" fill="#0088FE" name="Quantidade"/>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>
                        Comparações de unidades
                    </CardTitle>
                    <CardDescription>
                        Comparação de unidades total
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={empresas}
                            margin={{top: 20, right: 30, left: 20, bottom: 60}}
                        >

                            <XAxis
                                dataKey="nome"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />

                            <YAxis/>

                            <Tooltip
                                formatter={(value, name) => {
                                    if(name === "Preço") {
                                        return formataDinheiro(value);
                                    } else {
                                        return formataNumero(value);
                                    }
                                }}
                            />

                            <Legend />

                            <Bar dataKey="unidades" stackId="a" fill="#FFBB28" name="Unidades"/>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            {
                /*

                            <Card>
                <CardHeader>
                    <CardTitle>
                        Comparações de unidades
                    </CardTitle>
                    <CardDescription>
                        Comparação de unidades total
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={empresas}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {empresas.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

                 */
            }

        </AuthenticatedLayout>
    );
}

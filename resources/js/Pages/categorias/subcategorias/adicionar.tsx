import {Head, Link, router, useForm} from "@inertiajs/react";
import * as React from "react";
import {PageProps} from "@/types";
import {Button} from "@/components/ui/button";
import {Loading} from "notiflix";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface Props extends PageProps {
    categoria: any;
    item?: any;
    mode: "add" | "editar";
}

function Index(props: Props) {
    const {post, data, setData, errors, processing} = useForm({
        nome: props.item?.nome ?? "",
        conta: props.item?.conta ?? "",
        tipo: props.item?.tipo?.toString() ?? "0",
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (props.mode === "add") {
            post(route("categorias.subcategorias.add_post", [props.categoria.id]));
        } else {
            post(route("categorias.subcategorias.editar_post", [props.categoria.id, props.item.id]));
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("dashboard")},
                {label: "Categorias", url: route("categorias.index")},
                {label: props.categoria.nome, url: route("categorias.subcategorias.index", [props.categoria.id])},
                {label: props.mode === "add" ? "Adicionar subcategoria" : "Editar subcategoria", url: null},
            ]}>

            <Head title={props.mode === "add" ? "Adicionar subcategoria" : "Editar subcategoria"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>
                <div className={"w-full max-w-xl mx-auto"}>
                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode === "add" ? "Adicionar Subcategoria" : "Editar Subcategoria"}
                            </div>
                            <div className={"text-sm text-gray-400"}>
                                Categoria: {props.categoria.nome}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className={"mt-5"}>
                            <div className={"mb-3"}>
                                <Label>Nome</Label>
                                <Input
                                    value={data.nome}
                                    onChange={(e) => setData("nome", e.target.value)}
                                    placeholder={"Nome da subcategoria"}
                                />
                                {errors.nome && <div className={"text-red-500 text-sm"}>{errors.nome}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Conta</Label>
                                <Input
                                    value={data.conta}
                                    onChange={(e) => setData("conta", e.target.value)}
                                    placeholder={"Número ou código da conta"}
                                />
                                {errors.conta && <div className={"text-red-500 text-sm"}>{errors.conta}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Tipo</Label>
                                <Select 
                                    onValueChange={(value) => setData("tipo", value)}
                                    value={data.tipo}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Selecione o tipo"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Receitas</SelectItem>
                                        <SelectItem value="1">Custos e Despesas</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && <div className={"text-red-500 text-sm"}>{errors.tipo}</div>}
                            </div>

                            <div className={"flex gap-2"}>
                                <Button disabled={processing} type={"submit"} className={"mt-5"}>
                                    {props.mode === "add" ? "Adicionar" : "Atualizar"}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    type="button" 
                                    className={"mt-5"} 
                                    onClick={() => router.get(route("categorias.subcategorias.index", [props.categoria.id]))}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;

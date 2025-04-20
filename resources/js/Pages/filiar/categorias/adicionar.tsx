import {Head, Link, router, useForm} from "@inertiajs/react";
import * as React from "react";
import {PageProps} from "@/types";
import {Button} from "@/components/ui/button";
import {Loading} from "notiflix";
import {useAlert} from "@/components/AlertDialogProvider";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface Props extends PageProps{
    saldo: number,
}

const formatDate = (date) => {
    if (!date) return ""; // Verifica se a data está presente
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Adiciona zero à esquerda se necessário
    const day = String(d.getDate()).padStart(2, "0"); // Adiciona zero à esquerda se necessário
    return `${year}-${month}-${day}`;
};

function Index(props: Props){

   const {post, data, setData, errors, processing} = useForm({
       unidade: props.item?.unidade?.toString() ?? "",
       quantidade: props.item?.quantidade?.toString() ?? "",
       preco: props.item?.preco ?? "",
       data_inicio: formatDate(props.item?.data_inicio),
       data_fim: formatDate(props.item?.data_fim),
   })

    const onSubmit = async (e) => {
        e.preventDefault();
        post(props.mode == "add" ? route("filiar.categoria.add", [props.f.slug, props.c.slug]):route("filiar.categoria.editar", [props.f.slug, props.c.slug, props.item.id]), {
        });
    };

    return(
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("filiar.index", [props.f.slug])},
                {label: props.c.nome, url: route("filiar.categoria.index", [props.f.slug, props.c.slug])},
                {label: "Adicionar relatório", url: null},
            ]}>

            <Head title={props.mode == "add" ? "Adicionar relatório":"Actualizar relatório"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>

                <div className={"w-full max-w-xl mx-auto"}>

                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode == "add" ? "Adicionar relatório":"Actualizar relatório"}
                            </div>
                            <div className={"text-sm text-gray-400"}>
                                {
                                    props.mode === "add" ? (
                                        "Adicione novo relatório na categoria "+props.c.nome
                                    ) : (
                                        "Actualize os dados do relatório "+props.c.nome
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className={"mt-5"}>

                            <div className={"mb-3"}>
                                <Label>Unidade</Label>
                                <Input
                                    value={data.unidade}
                                    onChange={(e) => setData("unidade", e.target.value)}
                                    type={"number"}
                                    placeholder={""}
                                />
                                {errors.unidade && <div className={"text-red-500 text-sm"}>{errors.unidade}</div>}
                            </div>


                            <div className={"mb-3"}>
                                <Label>Quantidade</Label>
                                <Input
                                    value={data.quantidade}
                                    onChange={(e) => setData("quantidade", e.target.value)}
                                    type={"number"}
                                    placeholder={""}
                                />
                                {errors.quantidade && <div className={"text-red-500 text-sm"}>{errors.quantidade}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Preço</Label>
                                <Input
                                    value={data.preco}
                                    onChange={(e) => setData("preco", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.preco && <div className={"text-red-500 text-sm"}>{errors.preco}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Data de inicio</Label>
                                <Input
                                    value={data.data_inicio}
                                    type={"date"}
                                    onChange={(e) => setData("data_inicio", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.data_inicio && <div className={"text-red-500 text-sm"}>{errors.data_inicio}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Data de fim</Label>
                                <Input
                                    value={data.data_fim}
                                    type={"date"}
                                    onChange={(e) => setData("data_fim", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.data_fim && <div className={"text-red-500 text-sm"}>{errors.data_fim}</div>}
                            </div>

                            <div className={""}>
                                <Button disabled={processing} type={"submit"} className={"mt-5"}>
                                    {props.mode == "add" ? "Adicionar" : "Actualizar"}
                                </Button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>


        </AuthenticatedLayout>
    )
}

export default Index;

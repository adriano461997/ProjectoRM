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

function Index(props: Props){

   const {post, data, setData, errors, processing} = useForm({
       nome: props.item?.nome ?? "",
       tipo_receita_id: props.item?.tipo_receita_id?.toString() ?? "",
       descricao: props.item?.descricao ?? "",
   })

    const onSubmit = async (e) => {
        e.preventDefault();
        post(props.mode == "add" ? route("categorias.add_post"):route("categorias.editar_post", [props.item.id]), {
        });
    };

    return(
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("dashboard")},
                {label: "Adicionar categoria", url: null},
            ]}>

            <Head title={props.mode == "add" ? "Adicionar categoria":"Actualizar categoria"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>

                <div className={"w-full max-w-xl mx-auto"}>

                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode == "add" ? "Adicionar Categoria":"Actualizar Categoria"}
                            </div>
                            <div className={"text-sm text-gray-400"}>
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
                                    placeholder={""}
                                />
                                {errors.nome && <div className={"text-red-500 text-sm"}>{errors.nome}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Tipo</Label>
                                <Select onValueChange={(value) => setData("tipo_receita_id", value)}
                                        value={data.tipo_receita_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={""}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            props.tipos.map((item, index) => (
                                                <SelectItem key={index}
                                                            value={item.id.toString()}>{item.nome}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {errors.tipo_receita_id &&
                                    <div className={"text-red-500 text-sm"}>{errors.tipo_receita_id}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Descrição</Label>
                                <Input
                                    value={data.descricao}
                                    onChange={(e) => setData("descricao", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.descricao && <div className={"text-red-500 text-sm"}>{errors.descricao}</div>}
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

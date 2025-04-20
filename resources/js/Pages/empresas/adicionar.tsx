import {Head,  useForm} from "@inertiajs/react";
import * as React from "react";
import {PageProps} from "@/types";
import {Button} from "@/components/ui/button";
import {useAlert} from "@/components/AlertDialogProvider";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface Props extends PageProps{
    saldo: number,
}

function Index(props: Props){

   const {post, data, setData, errors, processing} = useForm({
       nome: props.item?.nome ?? "",
       tipo_receita_id: props.item?.tipo_receita_id ?? "",
       endereco: props.item?.endereco ?? "",
       telefone: props.item?.telefone ?? "",
   })

    const alert = useAlert();

    const onSubmit = async (e) => {
        e.preventDefault();
        post(props.mode == "add" ? route("empresas.add_post"):route("empresas.editar_post", [props.item.id]));
    };

    return(
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("dashboard")},
                {label: "Adicionar empresa", url: null},
            ]}>

            <Head title={props.mode == "add" ? "Adicionar empresa":"Actualizar empresa"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>

                <div className={"w-full max-w-xl mx-auto"}>

                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode == "add" ? "Adicionar empresa":"Actualizar empresa"}
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
                                <Label>Telefone</Label>
                                <Input
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.telefone && <div className={"text-red-500 text-sm"}>{errors.telefone}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Endereço</Label>
                                <Input
                                    value={data.endereco}
                                    onChange={(e) => setData("endereco", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.endereco && <div className={"text-red-500 text-sm"}>{errors.endereco}</div>}
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

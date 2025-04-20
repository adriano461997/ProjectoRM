import {Head,  useForm} from "@inertiajs/react";
import * as React from "react";
import {PageProps} from "@/types";
import {Button} from "@/components/ui/button";
import {useAlert} from "@/components/AlertDialogProvider";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {MultiSelect} from "@/components/multi-select";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Props extends PageProps{
    saldo: number,
}

function Index(props: Props){

   const {post, data, setData, errors, processing} = useForm({
       nome: props.item?.name ?? "",
       email: props.item?.email ?? "",
       empresas: props.item?.empresas ?? [],
       password: "",
       admin: props.item?.admin?.toString() ?? "0",
   })

    const alert = useAlert();

    const onSubmit = async (e) => {
        e.preventDefault();
        post(props.mode == "add" ? route("usuarios.add_post"):route("usuarios.editar_post", [props.item.id]));
    };

    console.log(props.empresas);

    return(
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("dashboard")},
                {label: "Adicionar usuário", url: null},
            ]}>

            <Head title={props.mode == "add" ? "Adicionar usuário":"Actualizar usuário"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>

                <div className={"w-full max-w-xl mx-auto"}>

                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode == "add" ? "Adicionar usuário":"Actualizar usuário"}
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
                                <Label>Email</Label>
                                <Input
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.email && <div className={"text-red-500 text-sm"}>{errors.email}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Palavra-passe</Label>
                                <Input
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder={""}
                                />
                                {errors.password && <div className={"text-red-500 text-sm"}>{errors.password}</div>}
                            </div>

                            <div className="mb-3">
                                <Label>Empresas</Label>
                                <MultiSelect
                                    options={props.empresas.map((item) => ({label: item.nome, value: item.id}))}
                                    onValueChange={(value) => {
                                        setData("empresas", value)
                                    }}
                                    defaultValue={props.mode === "editar" ? props.empresas_selected : []}
                                    placeholder="Selecionar empresas"
                                    variant="inverted"
                                    animation={2}
                                    maxCount={3}
                                />
                            </div>

                            <div className={"mb-3"}>
                                <Label>Administrador geral</Label>
                                <Select onValueChange={(value) => setData("admin", value)} value={data.admin}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={""}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                         <SelectItem  value={"0"}>Não</SelectItem>
                                         <SelectItem  value={"1"}>Sim</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.admin && <div className={"text-red-500 text-sm"}>{errors.admin}</div>}
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

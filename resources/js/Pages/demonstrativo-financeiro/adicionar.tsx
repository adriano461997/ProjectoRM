import {Head, Link, router, useForm} from "@inertiajs/react";
import * as React from "react";
import {PageProps} from "@/types";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {format, parseISO} from "date-fns";

interface Props extends PageProps {
    mode: "add" | "editar";
    item?: any;
    categorias: any[];
    subcategorias: any[];
    categoria_id?: string;
    f: any
}

function Adicionar(props: Props) {
    const [subcategorias, setSubcategorias] = useState(props.subcategorias || []);
    const [categoriaId, setCategoriaId] = useState(props.categoria_id || props.item?.subcategoria?.categoria_id || "");

    const {post, data, setData, errors, processing} = useForm({
        subcategoria_id: props.item?.subcategoria_id?.toString() ?? "",
        valor: props.item?.valor?.toString() ?? "",
        data: props.item?.data ? format(parseISO(props.item.data), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        categoria_id: categoriaId,
    });

    // Carregar subcategorias quando a categoria mudar
    const handleCategoriaChange = async (value: string) => {
        setCategoriaId(value);
        setData("categoria_id", value);
        setData("subcategoria_id", "");

        if (value) {
            try {
                const response = await fetch(route("demonstrativo-financeiro.subcategorias", props.f.slug) + `?categoria_id=${value}`);
                const data = await response.json();
                setSubcategorias(data);
            } catch (error) {
                console.error("Erro ao carregar subcategorias:", error);
            }
        } else {
            setSubcategorias([]);
        }
    };

    // Carregar subcategorias iniciais se estiver editando
    useEffect(() => {
        if (props.mode === "editar" && props.item?.subcategoria?.categoria_id) {
            setCategoriaId(props.item.subcategoria.categoria_id.toString());
        }
    }, [props.mode, props.item]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (props.mode === "add") {
            post(route("demonstrativo-financeiro.add_post", props.f.slug));
        } else {
            post(route("demonstrativo-financeiro.editar_post", [props.f.slug, props.item.id]));
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: "Dashboard", url: route("dashboard", props.f.slug)},
                {label: "Demonstrativo Financeiro", url: route("demonstrativo-financeiro.index", props.f.slug)},
                {label: props.mode === "add" ? "Adicionar Lançamento" : "Editar Lançamento", url: null},
            ]}>

            <Head title={props.mode === "add" ? "Adicionar Lançamento" : "Editar Lançamento"} />

            <div className={"flex flex-1 items-center justify-center w-full"}>
                <div className={"w-full max-w-xl mx-auto"}>
                    <div className={"flex justify-between items-center"}>
                        <div>
                            <div className={"text-xl"}>
                                {props.mode === "add" ? "Adicionar Lançamento" : "Editar Lançamento"}
                            </div>
                            <div className={"text-sm text-gray-400"}>
                                Preencha os dados do lançamento financeiro
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className={"mt-5"}>
                            <div className={"mb-3"}>
                                <Label>Categoria</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData("categoria_id", value);
                                        handleCategoriaChange(value);
                                    }}
                                    defaultValue={data.categoria_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.categorias.map((categoria) => (
                                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                {categoria.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoria_id && <div className={"text-red-500 text-sm"}>{errors.categoria_id}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Subcategoria</Label>
                                <Select
                                    onValueChange={(value) => setData("subcategoria_id", value)}
                                    defaultValue={data.subcategoria_id}
                                    disabled={subcategorias.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma subcategoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategorias.map((subcategoria) => (
                                            <SelectItem key={subcategoria.id} value={subcategoria.id.toString()}>
                                                {subcategoria.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.subcategoria_id && <div className={"text-red-500 text-sm"}>{errors.subcategoria_id}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Valor</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.valor}
                                    onChange={(e) => setData("valor", e.target.value)}
                                    placeholder={"0.00"}
                                />
                                {errors.valor && <div className={"text-red-500 text-sm"}>{errors.valor}</div>}
                            </div>

                            <div className={"mb-3"}>
                                <Label>Data</Label>
                                <Input
                                    type="date"
                                    value={data.data}
                                    onChange={(e) => setData("data", e.target.value)}
                                />
                                {errors.data && <div className={"text-red-500 text-sm"}>{errors.data}</div>}
                            </div>

                            <div className={"flex gap-2"}>
                                <Button disabled={processing} type={"submit"} className={"mt-5"}>
                                    {props.mode === "add" ? "Adicionar" : "Atualizar"}
                                </Button>
                                <Button variant="outline" asChild className={"mt-5"}>
                                    <Link href={route("demonstrativo-financeiro.index", props.f.slug)}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Adicionar;

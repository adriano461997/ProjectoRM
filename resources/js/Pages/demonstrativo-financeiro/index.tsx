import {Head, Link, router, useForm, usePage} from "@inertiajs/react";
import * as React from "react";
import { PageProps, PaginationData } from "@/types";
import {memo, useEffect, useState} from "react";
import { CustomPaginate } from "@/components/CustomPaginate";
import { useConfirm } from "@/components/AlertDialogProvider";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {format, parseISO} from "date-fns";

interface Props extends PageProps {
    items: PaginationData<any>;
    categorias: any[];
    subcategorias: any[];
    filtros: {
        data_inicio: string;
        data_fim: string;
        categoria_id: string;
        subcategoria_id: string;
    },
    f: any
}

function Index(props: Props) {
    const [items, setItems] = useState(props.items);
    const [subcategorias, setSubcategorias] = useState(props.subcategorias);

    const formFiltros = useForm({
        data_inicio: props.filtros.data_inicio ?? "",
        data_fim: props.filtros.data_fim ?? "",
        categoria_id: props.filtros.categoria_id ?? "",
        subcategoria_id: props.filtros.subcategoria_id ?? "",
    });

    useEffect(() => {
        setItems(props.items);
        setSubcategorias(props.subcategorias);
    }, [props.items, props.subcategorias]);

    const confirm = useConfirm();

    const handleMenu = async (id: number, item: any) => {
        if (id === 0) {
            const c = await confirm({
                title: "Remover Lançamento?",
                body: "Tem a certeza que deseja remover este lançamento?",
                actionButton: "Sim",
                cancelButton: "Não",
                cancelButtonVariant: "destructive",
            });
            if (c) {
                const url = route("demonstrativo-financeiro.eliminar", [props.f.slug, item.id]);
                router.post(url, {}, {
                    preserveState: false,
                });
            }
        }
    };

    // Função para filtrar os dados
    const handleFiltrar = (e: React.FormEvent) => {
        e.preventDefault();
        formFiltros.get(route("demonstrativo-financeiro.index", props.f.slug));
    };

    // Função para carregar subcategorias quando a categoria mudar
    const handleCategoriaChange = async (value: string) => {
        formFiltros.setData("categoria_id", value);
        formFiltros.setData("subcategoria_id", "all");

        if (value && value !== "all") {
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

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Dashboard", url: route("dashboard", props.f.slug) },
                { label: "Demonstrativo Financeiro", url: null }
            ]}
        >
            <Head title={"Demonstrativo Financeiro"} />

            <div className="p-5">
                <div className="flex justify-between items-center mb-5 flex-col md:flex-row">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-semibold text-foreground">
                            Demonstrativo Financeiro
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lista de lançamentos financeiros
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={route("demonstrativo-financeiro.report", props.f.slug)}>
                                Demonstração de Resultados
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route("demonstrativo-financeiro.add", props.f.slug)}>
                                Adicionar Lançamento
                            </Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleFiltrar}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                        <div>
                            <Label>Data Início</Label>
                            <Input
                                type="date"
                                value={formFiltros.data.data_inicio}
                                onChange={(e) => formFiltros.setData("data_inicio", e.target.value)}
                                className="rounded-lg"
                            />
                        </div>
                        <div>
                            <Label>Data Fim</Label>
                            <Input
                                type="date"
                                value={formFiltros.data.data_fim}
                                onChange={(e) => formFiltros.setData("data_fim", e.target.value)}
                                className="rounded-lg"
                            />
                        </div>
                        <div>
                            <Label>Categoria</Label>
                            <Select 
                                onValueChange={(value) => {
                                    formFiltros.setData("categoria_id", value);
                                    handleCategoriaChange(value);
                                }}
                                defaultValue="all"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as categorias</SelectItem>
                                    {props.categorias.map((categoria) => (
                                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                            {categoria.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Subcategoria</Label>
                            <Select
                                onValueChange={(value) => formFiltros.setData("subcategoria_id", value)}
                                defaultValue="all"
                                disabled={formFiltros.data.categoria_id === "all" || subcategorias.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma subcategoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as subcategorias</SelectItem>
                                    {subcategorias.map((subcategoria) => (
                                        <SelectItem key={subcategoria.id} value={subcategoria.id.toString()}>
                                            {subcategoria.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-5">
                        <Button type={"submit"}>
                            Filtrar
                        </Button>
                        <Button variant={"outline"} asChild>
                            <Link href={route("demonstrativo-financeiro.index", props.f.slug)}>
                                Limpar filtros
                            </Link>
                        </Button>
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full bg-background border">
                        <thead className="bg-gray-100 dark:bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Data</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Categoria</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Subcategoria</th>
                            <th className="px-6 py-3 text-right border-b whitespace-nowrap text-foreground">Valor</th>
                            <th className="px-6 py-3 border-b text-right whitespace-nowrap text-foreground">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.data.map((item) => (
                            <Item key={item.id} item={item} handleMenu={handleMenu} />
                        ))}
                        </tbody>
                    </table>
                </div>

                {
                    items.data.length === 0 && (
                        <div className="text-center p-5 text-red-500 mt-5 text-xl">
                            Nenhum lançamento encontrado
                        </div>
                    )
                }

                <div className="mt-5">
                    <CustomPaginate items={props.items}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

interface ItemProps {
    item: any;
    handleMenu: (id: number, item: any) => Promise<void>;
}

const Item = memo(({
                       item, handleMenu
                   }: ItemProps) => {

    const {props} = usePage();

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
        }).format(valor);
    };

    const formatarData = (data: string) => {
        try {
            return format(parseISO(data), 'dd/MM/yyyy');
        } catch (e) {
            return data;
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-[#333]">
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{formatarData(item.data)}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.subcategoria?.categoria?.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.subcategoria?.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground text-right">{formatarValor(item.valor)}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground text-right">
                <Link href={route("demonstrativo-financeiro.editar", [props.f.slug, item.id])} className="text-primary hover:underline ml-3">Editar</Link>
                <button onClick={()=>handleMenu(0, item)} className="text-red-500 hover:underline ml-3">Excluir</button>
            </td>
        </tr>
    );
});

export default Index;

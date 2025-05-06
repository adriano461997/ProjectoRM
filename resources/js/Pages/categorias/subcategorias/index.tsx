import {Head, Link, router, useForm} from "@inertiajs/react";
import * as React from "react";
import { PageProps } from "@/types";
import {memo, useEffect, useState} from "react";
import { CustomPaginate } from "@/components/CustomPaginate";
import { useConfirm } from "@/components/AlertDialogProvider";
import {Loading} from "notiflix";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface Props extends PageProps {
    items: {
        data: any[];
    };
    categoria: any;
}

function Index(props: Props) {
    const [search, setSearch] = useState('');
    const [items, setItems] = useState(props.items);

    const formFiltros = useForm({
         q: props.query.q ?? "",
         tipo: props.query.tipo ?? "all",
    });

    useEffect(()=>{
        setItems(props.items);
    },[items]);

    const confirm = useConfirm();

    const handleMenu = async (id, item) => {
        if(id === 0){
            const c = await confirm({
                title: "Remover Subcategoria?",
                body: "Tem a certeza que deseja remover esta subcategoria?",
                actionButton: "Sim",
                cancelButton: "Não",
                cancelButtonVariant: "destructive",
            });
            if(c){
                const url = route("categorias.subcategorias.eliminar", [props.categoria.id, item.id]);
                router.post(url, {}, {
                    preserveState: false,
                })
            }
        }
    };

    // Função para filtrar os dados
    const handleFiltrar = (e) => {
        e.preventDefault();
        formFiltros.get(route("categorias.subcategorias.index", [props.categoria.id]));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Dashboard", url: route("dashboard") },
                { label: "Categorias", url: route("categorias.index") },
                { label: props.categoria.nome, url: null },
                { label: "Subcategorias", url: null }
            ]}
        >
            <Head title={`Subcategorias - ${props.categoria.nome}`} />

            <div className="p-5">
                <div className="flex justify-between items-center mb-5 flex-col md:flex-row">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-semibold text-foreground">
                            Subcategorias de {props.categoria.nome}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lista de subcategorias
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route("categorias.subcategorias.add", [props.categoria.id])}>
                            Adicionar subcategoria
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleFiltrar}>
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-5">
                        <Input
                            placeholder={"Pesquisar"}
                            value={formFiltros.data.q}
                            onChange={(e) => {
                                formFiltros.setData("q", e.target.value);
                            }}
                            className="rounded-lg"
                        />
                        <Select
                            onValueChange={(value) => formFiltros.setData("tipo", value)}
                            defaultValue={formFiltros.data.tipo}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os tipos</SelectItem>
                                <SelectItem value="0">Receitas</SelectItem>
                                <SelectItem value="1">Custos e Despesas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type={"submit"}>
                            Filtrar
                        </Button>
                        <Button variant={"outline"} asChild>
                            <Link href={route("categorias.subcategorias.index", [props.categoria.id])}>
                                Limpar filtros
                            </Link>
                        </Button>
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full bg-background border">
                        <thead className="bg-gray-100 dark:bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Nome</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Conta</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Tipo</th>
                            <th className="px-6 py-3 border-b text-right whitespace-nowrap text-foreground">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.data.map((item) => (
                            <Item key={item.id} item={item} handleMenu={handleMenu} categoriaId={props.categoria.id} />
                        ))}
                        </tbody>
                    </table>
                </div>

                {
                    items.data.length === 0 && (
                        <div className="text-center p-5 text-red-500 mt-5 text-xl">
                            Nenhuma subcategoria encontrada
                        </div>
                    )
                }

                <CustomPaginate className="mt-5" items={props.items}/>
            </div>
        </AuthenticatedLayout>
    );
}

const Item = memo(({
                       item, handleMenu, categoriaId
                   }: {
    item: any, 
    handleMenu: (id: number, item: any) => void,
    categoriaId: number
}) => {
    const getTipoLabel = (tipo: number) => {
        switch(tipo) {
            case 0: return 'Receitas';
            case 1: return 'Custos e Despesas';
            default: return 'Desconhecido';
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-[#333]">
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.conta}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{getTipoLabel(item.tipo)}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground text-right">
                <Link href={route("categorias.subcategorias.editar", [categoriaId, item.id])} className="text-primary hover:underline ml-3">Editar</Link>
                <button onClick={()=>handleMenu(0, item)} className="text-red-500 hover:underline ml-3">Excluir</button>
            </td>
        </tr>
    );
});

export default Index;

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

interface Props extends PageProps {
    items: {
        data: any[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    query?: {
        q?: string;
    };
}

function Index(props: Props) {

    const [search, setSearch] = useState('');
    const [items, setItems] = useState(props.items);

    const formFiltros = useForm({
         q: props.query?.q ?? "",
    });

    useEffect(()=>{
        setItems(props.items);
    },[items]);

    const confirm = useConfirm();

    const handleMenu = async (id: number, item: any) => {
        if(id === 0){
            const c = await confirm({
                title: "Remover Categoria?",
                body: "Tem a certeza que deseja remover esta categoria?",
                actionButton: "Sim",
                cancelButton: "Não",
                cancelButtonVariant: "destructive",
            });
            if(c){
                const url = route("categorias.eliminar", [item.id]);
                router.post(url, {}, {
                    preserveState: false,
                })
            }
        }
    };

    // Função para filtrar os dados
    const handleFiltrar = (e: React.FormEvent) => {
        e.preventDefault();
        formFiltros.get(route("categorias.index"));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Dashboard", url: route("dashboard") },
                { label: "Categorias", url: null }
            ]}
        >
            <Head title={"Categorias"} />

            <div className="p-5">

                <div className="flex justify-between items-center mb-5 flex-col md:flex-row">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-semibold text-foreground">
                            Categorias
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lista de categorias
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route("categorias.add")}>
                            Adicionar categoria
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleFiltrar}>
                    <div className="flex flex-col md:flex-row items-center gap-3  mb-5">
                        <Input
                        placeholder={"Pesquisar"}
                        value={formFiltros.data.q}
                        onChange={(e) => {
                            formFiltros.setData("q", e.target.value);
                        }}
                        className="rounded-lg"
                        />
                        <Button type={"submit"}>
                            Filtrar
                        </Button>
                        <Button variant={"outline"} asChild>
                            <Link href={route("categorias.index")}>
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
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Descrição</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Tipo</th>
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
                            Nenhum dado encontrado
                        </div>
                    )
                }

                <CustomPaginate className="mt-5" items={props.items}/>
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


    return (
        <tr  className="hover:bg-gray-50 dark:hover:bg-[#333]">
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.descricao}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.tipo_receita?.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground text-right">
                <Link href={route("categorias.subcategorias.index", [item.id])} className="text-blue-500 hover:underline">Subcategorias</Link>
                <Link href={route("categorias.editar", [item.id])} className="text-primary hover:underline ml-3">Editar</Link>
                <button onClick={()=>handleMenu(0, item)} className="text-red-500 hover:underline ml-3">Excluir</button>
            </td>
        </tr>
    );
});

export default Index;

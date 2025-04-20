import {Head, Link, router, useForm} from "@inertiajs/react";
import * as React from "react";
import { PageProps } from "@/types";
import {memo, useEffect, useState} from "react";
import { CustomPaginate } from "@/components/CustomPaginate";
import { useConfirm } from "@/components/AlertDialogProvider";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface Props extends PageProps {
    items: {
        data: any[];
    };
}

function Index(props: Props) {

    const [search, setSearch] = useState('');
    const [items, setItems] = useState(props.items);

    const formFiltros = useForm({
         q: props.query.q ?? "",
    });

    useEffect(()=>{
        setItems(props.items);
    },[items]);

    const confirm = useConfirm();

    const handleMenu = async (id, item) => {
        if(id === 0){
            const c = await confirm({
                title: "Excluir empresa?",
                body: "Tem a certeza que deseja excluir esta empresa?",
                actionButton: "Sim",
                cancelButton: "Não",
                cancelButtonVariant: "destructive",
            });
            if(c){
                const url = route("empresas.eliminar", [item.id]);
                router.post(url, {}, {
                    preserveState: false,
                })
            }
        }
    };

    // Função para filtrar os dados
    const handleFiltrar = (e) => {
        e.preventDefault();
        formFiltros.get(route("empresas.index"));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Dashboard", url: route("dashboard") },
                { label: "Empresas", url: null }
            ]}
        >
            <Head title={"Empresas"} />

            <div className="p-5">

                <div className="flex justify-between items-center mb-5 flex-col md:flex-row">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-semibold text-foreground">
                            Empresas
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lista de empresas
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route("empresas.add")}>
                            Adicionar empresa
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
                            <Link href={route("empresas.index")}>
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
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Ident.</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Telefone</th>
                            <th className="px-6 py-3 text-left border-b whitespace-nowrap text-foreground">Endereço</th>
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

const Item = memo(({
                       item, handleMenu
                   }: {
    item: any, handleMenu
        : () => void
}) => {


    return (
        <tr  className="hover:bg-gray-50 dark:hover:bg-[#333]">
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.nome}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.slug}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.telefone}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground">{item.endereco}</td>
            <td className="px-6 py-3 border-b whitespace-nowrap text-foreground text-right">
                {/*<button className="text-blue-500 hover:underline">Editar</button>*/}
                <Link href={route("empresas.editar", [item.id])} className="text-primary hover:underline ml-3">Editar</Link>
                <button onClick={()=>handleMenu(0, item)} className="text-red-500 hover:underline ml-3">Excluir</button>
            </td>
        </tr>
    );
});

export default Index;

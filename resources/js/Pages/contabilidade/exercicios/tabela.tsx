import * as React from "react";
import { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { usePage, Link, router } from "@inertiajs/react";
import dayjs from "dayjs";
import req from "@/utils/req";
import { CheckCircle } from "lucide-react"; // Import the icon from lucide-react (which shadcn uses)

interface ItemType {
    id: number;
    nome: string;
    data_inicio: string;
    data_fim: string;
    activo: boolean;
    created_at: string;
}

interface Props {
    items: PaginationData<ItemType>;
    handleMenu: (id: number, item: ItemType) => void;
    activar: (item: ItemType) => void;
}

export default function DepTabela(props: Props) {
    const [search, setSearch] = useState("");
    const { props: props2 } = usePage();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            router.reload({
                data: {
                    q: search,
                },
            });
        }
    };

    const handleLimparFiltros = () => {
        router.visit(window.location.pathname);
    };

    return (
        <React.Fragment>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                        <label>Pesquisar exercícios</label>
                        <Input
                            placeholder="Digite o termo e pressione Enter..."
                            value={search}
                            onKeyDown={handleSearch}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <div>
                        <label>Limpar filtros</label>
                        <Button onClick={handleLimparFiltros}>
                            Limpar filtros
                        </Button>
                    </div>
                </div>
                <p>Total: {props.items.total}</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Data de início</TableCell>
                            <TableCell>Data de fim</TableCell>
                            <TableCell>Ativo</TableCell>
                            <TableCell>Data de criação</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.items.data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>
                                    {dayjs(row.data_inicio).format(
                                        "DD [de] MMMM [de] YYYY"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {dayjs(row.data_fim).format(
                                        "DD [de] MMMM [de] YYYY"
                                    )}
                                </TableCell>
                                <TableCell
                                    className={
                                        row.activo
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {row.activo ? "Sim" : "Não"}
                                </TableCell>
                                <TableCell>
                                    {dayjs(row.created_at).format("DD/MM/YYYY")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {!row.activo && (
                                            <Tooltip content="Ativar exercício como atual">
                                                <Button
                                                    onClick={() =>
                                                        props.activar(row)
                                                    }
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-primary"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                        <Button
                                            onClick={() =>
                                                props.handleMenu(0, row)
                                            }
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                props.handleMenu(1, row)
                                            }
                                            variant="destructive"
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {props.items.data.length === 0 && (
                    <div className="p-5 text-center text-red-500">
                        Nenhum item foi encontrado!
                    </div>
                )}
                <Pagination
                    currentPage={props.items.current_page}
                    totalPages={props.items.last_page}
                    onPageChange={(page) =>
                        router.visit(`${window.location.pathname}?page=${page}`)
                    }
                />
            </div>
        </React.Fragment>
    );
}

import * as React from "react";
import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { PaginationData } from "@/types";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";

interface ItemType {
    // ...existing code...
}

interface Props {
    items: PaginationData<ItemType>;
    handleMenu: (id: number, item: ItemType) => void;
}

export default function DepTabela(props: Props) {
    const [search, setSearch] = useState("");
    const { props: props2 } = usePage();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
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
            <div className="flex flex-wrap gap-1.5 mb-4">

                {
                    /*
                                    <div className="flex-1 min-w-[160px]">
                    <div className="space-y-2">
                        <Label htmlFor="search">Pesquisar movimentos</Label>
                        <div className="relative">
                            <Input
                                id="search"
                                placeholder="Digita o termo e clica enter..."
                                value={search}
                                onKeyDown={handleSearch}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                className="w-full"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon
                                    icon="lucide:search"
                                    className="h-4 w-4 text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                     */
                }



                {
                    /*
                                    <div className="min-w-[160px]">
                    <div className="space-y-2">
                        <Label>Limpar filtros</Label>
                        <Button
                            onClick={handleLimparFiltros}
                            variant="outline"
                            size="sm"
                            className="w-full"
                        >
                            Limpar filtros
                        </Button>
                    </div>
                </div>
                     */
                }
            </div>

            <p className="mb-2">Total: {props.items.total}</p>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº DOC</TableHead>
                                <TableHead>Exercicio</TableHead>
                                <TableHead>Diário</TableHead>
                                <TableHead>Data de lançamento</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Data de criação</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.items.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-bold">
                                        <Link
                                            href={
                                                window.location.pathname +
                                                "/editar/" +
                                                row.id
                                            }
                                        >
                                            {row.codigo_formatado}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{row.exercicio.nome}</TableCell>
                                    <TableCell>{row.diario?.nome}</TableCell>
                                    <TableCell>
                                        {dayjs(row.data_lancamento).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row.descricao ?? "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(row.created_at).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <ClienteMenu
                                            handleMenu={props.handleMenu}
                                            row={row}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {props.items.data.length === 0 && (
                    <div className="p-5">
                        <p className="text-center text-red-500 text-xl">
                            Nenhuma item foi encontrado!
                        </p>
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-between pt-4 hidden md:flex">
                {props.items.prev_page_url && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={props.items.prev_page_url}>
                            <Icon icon="lucide:chevron-left" className="mr-2" />
                            Anterior
                        </Link>
                    </Button>
                )}

                <div className="flex-1" />

                <Pagination>
                    <PaginationContent>
                        {props.items.links.map((link, index) => (
                            <PaginationItem key={index} active={link.active}>
                                <PaginationLink href={link.url}>
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>

                <div className="flex-1" />

                {props.items.next_page_url && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={props.items.next_page_url}>
                            Seguinte
                            <Icon
                                icon="lucide:chevron-right"
                                className="ml-2"
                            />
                        </Link>
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
}

export function ClienteMenu({
    row,
    handleMenu,
}: {
    row: ItemType;
    handleMenu: (id: number, item: ItemType) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icon icon="lucide:more-horizontal" className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link
                        href={window.location.pathname + "/editar/" + row.id}
                        className="flex items-center"
                    >
                        <Icon icon="lucide:edit" className="mr-2 h-4 w-4" />
                        Editar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleMenu(1, row)}
                    className="text-red-500 focus:text-red-500"
                >
                    <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

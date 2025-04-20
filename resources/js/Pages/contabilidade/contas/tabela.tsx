import * as React from "react";
import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { PaginationData } from "@/types";
import { Icon } from "@iconify/react";
import CustomShadCNPagination from "@/components/CustomShadCNPagination";

// Import shadcn-ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

interface ItemType {}

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
            <div className="py-2 flex flex-wrap gap-1.5 mb-4">
                <div className="flex-1 min-w-[160px]">
                    <div className="space-y-2">
                        <Label htmlFor="search">
                            Pesquisar Plano de contas
                        </Label>
                        <Input
                            id="search"
                            placeholder="Digita o termo e clica enter..."
                            value={search}
                            onKeyDown={handleSearch}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full"
                            icon={<Icon icon="lucide:search" />}
                        />
                    </div>
                </div>

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
            </div>

            <p className="mb-2">Total: {props.items.total}</p>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Codigo</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.items.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.codigo}</TableCell>
                                    <TableCell>{row.nome}</TableCell>
                                    <TableCell>{row.classe.nome}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            {row.empresa_id != null && (
                                                <ClienteMenu
                                                    handleMenu={
                                                        props.handleMenu
                                                    }
                                                    row={row}
                                                />
                                            )}
                                        </div>
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

                <CustomShadCNPagination
                    data={props.items}
                    only={["items"]}
                    hidePrevButton
                    hideNextButton
                />

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
                <DropdownMenuItem onClick={() => handleMenu(0, row)}>
                    <Icon icon="dashicons:edit-page" className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleMenu(1, row)}
                    className="text-red-500 focus:text-red-500"
                >
                    <Icon
                        icon="material-symbols:delete-sharp"
                        className="mr-2 h-4 w-4"
                    />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

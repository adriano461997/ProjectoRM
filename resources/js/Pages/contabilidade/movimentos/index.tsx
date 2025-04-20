import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Loading } from "notiflix";
import req from "@/utils/req";
import {showPop, showPopConfirm} from "@/utils/Pops";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import DepTabela from "./tabela";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface ItemType {}

interface Props extends PageProps {
    items: PaginationData<ItemType>;
}

function Index(props: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [items, setItems] = useState<PaginationData<ItemType>>(props.items);
    const [openEditar, setOpenEditar] = useState<boolean>(false);
    const [item, setItem] = useState<ItemType>();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    const handleAdd = (payload: ItemType) => {
        const arrayTemp = [payload, ...items.data];
        setItems((prev) => {
            setHasUnsavedChanges(true);
            return {
                ...prev,
                data: arrayTemp,
            };
        });
    };

    const handleChange = (payload: ItemType) => {
        const arrayTemp = items.data.map((it) => {
            if (it.id === payload.id) {
                return payload;
            }
            return it;
        });
        setItems((prevState) => {
            setHasUnsavedChanges(true);
            return {
                ...prevState,
                data: arrayTemp,
            };
        });
    };

    const handleRemove = (item: ItemType) => {
        const arrayTemp = items.data.filter((f) => f.id != item.id);
        setItems((prev) => {
            setHasUnsavedChanges(true);
            return {
                ...prev,
                data: arrayTemp,
            };
        });
    };

    const handleMenu = (id: number, item: ItemType) => {
        if (id === 0) {
            setItem(item);
            setOpenEditar(true);
        } else if (id === 1) {
            showPopConfirm("", "Tens a certeza que queres apagar este movimento?", "question", async ()=> {
                Loading.dots();
                const url =
                    window.location.pathname + "/" + "eliminar/" + item.id;
                const res: any = await req().post(url);
                if (res.data.estado === "ok") {
                    showPop("", "Eliminado com sucesso", "success");
                    handleRemove(item);
                } else {
                    showPop(
                        "",
                        res.data.texto ?? "Ocorreu um erro!",
                        "error"
                    );
                }
                Loading.remove();
            })
        }
    };


    return (
        <Fragment>
            <Head title={"Movimentos"} />

            <div className="flex mb-1 gap-1 flex-col sm:flex-row sm:items-center flex-wrap justify-between">
                <h1 className="text-3xl font-semibold">Movimentos</h1>
            </div>

            <div className="flex flex-start">
                <Button
                    variant="default"
                    asChild
                    className="flex items-center gap-2">
                    <Link href={"/contabilidade/movimentos/criar"}>
                        <Icon fontSize={20} icon={"material-symbols:add"} />
                        <span>Novo lançamento</span>
                    </Link>
                </Button>
            </div>

            <DepTabela handleMenu={handleMenu} items={items} />
        </Fragment>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
export default Index;

import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Icon } from "@iconify/react";
import { Loading } from "notiflix";
import {showPop, showPopConfirm} from "@/utils/Pops";
import req from "@/utils/req";

import { Button } from "@/components/ui/button";
import DepTabela from "./tabela";
import Modal from "./Modal";
import { BaixarContasOffline, getContasOffline } from "@/utils/ContasOffline";
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
    const [contas, setContas] = useState(getContasOffline());

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    const handleAdd = (payload: ItemType) => {
        const arrayTemp = [payload, ...items.data];
        setItems((prev) => {
            return {
                ...prev,
                data: arrayTemp,
            };
        });
        const updatedContas = [payload, ...contas];
        setContas(updatedContas);
        window.localStorage.setItem("contas", JSON.stringify(updatedContas));
    };

    const handleChange = (payload: ItemType) => {
        const arrayTemp = items.data.map((it) => {
            if (it.id === payload.id) {
                return payload;
            }
            return it;
        });
        setItems((prevState) => {
            return {
                ...prevState,
                data: arrayTemp,
            };
        });
    };

    const handleRemove = (item: ItemType) => {
        const arrayTemp = items.data.filter((f) => f.id != item.id);
        setItems((prev) => {
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

            showPopConfirm("", "Tens a certeza que queres apagar este contas?", "question", async ()=> {
                Loading.dots();
                const url =
                    window.location.pathname + "/" + "eliminar/" + item.id;
                const res: any = await req().post(url);
                if (res.data.estado === "ok") {
                    showPop("", "Eliminado com sucesso", "success");
                    handleRemove(item);

                    const updatedContas = contas.filter(
                        (f) => f.id !== item.id
                    );
                    setContas(updatedContas);
                    window.localStorage.setItem(
                        "contas",
                        JSON.stringify(updatedContas)
                    );
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

    const handleOpen = () => {
        if (contas.length !== 0) {
            setOpen(true);
            return;
        }

        Loading.dots();
        router.reload({
            only: ["contas"],
            onSuccess: () => {
                setContas(props.contas);
                setOpen(true);
                Loading.remove();
            },
            onError: () => {
                showPop(
                    "Erro",
                    "Desculpe, não conseguimos processar o seu pedido devido a um erro interno. Por favor, verifica a sua internet ou tenta novamente mais tarde!",
                    "error"
                );
                Loading.remove();
            },
        });
    };

    return (
        <Fragment>
            <Head title={"Contas"} />

            {open && (
                <Modal
                    mode={"add"}
                    contas={contas}
                    onAdd={handleAdd}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}

            {openEditar && (
                <Modal
                    item={item}
                    contas={contas}
                    mode={"editar"}
                    onAdd={handleChange}
                    open={openEditar}
                    onClose={() => setOpenEditar(false)}
                />
            )}

            <div className="flex mb-4 gap-3 flex-col sm:flex-row sm:items-center flex-wrap justify-between">
                <h1 className="text-2xl font-bold">Plano de Contas</h1>
                    <div>
                        <Button onClick={handleOpen} size="sm">
                            <Icon
                                fontSize={20}
                                icon={"material-symbols:add"}
                                className="mr-2"
                            />
                            Cria plano de conta
                        </Button>
                    </div>
            </div>
            <DepTabela handleMenu={handleMenu} items={items} />
        </Fragment>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
export default Index;

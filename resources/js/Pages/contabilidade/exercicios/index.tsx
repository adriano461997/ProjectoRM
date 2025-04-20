import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import DepTabela from "./tabela";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Loading } from "notiflix";
import req from "@/utils/req";
import { showPop, showPopConfirm } from "@/utils/Pops";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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

            showPopConfirm("", "Tens a certeza que queres apagar este exercicios?", "question", async () => {
                Loading.dots();
                try {
                    const res = await req().post(
                        `${window.location.pathname}/eliminar/${item.id}`
                    );
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
                } catch (error) {
                    showPop("", "Erro ao excluir!", "error");
                } finally {
                    Loading.remove();
                }
            })
        }
    };

    const Activar = (item) => {
        showPopConfirm(
            "Tens a certeza que queres activar este exercicios?",
            "O exercício que está atualmente ativo será desativado e este será o atual",
            "question",
            async () => {
                Loading.dots();
                try {
                    const res = await req().post(
                        `${window.location.pathname}/activar/${item.id}`
                    );
                    if (res.data.estado === "ok") {
                        router.reload();
                        showPop("", "Ativado com sucesso", "success");
                    } else {
                        showPop(
                            "",
                            res.data.texto ?? "Ocorreu um erro!",
                            "error"
                        );
                    }
                } catch (error) {
                    showPop("", "Erro ao ativar!", "error");
                } finally {
                    Loading.remove();
                }
            }
        );
    };

    return (
        <Fragment>
            <Head title={"Exercicios"} />

            {open && (
                <Modal
                    mode={"add"}
                    onAdd={handleAdd}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}

            {openEditar && (
                <Modal
                    item={item}
                    mode={"editar"}
                    onAdd={handleChange}
                    open={openEditar}
                    onClose={() => setOpenEditar(false)}
                />
            )}

            <div className="flex mb-4 gap-4 flex-wrap justify-between items-start sm:items-center">
                <h1 className="text-2xl font-bold">Exercicios</h1>
            </div>

                <div className="mb-4">
                    <Button onClick={() => setOpen(true)} className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Criar exercicio
                    </Button>
                </div>

            <DepTabela
                activar={Activar}
                handleMenu={handleMenu}
                items={items}
            />
        </Fragment>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
export default Index;

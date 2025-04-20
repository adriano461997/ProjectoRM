import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import req from "@/utils/req";

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd?: (item: any) => void;
    item?: any;
    mode: "add" | "editar";
}

export default function ModalRegistar(props: Props) {
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: props.item?.nome ?? "",
            data_inicio: props.item?.data_inicio ?? null,
            data_fim: props.item?.data_fim ?? null,
        },
    });

    const onSubmit = async (params) => {
        setLoading(true);
        const url = `${window.location.pathname}/${
            props.mode === "add" ? "criar" : `editar/${props.item?.id}`
        }`;
        try {
            const res = await req().post(url, params);
            if (res.data.estado === "ok") {
                if (props.onAdd) props.onAdd(res.data.payload);
                props.onClose();
            } else {
                alert(res.data.texto);
            }
        } catch (error) {
            alert("Ocorreu um erro!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {props.mode === "add"
                            ? "Criar Exercício"
                            : "Atualizar Exercício"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label>Nome</label>
                            <Input
                                {...register("nome", {
                                    required: "Por favor digite o nome",
                                })}
                                placeholder="Digite o nome"
                            />
                            {errors.nome && (
                                <p className="text-red-500">
                                    {errors.nome.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Data de Início</label>
                            <Controller
                                name="data_inicio"
                                control={control}
                                rules={{
                                    required:
                                        "Por favor selecione a data de início",
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setValue(
                                                "data_inicio",
                                                e.target.value
                                                    ? new Date(e.target.value)
                                                    : null
                                            )
                                        }
                                    />
                                )}
                            />
                            {errors.data_inicio && (
                                <p className="text-red-500">
                                    {errors.data_inicio.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Data de Fim</label>
                            <Controller
                                name="data_fim"
                                control={control}
                                rules={{
                                    required:
                                        "Por favor selecione a data de fim",
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setValue(
                                                "data_fim",
                                                e.target.value
                                                    ? new Date(e.target.value)
                                                    : null
                                            )
                                        }
                                    />
                                )}
                            />
                            {errors.data_fim && (
                                <p className="text-red-500">
                                    {errors.data_fim.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={props.onClose}
                            variant="secondary"
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {props.mode === "add" ? "Adicionar" : "Atualizar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

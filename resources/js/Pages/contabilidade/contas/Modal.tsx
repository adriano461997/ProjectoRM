import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Controller, useForm } from "react-hook-form";
import { Loading } from "notiflix";
import req, { CustomResponse } from "@/utils/req";
import { showPop } from "@/utils/Pops";
import { usePage } from "@inertiajs/react";
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd?: (item: any) => void;
    item?: any;
    mode: "add" | "editar";
    contas: any;
}

export default function ModalRegistar(props: Props) {
    const [loading, setLoading] = useState(false);
    const { props: props2 } = usePage();

    const form = useForm({
        defaultValues: {
            int_id: props.item?.int_id ?? "",
            nome: props.item?.nome ?? "",
        },
    });

    const {
        control,
        register,
        setValue,
        setError,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = async (params) => {
        setLoading(true);
        Loading.dots();

        const url = "/contabilidade/contas/" + (props.mode === "add" ? "criar" : "editar/" + props.item?.id);

        try {
            const response = (await req().post(
                url,
                params
            )) as CustomResponse<any>;
            const { data } = response;

            if (data.estado === "ok") {
                if (props.mode === "add") {
                    showPop("", "Plano de conta criado com sucesso com o código: " + data.payload.codigo, "success")
                } else {
                    showPop("", "Plano de conta actualizado com sucesso!", "success")
                }

                if (props.onAdd) {
                    props.onAdd(data.payload);
                }

                if (props.onClose) {
                    props.onClose();
                }
            } else {
                if (data.input) {
                    setError(data.input, {
                        message: data.texto,
                    });
                } else {
                    showPop("", data.texto, "error");
                }
            }
        } catch (error) {
            showPop("", "Ocorreu um erro ao processar o pedido", "error");
        } finally {
            Loading.remove();
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => !open && props.onClose()}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {props.mode === "add"
                            ? "Adicionar Plano de conta"
                            : "Actualizar Plano de conta"}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha as informações do Plano de conta
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input
                                    {...register("nome", {
                                        required: "Por favor digita o Nome",
                                    })}
                                    placeholder="Por favor digita Nome"
                                />
                            </FormControl>
                            {errors.nome && (
                                <FormMessage>{errors.nome.message}</FormMessage>
                            )}
                        </FormItem>

                        {props.mode === "add" && (
                            <FormItem>
                                <FormLabel>Conta de refêrencia</FormLabel>
                                <Controller
                                    name="int_id"
                                    rules={{
                                        required:
                                            "Por favor seleciona a conta de referência!",
                                    }}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecionar a conta" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <ScrollArea className="h-72">
                                                    {props.contas
                                                        .filter(
                                                            (f) =>
                                                                f.conta_mae_id ===
                                                                null
                                                        )
                                                        .map((item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.codigo} -{" "}
                                                                {item.nome}
                                                            </SelectItem>
                                                        ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.int_id && (
                                    <FormMessage>
                                        {errors.int_id.message}
                                    </FormMessage>
                                )}
                            </FormItem>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {props.mode === "add"
                                    ? "Adicionar"
                                    : "Actualizar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

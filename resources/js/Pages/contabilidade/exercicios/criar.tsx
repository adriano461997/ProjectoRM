import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { router } from "@inertiajs/react";
import req from "@/utils/req";

interface Props {
    onAdd?: (item: any) => void;
    closeForm?: () => void;
}

export default function CriarExercicio({ onAdd, closeForm }: Props) {
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: "",
            data_inicio: null,
            data_fim: null,
        },
    });

    const onSubmit = async (params) => {
        setLoading(true);
        const url = `${window.location.pathname}/criar`;
        try {
            const res = await req().post(url, params);
            if (res.data.estado === "ok") {
                if (onAdd) onAdd(res.data.payload);
                if (closeForm) closeForm();
                else router.visit(window.location.pathname);
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
        <Card>
            <CardHeader>
                <CardTitle>Criar Exercício</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            id="nome"
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

                    <div className="space-y-2">
                        <Label htmlFor="data_inicio">Data de Início</Label>
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
                                    id="data_inicio"
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

                    <div className="space-y-2">
                        <Label htmlFor="data_fim">Data de Fim</Label>
                        <Controller
                            name="data_fim"
                            control={control}
                            rules={{
                                required: "Por favor selecione a data de fim",
                            }}
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    id="data_fim"
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

                    <div className="flex justify-end gap-2 pt-4">
                        {closeForm && (
                            <Button
                                variant="outline"
                                onClick={closeForm}
                                type="button"
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" disabled={loading}>
                            {loading ? "A processar..." : "Adicionar"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

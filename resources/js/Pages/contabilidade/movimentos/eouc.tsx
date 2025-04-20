import * as React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Loading } from "notiflix";
import {showPop, showPopConfirm} from "@/utils/Pops";
import { PageProps, PaginationData } from "@/types";
import dayjs from "dayjs";
import useDebounceValue from "@/utils/useDebounceValue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import req from "@/utils/req";
import { BaixarContasOffline } from "@/utils/ContasOffline";
import { formataLancamentoValue } from "@/utils/tools";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Spinner } from "@/components/ui/Spinner";
import Modal from "../contas/Modal";

interface ItemType {
    // ...existing code...
}

interface Props extends PageProps {
    item: any;
}

function Index(props: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [items, setItems] = useState<PaginationData<ItemType>>(props.items);
    const [item, setItem] = useState<ItemType>();
    const [contas, setContas] = useState(
        JSON.parse(window.localStorage.getItem("contas") ?? "[]")
    );

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    const {
        control,
        register,
        setValue,
        setError,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            diario_id: props.item?.diario_id ?? "",
            exercicio_id: props.item?.exercicio_id ?? props.ex?.id ?? "",
            data_lancamento: props.item
                ? dayjs(props.item.data_lancamento).format("YYYY-MM-DD")
                : dayjs().format("YYYY-MM-DD"),
            descricao: props.item?.descricao ?? "",
            movimentos: props.movimentos ?? [
                {
                    conta_id: "",
                    debito: "",
                    credito: "",
                },
            ],
        },
    });

    const values = watch();

    const onSubmit = async (params) => {
        Loading.dots();

        const url = window.location.pathname;
        const res: any = await req().post(url, params);

        if (res.data.estado === "ok") {
            router.visit("/contabilidade/movimentos");
            if (props.mode === "add") {
                showPop("", "Movimento adicionado com sucesso!", "success");
            } else {
                showPop("", "Movimento actualizado com sucesso!", "success");
            }
        } else {
            if (res.input) {
                setError(res.input, {
                    message: res.texto,
                });
            } else {
                showPop("", res.texto, "error");
            }
        }
        Loading.remove();
    };

    const { fields, append, prepend, remove, swap, move, insert } =
        useFieldArray({
            control,
            keyName: "movimentos",
            name: "movimentos",
            rules: undefined,
        });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F1") {
                event.preventDefault();
                // Coloque aqui a ação que deseja executar
                append({ conta_id: "", credito: "", debito: "" });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const removeConfirm = (index) => {
        const item = values.movimentos[index];
        if (item.conta_id === "" && item.debito === "" && item.credito === "") {
            removeFinal(index);
            return;
        }
        showPopConfirm(
            "",
            "Tens a certeza que quer remover este item?",
            "question",
            () => {
                removeFinal(index);
            }
        );
    };

    const removeFinal = (index) => {
        remove(index);
    };

    const handleAdd = (payload) => {
        const updatedContas = [payload, ...contas];
        setContas(updatedContas);
        window.localStorage.setItem("contas", JSON.stringify(updatedContas));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const baixarContasOffline = async () => {
        await BaixarContasOffline(props, (res) => {
            if (res.estado === "ok") {
                setContas(res.data);
            } else {
            }
        });
    };

    return (
        <Fragment>
            <Head
                title={
                    props.mode === "add"
                        ? "Novo lançamento"
                        : "Actualizar lançamento"
                }
            />

            <div className="flex mb-4 gap-1 flex-col sm:flex-row sm:items-center flex-wrap justify-between">
                <h1 className="text-3xl font-semibold">
                    {props.mode === "add"
                        ? "Novo lançamento"
                        : "Actualizar lançamento"}
                </h1>

                <div className="flex gap-3 items-center">
                    <Button
                        onClick={handleOpen}
                        size="sm"
                        className="gap-1 items-center"
                    >
                        <Icon fontSize={20} icon="material-symbols:add" />
                        Cria plano de conta
                    </Button>

                    <Button
                        onClick={baixarContasOffline}
                        size="sm"
                        variant="success"
                    >
                        Actualizar contas
                    </Button>
                </div>
            </div>

            {contas.length === 0 && (
                <div className="p-5 flex items-center flex-col justify-center">
                    <p className="text-center mb-2">
                        Você precisa baixar as contas para continuar!
                    </p>
                    <Button onClick={baixarContasOffline} className="mt-2">
                        Baixar agora
                    </Button>
                </div>
            )}

            {open && (
                <Modal
                    mode={"add"}
                    contas={contas}
                    onAdd={handleAdd}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}

            {contas.length !== 0 && (
                <div className="grid gap-5 grid-cols-1 lg:grid-cols-4">
                    <div className="col-span-1 lg:col-span-3">
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Conta
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Débito
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Crédito
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {fields.map((item, index) => (
                                        <Item
                                            contas={contas}
                                            values={values}
                                            onRemove={removeConfirm}
                                            setValue={setValue}
                                            key={item.movimentos}
                                            index={index}
                                            item={values.movimentos[index]}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() =>
                                                append({
                                                    conta_id: "",
                                                    credito: "",
                                                    debito: "",
                                                })
                                            }
                                            variant="outline"
                                            size="icon"
                                        >
                                            <Icon
                                                fontSize={24}
                                                icon="ic:baseline-plus"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Adicionar conta
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                            <div>
                                Pressiona <span>F1</span> para inserir uma nova
                                linha!
                            </div>
                            <div>
                                Estando com um crédito ou um débito aberto
                                pressiona <span>F2</span> fazer o balanço
                                automático!
                            </div>
                        </div>

                        <div className="mt-5">
                            <Button onClick={handleSubmit(onSubmit)}>
                                {props.mode === "add"
                                    ? "Criar documento"
                                    : "Actualizar documento"}
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codigo">
                                        Número do documento
                                    </Label>
                                    <Input
                                        id="codigo"
                                        placeholder="Gerado automáticamente!"
                                        value={props.item?.codigo ?? ""}
                                        disabled
                                    />
                                </div>

                                <Controller
                                    name="exercicio_id"
                                    rules={{
                                        required:
                                            "Por favor seleciona o exercicio",
                                    }}
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="exercicio_id"
                                                className="font-bold"
                                            >
                                                Exercicio{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={value}
                                                onValueChange={(newValue) =>
                                                    setValue(
                                                        "exercicio_id",
                                                        newValue
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecionar o exercicio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.exercicios.map(
                                                        (item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.nome}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.exercicio_id?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.exercicio_id.message.toString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="diario_id"
                                    rules={{
                                        required:
                                            "Por favor seleciona o diário",
                                    }}
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="diario_id"
                                                className="font-bold"
                                            >
                                                Diário{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={value}
                                                onValueChange={(newValue) =>
                                                    setValue(
                                                        "diario_id",
                                                        newValue
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecionar o diário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.diarios.map(
                                                        (item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.codigo} -{" "}
                                                                {item.nome}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.diario_id?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.diario_id.message.toString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="data_lancamento"
                                        className="font-bold"
                                    >
                                        Data do lançamento{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="data_lancamento"
                                        type="date"
                                        placeholder="Por favor escolhe a data do lançamento"
                                        {...register("data_lancamento", {
                                            required:
                                                "Por favor escolhe a data de lançamento",
                                        })}
                                    />
                                    {errors.data_lancamento?.message && (
                                        <p className="text-red-500 text-sm">
                                            {errors.data_lancamento.message.toString()}
                                        </p>
                                    )}
                                </div>

                                <Controller
                                    name="descricao"
                                    rules={{ required: false }}
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao">
                                                Descrição
                                            </Label>
                                            <Input
                                                id="descricao"
                                                placeholder="Deixa em branco se não tiver"
                                                {...field}
                                            />
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

const Item = ({ item, index, setValue, onRemove, values, contas }) => {
    const [modeTd1, setModeTd1] = useState(false);
    const [modeTd2, setModeTd2] = useState(false);
    const [modeTd3, setModeTd3] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debounceValue = useDebounceValue(inputValue, 100);
    const popoverRef = useRef(null);

    const handleKeyUp = (e, field: string, setMode) => {
        if (e.key === "F2") {
            const totalDebito = values.movimentos.reduce(
                (acc, mov) => acc + parseFloat(mov.debito || 0),
                0
            );
            const totalCredito = values.movimentos.reduce(
                (acc, mov) => acc + parseFloat(mov.credito || 0),
                0
            );
            const balance = Math.abs(totalDebito - totalCredito);

            if (field === "debito") {
                setValue(`movimentos.${index}.debito`, balance.toFixed(2));
            } else if (field === "credito") {
                setValue(`movimentos.${index}.credito`, balance.toFixed(2));
            }
            setMode(false);
        } else if (e.key === "Enter") {
            setValue(`movimentos.${index}.${field}`, e.target.value);
            setMode(false);
        }
    };

    useEffect(() => {
        if (debounceValue) {
            handleSearch(debounceValue);
        } else {
            setSearchResults([]);
            setLoading(false);
        }
    }, [debounceValue]);

    const handleSearch = (query: string) => {
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        const lowerCaseQuery = query.toLowerCase();
        const results = contas
            .filter((conta) =>
                conta.codigo.toLowerCase().includes(lowerCaseQuery)
            )
            .sort((a, b) => {
                const aStartsWith = a.codigo
                    .toLowerCase()
                    .startsWith(lowerCaseQuery);
                const bStartsWith = b.codigo
                    .toLowerCase()
                    .startsWith(lowerCaseQuery);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return 0;
            })
            .slice(0, 14);
        setSearchResults(results);
        setLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (searchResults.length > 0) {
                if (event.key === "ArrowDown") {
                    setSelectedIndex(
                        (prevIndex) => (prevIndex + 1) % searchResults.length
                    );
                } else if (event.key === "ArrowUp") {
                    setSelectedIndex(
                        (prevIndex) =>
                            (prevIndex - 1 + searchResults.length) %
                            searchResults.length
                    );
                } else if (event.key === "Enter" && selectedIndex >= 0) {
                    const selectedItem = searchResults[selectedIndex];
                    setValue(
                        `movimentos.${index}.conta_id`,
                        selectedItem.codigo
                    );
                    setModeTd1(false);
                    setInputValue("");
                    setSearchResults([]);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [searchResults, selectedIndex]);

    return (
        <tr style={{ height: 30 }}>
            <td
                onDoubleClick={() => setModeTd1(true)}
                className="border border-gray-300 whitespace-nowrap relative"
            >
                {!modeTd1 ? (
                    <div className="w-full px-4 py-2">{item.conta_id}</div>
                ) : (
                    <div className="w-full relative">
                        <Input
                            type="text"
                            autoFocus
                            defaultValue={item.conta_id}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyUp={(e) =>
                                handleKeyUp(e, "conta_id", setModeTd1)
                            }
                            className="border-0 rounded-none w-full"
                        />
                        {loading && (
                            <div className="absolute top-1 right-1">
                                <Spinner />
                            </div>
                        )}
                        {searchResults.length > 0 && (
                            <div
                                ref={popoverRef}
                                className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-md"
                                style={{
                                    position: "fixed",
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    width: "500px",
                                    top: "auto",
                                    left: "auto",
                                }}
                            >
                                {searchResults.map((result: any, i) => (
                                    <div
                                        key={result.id}
                                        className={`p-2 hover:bg-gray-100 transition cursor-pointer ${
                                            selectedIndex === i
                                                ? "bg-gray-100"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setValue(
                                                `movimentos.${index}.conta_id`,
                                                result.codigo
                                            );
                                            setModeTd1(false);
                                            setInputValue("");
                                            setSearchResults([]);
                                        }}
                                    >
                                        {result.codigo} - {result.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </td>
            <td
                onDoubleClick={() => setModeTd2(true)}
                className="border border-gray-300 whitespace-nowrap"
            >
                {!modeTd2 ? (
                    <div className="w-full px-4 py-2 text-green-600">
                        {formataLancamentoValue(item.debito)}
                    </div>
                ) : (
                    <div className="w-full">
                        <Input
                            type="text"
                            autoFocus
                            defaultValue={item.debito}
                            onKeyUp={(e) =>
                                handleKeyUp(e, "debito", setModeTd2)
                            }
                            className="border-0 rounded-none w-full"
                        />
                    </div>
                )}
            </td>
            <td
                onDoubleClick={() => setModeTd3(true)}
                className="border relative border-gray-300 whitespace-nowrap"
            >
                {!modeTd3 ? (
                    <div className="w-full px-4 py-2 text-red-600">
                        {formataLancamentoValue(item.credito)}
                    </div>
                ) : (
                    <div className="w-full">
                        <Input
                            type="text"
                            autoFocus
                            defaultValue={item.credito}
                            onKeyUp={(e) =>
                                handleKeyUp(e, "credito", setModeTd3)
                            }
                            className="border-0 rounded-none w-full"
                        />
                    </div>
                )}
                <div className="absolute top-0 right-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => onRemove(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 h-8 w-8"
                                >
                                    <Icon fontSize={18} icon="lucide:trash-2" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remover</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </td>
        </tr>
    );
};

Index.layout = (page) => <AuthenticatedLayout children={page} />;
export default Index;

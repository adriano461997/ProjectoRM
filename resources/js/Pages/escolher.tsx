// @flow
import * as React from 'react';
import {Head, Link} from "@inertiajs/react";
import {Fragment} from "react";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

type Props = {

};

function Escolher(props: Props) {
    return (
        <Fragment>
            <Head title={"Escolher"}/>

            <div className={"flex flex-row h-[100vh] justify-center items-center"}>
                <div className={"max-w-xl px-4 md:px-0 w-full"}>

                    <div className={"text-xl"}>
                        Como quer prosseguir?
                    </div>
                    <div className={"text-sm text-gray-400"}>
                        Selecione uma opção
                    </div>

                    <div className={""}>

                        {
                            props.auth.user.admin === 1 && (
                                <div className={"bg-white p-3 rounded-lg shadow-md mt-3"}>
                                    <div className={"flex items-center"}>
                                        <div className={"flex-1"}>
                                            <div className={"text-lg font-semibold"}>
                                                Dashboard principal
                                            </div>
                                        </div>
                                        <div className={"flex justify-end mt-3"}>
                                            <Button asChild>
                                                <Link href={route("dashboard")}>
                                                    Continuar
                                                    <ArrowRight />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            props.empresas.map((item) => {
                                return (
                                    <div key={item.id} className={"bg-white p-3 rounded-lg shadow-md mt-3"}>
                                        <div className={"flex items-center"}>
                                            <div className={"flex-1"}>
                                                <div className={"text-lg font-semibold"}>
                                                    {item.filiar.nome}
                                                </div>
                                                <div className={"text-gray-500"}>
                                                    {item.filiar.endereco}
                                                </div>
                                                <div className={"text-gray-500"}>
                                                    {item.filiar.telefone}
                                                </div>
                                            </div>

                                            <div className={"flex justify-end mt-3"}>
                                                <Button asChild>
                                                    <Link href={route("filiar.index", item.filiar.slug)}>
                                                        Continuar
                                                        <ArrowRight />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );

}


export default Escolher;

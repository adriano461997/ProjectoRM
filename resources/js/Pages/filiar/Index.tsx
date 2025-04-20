import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props: any) {
    return (
        <AuthenticatedLayout

        >
            <Head title="Dashboard" />


            <div className={"flex flex-1 items-center justify-center"}>
                <div className={""}>
                    <div className={"text-2xl text-center"}>
                        Seja bem vindo ao Projecto RM
                    </div>
                    <div className={"text-center text-gray-500"}>
                        Clica em um dos relatórios para começar a gereciar!
                    </div>
                </div>
            </div>


        </AuthenticatedLayout>
    );
}

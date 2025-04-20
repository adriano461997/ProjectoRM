import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Faturamento from "@/Pages/Insi/ps/Faturamento";
import CustosOperacionais from "@/Pages/Insi/ps/CustosOperacionais";
import NumeroColaboracoes from "@/Pages/Insi/ps/NumeroColaboracoes";
import FeedbackChart from "@/Pages/Insi/ps/FeedbackClientes";
import NumeroRelatorios from './ps/NumeroRelatorios';
import TempoResposta from "@/Pages/Insi/ps/TempoResposta";
import TaxaConlusaoTarefa from "@/Pages/Insi/ps/TaxaConlusaoTarefa";
export default function Dashboard(props: any) {
    const receitas = {
        faturamento: <Faturamento />,
        custos_operacionais: <CustosOperacionais />,
        numero_colaboracoes: <NumeroColaboracoes />,
        feedback_clientes: <FeedbackChart />,
        numero_relatorios: <NumeroRelatorios />,
        tempo_resposta: <TempoResposta />,
        taxa_conlusao_tarefas: <TaxaConlusaoTarefa />
    }
    return (
        <AuthenticatedLayout>
            <Head title="Insights" />
            {receitas[props.slug]}
        </AuthenticatedLayout>
    );
}

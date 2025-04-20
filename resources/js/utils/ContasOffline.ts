import { Loading } from "notiflix";
import req from "./req";
import { showPop } from "./Pops";
import { PageProps } from "@/types";

export const BaixarContasOffline = async (
  props: PageProps,
  callback?: (res: {data: any, estado: string, texto: string}) => void
) => {
  Loading.dots();
  const res = await req().post("/contabilidade/movimentos/contas");
  if (callback) {
    callback(res.data);
  }
  if (res.data.estado === 'ok') {
    window.localStorage.setItem('contas', JSON.stringify(res.data.data));
    showPop('', 'Contas actualizadas com sucesso!', 'success');
  } else {
    showPop('', res.data.texto ?? 'Ocorreu um erro!', 'error');
  }
  Loading.remove();
};

export const getContasOffline = () => {
  const contas = window.localStorage.getItem('contas');
  return contas ? JSON.parse(contas) : [];
};

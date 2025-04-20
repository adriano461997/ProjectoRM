export function formataLancamentoValue(num) {
    if(!num){
        return "";
    }
    return Number(num).toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

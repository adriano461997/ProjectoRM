import Swal from "sweetalert2";

function showPop(titulo: string, texto: string, tipo: "success" | "question" | "error" | "warning", callback?: (()=> void) | null){
    Swal.fire({
        title: titulo,
        confirmButtonText: `Ok`,
        text: texto,
        html: texto,
        //confirmButtonColor: window.cor_primaria,
        //iconColor: tipo === "success" && window.cor_primaria,
        icon: tipo,
    }).then((result) => {
        if(typeof callback === "function"){
            callback();
        }
    });
}

function showPopConfirm(titulo: string, texto: string, tipo: "success" | "question" | "error" | "warning", callback?: (()=> void) | null, btOk: string = "Sim" , btCancel: string = "Não", cancelcallback: (()=> void) | null = null){
    Swal.fire({
        title: titulo,
        confirmButtonText: btOk,
        cancelButtonText: btCancel,
        //confirmButtonColor: window.cor_primaria,
        showCancelButton: true,
        text: texto,
        icon: tipo,
    }).then((result) => {
        if(result.value) {
            if(typeof callback === "function"){
                callback();
            }
        } else {
            if(typeof cancelcallback === "function"){
                cancelcallback();
            }
        }
    });
}

export {showPop, showPopConfirm}

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {TipoConviteType} from "@/Pages/TipoConvite";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleAdd = (items, payload)=>{
    return [payload, ...items.data];
}

export const handleChange = (items, payload: TipoConviteType)=>{
    return items.data.map((it) => {
        if (it.id === payload.id) {
            return payload;
        }
        return it;
    });
}

export const handleRemove = (items, item: TipoConviteType)=>{
    return items.data.filter(f => f.id != item.id);
}

export const formataErro = (error): string =>{
    if (error instanceof Object) {
        console.log("From object");
        return Object.values(error).join("\n");
    } else if(error instanceof String){
        console.log("From string");
        return error;
    } else if(error instanceof Array){
        console.log("From array");
        return error.join("\n");
    }
    return "Ocorreu um erro ao processar a sua solicitação";
}

//Faça uma função para formatar valores em KZ AO
export function formataDinheiro(num, prefix = "Kz") {
    return Number(num).toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + " " + prefix;
}

//Faça uma função para formatar valores em KZ AO
export function formataNumero(num, prefix = "Kz") {
    return Number(num).toString().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

export const affiliatesData = [
    {
        name: "Luanda Business Center",
        location: "Rua Comandante Gika, Edifício Garden Towers, Torre B, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Viana Trade Hub",
        location: "Estrada de Viana, Km 12, Município de Viana, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Talatona Commerce",
        location: "Avenida Pedro de Castro Van-Dúnem Loy, Talatona, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Benfica Solutions",
        location: "Rua do Benfica, Bairro Benfica, Município de Belas, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Kilamba Business Park",
        location: "Centralidade do Kilamba, Bloco Q, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Cacuaco Enterprise",
        location: "Rua Principal do Cacuaco, Município de Cacuaco, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Maculusso Office Center",
        location: "Rua Nicolau G. Spencer, Bairro Maculusso, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Patriota Business Hub",
        location: "Avenida 21 de Janeiro, Bairro Patriota, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Maianga Trade Center",
        location: "Rua Américo Boavida, Bairro Maianga, Luanda",
        createdAt: "24/11/2024"
    },
    {
        name: "Sambizanga Solutions",
        location: "Rua da Leal, Bairro Sambizanga, Luanda",
        createdAt: "24/11/2024"
    }
];

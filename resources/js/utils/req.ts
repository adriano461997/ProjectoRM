import axios, {Axios, AxiosResponse} from "axios";

export interface CustomResponse<T> extends AxiosResponse{
    data: {
        estado: "ok"|"erro",
        texto: string,
        interno: boolean,
        token: string,
    }
}

export default function req() : Axios{
    const instance = axios.create({
        //baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
    });
    instance.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        return {
            ...error.response,
            data: {
                ...error.response?.data,
                texto: error.response?.data?.texto ?? "Ocorreu um erro certifica-te que tens uma conexão a internet!",
                interno: !Boolean(error.response),
            }
        };
    });
    return instance;
}

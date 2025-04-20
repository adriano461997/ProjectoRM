import req from "./req";

export async function CustomRequest(url: string, data: any = {}, method: string = 'GET') {
    try {
        const request = await req();
        const response = await request({
            method,
            url,
            data: method.toUpperCase() !== 'GET' ? data : {},
            params: method.toUpperCase() === 'GET' ? data : {},
        });

        return response.data;
    } catch (error) {
        console.error("Request error:", error);
        return {
            estado: "erro",
            texto: "Ocorreu um erro na requisição",
            interno: true,
        };
    }
}

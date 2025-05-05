export const callFastAPI = async (endpoint: string, method: string, body?: object) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL}/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        console.error(`❌ Error en ${endpoint}:`, await response.json());
        throw new Error(`Error en ${endpoint}`);
    }

    return response.json();
};
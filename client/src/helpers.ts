export async function fetchApi(url: string, options: RequestInit): Promise<any> {
    const response = await fetch(url, options);
    const isResponseJson = response.headers.get('content-type')?.includes('application/json');
    if (response.ok) {
        return isResponseJson ? await response.json() : await response.text();
    } else {
        const error = isResponseJson ? await response.json() : { message: 'Une erreur est survenue' };
        console.error(error.message);
        throw new Error(error.message);
    }
}

export function getAuthHeaders(): HeadersInit {
    return {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
}

export function getJsonHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
    };
}
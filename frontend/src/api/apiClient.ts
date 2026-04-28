const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: HeadersInit;
};

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers } = options;

    const token = localStorage.getItem('token');

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 401) {
            const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
            
            if (!isAuthEndpoint) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Unauthorized');
        }

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
                
            try {
                const errorText = await response.text();
                
                if (errorText) {
                    const errorData = JSON.parse(errorText);
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                }
            } catch (e) {
            }
            
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null as T;
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}
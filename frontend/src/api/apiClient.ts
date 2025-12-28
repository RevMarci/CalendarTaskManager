const BASE_URL = 'http://localhost:5000/api';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `API Error: ${response.status}`);
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
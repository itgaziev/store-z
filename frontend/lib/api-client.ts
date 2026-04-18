import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { operations } from "./types/schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
    query?: Record<string, string | number | boolean | undefined | null>;
}

function buildQueryString(params?: Record<string, string | number | boolean | undefined | null>): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
 
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

function getAccessToken(): string {
    if (typeof window === 'undefined') return '';
    return getCookie('accessToken')?.toString() || '';
}

function setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    setCookie('accessToken', token, { maxAge: 60 * 60, path: '/' });
}

function getRefreshToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('refreshToken') || '';
}

function setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
}

function clearAuthTokens(): void {
    if (typeof window === 'undefined') return;
    console.log('Clearing auth tokens');
    deleteCookie('accessToken');
}

export type ApiResponse<T extends keyof operations> = 
    operations[T]['responses'] extends { 200: { content: { 'application/json': infer R } } } ? R :
    operations[T]['responses'] extends { 201: { content: { 'application/json': infer R } } } ? R :
    void;

export type ApiRequest<T extends keyof operations> =
    operations[T]['requestBody'] extends { content: { 'application/json': infer R } } ? R :
    void;

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions & {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        data?: any;
    } = {}
): Promise<T> {
    const { requiresAuth = true, headers, query, data, method, ...restOptions } = options;

    let configHeaders: Record<string, string> = {};

    if (requiresAuth) {
        const token = getAccessToken();
        if (token) {
            configHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    if (headers && typeof headers === 'object' && !Array.isArray(headers) && !(headers instanceof Headers)) {
        configHeaders = { ...configHeaders, ...headers as Record<string, string> };
    }

    const config: RequestInit = {
        ...restOptions,
        method,
        credentials: 'include',
        headers: configHeaders,
    };

    if (data !== undefined && !(data instanceof FormData)) {
        config.body = JSON.stringify(data);
        configHeaders['Content-Type'] = 'application/json';
    } else if (data instanceof FormData) {
        config.body = data;
    }

    const url = `${API_BASE_URL}${endpoint}${buildQueryString(query)}`;
    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status, 
            errorData.message || 'An error occurred while processing the request.', 
            errorData
        );
    }

    return response.json();
}

export { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, clearAuthTokens };
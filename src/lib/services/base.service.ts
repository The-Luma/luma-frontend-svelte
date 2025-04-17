import type { ApiResponse, ApiError as IApiError } from '$lib/types/api.types';
import { API_CONFIG } from '$lib/config/api.config';
// Remove the circular dependency by not importing api directly
// import { api } from './api';

export class HttpError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | undefined>;
}

export abstract class BaseService {
    protected constructor(
        protected baseUrl: string = API_CONFIG.baseUrl,
        protected defaultHeaders: HeadersInit = API_CONFIG.defaultHeaders
    ) {}

    protected async fetch<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = this.buildUrl(endpoint, options.params);
            const { params, ...fetchOptions } = options;
            
            const response = await fetch(url, {
                ...fetchOptions,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            });

            // For 204 No Content responses, return immediately with status
            if (response.status === 204) {
                return {
                    data: null as T,
                    status: response.status
                };
            }

            const responseData = await response.json();
            console.log('API Response:', { url, status: response.status, data: responseData });

            // Handle 401 Unauthorized errors by attempting token refresh
            // Make exceptions for username and password change endpoints
            const isAuthEndpoint = endpoint === API_CONFIG.endpoints.auth.changeUsername || 
                                  endpoint === API_CONFIG.endpoints.auth.changePassword;
            
            if (response.status === 401 && endpoint !== API_CONFIG.endpoints.auth.refresh && !isAuthEndpoint) {
                console.log('Attempting token refresh...');
                // Instead of using api.auth.refreshToken(), use a direct fetch call
                const refreshUrl = this.buildUrl(API_CONFIG.endpoints.auth.refresh);
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: this.defaultHeaders,
                });
                
                const refreshData = await refreshResponse.json();
                
                if (!refreshResponse.ok || refreshData.error) {
                    console.error('Token refresh failed:', refreshData.error);
                    return {
                        error: 'Session expired. Please login again.',
                        status: 401
                    };
                }

                // Retry the original request with the new token
                console.log('Token refreshed, retrying original request...');
                return this.fetch<T>(endpoint, options);
            }

            if (!response.ok) {
                return {
                    error: responseData.error || 'An error occurred',
                    status: response.status
                };
            }

            // Handle both direct data and nested data structures
            const data = responseData.data || responseData;
            return {
                data: data as T,
                status: response.status
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                status: 500
            };
        }
    }

    protected buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, value.toString());
                }
            });
        }
        
        return url.toString();
    }

    protected get defaultOptions(): RequestInit {
        return {
            credentials: 'include',
            headers: this.defaultHeaders,
        };
    }

    protected async get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...this.defaultOptions,
            ...options,
            method: 'GET',
        });
    }

    protected async post<T>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...this.defaultOptions,
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async put<T>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...this.defaultOptions,
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...this.defaultOptions,
            ...options,
            method: 'DELETE',
        });
    }
} 
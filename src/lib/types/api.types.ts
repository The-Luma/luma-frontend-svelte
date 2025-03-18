export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export type ApiError = {
    message: string;
    code?: string;
    status: number;
}; 
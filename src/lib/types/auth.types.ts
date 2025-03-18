export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: UserResponse;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

export interface SearchUsersQuery {
    query: string;
    page?: number;
    per_page?: number;
    [key: string]: string | number | undefined;
}

export interface SearchUsersResponse {
    users: UserResponse[];
    total: number;
    page: number;
    per_page: number;
} 
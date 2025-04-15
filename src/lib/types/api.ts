export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface SearchUsersQuery {
    query: string;
}

export interface SearchUsersResponse {
    users: UserResponse[];
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
} 
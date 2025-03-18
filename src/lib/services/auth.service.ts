import { BaseService } from './base.service';
import type { LoginRequest, LoginResponse, UserResponse } from '$lib/types/auth.types';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';

export class AuthService extends BaseService {
    constructor() {
        super();
    }

    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.post<LoginResponse>(API_CONFIG.endpoints.auth.login, data);
    }

    async logout(): Promise<ApiResponse<void>> {
        return this.post<void>(API_CONFIG.endpoints.auth.logout);
    }

    async me(): Promise<ApiResponse<UserResponse>> {
        return this.get<UserResponse>(API_CONFIG.endpoints.auth.me);
    }

    async refreshToken(): Promise<ApiResponse<LoginResponse>> {
        return this.post<LoginResponse>(API_CONFIG.endpoints.auth.refresh);
    }

    async check(): Promise<ApiResponse<{ authenticated: boolean }>> {
        return this.get<{ authenticated: boolean }>(API_CONFIG.endpoints.auth.check);
    }
} 
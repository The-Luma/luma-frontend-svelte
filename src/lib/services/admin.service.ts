import { BaseService } from './base.service';
import type { RegisterRequest, LoginResponse, SearchUsersQuery, SearchUsersResponse } from '$lib/types/auth.types';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';

export class AdminService extends BaseService {
    constructor() {
        super();
    }

    async create(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        return this.post<LoginResponse>(API_CONFIG.endpoints.admin.create, data);
    }

    async checkSetup(): Promise<ApiResponse<boolean>> {
        return this.get<boolean>(API_CONFIG.endpoints.admin.check);
    }

    async searchUsers(query: SearchUsersQuery): Promise<ApiResponse<SearchUsersResponse>> {
        return this.get<SearchUsersResponse>(API_CONFIG.endpoints.admin.users, { params: query });
    }
} 
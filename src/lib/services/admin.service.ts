import { BaseService } from './base.service';
import type { RegisterRequest, LoginResponse, SearchUsersQuery, SearchUsersResponse } from '$lib/types/auth.types';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';
import { getFullUrl } from '$lib/utils/url.utils';

interface ListUsersResponse {
    users: Array<{
        id: number;
        username: string;
        email: string;
        role: string;
    }>;
    total: number;
    limit: number;
    offset: number;
}

interface InviteUserRequest {
    email: string;
    role: string;
}

export interface InviteUserResponse {
    id: number;
    email: string;
    role: string;
    token: string;
    invited_by: number;
    expires_at: string;
    created_at: string;
    invitation_link: string;
}

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

    async listUsers(): Promise<ApiResponse<ListUsersResponse>> {
        return this.get<ListUsersResponse>(API_CONFIG.endpoints.admin.listUsers);
    }

    async inviteUser(data: InviteUserRequest): Promise<ApiResponse<InviteUserResponse>> {
        const response = await this.post<InviteUserResponse>(API_CONFIG.endpoints.admin.invitations, data);
        
        // If we have a successful response, modify the invitation_link to use the current base URL
        if (response.data) {
            const token = response.data.token;
            response.data.invitation_link = getFullUrl(`register?token=${token}`);
        }
        
        return response;
    }

    async deleteUser(userId: number): Promise<ApiResponse<null>> {
        return this.delete<null>(`/users/${userId}`);
    }
} 
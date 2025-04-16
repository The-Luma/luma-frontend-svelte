import { BaseService } from './base.service';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';
import type { 
    Namespace, 
    CreateNamespaceRequest, 
    ShareNamespaceRequest, 
    RevokeNamespaceRequest,
    NamespaceQuery,
    NamespaceAccessResponse
} from '$lib/types/api.types';

export class NamespaceService extends BaseService {
    constructor() {
        super();
    }

    async create(data: CreateNamespaceRequest): Promise<ApiResponse<Namespace>> {
        const response = await this.post<{ namespace: Namespace }>(API_CONFIG.endpoints.namespaces.create, data);
        return {
            data: response.data?.namespace,
            error: response.error,
            status: response.status
        };
    }

    async list(query?: NamespaceQuery): Promise<ApiResponse<Namespace[]>> {
        const params: Record<string, string | number | undefined> = {};
        if (query?.include_public !== undefined) {
            params.include_public = query.include_public ? 'true' : 'false';
        }
        const response = await this.get<{ namespaces: Namespace[] }>(API_CONFIG.endpoints.namespaces.list, { params });
        return {
            data: response.data?.namespaces,
            error: response.error,
            status: response.status
        };
    }

    async deleteNamespace(id: number): Promise<ApiResponse<void>> {
        const endpoint = API_CONFIG.endpoints.namespaces.delete.replace(':id', id.toString());
        return this.delete<void>(endpoint);
    }

    async share(id: number, data: ShareNamespaceRequest): Promise<ApiResponse<void>> {
        const endpoint = API_CONFIG.endpoints.namespaces.share.replace(':id', id.toString());
        return this.post<void>(endpoint, data);
    }

    async revoke(id: number, data: RevokeNamespaceRequest): Promise<ApiResponse<void>> {
        const endpoint = API_CONFIG.endpoints.namespaces.revoke.replace(':id', id.toString());
        return this.post<void>(endpoint, data);
    }

    async getAccessList(id: number): Promise<ApiResponse<{ access_list: NamespaceAccessResponse[] }>> {
        const endpoint = API_CONFIG.endpoints.namespaces.access.replace(':id', id.toString());
        return this.get<{ access_list: NamespaceAccessResponse[] }>(endpoint);
    }
} 
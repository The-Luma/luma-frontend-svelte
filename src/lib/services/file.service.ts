import { BaseService } from './base.service';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';
import type { Document, DocumentListItem } from '$lib/types/api.types';

export class FileService extends BaseService {
    constructor() {
        super();
    }

    async upload(namespaceId: number, file: File): Promise<ApiResponse<Document>> {
        const endpoint = API_CONFIG.endpoints.files.upload.replace(':id', namespaceId.toString());
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(this.buildUrl(endpoint), {
            ...this.defaultOptions,
            method: 'POST',
            body: formData,
            // Don't set Content-Type header, let browser set it with boundary
            headers: {}
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                error: errorData.error || 'Failed to upload file',
                status: response.status
            };
        }

        const data = await response.json();
        return {
            data: data.document,
            status: response.status
        };
    }

    async list(namespaceId: number): Promise<ApiResponse<DocumentListItem[]>> {
        const endpoint = API_CONFIG.endpoints.files.list.replace(':id', namespaceId.toString());
        const response = await this.get<{ documents: DocumentListItem[] }>(endpoint);
        
        // Transform the response to match the expected format
        return {
            data: response.data?.documents || [],
            error: response.error,
            status: response.status
        };
    }

    async deleteDocument(namespaceId: number, documentId: number): Promise<ApiResponse<void>> {
        const endpoint = API_CONFIG.endpoints.files.delete
            .replace(':id', namespaceId.toString())
            .replace(':docId', documentId.toString());
        return this.delete<void>(endpoint);
    }

    async download(namespaceId: number, documentId: number): Promise<Response> {
        const endpoint = API_CONFIG.endpoints.files.download
            .replace(':id', namespaceId.toString())
            .replace(':docId', documentId.toString());

        const response = await fetch(this.buildUrl(endpoint), {
            ...this.defaultOptions,
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to download document');
        }

        return response;
    }
} 
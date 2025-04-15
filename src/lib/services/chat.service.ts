import { BaseService } from './base.service';
import { API_CONFIG } from '$lib/config/api.config';
import type { ApiResponse } from '$lib/types/api.types';
import type { 
    ChatMessage, 
    ChatStart, 
    Conversation, 
    ConversationListItem,
    NamespaceQuery 
} from '$lib/types/api.types';

export class ChatService extends BaseService {
    constructor() {
        super();
    }

    async start(data: ChatStart): Promise<ApiResponse<Conversation>> {
        return this.post<Conversation>(API_CONFIG.endpoints.chats.start, data);
    }

    async sendMessage(data: ChatMessage): Promise<ApiResponse<ChatMessage>> {
        return this.post<ChatMessage>(API_CONFIG.endpoints.chats.send, data);
    }

    async getHistory(conversationId: number): Promise<ApiResponse<Conversation>> {
        const endpoint = API_CONFIG.endpoints.chats.history.replace(':id', conversationId.toString());
        return this.get<Conversation>(endpoint);
    }

    async list(query?: NamespaceQuery): Promise<ApiResponse<ConversationListItem[]>> {
        const params: Record<string, string | number | undefined> = {};
        if (query?.include_public !== undefined) {
            params.include_public = query.include_public ? 'true' : 'false';
        }
        return this.get<ConversationListItem[]>(API_CONFIG.endpoints.chats.list, { params });
    }

    async deleteConversation(conversationId: number): Promise<ApiResponse<void>> {
        const endpoint = API_CONFIG.endpoints.chats.delete.replace(':id', conversationId.toString());
        return this.delete<void>(endpoint);
    }
} 
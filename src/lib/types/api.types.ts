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

// Namespace Types
export interface Namespace {
    id: number;
    name: string;
    description: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
    auth_level: number;
}

export interface CreateNamespaceRequest {
    name: string;
    description: string;
    is_public?: boolean;
}

export interface ShareNamespaceRequest {
    user_id: number;
    auth_level: string;
}

export interface RevokeNamespaceRequest {
    user_id: number;
}

// Chat Types
export interface ChatMessage {
    content: string;
    conversation_id: number;
}

export interface ChatStart {
    namespace_id: number;
}

export interface Conversation {
    id: number;
    namespace_id: number;
    created_at: string;
    updated_at: string;
    messages: ChatMessage[];
}

export interface ConversationListItem {
    id: number;
    namespace_id: number;
    created_at: string;
    updated_at: string;
}

// File Types
export interface Document {
    id: number;
    namespace_id: number;
    name: string;
    file_path: string;
    created_at: string;
    updated_at: string;
}

export interface FileMetadata {
    chunks: number;
    original_filename: string;
    parent_document_id: string;
    size: number;
    storage_path: string;
}

export interface DocumentListItem {
    id: number;
    namespace_id: number;
    name: string;
    created_at: string;
    type_: string;
    is_public: boolean;
    user_id: number;
    file_metadata: FileMetadata;
}

// Query Types
export interface NamespaceQuery {
    include_public?: boolean;
} 
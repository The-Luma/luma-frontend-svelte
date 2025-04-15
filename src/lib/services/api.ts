import { AuthService as AuthServiceClass } from './auth.service';
import { AdminService as AdminServiceClass } from './admin.service';
import { HealthService as HealthServiceClass } from './health.service';
import { NamespaceService as NamespaceServiceClass } from './namespace.service';
import { ChatService as ChatServiceClass } from './chat.service';
import { FileService as FileServiceClass } from './file.service';

// Create service instances
const authService = new AuthServiceClass();
const adminService = new AdminServiceClass();
const healthService = new HealthServiceClass();
const namespaceService = new NamespaceServiceClass();
const chatService = new ChatServiceClass();
const fileService = new FileServiceClass();

// Export the API object
export const api = {
    auth: authService,
    admin: adminService,
    health: healthService,
    namespaces: namespaceService,
    chats: chatService,
    files: fileService,
} as const;

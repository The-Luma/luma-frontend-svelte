const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error('VITE_API_URL is not defined in environment variables');
}

export const API_CONFIG = {
    baseUrl: API_URL as string,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    endpoints: {
        auth: {
            login: '/login',
            logout: '/logout',
            refresh: '/refresh',
            me: '/me',
            check: '/auth/check',
            changeUsername: '/account/username',
            changePassword: '/account/password',
        },
        admin: {
            create: '/admin',
            check: '/admin/check',
            users: '/admin/users',
            listUsers: '/users',
            invitations: '/invitations',
        },
        health: {
            check: ''
        },
        namespaces: {
            create: '/namespaces',
            list: '/namespaces',
            delete: '/namespaces/:id',
            share: '/namespaces/:id/share',
            revoke: '/namespaces/:id/revoke',
        },
        chats: {
            start: '/chat/start',
            send: '/chat/message',
            history: '/chat/:id',
            list: '/chat',
            delete: '/chat/:id',
        },
        files: {
            upload: '/documents/upload/:id',
            list: '/documents/:id',
            delete: '/documents/:id/:docId',
            download: '/documents/:id/:docId/download',
        }
    }
} as const;

export type ApiEndpoints = typeof API_CONFIG.endpoints; 
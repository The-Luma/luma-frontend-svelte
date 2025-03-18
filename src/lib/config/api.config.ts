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
        },
        admin: {
            create: '/admin',
            check: '/admin/check',
            users: '/admin/users',
            invitations: '/admin/invitations',
        },
        health: {
            check: ''
        }
    }
} as const;

export type ApiEndpoints = typeof API_CONFIG.endpoints; 
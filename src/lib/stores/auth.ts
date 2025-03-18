import { writable, derived } from 'svelte/store';
import { api } from '$lib/services/api';

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

// Helper function to check if a user is an admin
export function isAdmin(user: User | null): boolean {
    return user?.role === 'admin';
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

const createAuthStore = () => {
    const { subscribe, set, update } = writable<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null
    });

    return {
        subscribe,
        setAuthenticated: (authenticated: boolean) => {
            update(state => ({ ...state, isAuthenticated: authenticated }));
        },
        setUser: (user: User | null) => {
            update(state => ({ ...state, user }));
        },
        setLoading: (loading: boolean) => {
            update(state => ({ ...state, isLoading: loading }));
        },
        logout: async () => {
            try {
                await api.auth.logout();
            } catch (error) {
                console.error('Error during logout:', error);
            } finally {
                set({ isAuthenticated: false, isLoading: false, user: null });
            }
        }
    };
};

export const auth = createAuthStore();

// Derived stores for convenience
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const isLoading = derived(auth, $auth => $auth.isLoading);
export const user = derived(auth, $auth => $auth.user);
export const isUserAdmin = derived(auth, $auth => isAdmin($auth.user));

// Function to check if admin setup is needed
export const isAdminSetup = writable<boolean>(false);

export async function checkAdminSetup() {
    try {
        const response = await api.admin.checkSetup();
        if (response.error) {
            console.error('Error checking admin setup:', response.error);
            return false;
        }
        isAdminSetup.set(response.data ?? false);
        return response.data ?? false;
    } catch (error) {
        console.error('Error checking admin setup:', error);
        return false;
    }
}

// Function to check authentication status
export async function checkAuth() {
    auth.setLoading(true);
    try {
        const response = await api.auth.me();
        if (response.error || !response.data) {
            auth.logout();
            return false;
        }
        auth.setUser(response.data);
        auth.setAuthenticated(true);
        return true;
    } catch (error) {
        console.error('Error checking auth:', error);
        auth.logout();
        return false;
    } finally {
        auth.setLoading(false);
    }
}

// Setup refresh token interval
const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

export function setupTokenRefresh() {
    const refreshToken = async () => {
        try {
            const response = await api.auth.refreshToken();
            if (response.error) {
                console.error('Error refreshing token:', response.error);
                auth.logout();
            } else if (response.data) {
                // Update the auth store with the new user data
                auth.setUser(response.data.user);
                auth.setAuthenticated(true);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            auth.logout();
        }
    };

    // Initial refresh
    refreshToken();

    // Setup interval
    const interval = setInterval(refreshToken, REFRESH_INTERVAL);

    // Return cleanup function
    return () => clearInterval(interval);
}

export type { UserResponse } from '$lib/types/auth.types'; 
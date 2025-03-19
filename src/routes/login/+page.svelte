<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { api } from '$lib/services/api';
    import { auth, setupTokenRefresh } from '$lib/stores/auth';
    import type { LoginRequest } from '$lib/types/auth.types';

    const toastStore = getToastStore();
    let userInput = $state(''); 
    let password = $state('');
    let isLoading = $state(false);

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        
        if (!userInput || !password) {
            toastStore.trigger({
                message: 'Please fill in all fields',
                background: 'variant-filled-error'
            });
            return;
        }

        const loginData: LoginRequest = {
            username: userInput,
            password
        };

        isLoading = true;
        try {
            const response = await api.auth.login(loginData);

            if (response.error || !response.data) {
                throw new Error(response.error || 'Login failed');
            }

            // Update authentication state
            auth.setUser(response.data.user);
            auth.setAuthenticated(true);
            
            // Setup token refresh
            setupTokenRefresh();
            
            toastStore.trigger({
                message: 'Login successful!',
                background: 'variant-filled-success'
            });

            // Redirect immediately
            goto('/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            toastStore.trigger({
                message: error instanceof Error ? error.message : 'Invalid username or password',
                background: 'variant-filled-error'
            });
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card variant-glass-surface p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Sign in to your account</h2>
        </header>

        <form class="space-y-6" onsubmit={handleSubmit}>
            <label class="label">
                <span>Email or Username</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Enter email or username"
                    bind:value={userInput}
                    required
                    disabled={isLoading}
                />
            </label>

            <label class="label">
                <div class="flex justify-between items-center">
                    <span>Password</span>
                    <a href="/forgot-password" class="anchor">Forgot password?</a>
                </div>
                <input
                    class="input"
                    type="password"
                    placeholder="Enter password"
                    bind:value={password}
                    required
                    disabled={isLoading}
                />
            </label>

            <button 
                type="submit" 
                class="btn variant-filled-primary w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    </div>
</div>

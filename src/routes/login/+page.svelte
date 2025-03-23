<script lang="ts">
    import { goto } from '$app/navigation';
    // import toast from '../+layout.svelte'
    import { api } from '$lib/services/api';
    import { auth, setupTokenRefresh } from '$lib/stores/auth';
    import type { LoginRequest } from '$lib/types/auth.types';

    let userInput = $state(''); 
    let password = $state('');
    let isLoading = $state(false);

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        
        if (!userInput || !password) {
            // toast.create({
            //     title: 'Error',
            //     description: 'Please fill in all fields.',
            //     type: 'error'
            // });
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
            
            // toastStore.trigger({
            //     message: 'Login successful!',
            //     background: 'preset-filled-success-500'
            // });

            // Redirect immediately
            goto('/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            // toastStore.trigger({
            //     message: error instanceof Error ? error.message : 'Invalid username or password',
            //     background: 'preset-filled-error-500'
            // });
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card preset-filled-surface-100-900 border-surface-200-800 p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Sign in</h2>
        </header>

        <form class="space-y-6" onsubmit={handleSubmit}>
            <label class="label">
                <span>Username</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Enter username"
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
                class="btn preset-filled-primary-500 w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    </div>
</div>

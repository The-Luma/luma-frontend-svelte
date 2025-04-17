<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/services/api';
    import { auth, setupTokenRefresh } from '$lib/stores/auth';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    export const toast: ToastContext = getContext('toast');

    let username = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let isLoading = $state(false);
    let invitationToken = $state('');
    let isValidToken = $state(false);
    let error = $state<string | null>(null);

    // Get the invitation token from the URL query parameter
    $effect(() => {
        const token = $page.url.searchParams.get('token');
        if (token) {
            invitationToken = token;
            isValidToken = true;
            console.log('Invitation token found:', token);
        } else {
            isValidToken = false;
            console.log('No invitation token found in URL');
        }
    });

    onMount(() => {
        // Log the current URL and token for debugging
        console.log('Current URL:', $page.url.toString());
        console.log('Token from URL:', $page.url.searchParams.get('token'));
    });

    const validateForm = () => {
        // Username validation
        if (username.length < 3 || username.length > 50) {
            toast.create({
                title: 'Error',
                description: 'Username must be between 3 and 50 characters',
                type: 'error'
            });
            return false;
        }

        // Password validation
        if (password.length < 13) {
            toast.create({
                title: 'Error',
                description: 'Password must be at least 13 characters long',
                type: 'error'
            });
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toast.create({
                title: 'Error',
                description: 'Password must contain at least one uppercase letter',
                type: 'error'
            });
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toast.create({
                title: 'Error',
                description: 'Password must contain at least one lowercase letter',
                type: 'error'
            });
            return false;
        }

        if (!/[0-9]/.test(password)) {
            toast.create({
                title: 'Error',
                description: 'Password must contain at least one number',
                type: 'error'
            });
            return false;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            toast.create({
                title: 'Error',
                description: 'Password must contain at least one special character',
                type: 'error'
            });
            return false;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            toast.create({
                title: 'Error',
                description: 'Passwords do not match',
                type: 'error'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        error = null;
        
        if (!isValidToken) {
            error = 'Invalid or missing invitation token';
            toast.create({
                title: 'Error',
                description: error,
                type: 'error'
            });
            return;
        }
        
        if (!validateForm()) {
            return;
        }

        isLoading = true;
        try {
            console.log('Attempting registration with token:', invitationToken);
            const response = await api.auth.registerWithInvitation({
                username,
                password,
                invitation_token: invitationToken
            });

            if (response.error || !response.data) {
                throw new Error(response.error || 'Registration failed');
            }

            // Update authentication state
            auth.setUser(response.data.user);
            auth.setAuthenticated(true);
            
            // Setup token refresh
            setupTokenRefresh();
            
            toast.create({
                title: 'Success',
                description: 'Registration successful! Welcome to Luma.',
                type: 'success'
            });

            // Redirect to dashboard
            goto('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
            toast.create({
                title: 'Error',
                description: errorMessage,
                type: 'error'
            });
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card preset-filled-surface-100-900 border-surface-200-800 p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Complete Your Registration</h2>
            {#if !isValidToken}
                <p class="text-error-500">Invalid or missing invitation token. Please use the link provided in your invitation email.</p>
            {:else}
                <p class="text-surface-600-400">You've been invited to join Luma. Please complete your registration to get started.</p>
            {/if}
        </header>
        
        {#if isValidToken}
            <form class="space-y-6" onsubmit={handleSubmit}>
                <label class="label">
                    <span>Username</span>
                    <input
                        class="input"
                        type="text"
                        placeholder="Choose a username"
                        bind:value={username}
                        required
                        disabled={isLoading}
                    />
                </label>

                <label class="label">
                    <span>Password</span>
                    <input
                        class="input"
                        type="password"
                        placeholder="Create a password"
                        bind:value={password}
                        required
                        disabled={isLoading}
                    />
                    <p class="text-xs text-surface-600-400 mt-1">
                        Password must be at least 13 characters long and contain uppercase, lowercase, numbers, and special characters.
                    </p>
                </label>

                <label class="label">
                    <span>Confirm Password</span>
                    <input
                        class="input"
                        type="password"
                        placeholder="Confirm your password"
                        bind:value={confirmPassword}
                        required
                        disabled={isLoading}
                    />
                </label>

                <button 
                    type="submit" 
                    class="btn preset-filled-primary-500 w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </button>
            </form>
        {:else}
            <div class="flex justify-center">
                <a href="/login" class="btn preset-filled">Return to Login</a>
            </div>
        {/if}
    </div>
</div> 
<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { isAdminSetup } from '$lib/stores/auth';
    import { api } from '$lib/services/api';
    import type { RegisterRequest } from '$lib/types/auth.types';

    const toastStore = getToastStore();
    let email = $state('');
    let username = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let isLoading = $state(false);

    const validateForm = () => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toastStore.trigger({
                message: 'Invalid email format',
                background: 'variant-filled-error'
            });
            return false;
        }

        // Username validation
        if (username.length < 3 || username.length > 50) {
            toastStore.trigger({
                message: 'Username must be between 3 and 50 characters',
                background: 'variant-filled-error'
            });
            return false;
        }

        // Password validation
        if (password !== confirmPassword) {
            toastStore.trigger({
                message: 'Passwords do not match',
                background: 'variant-filled-error'
            });
            return false;
        }

        if (password.length < 13) {
            toastStore.trigger({
                message: 'Password must be at least 13 characters long',
                background: 'variant-filled-error'
            });
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toastStore.trigger({
                message: 'Password must contain at least one uppercase letter',
                background: 'variant-filled-error'
            });
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toastStore.trigger({
                message: 'Password must contain at least one lowercase letter',
                background: 'variant-filled-error'
            });
            return false;
        }

        if (!/[0-9]/.test(password)) {
            toastStore.trigger({
                message: 'Password must contain at least one number',
                background: 'variant-filled-error'
            });
            return false;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            toastStore.trigger({
                message: 'Password must contain at least one special character',
                background: 'variant-filled-error'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        isLoading = true;
        try {
            const adminData: RegisterRequest = {
                email,
                username,
                password
            };

            const response = await api.admin.create(adminData);

            if (response.error) {
                throw new Error(response.error);
            }

            isAdminSetup.set(true);
            
            toastStore.trigger({
                message: 'Admin account created successfully!',
                background: 'variant-filled-success'
            });

            // Redirect to login page after a short delay
            setTimeout(() => {
                goto('/login');
            }, 1500);

        } catch (error) {
            console.error('Error creating admin account:', error);
            toastStore.trigger({
                message: error instanceof Error ? error.message : 'Failed to create admin account',
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
            <h2 class="h2">Welcome to Luma!</h2>
            <p class="text-secondary">Create your admin account to get started</p>
        </header>

        <form class="space-y-6" onsubmit={handleSubmit}>
            <label class="label">
                <span>Email</span>
                <input
                    class="input"
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    required
                    disabled={isLoading}
                />
            </label>

            <label class="label">
                <span>Username</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Choose a username (3-50 characters)"
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
                    placeholder="Create a password (min 13 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)"
                    bind:value={password}
                    required
                    disabled={isLoading}
                />
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
                class="btn variant-filled-primary w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
        </form>
    </div>
</div> 
<script lang="ts">
    import { goto } from '$app/navigation';
    import { isAdminSetup } from '$lib/stores/auth';
    import { api } from '$lib/services/api';
    import type { RegisterRequest } from '$lib/types/auth.types';

    // let email = $state('');
    // let username = $state('');
    // let password = $state('');
    // let confirmPassword = $state('');
    let isLoading = $state(false);
    let errors = $state({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        submit: ''
    });

    const validateForm = () => {
        // Reset errors
        errors = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            submit: ''
        };

        let isValid = true;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // toastStore.trigger({
            //     message: 'Invalid email format',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.email = 'Invalid email format';
            isValid = false;
        }

        // Username validation
        if (username.length < 3 || username.length > 50) {
            // toastStore.trigger({
            //     message: 'Username must be between 3 and 50 characters',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.username = 'Username must be between 3 and 50 characters';
            isValid = false;
        }

        // Password validation
        if (password !== confirmPassword) {
            // toastStore.trigger({
            //     message: 'Passwords do not match',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (password.length < 13) {
            // toastStore.trigger({
            //     message: 'Password must be at least 13 characters long',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.password = 'Password must be at least 13 characters long';
            isValid = false;
        }

        if (!/[A-Z]/.test(password)) {
            // toastStore.trigger({
            //     message: 'Password must contain at least one uppercase letter',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.password = 'Password must contain at least one uppercase letter';
            isValid = false;
        }

        if (!/[a-z]/.test(password)) {
            // toastStore.trigger({
            //     message: 'Password must contain at least one lowercase letter',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.password = 'Password must contain at least one lowercase letter';
            isValid = false;
        }

        if (!/[0-9]/.test(password)) {
            // toastStore.trigger({
            //     message: 'Password must contain at least one number',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.password = 'Password must contain at least one number';
            isValid = false;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            // toastStore.trigger({
            //     message: 'Password must contain at least one special character',
            //     background: 'preset-filled-error-500'
            // });
            // return false;
            errors.password = 'Password must contain at least one special character';
            isValid = false;
        }

        // return true;
        return isValid;
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
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                goto('/login');
            }, 1500);

        } catch (error) {
            console.error('Error creating admin account:', error);
            errors.submit = error instanceof Error ? error.message : 'Failed to create admin account';
        } finally {
            isLoading = false;
        }
    };
    </script>

    <div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card preset-tonal-surface p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Welcome to Luma!</h2>
            <p class="text-secondary">Create your admin account to get started</p>
        </header>

        <form class="space-y-6" onsubmit={handleSubmit}>
            <label class="label">
                <span>Email</span>
                <input
                    class="input {errors.email ? 'border-error-500' : ''}"
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    required
                    disabled={isLoading}
                />
                {#if errors.email}
                    <p class="text-error-500 text-sm mt-1">{errors.email}</p>
                {/if}
            </label>

            <label class="label">
                <span>Username</span>
                <input
                    class="input {errors.username ? 'border-error-500' : ''}"
                    type="text"
                    placeholder="Choose a username (3-50 characters)"
                    bind:value={username}
                    required
                    disabled={isLoading}
                />
                {#if errors.username}
                    <p class="text-error-500 text-sm mt-1">{errors.username}</p>
                {/if}
            </label>

            <label class="label">
                <span>Password</span>
                <input
                    class="input {errors.password ? 'border-error-500' : ''}"
                    type="password"
                    placeholder="Create a password (min 13 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)"
                    bind:value={password}
                    required
                    disabled={isLoading}
                />
                {#if errors.password}
                    <p class="text-error-500 text-sm mt-1">{errors.password}</p>
                {/if}
            </label>

            <label class="label">
                <span>Confirm Password</span>
                <input
                    class="input {errors.confirmPassword ? 'border-error-500' : ''}"
                    type="password"
                    placeholder="Confirm your password"
                    bind:value={confirmPassword}
                    required
                    disabled={isLoading}
                />
                {#if errors.confirmPassword}
                    <p class="text-error-500 text-sm mt-1">{errors.confirmPassword}</p>
                {/if}
            </label>

            {#if errors.submit}
                <p class="text-error-500 text-sm text-center">{errors.submit}</p>
            {/if}

            <button 
                type="submit" 
                class="btn preset-filled-primary-500 w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
        </form>
    </div>
</div> 

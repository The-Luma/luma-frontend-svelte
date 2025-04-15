<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton-svelte';
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

    let { children } = $props();
    
    // Subscribe to the auth store
    let user = $derived($auth.user);
    let isLoading = $derived($auth.isLoading);

    onMount(() => {
        if (!$auth.isAuthenticated && !isLoading) {
            goto('/dashboard');
        }
    });

    const handleLogout = async () => {
        try {
            await auth.logout();
            goto('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
</script>

<div class="flex flex-col h-full">
    <!-- Grid Columns -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <!-- Main Content -->
        <main class="h-full bg-surface-50-900">
            {#if isLoading}
                <div class="flex justify-center items-center h-[50vh]">
                    <div class="loading loading-spinner loading-lg"></div>
                </div>
            {:else if user}
                {@render children()}
            {:else}
                <p class="text-center text-error-500">Not authenticated. Redirecting to login...</p>
            {/if}
        </main>
    </div>
</div> 
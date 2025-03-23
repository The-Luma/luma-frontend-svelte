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

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <!-- Header -->
    <header class="p-4">
        <div class="flex items-center justify-between bg-blend-color">
            <h5 class="h5">Luma</h5>
            <div class="flex items-center gap-4">
                <ThemeSwitcher />
                <button class="btn preset-filled-error-500" on:click={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    </header>

    <!-- Grid Columns -->
    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <!-- Left Sidebar -->
        <aside class="bg-surface-200-700 p-4">
            <nav class="space-y-2">
                <a href="/dashboard" class="btn variant-ghost w-full justify-start">Overview</a>
                <a href="/dashboard/profile" class="btn variant-ghost w-full justify-start">Profile</a>
                <a href="/dashboard/settings" class="btn variant-ghost w-full justify-start">Settings</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="bg-surface-50-900 p-4">
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

    <!-- Footer -->
    <footer class="bg-surface-100-800 p-4">
        <div class="text-center text-sm opacity-60">
            © 2024 Your App Name. All rights reserved.
        </div>
    </footer>
</div> 
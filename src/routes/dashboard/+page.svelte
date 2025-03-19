<script lang="ts">
        import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';

    const toastStore = getToastStore();

    // Subscribe to the auth store
    let user = $derived($auth.user);
    let isLoading = $derived($auth.isLoading);

    onMount(() => {
        // If not authenticated, redirect to login
        if (!$auth.isAuthenticated && !isLoading) {
            goto('/login');
        }
    });

    const handleLogout = async () => {
        try {
            await auth.logout();
            toastStore.trigger({
                message: 'Logged out successfully',
                background: 'preset-filled-success-500'
            });
            goto('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toastStore.trigger({
                message: 'Error during logout',
                background: 'preset-filled-error-500'
            });
        }
    };
</script>

<div class="container mx-auto p-4 space-y-8">
    <div class="flex justify-between items-center">
        <h1 class="h1">Dashboard</h1>
        <button class="btn preset-filled-error-500" onclick={handleLogout}>
            Logout
        </button>
    </div>

    {#if isLoading}
        <div class="flex justify-center items-center h-[50vh]">
            <div class="loading loading-spinner loading-lg"></div>
        </div>
    {:else if user}
        <div class="card preset-tonal-surface p-6 space-y-4">
            <h2 class="h2">Welcome, {user.username}!</h2>
            
            <div class="space-y-2">
                <div class="grid grid-cols-[120px_1fr] gap-2">
                    <span class="font-bold">Email:</span>
                    <span>{user.email}</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] gap-2">
                    <span class="font-bold">User ID:</span>
                    <span>{user.id}</span>
                </div>
                <div class="grid grid-cols-[120px_1fr] gap-2">
                    <span class="font-bold">Role:</span>
                    <span class="capitalize">{user.role}</span>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center text-error-500">Not authenticated. Redirecting to login...</p>
    {/if}
</div> 
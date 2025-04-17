<script lang="ts">
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';

    let username = $state('');
    
    onMount(() => {
        username = $auth.user?.username || 'User';
    });
</script>

<div class="card p-8">
    <div class="space-y-4">
        <h1 class="h1">Welcome back, {username}!</h1>
        <p class="text-surface-600-400 text-lg">
            Use the navigation menu on the left to access different sections of your dashboard.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div class="card variant-ghost-surface p-4">
                <h2 class="h2">What you can do</h2>
                <ul class="space-y-2 mt-2">
                    <li>• Start a new chat with Luma</li>
                    <li>• Manage spaces</li>
                    <li>• Upload files to a space </li>
                    <li>• Update profile</li>
                </ul>
            </div>
        </div>
    </div>
</div> 
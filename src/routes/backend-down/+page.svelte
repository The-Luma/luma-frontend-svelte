<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { api } from '$lib/services/api';

    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 5000; // 5 seconds

    async function checkBackend() {
        const isUp = await api.health.check();
        if (isUp) {
            goto('/');
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkBackend, retryInterval);
        }
    }

    onMount(() => {
        checkBackend();
    });
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card variant-glass-surface p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Backend Service Unavailable</h2>
            <p class="text-secondary">
                We're unable to connect to the backend service. Please check if the backend is running.
            </p>
        </header>

        <div class="space-y-4">
            <p class="text-center">
                Attempting to reconnect... ({retryCount}/{maxRetries})
            </p>
            <div class="progress-bar">
                <div 
                    class="progress-bar-fill" 
                    style="width: {(retryCount / maxRetries) * 100}%"
                ></div>
            </div>
        </div>

        <div class="text-center space-y-2">
            <p class="text-sm text-secondary">
                If this persists, please check:
            </p>
            <ul class="text-sm text-secondary list-disc list-inside">
                <li>Backend service is running</li>
                <li>Backend port is correct</li>
                <li>Network connectivity is working</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .progress-bar {
        width: 100%;
        height: 4px;
        background-color: var(--color-surface-300);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background-color: var(--color-primary-500);
        transition: width 0.3s ease-in-out;
    }
</style> 
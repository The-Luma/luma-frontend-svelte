<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="container mx-auto p-4 space-y-8">
    <div class="card variant-glass-surface p-8 max-w-[480px] mx-auto space-y-6">
        <header class="text-center space-y-4">
            <h2 class="h2">Error {$page.status}</h2>
            <p class="text-error-500">{$page.error?.message}</p>
        </header>

        <div class="flex justify-center">
            <a href="/" class="btn variant-filled-primary">
                Return Home
            </a>
        </div>
    </div>
</div> 
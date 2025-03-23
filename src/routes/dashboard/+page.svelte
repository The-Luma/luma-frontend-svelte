<script lang="ts">
    import { auth } from '$lib/stores/auth';
    
    let user = $derived($auth.user);
</script>

<div class="card preset-filled-surface-100-900 border-surface-200-800  p-6 space-y-4">
    <h2 class="h2">Welcome, {user?.username}!</h2>
    
    <div class="space-y-2">
        <div class="grid grid-cols-[120px_1fr] gap-2">
            <span class="font-bold">Email:</span>
            <span>{user?.email}</span>
        </div>
        <div class="grid grid-cols-[120px_1fr] gap-2">
            <span class="font-bold">User ID:</span>
            <span>{user?.id}</span>
        </div>
        <div class="grid grid-cols-[120px_1fr] gap-2">
            <span class="font-bold">Role:</span>
            <span class="capitalize">{user?.role}</span>
        </div>
    </div>
</div> 
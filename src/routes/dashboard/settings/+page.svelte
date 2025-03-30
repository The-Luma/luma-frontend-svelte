<script lang="ts">
    // Settings functionality will be implemented here
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

    let email = $state('');
    let username = $state('');
    let password = $state('');
    let changeUsername = $state('');
    let changePassword = $state('');
    let confermPassword = $state('');
    
    onMount(() => {
        email = $auth.user?.email || 'Email';
        username = $auth.user?.username || 'User';
        password = '********';
    });

</script>

<div class="card p-4 preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full max-w-md">
    <h1 class="h1">Settings</h1>
    <hr class="hr" />
    
    <div class='grid gap-4 grid-cols-3 gap-4' >
        <div class="col-span-3 grid grid-cols-subgrid">
            <h3 class='h6'>Email</h3>
            <p class='text-sm text-gray-500'>{email}</p>
        </div>
        
        <h3 class='h6'>Username</h3>
        <p class="text-sm text-gray-500" id='username'>{username}</p>

        <!-- svelte-ignore event_directive_deprecated -->
        <button type="button" class="btn btn-sm preset-filled" id='change_username'>Change Username</button>

        <h3 class='h6'>Password</h3>
        <p class="text-sm text-gray-500" id='password'>{password}</p>
        <button type="button" class="btn btn-sm preset-filled" id='change_password'>Change Password</button>
        
        <button class="btn preset-filled-error-500 items-en">Logout</button>
    </div>
</div> 
<script lang="ts">
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';

    let username = $state('');
    let email = $state('');
    let role = $state('')
    
    onMount(() => {
        username = $auth.user?.username || 'User';
        email = $auth.user?.email || 'Email';
        role = $auth.user?.role || 'Role'
    });
</script>

<div class="card p-4">
    <h1 class="h1">My Profile</h1>
    <br />
    <h3 class="h3"> Hello {username}!</h3>
    <p>
        {email}
        {role}
    </p>
</div> 
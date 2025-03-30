<script lang="ts">
    // Settings functionality will be implemented here
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Tabs } from '@skeletonlabs/skeleton-svelte';
    import { writable } from 'svelte/store';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

    export const toast: ToastContext = getContext('toast');

    const selectedTab = writable('admin');
    let email = $state('');
    let username = $state('');
    let password = $state('');
    let isAdmin = $state(false);
    
    // Dummy data for users
    let users = $state([
        { id: 1, name: 'John Doe', role: 'Admin' },
        { id: 2, name: 'Jane Smith', role: 'Editor' },
        { id: 3, name: 'Bob Wilson', role: 'Viewer' }
    ]);
    
    onMount(() => {
        email = $auth.user?.email || 'Email';
        username = $auth.user?.username || 'User';
        password = '********';
        
        if ($auth.user?.role === 'admin') {
            isAdmin = true;
        }
    });

    const inviteUser = () => {
        toast.create({
            title: 'Info',
            description: 'Invite user functionality coming soon',
            type: 'info'
        });
    };

    const changeRole = (userId: number, newRole: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
            toast.create({
                title: 'Success',
                description: `User role updated to ${newRole}`,
                type: 'success'
            });
        }
    };

    const removeUser = (userId: number) => {
        users = users.filter(u => u.id !== userId);
        toast.create({
            title: 'Success',
            description: 'User removed successfully',
            type: 'success'
        });
    };

    const handleLogout = async () => {
        try {
            await auth.logout();
            goto('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
</script>

{#if isAdmin}
    <div class="card p-4 preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full max-w-md">
        <Tabs value={$selectedTab} on:change={(e) => selectedTab.set(e.detail.value)}>
            {#snippet list()}
                <Tabs.Control value="user">User Settings</Tabs.Control>
                <Tabs.Control value="admin">User Management</Tabs.Control>
            {/snippet}
            {#snippet content()}
                <Tabs.Panel value="user">
                    <div class="space-y-4">
                        <h1 class="h1">User Settings</h1>
                        <hr class="hr" />
                        
                        <div class='grid gap-4 grid-cols-3 gap-4'>
                            <div class="col-span-3 grid grid-cols-subgrid">
                                <h3 class='h6'>Email</h3>
                                <p class='text-sm text-gray-500'>{email}</p>
                            </div>
                            
                            <h3 class='h6'>Username</h3>
                            <p class="text-sm text-gray-500" id='username'>{username}</p>
                            <button type="button" class="btn btn-sm preset-filled" id='change_username'>Change Username</button>

                            <h3 class='h6'>Password</h3>
                            <p class="text-sm text-gray-500" id='password'>{password}</p>
                            <button type="button" class="btn btn-sm preset-filled" id='change_password'>Change Password</button>
                        </div>

                        <hr class="hr" />
                        <div class="flex justify-center">
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button class="btn preset-filled-error-500 w-full" on:click={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </Tabs.Panel>
                
                <Tabs.Panel value="admin">
                    <div class="space-y-4">
                        <h1 class="h1">User Management</h1>
                        <hr class="hr" />
                        
                        <div class="flex justify-between items-center">
                            <h3 class="h6">Manage Users</h3>
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button class="btn btn-sm preset-filled" on:click={inviteUser}>
                                Invite User
                            </button>
                        </div>

                        <div class="space-y-4">
                            {#each users as user}
                                <div class="card p-4 variant-ghost-surface">
                                    <div class="grid grid-cols-3 gap-4 items-center">
                                        <div class="col-span-1">
                                            <p class="font-medium">{user.name}</p>
                                        </div>
                                        <!-- svelte-ignore event_directive_deprecated -->
                                        <select 
                                            class="col-span-1" 
                                            bind:value={user.role}
                                            on:change={(e: Event) => {
                                                const target = e.target as HTMLSelectElement;
                                                if (target) {
                                                    changeRole(user.id, target.value);
                                                }
                                            }}
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Viewer">Viewer</option>
                                        </select>
                                        <!-- svelte-ignore event_directive_deprecated -->
                                        <button 
                                            class="btn btn-sm preset-filled-error-500 col-span-1"
                                            on:click={() => removeUser(user.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </Tabs.Panel>
            {/snippet}
        </Tabs>
    </div>
{:else}
    <div class="card p-4 preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full max-w-md">
        <h1 class="h1">Settings</h1>
        <br />
        <hr class="hr" />
        <br />
        
        <div class='grid gap-4 grid-cols-3 gap-4' >
            <div class="col-span-3 grid grid-cols-subgrid">
                <h3 class='h6'>Email</h3>
                <p class='text-sm text-gray-500'>{email}</p>
            </div>
            
            <h3 class='h6'>Username</h3>
            <p class="text-sm text-gray-500" id='username'>{username}</p>
            <button type="button" class="btn btn-sm preset-filled" id='change_username'>Change Username</button>

            <h3 class='h6'>Password</h3>
            <p class="text-sm text-gray-500" id='password'>{password}</p>
            <button type="button" class="btn btn-sm preset-filled" id='change_password'>Change Password</button>
        </div>

        <hr class="hr my-8" />
        
        <div class="flex justify-center">
            <button class="btn preset-filled-error-500 w-full" on:click={handleLogout}>
                Logout
            </button>
        </div>
    </div>
{/if}

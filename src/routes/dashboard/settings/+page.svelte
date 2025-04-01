<script lang="ts">
    // Settings functionality will be implemented here
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Tabs, Modal } from '@skeletonlabs/skeleton-svelte';
    // import { writable } from 'svelte/store';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

    export const toast: ToastContext = getContext('toast');

    let selectedTab = $state('user');
    let email = $state('');
    let username = $state('');
    let password = $state('');
    let isAdmin = $state(false);

    let usernameModalState = $state(false);
    let newUsername = $state('');
    
    let passwordModalState = $state(false);
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');
    let isUpdatingPassword = $state(false);
    
    let inviteModalState = $state(false);
    let inviteEmail = $state('');
    let inviteRole = $state('Viewer');
    let isInviting = $state(false);

    function userModalClose() {
        usernameModalState = false;
    }

    function passwordModalClose() {
        passwordModalState = false;
    }
    
    function inviteModalClose() {
        inviteModalState = false;
        inviteEmail = '';
        inviteRole = 'Viewer';
    }

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

    const inviteUser = async () => {
        if (!inviteEmail.trim()) {
            toast.create({
                title: 'Error',
                description: 'Email is required',
                type: 'error'
            });
            return;
        }

        isInviting = true;
        try {
            // TODO: Implement actual invite API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            // Add new user to the list (temporary)
            users = [...users, {
                id: users.length + 1,
                name: inviteEmail.split('@')[0],
                role: inviteRole
            }];

            toast.create({
                title: 'Success',
                description: 'User invited successfully',
                type: 'success'
            });
            inviteModalClose();
        } catch (error) {
            console.error('Error inviting user:', error);
            toast.create({
                title: 'Error',
                description: 'Failed to invite user. Please try again.',
                type: 'error'
            });
        } finally {
            isInviting = false;
        }
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

    const removeUser = async (userId: number) => {
        try {
            // Check if trying to delete own account
            if (userId === $auth.user?.id) {
                toast.create({
                    title: 'Error',
                    description: 'You cannot delete your own account',
                    type: 'error'
                });
                return;
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            users = users.filter(u => u.id !== userId);
            
            toast.create({
                title: 'Success',
                description: 'User removed successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.create({
                title: 'Error',
                description: 'Failed to delete user. Please try again.',
                type: 'error'
            });
        }
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
        <Tabs value={selectedTab} onValueChange={(e) => (selectedTab = e.value)}>
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
                            <button 
                                type="button" 
                                class="btn btn-sm preset-filled" 
                                id='change_username'
                                onclick={() => usernameModalState = true}
                            >
                                Change Username
                            </button>

                            <h3 class='h6'>Password</h3>
                            <p class="text-sm text-gray-500" id='password'>{password}</p>
                            <button 
                                type="button" 
                                class="btn btn-sm preset-filled" 
                                id='change_password'
                                onclick={() => passwordModalState = true}
                            >
                                Change Password
                            </button>
                        </div>

                        <hr class="hr" />
                        <div class="flex justify-center">
                            <button class="btn preset-filled-error-500 w-full" onclick={handleLogout}>
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
                            <button class="btn btn-sm preset-filled" onclick={() => inviteModalState = true}>
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
                                        <select 
                                            class="col-span-1" 
                                            bind:value={user.role}
                                            onchange={(e: Event) => {
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
                                        <button 
                                            class="btn btn-sm preset-filled-error-500 col-span-1"
                                            onclick={() => removeUser(user.id)}
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
            <button 
                type="button" 
                class="btn btn-sm preset-filled" 
                id='change_username'
                onclick={() => usernameModalState = true}
            >
                Change Username
            </button>

            <h3 class='h6'>Password</h3>
            <p class="text-sm text-gray-500" id='password'>{password}</p>
            <button 
                type="button" 
                class="btn btn-sm preset-filled" 
                id='change_password'
                onclick={() => passwordModalState = true}
            >
                Change Password
            </button>
        </div>

        <hr class="hr my-8" />
        
        <div class="flex justify-center">
            <button class="btn preset-filled-error-500 w-full" onclick={handleLogout}>
                Logout
            </button>
        </div>
    </div>
{/if}

<!-- Change Username Modal -->
<Modal
  open={usernameModalState}
  onOpenChange={(e) => (usernameModalState = e.open)}
  contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
  backdropClasses="backdrop-blur-sm"
>
  {#snippet content()}
    <header class="flex justify-between">
      <h2 class="h2">Update Username</h2>
    </header>
    <article class="space-y-4">
      <p class="text-sm text-gray-500">Enter your new username below.</p>
      <div class="space-y-2">
        <label class="label" for="newUsername">New Username</label>
        <input 
          type="text" 
          id="newUsername"
          bind:value={newUsername}
          class="input"
          placeholder="Enter new username"
        />
      </div>
    </article>
    <footer class="flex justify-end gap-4">
      <button type="button" class="btn preset-tonal" onclick={userModalClose}>Cancel</button>
      <button 
        type="button" 
        class="btn preset-filled" 
        onclick={() => {
          if (newUsername.trim()) {
            username = newUsername;
            newUsername = '';
            userModalClose();
          } else {
            toast.create({
              title: 'Error',
              description: 'Username cannot be empty',
              type: 'error'
            });
          }
        }}
      >
        Update Username
      </button>
    </footer>
  {/snippet}
</Modal>

<!-- Change Password Modal -->
<Modal
  open={passwordModalState}
  onOpenChange={(e) => (passwordModalState = e.open)}
  contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
  backdropClasses="backdrop-blur-sm"
>
  {#snippet content()}
    <header class="flex justify-between">
      <h2 class="h2">Update Password</h2>
    </header>
    <article class="space-y-4">
      <div class="space-y-2">
        <label class="label" for="currentPassword">Current Password</label>
        <input 
          type="password" 
          id="currentPassword"
          bind:value={currentPassword}
          class="input"
          placeholder="Enter current password"
          disabled={isUpdatingPassword}
        />
      </div>
      <div class="space-y-2">
        <label class="label" for="newPassword">New Password</label>
        <input 
          type="password" 
          id="newPassword"
          bind:value={newPassword}
          class="input"
          placeholder="Enter new password"
          disabled={isUpdatingPassword}
        />
      </div>
      <div class="space-y-2">
        <label class="label" for="confirmPassword">Confirm New Password</label>
        <input 
          type="password" 
          id="confirmPassword"
          bind:value={confirmPassword}
          class="input"
          placeholder="Confirm new password"
          disabled={isUpdatingPassword}
        />
      </div>
    </article>
    <footer class="flex justify-end gap-4">
      <button 
        type="button" 
        class="btn preset-tonal" 
        onclick={passwordModalClose}
        disabled={isUpdatingPassword}
      >
        Cancel
      </button>
      <button 
        type="button" 
        class="btn preset-filled" 
        onclick={() => {
          if (!currentPassword.trim()) {
            toast.create({
              title: 'Error',
              description: 'Current password is required',
              type: 'error'
            });
            return;
          }
          if (!newPassword.trim()) {
            toast.create({
              title: 'Error',
              description: 'New password is required',
              type: 'error'
            });
            return;
          }
          if (newPassword !== confirmPassword) {
            toast.create({
              title: 'Error',
              description: 'New passwords do not match',
              type: 'error'
            });
            return;
          }
          if (newPassword.length < 313) {
            toast.create({
              title: 'Error',
              description: 'New password must be at least 8 characters long',
              type: 'error'
            });
            return;
          }

          isUpdatingPassword = true;
          // TODO: Implement actual password update API call
          setTimeout(() => {
            password = '********';
            passwordModalClose();
            toast.create({
              title: 'Success',
              description: 'Password updated successfully',
              type: 'success'
            });
          }, 1000);
        }}
        disabled={isUpdatingPassword}
      >
        {#if isUpdatingPassword}
          Updating...
        {:else}
          Update Password
        {/if}
      </button>
    </footer>
  {/snippet}
</Modal>

<!-- Invite User Modal -->
<Modal
    open={inviteModalState}
    onOpenChange={(e) => (inviteModalState = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <header class="flex justify-between">
            <h2 class="h2">Invite User</h2>
        </header>
        <article class="space-y-4">
            <p class="text-sm text-gray-500">Enter the email address of the user you want to invite.</p>
            <div class="space-y-2">
                <label class="label" for="inviteEmail">Email Address</label>
                <input 
                    type="email" 
                    id="inviteEmail"
                    bind:value={inviteEmail}
                    class="input"
                    placeholder="Enter email address"
                    disabled={isInviting}
                />
            </div>
            <!-- <div class="space-y-2">
                <label class="label" for="inviteRole">Role</label>
                <select 
                    id="inviteRole"
                    bind:value={inviteRole}
                    class="select"
                    disabled={isInviting}
                >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
            </div> -->
        </article>
        <footer class="flex justify-end gap-4">
            <button 
                type="button" 
                class="btn preset-tonal" 
                onclick={inviteModalClose}
                disabled={isInviting}
            >
                Cancel
            </button>
            <button 
                type="button" 
                class="btn preset-filled" 
                onclick={inviteUser}
                disabled={isInviting}
            >
                {#if isInviting}
                    Inviting...
                {:else}
                    Invite User
                {/if}
            </button>
        </footer>
    {/snippet}
</Modal>

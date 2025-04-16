<script lang="ts">
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Tabs, Modal } from '@skeletonlabs/skeleton-svelte';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    import { api } from '$lib/services/api';
    import type { InviteUserResponse } from '$lib/services/admin.service';

    export const toast: ToastContext = getContext('toast');

    let selectedTab = $state('user');
    let email = $state('');
    let username = $state('');
    let password = $state('');
    let isAdmin = $state(false);

    let usernameModalState = $state(false);
    let newUsername = $state('');
    let usernamePassword = $state('');
    let isUpdatingUsername = $state(false);
    
    let passwordModalState = $state(false);
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');
    let isUpdatingPassword = $state(false);
    
    let inviteModalState = $state(false);
    let inviteEmail = $state('');
    let inviteRole = $state('Viewer');
    let isInviting = $state(false);
    let invitationDetails = $state<InviteUserResponse | null>(null);
    let invitationSuccessModalState = $state(false);

    interface User {
        id: number;
        username: string;
        role: string;
    }
    
    let users = $state<User[]>([]);
    let isLoading = $state(false);

    function userModalClose() {
        usernameModalState = false;
        newUsername = '';
        usernamePassword = '';
    }

    function passwordModalClose() {
        passwordModalState = false;
    }
    
    function inviteModalClose() {
        inviteModalState = false;
        inviteEmail = '';
        inviteRole = 'Viewer';
    }

    function invitationSuccessModalClose() {
        invitationSuccessModalState = false;
        invitationDetails = null;
    }

    onMount(async () => {
        email = $auth.user?.email || 'Email';
        username = $auth.user?.username || 'User';
        password = '****************';
        
        if ($auth.user?.role === 'admin') {
            isAdmin = true;
            await loadUsers();
        }
    });

    const loadUsers = async () => {
        isLoading = true;
        try {
            const response = await api.admin.listUsers();

            if (response.error) {
                throw new Error(response.error);
            }

            users = response.data?.users || [];
        } catch (error) {
            console.error('Error loading users:', error);
            toast.create({
                title: 'Error',
                description: 'Failed to load users. Please try again.',
                type: 'error'
            });
        } finally {
            isLoading = false;
        }
    };

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
            const response = await api.admin.inviteUser({
                email: inviteEmail,
                role: inviteRole.toLowerCase()
            });

            if (response.error) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('No response data received');
            }

            invitationDetails = response.data;
            inviteModalClose();
            invitationSuccessModalState = true;
            await loadUsers(); // Reload the users list
        } catch (error) {
            console.error('Error inviting user:', error);
            toast.create({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to invite user. Please try again.',
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

    const updateUsername = async () => {
        if (!newUsername.trim()) {
            toast.create({
                title: 'Error',
                description: 'Username cannot be empty',
                type: 'error'
            });
            return;
        }
        if (!usernamePassword.trim()) {
            toast.create({
                title: 'Error',
                description: 'Current password is required',
                type: 'error'
            });
            return;
        }

        isUpdatingUsername = true;
        try {
            const response = await api.auth.changeUsername({
                new_username: newUsername,
                password: usernamePassword
            });

            if (response.error) {
                throw new Error(response.error);
            }

            // Update the local username
            username = newUsername;
            
            // Refresh user details to ensure all data is up to date
            const userResponse = await api.auth.me();
            if (userResponse.data) {
                // Update the auth store with the latest user data
                auth.setUser(userResponse.data);
            }
            
            userModalClose();
            toast.create({
                title: 'Success',
                description: 'Username updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Error updating username:', error);
            toast.create({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update username',
                type: 'error'
            });
        } finally {
            isUpdatingUsername = false;
        }
    };

    const updatePassword = async () => {
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
        if (newPassword.length < 8) {
            toast.create({
                title: 'Error',
                description: 'New password must be at least 8 characters long',
                type: 'error'
            });
            return;
        }

        isUpdatingPassword = true;
        try {
            const response = await api.auth.changePassword({
                current_password: currentPassword,
                new_password: newPassword
            });

            if (response.error) {
                throw new Error(response.error);
            }

            password = '********';
            passwordModalClose();
            toast.create({
                title: 'Success',
                description: 'Password updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Error updating password:', error);
            toast.create({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update password',
                type: 'error'
            });
        } finally {
            isUpdatingPassword = false;
        }
    };
</script>

{#if isAdmin}
    <div class="card rounded-container flex flex-row h-[calc(100vh-4rem)]">
        <div class="flex flex-col w-full p-4">
            <Tabs value={selectedTab} onValueChange={(e) => (selectedTab = e.value)}>
                {#snippet list()}
                    <Tabs.Control value="user">User Settings</Tabs.Control>
                    <Tabs.Control value="admin">User Management</Tabs.Control>
                {/snippet}
                {#snippet content()}
                    <Tabs.Panel value="user">
                        <div class="space-y-4">
                            <h2 class="h2">Settings</h2>
                            <hr class="hr" />
                            
                            <div class='grid gap-4 grid-cols-3 gap-4'>
                                <div class="col-span-3 grid grid-cols-subgrid">
                                    <h3 class='h6'>Email</h3>
                                    <p class='text-sm text-surface-600-400'>{email}</p>
                                </div>
                                
                                <h3 class='h6'>Username</h3>
                                <p class="text-sm text-surface-600-400" id='username'>{username}</p>
                                <button 
                                    type="button" 
                                    class="btn btn-sm preset-filled" 
                                    id='change_username'
                                    onclick={() => usernameModalState = true}
                                >
                                    Change Username
                                </button>

                                <h3 class='h6'>Password</h3>
                                <p class="text-sm text-surface-600-400" id='password'>{password}</p>
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
                            <div class="flex justify-end">
                                <button class="btn btn-sm preset-filled-error-500" onclick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </Tabs.Panel>
                    
                    <Tabs.Panel value="admin">
                        <div class="space-y-4">
                            <h2 class="h2">User Management</h2>
                            <hr class="hr" />
                            
                            <div class="flex justify-between items-center">
                                <h3 class="h6">Manage Users</h3>
                                <button class="btn btn-sm preset-filled" onclick={() => inviteModalState = true}>
                                    Invite User
                                </button>
                            </div>

                            <div class="space-y-4">
                                {#if isLoading}
                                    <div class="flex justify-center">
                                        <div class="spinner"></div>
                                    </div>
                                {:else if users.length === 0}
                                    <p class="text-center text-surface-600-400">No users found</p>
                                {:else}
                                    {#each users as user}
                                        <div class="card p-4 variant-ghost-surface">
                                            <div class="grid grid-cols-3 gap-4 items-center">
                                                <div class="col-span-1">
                                                    <p class="font-medium">{user.username}</p>
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
                                {/if}
                            </div>
                        </div>
                    </Tabs.Panel>
                {/snippet}
            </Tabs>
        </div>
    </div>
{:else}
    <div class="card rounded-container flex flex-row h-[calc(100vh-4rem)]">
        <div class="flex flex-col w-full p-4">
            <h2 class="h2">Settings</h2>
            <hr class="hr my-4" />
            
            <div class='grid gap-4 grid-cols-3 gap-4'>
                <div class="col-span-3 grid grid-cols-subgrid">
                    <h3 class='h6'>Email</h3>
                    <p class='text-sm text-surface-600-400'>{email}</p>
                </div>
                
                <h3 class='h6'>Username</h3>
                <p class="text-sm text-surface-600-400" id='username'>{username}</p>
                <button 
                    type="button" 
                    class="btn btn-sm preset-filled" 
                    id='change_username'
                    onclick={() => usernameModalState = true}
                >
                    Change Username
                </button>

                <h3 class='h6'>Password</h3>
                <p class="text-sm text-surface-600-400" id='password'>{password}</p>
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
            
            <div class="flex justify-end">
                <button class="btn btn-sm preset-filled-error-500" onclick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Change Username Modal -->
<Modal
    open={usernameModalState}
    onOpenChange={(e) => (usernameModalState = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg w-[90vw] md:w-[45vw]"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <header class="flex justify-between">
        <h2 class="h2">Update Username</h2>
        </header>
        <article class="space-y-4">
        <p class="text-sm text-gray-500">Enter your new username and current password to confirm the change.</p>
        <div class="space-y-2">
            <label class="label" for="newUsername">New Username</label>
            <input 
            type="text" 
            id="newUsername"
            bind:value={newUsername}
            class="input"
            placeholder="Enter new username"
            disabled={isUpdatingUsername}
            />
        </div>
        <div class="space-y-2">
            <label class="label" for="usernamePassword">Current Password</label>
            <input 
            type="password" 
            id="usernamePassword"
            bind:value={usernamePassword}
            class="input"
            placeholder="Enter current password"
            disabled={isUpdatingUsername}
            />
        </div>
        </article>
        <footer class="flex justify-end gap-4">
        <button 
            type="button" 
            class="btn preset-tonal" 
            onclick={userModalClose}
            disabled={isUpdatingUsername}
        >
            Cancel
        </button>
        <button 
            type="button" 
            class="btn preset-filled" 
            onclick={updateUsername}
            disabled={isUpdatingUsername}
        >
            {#if isUpdatingUsername}
            Updating...
            {:else}
            Update Username
            {/if}
        </button>
        </footer>
    {/snippet}
</Modal>

<!-- Change Password Modal -->
<Modal
    open={passwordModalState}
    onOpenChange={(e) => (passwordModalState = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg w-[90vw] md:w-[45vw]"
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
            onclick={updatePassword}
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
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg w-[90vw] md:w-[45vw]"
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

<!-- Invitation Success Modal -->
<Modal
    open={invitationSuccessModalState}
    onOpenChange={(e) => (invitationSuccessModalState = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg w-[90vw] md:w-[45vw]"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <header class="flex justify-between">
            <h2 class="h2">Invitation Sent</h2>
        </header>
        <article class="space-y-4">
            {#if invitationDetails}
                <div class="space-y-4">
                    <div class="space-y-2">
                        <p class="text-sm text-surface-600-400">An invitation has been sent to:</p>
                        <p class="font-medium">{invitationDetails.email}</p>
                    </div>
                    
                    <div class="space-y-2">
                        <p class="text-sm text-surface-600-400">Role:</p>
                        <p class="font-medium capitalize">{invitationDetails.role}</p>
                    </div>
                    
                    <div class="space-y-2">
                        <p class="text-sm text-surface-600-400">Invitation Link:</p>
                        <div class="flex items-center gap-2">
                            <input
                                type="text"
                                class="input flex-1"
                                value={invitationDetails.invitation_link}
                                readonly
                            />
                            <button
                                class="btn btn-sm preset-filled"
                                onclick={() => {
                                    navigator.clipboard.writeText(invitationDetails.invitation_link);
                                    toast.create({
                                        title: 'Success',
                                        description: 'Invitation link copied to clipboard',
                                        type: 'success'
                                    });
                                }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <p class="text-sm text-surface-600-400">Expires at:</p>
                        <p class="font-medium">{new Date(invitationDetails.expires_at).toLocaleString()}</p>
                    </div>
                </div>
            {/if}
        </article>
        <footer class="flex justify-end gap-4">
            <button 
                type="button" 
                class="btn preset-filled" 
                onclick={invitationSuccessModalClose}
            >
                Close
            </button>
        </footer>
    {/snippet}
</Modal>
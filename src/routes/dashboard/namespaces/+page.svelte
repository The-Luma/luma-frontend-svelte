<script lang="ts">
    import { api } from '$lib/services/api';
    import { onMount } from 'svelte';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    import { Modal } from '@skeletonlabs/skeleton-svelte';


    let ModalOpenState = $state(false);
    let newNamespace = $state({
        name: '',
        description: ''
    });
    let isCreating = $state(false);

    interface TableRow {
        position: string;
        symbol: string;
        name: string;
        atomic_no: number;
    }


    export const toast: ToastContext = getContext('toast');

    interface Namespace {
        id: number;
        name: string;
        description: string;
        created_at: string;
    }


    let namespaces = $state([
        {
            id: 1,
            name: "Development",
            description: "Development environment for testing and debugging",
            created_at: "2024-03-15T10:30:00Z"
        },
        {
            id: 2,
            name: "Production",
            description: "Live production environment for end users",
            created_at: "2024-03-10T14:20:00Z"
        },
        {
            id: 3,
            name: "Staging",
            description: "Staging environment for pre-production testing",
            created_at: "2024-03-05T09:15:00Z"
        },
        {
            id: 4,
            name: "QA",
            description: "Quality assurance testing environment",
            created_at: "2024-02-28T16:45:00Z"
        },
        {
            id: 5,
            name: "Backup",
            description: "Backup and recovery namespace",
            created_at: "2024-02-20T11:10:00Z"
        }
    ]);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    function modalClose() {
        ModalOpenState = false;
        newNamespace = {
            name: '',
            description: ''
        };
    }

    async function createNamespace() {
        // Validate inputs
        if (!newNamespace.name.trim()) {
            toast.create({
                title: 'Error',
                description: 'Please enter a namespace name',
                type: 'error'
            });
            return;
        }

        if (!newNamespace.description.trim()) {
            toast.create({
                title: 'Error',
                description: 'Please enter a namespace description',
                type: 'error'
            });
            return;
        }

        isCreating = true;
        try {
            const response = await fetch('api/namespaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('access_token=')[0]?.split(';')[1]}`
                },
                body: JSON.stringify(newNamespace)
            });

            if (!response.ok) {
                throw new Error('Failed to create namespace');
            }

            const data = await response.json();
            namespaces = [...namespaces, data];
            toast.create({
                title: 'Success',
                description: 'Namespace created successfully',
                type: 'success'
            });
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred';
            toast.create({
                title: 'Error',
                description: 'Failed to create namespace',
                type: 'error'
            });
        } finally {
            isCreating = false;
            namespaces
            modalClose(); 
        }
    }

    async function fetchNamespaces() {
        isLoading = true;
        // error = null;
        try {
            const response = await fetch('/api/namespaces', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch namespaces');
            }

            const data = await response.json();
            namespaces = data;
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred';
            toast.create({
                title: 'Error',
                description: 'Was not able to get namespace',
                type: 'error'
            });
            return;
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchNamespaces();
    });
</script>

<div class="flex-1 flex flex-col h-[calc(100vh-2rem)]">
    <div class="card w-full h-full p-4">
        <div class="flex justify-between items-center m-5">
            <h1 class="h1">My Namespaces</h1>
            <div class="flex justify-end">
                <button 
                    type="button" 
                    class="btn preset-filled-primary-500 ml-50"
                    id='change_username'
                    onclick={() => ModalOpenState = true}
                >
                    Create Namespace
                </button>
            </div>
        </div>

        {#if isLoading}
            <div class="flex justify-center items-center h-32">
                <div class="spinner"></div>
            </div>
        {:else if namespaces.length === 0 || error}
            <div class="text-center p-8 text-surface-600-400">
                No namespaces found. Create your first namespace to get started.
            </div>
        {:else}
        <div class="table-wrap">
            <table class="table caption-bottom ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>&nbsp;</th>
                  <th>&nbsp;</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {#each namespaces as row}
                    <tr>
                      <td>{row.name}</td>
                      <td>{row.description}</td>
                      <td>{row.created_at}</td>
                      <td class="text-right mr-10">
                        <button class="btn btn-sm preset-tonal-secondary" id="addUser">
                          Add User
                        </button>
                      </td>
                      <td class="text-right mr-10">
                        <button class="btn preset-tonal-success">View User &rarr;</button>
                      </td> 
                      <td class="text-right mr-10">
                        <button class="btn preset-tonal-error" id="del">
                            Delete
                        </button>
                      </td>
                    </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
    </div>
</div>

<Modal
  open={ModalOpenState}
  onOpenChange={(e) => (ModalOpenState = e.open)}
  triggerBase="btn preset-tonal"
  contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
  backdropClasses="backdrop-blur-sm"
>

  {#snippet content()}
    <header class="flex justify-between">
        <h2 class="h2">Create Namespace</h2>
    </header>
    <article>
        <div class="space-y-2">
            <label class="label" for="nameNamespace">Name the namespace</label>
            <input 
                type="text" 
                id="nameNamespace"
                bind:value={newNamespace.name}
                class="input"
                placeholder="Enter Name"
                disabled={isCreating}
            />
        </div>
        <div class="space-y-2">
            <label class="label" for="Description">Description</label>
            <input 
                type="text" 
                id="Description"
                bind:value={newNamespace.description}
                class="input"
                placeholder="Enter Description"
                disabled={isCreating}
            />
        </div>
    </article>
    <footer class="flex justify-end gap-4">
      <button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
      <button type="button" class="btn preset-filled" onclick={createNamespace}>Confirm</button>
    </footer>
  {/snippet}
</Modal>
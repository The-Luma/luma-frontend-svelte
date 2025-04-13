<script lang="ts">
    import { onMount } from 'svelte';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

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

    let tableData: Namespace[] = [
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
    ];

    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let namespaces: Namespace[] = [];

    // async function fetchNamespaces() {
    //     isLoading = true;
    //     error = null;
    //     try {
    //         const response = await fetch('/namespaces', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0]}`
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch namespaces');
    //         }

    //         const data = await response.json();
    //         namespaces = data;
    //     } catch (err) {
    //         error = err instanceof Error ? err.message : 'An error occurred';
    //         toast.create({
    //             title: 'Error',
    //             description: '',
    //             type: 'error'
    //         });
    //         return;
    //     } finally {
    //         isLoading = false;
    //     }
    // }

    // onMount(() => {
    //     fetchNamespaces();
    // });
</script>

<div class="card w-full p-4">
    <div class="flex justify-between items-center mb-4">
        <h1 class="h1">My Namespaces</h1>
        <button class="btn preset-filled-primary-500">Create Namespace</button>
    </div>

    {#if isLoading}
        <div class="flex justify-center items-center h-32">
            <div class="spinner"></div>
        </div>
    {:else if error}
        <div class="text-error-500 text-center p-4">
            {error}
        </div>
    {:else if namespaces.length === 0}
        <div class="text-center p-8 text-surface-600-400">
            No namespaces found. Create your first namespace to get started.
        </div>
    {:else}
        <div class="table-wrap">
            <table class="table caption-bottom">
                <caption class="pt-4">List of available namespaces</caption>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th class="!text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="[&>tr]:hover:preset-tonal-primary">
                    {#each tableData as namespace}
                        <tr>
                            <td>{namespace.name}</td>
                            <td>{namespace.description}</td>
                            <td>{new Date(namespace.created_at).toLocaleDateString()}</td>
                            <td class="text-right">
                                <div class="flex gap-2 justify-end">
                                    <button class="btn btn-sm preset-filled-primary-500">Edit</button>
                                    <button class="btn btn-sm preset-filled-error-500">Delete</button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">Total Namespaces</td>
                        <td class="text-right">{tableData.length}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    {/if}
</div>
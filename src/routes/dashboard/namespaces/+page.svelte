<script lang="ts">
    import { api } from '$lib/services/api';
    import { onMount } from 'svelte';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    import { Modal, FileUpload, Popover, Progress } from '@skeletonlabs/skeleton-svelte';
    // Icons
    import IconDropzone from '@lucide/svelte/icons/image-plus';
    import IconFile from '@lucide/svelte/icons/paperclip';
    import IconRemove from '@lucide/svelte/icons/circle-x';
    import IconX from '@lucide/svelte/icons/x';
    import IconDownload from '@lucide/svelte/icons/download';
    import IconTrash from '@lucide/svelte/icons/trash-2';
    import type { DocumentListItem } from '$lib/types/api.types';

    let ModalOpenState = $state(false);
    let SettingsModalOpenState = $state(false);
    let DeletePopoverOpenState = $state(false);
    let selectedNamespace = $state<Namespace | null>(null);
    let newNamespace = $state({
        name: '',
        description: ''
    });
    let isCreating = $state(false);
    let isDeleting = $state(false);
    let isUploading = $state(false);
    let uploadProgress = $state<number | null>(null);
    let documents = $state<DocumentListItem[]>([]);
    let isLoadingDocuments = $state(false);

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

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
        is_public: boolean;
    }


    let namespaces = $state<Namespace[]>([]);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    function modalClose() {
        ModalOpenState = false;
        newNamespace = {
            name: '',
            description: ''
        };
    }

    function openSettings(namespace: Namespace) {
        selectedNamespace = namespace;
        SettingsModalOpenState = true;
        fetchDocuments(namespace.id);
    }

    function closeSettings() {
        selectedNamespace = null;
        SettingsModalOpenState = false;
        documents = [];
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
            console.log('Creating namespace:', newNamespace);
            const response = await api.namespaces.create({
                name: newNamespace.name,
                description: newNamespace.description,
                is_public: false
            });

            console.log('Create namespace response:', response);

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.data) {
                console.log('New namespace data:', response.data);
                toast.create({
                    title: 'Success',
                    description: 'Space created successfully',
                    type: 'success'
                });
                modalClose();
                // Refresh the list to ensure we have the latest data
                await fetchNamespaces();
            } else {
                throw new Error('No data received from server');
            }
        } catch (err) {
            console.error('Error creating namespace:', err);
            error = err instanceof Error ? err.message : 'An error occurred';
            toast.create({
                title: 'Error',
                description: error,
                type: 'error'
            });
        } finally {
            isCreating = false;
        }
    }

    async function fetchNamespaces() {
        isLoading = true;
        error = null;
        try {
            console.log('Fetching namespaces...');
            const response = await api.namespaces.list();
            console.log('Fetch namespaces response:', response);

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.data) {
                console.log('Received namespaces:', response.data);
                namespaces = response.data;
            } else {
                console.log('No namespaces data received');
                namespaces = [];
            }
        } catch (err) {
            console.error('Error fetching namespaces:', err);
            error = err instanceof Error ? err.message : 'An error occurred';
            toast.create({
                title: 'Error',
                description: 'Failed to fetch spaces',
                type: 'error'
            });
        } finally {
            isLoading = false;
        }
    }

    async function deleteNamespace(id: number) {
        isDeleting = true;
        try {
            const response = await api.namespaces.deleteNamespace(id);
            
            if (response.error) {
                throw new Error(response.error);
            }

            namespaces = namespaces.filter(n => n.id !== id);
            toast.create({
                title: 'Success',
                description: 'Space deleted successfully',
                type: 'success'
            });
            closeSettings();
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred';
            toast.create({
                title: 'Error',
                description: 'Failed to delete space',
                type: 'error'
            });
        } finally {
            isDeleting = false;
        }
    }

    function closeDeletePopover() {
        DeletePopoverOpenState = false;
    }

    // @ts-ignore - Ignoring type error for FileUpload component
    async function handleFileUpload(details: any) {
        if (!selectedNamespace) return;
        
        const files = details.files;
        if (!files || files.length === 0) {
            console.error('No files received in handleFileUpload');
            return;
        }
        
        isUploading = true;
        uploadProgress = 0;
        try {
            for (const file of files) {
                console.log('Uploading file:', file.name, file.type, file.size);
                const response = await api.files.upload(selectedNamespace.id, file);
                
                if (response.error) {
                    console.error('Upload error:', response.error);
                    throw new Error(response.error);
                }
                
                uploadProgress = 100;
                toast.create({
                    title: 'Success',
                    description: `File "${file.name}" uploaded successfully`,
                    type: 'success'
                });
            }
            
            // Refresh the documents list
            await fetchDocuments(selectedNamespace.id);
        } catch (err) {
            console.error('Error uploading file:', err);
            toast.create({
                title: 'File Upload Failed',
                description: err instanceof Error ? err.message : 'Failed to upload file. Please try again.',
                type: 'error'
            });
        } finally {
            isUploading = false;
            uploadProgress = null;
        }
    }

    async function fetchDocuments(namespaceId: number) {
        isLoadingDocuments = true;
        try {
            const response = await api.files.list(namespaceId);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            if (response.data) {
                documents = response.data;
            } else {
                documents = [];
            }
        } catch (err) {
            console.error('Error fetching documents:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to fetch documents',
                type: 'error'
            });
        } finally {
            isLoadingDocuments = false;
        }
    }

    async function deleteDocument(documentId: number) {
        if (!selectedNamespace) return;
        
        try {
            const response = await api.files.deleteDocument(selectedNamespace.id, documentId);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            documents = documents.filter(d => d.id !== documentId);
            toast.create({
                title: 'Success',
                description: 'Document deleted successfully',
                type: 'success'
            });
        } catch (err) {
            console.error('Error deleting document:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to delete document',
                type: 'error'
            });
        }
    }

    async function downloadDocument(documentId: number) {
        if (!selectedNamespace) return;
        
        try {
            const response = await api.files.download(selectedNamespace.id, documentId);
            
            if (!response.ok) {
                throw new Error('Failed to download document');
            }
            
            // Get the document from our local state to get the original filename
            const doc = documents.find(d => d.id === documentId);
            if (!doc) {
                throw new Error('Document not found');
            }
            
            // Create a blob from the response
            const blob = await response.blob();
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const a = window.document.createElement('a');
            a.href = url;
            a.download = doc.name; // Use the original filename
            
            // Append to the document, click it, and remove it
            window.document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            window.document.body.removeChild(a);
            
            toast.create({
                title: 'Success',
                description: 'Document downloaded successfully',
                type: 'success'
            });
        } catch (err) {
            console.error('Error downloading document:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to download document',
                type: 'error'
            });
        }
    }

    onMount(() => {
        fetchNamespaces();
    });
</script>

<div class="flex-1 flex flex-col w-full h-[calc(100vh-2rem)]">
    <div class="grid grid-cols-1 md:grid-cols-[65%_35%] gap-4">
        <!-- Left Section - Table -->
        <div class="card w-full h-full p-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center m-5 gap-4">
                <h1 class="h1 whitespace-nowrap">My Spaces</h1>
                <div class="flex justify-end w-full sm:w-auto">
                    <button 
                        type="button" 
                        class="btn preset-filled-primary-500 w-full sm:w-auto"
                        onclick={() => ModalOpenState = true}
                    >
                        Create Space
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
            <div class="table-wrap overflow-x-auto max-h-[200px] overflow-y-auto">
                <table class="table caption-bottom min-w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created At</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each namespaces as row}
                            <tr>
                                <td>{row.name}</td>
                                <td class="max-w-[150px] truncate">{row.description}</td>
                                <td>{formatDate(row.created_at)}</td>
                                <td class="text-right">
                                    <button 
                                        class="btn preset-tonal-secondary" 
                                        onclick={() => openSettings(row)}
                                    >
                                        Settings
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {/if}
        </div>

        <!-- Right Section - Explanation -->
        <div class="card w-full h-full p-4">
            <div class="space-y-6">
                <h2 class="h2">About Spaces</h2>
                
                <div class="space-y-4">
                    <div>
                        <h3 class="h3">What are Spaces?</h3>
                        <p class="text-surface-600-400">
                            Spaces are isolated environments where you can organize your conversations, files, and collaborate with others. Each space has its own set of permissions and can be either public or private.
                        </p>
                    </div>

                    <div>
                        <h3 class="h3">Key Features</h3>
                        <ul class="list-disc list-inside space-y-2 text-surface-600-400">
                            <li>Organize conversations and files</li>
                            <li>Control access with public/private settings</li>
                            <li>Collaborate with team members</li>
                            <li>Manage permissions and sharing</li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="h3">Getting Started</h3>
                        <p class="text-surface-600-400">
                            Create your first space by clicking the "Create Space" button. You can then:
                        </p>
                        <ul class="list-disc list-inside space-y-2 text-surface-600-400 mt-2">
                            <li>Start conversations within the space</li>
                            <li>Upload and manage files</li>
                            <li>Invite team members to collaborate</li>
                            <li>Configure space settings</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
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
                class="input" 
                id="nameNamespace" 
                type="text" 
                placeholder="Enter namespace name" 
                bind:value={newNamespace.name}
            />
            <label class="label" for="descriptionNamespace">Description</label>
            <textarea 
                class="textarea" 
                id="descriptionNamespace" 
                rows="3" 
                placeholder="Enter namespace description"
                bind:value={newNamespace.description}
            ></textarea>
        </div>
    </article>
    <footer class="flex justify-end space-x-2">
        <button class="btn preset-tonal" onclick={modalClose}>Cancel</button>
        <button 
            class="btn preset-filled-primary-500" 
            onclick={createNamespace}
            disabled={isCreating}
        >
            {isCreating ? 'Creating...' : 'Create'}
        </button>
    </footer>
  {/snippet}
</Modal>

<!-- Settings Modal -->
<Modal
    open={SettingsModalOpenState}
    onOpenChange={(e) => (SettingsModalOpenState = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-6 space-y-6 shadow-xl max-w-screen-lg w-[90vw] max-h-[90vh] overflow-y-auto"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <header class="space-y-2">
            <h2 class="h2">{selectedNamespace?.name}</h2>
            <div class="flex items-center gap-4 text-surface-600-400 text-sm">
                <span>Created {formatDate(selectedNamespace?.created_at || '')}</span>
                <span>•</span>
                <span class="truncate">{selectedNamespace?.description}</span>
            </div>
        </header>
        {#if selectedNamespace}
            <article>
                <div class="space-y-6">
                    <!-- Second Row: File Upload and List -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Left Column: File Upload -->
                        <div class="space-y-4">
                            <h4 class="h4">Add New File</h4>
                            <div class="flex justify-center">
                                <div class="w-full max-w-md">
                                    <FileUpload
                                        name="namespace-files"
                                        accept="application/pdf"
                                        maxFiles={1}
                                        subtext="Upload a PDF file to this space"
                                        onFileAccept={(details) => {
                                            console.log('Files accepted:', details);
                                            handleFileUpload(details);
                                        }}
                                        onFileReject={(details) => {
                                            console.error('Files rejected:', details);
                                            toast.create({
                                                title: 'File Upload Failed',
                                                description: 'Please upload a PDF file only.',
                                                type: 'error'
                                            });
                                        }}
                                        classes="w-full"
                                        disabled={isUploading}
                                    >
                                        {#snippet iconInterface()}<IconDropzone class="size-8" />{/snippet}
                                        {#snippet iconFile()}<IconFile class="size-4" />{/snippet}
                                        {#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
                                    </FileUpload>
                                    {#if isUploading}
                                        <div class="space-y-2 mt-4">
                                            <Progress value={null} />
                                            <div class="text-center text-sm text-surface-600-400">
                                                Uploading...
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Files List -->
                        <div class="space-y-4">
                            <h4 class="h4">Files ({documents.length})</h4>
                            <div class="card px-4">
                                {#if isLoadingDocuments}
                                    <div class="flex justify-center items-center h-32">
                                        <div class="spinner"></div>
                                    </div>
                                {:else if documents.length === 0}
                                    <div class="text-surface-600-400 text-center">
                                        No files uploaded yet
                                    </div>
                                {:else}
                                    <div class="relative">
                                        <div class="overflow-x-auto">
                                            <table class="table caption-bottom min-w-full">
                                                <thead class="sticky top-0 bg-surface-100-900 z-10">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Uploaded</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div class="overflow-y-auto max-h-[200px]">
                                            <table class="table caption-bottom min-w-full">
                                                <tbody>
                                                    {#each documents as doc}
                                                        <tr>
                                                            <td>{doc.name}</td>
                                                            <td>{formatDate(doc.created_at)}</td>
                                                            <td class="text-right">
                                                                <div class="flex justify-end gap-2">
                                                                    <button 
                                                                        class="btn-icon preset-tonal" 
                                                                        onclick={() => downloadDocument(doc.id)}
                                                                        title="Download"
                                                                    >
                                                                        <IconDownload class="size-4" />
                                                                    </button>
                                                                    <button 
                                                                        class="btn-icon preset-tonal-error" 
                                                                        onclick={() => deleteDocument(doc.id)}
                                                                        title="Delete"
                                                                    >
                                                                        <IconTrash class="size-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div class="divider my-6"></div>

                    <!-- Third Row: User Management -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Left Column: Share Access -->
                        <div class="space-y-4">
                            <h4 class="h4">Share Access</h4>
                            <div class="card p-4">
                                <select class="select w-full">
                                    <option value="">Search users...</option>
                                </select>
                            </div>
                        </div>

                        <!-- Right Column: Users List -->
                        <div class="space-y-4">
                            <h4 class="h4">Users with Access</h4>
                            <div class="card p-4">
                                <div class="text-surface-600-400 text-center">
                                    No users shared with
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <footer class="flex justify-end gap-2">
                <Popover
                    open={DeletePopoverOpenState}
                    onOpenChange={(e) => (DeletePopoverOpenState = e.open)}
                    positioning={{ placement: 'top' }}
                    triggerBase="btn preset-tonal-error"
                    contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px] z-50"
                    arrow
                    arrowBackground="!bg-surface-200 dark:!bg-surface-800"
                >
                    {#snippet trigger()}
                        <button 
                            class="btn preset-tonal-error" 
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Space'}
                        </button>
                    {/snippet}
                    {#snippet content()}
                        <header class="flex justify-between">
                            <p class="font-bold text-xl">Delete Space</p>
                            <button class="btn-icon hover:preset-tonal" onclick={closeDeletePopover}><IconX /></button>
                        </header>
                        <article>
                            <p class="opacity-60 mb-4">
                                This action cannot be undone. This will permanently delete the space and all its contents.
                            </p>
                            <button 
                                class="btn preset-filled-error w-full" 
                                onclick={() => {
                                    if (selectedNamespace) {
                                        deleteNamespace(selectedNamespace.id);
                                        closeDeletePopover();
                                    }
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </article>
                    {/snippet}
                </Popover>
                <button class="btn preset-tonal" onclick={closeSettings}>Close</button>
            </footer>
        {/if}
    {/snippet}
</Modal>

<style>
    /* Remove the custom animation styles */
</style>
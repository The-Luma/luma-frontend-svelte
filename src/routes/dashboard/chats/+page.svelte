<script lang="ts">
    import IconSend from '@lucide/svelte/icons/send-horizontal';
    import { onMount } from 'svelte';
    import { FileUpload } from '@skeletonlabs/skeleton-svelte';
    import IconUpload from '@lucide/svelte/icons/upload';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    import { api } from '$lib/services/api';
    import type { Conversation, ChatMessage, ConversationListItem, Namespace } from '$lib/types/api.types';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import IconX from '@lucide/svelte/icons/x';
    import IconTrash from '@lucide/svelte/icons/trash-2';
    import SpaceAvatar from '$lib/components/SpaceAvatar.svelte';

    export const toast: ToastContext = getContext('toast');

    let elemChat: HTMLElement;
    let autoScrollEnabled = true;
    let isLoading = $state(false);
    let isCreating = $state(false);
    let isDeleting = $state(false);
    let conversations = $state<ConversationListItem[]>([]);
    let currentConversation = $state<Conversation | null>(null);
    let currentMessage = $state('');
    let selectedNamespaceId = $state<number | null>(null);
    let CreateChatModalOpenState = $state(false);
    let DeleteChatModalOpenState = $state(false);
    let namespaces = $state<Namespace[]>([]);
    let namespaceMap = $state<Record<number, { name: string }>>({});
    let isLoadingNamespaces = $state(false);

    interface MessageFeed {
        id: number;
        host: boolean;
        name: string;
        timestamp: string;
        message: string;
        color: string;
    }

    let messageFeed: MessageFeed[] = [];

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    async function fetchConversations() {
        isLoading = true;
        try {
            const response = await api.chats.list();
            if (response.error) {
                throw new Error(response.error);
            }
            if (response.data) {
                conversations = response.data;
                // Create a map of namespace IDs to names
                const namespaceResponse = await api.namespaces.list();
                if (namespaceResponse.data) {
                    namespaces = namespaceResponse.data;
                    namespaceMap = namespaces.reduce((acc, ns) => {
                        acc[ns.id] = { name: ns.name };
                        return acc;
                    }, {} as Record<number, { name: string }>);
                }
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to fetch conversations',
                type: 'error'
            });
        } finally {
            isLoading = false;
        }
    }

    async function fetchNamespaces() {
        isLoadingNamespaces = true;
        try {
            const response = await api.namespaces.list();
            if (response.error) {
                throw new Error(response.error);
            }
            if (response.data) {
                namespaces = response.data;
            }
        } catch (err) {
            console.error('Error fetching namespaces:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to fetch spaces',
                type: 'error'
            });
        } finally {
            isLoadingNamespaces = false;
        }
    }

    async function startNewChat(namespaceId: number) {
        isCreating = true;
        try {
            const response = await api.chats.start({ namespace_id: namespaceId });
            if (response.error) {
                throw new Error(response.error);
            }
            if (response.data) {
                currentConversation = response.data;
                messageFeed = [];
                toast.create({
                    title: 'Success',
                    description: 'New chat started',
                    type: 'success'
                });
                CreateChatModalOpenState = false;
            }
        } catch (err) {
            console.error('Error starting chat:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to start chat',
                type: 'error'
            });
        } finally {
            isCreating = false;
        }
    }

    async function loadChatHistory(conversationId: number) {
        isLoading = true;
        try {
            const response = await api.chats.getHistory(conversationId);
            if (response.error) {
                throw new Error(response.error);
            }
            if (response.data) {
                currentConversation = response.data;
                messageFeed = response.data.messages.map(msg => ({
                    id: msg.id,
                    host: msg.sender_type === 'user',
                    name: msg.sender_type === 'user' ? 'You' : 'AI',
                    timestamp: formatDate(msg.time_sent),
                    message: msg.content,
                    color: msg.sender_type === 'user' ? 'preset-tonal-primary' : 'preset-tonal-secondary'
                }));
            }
        } catch (err) {
            console.error('Error loading chat history:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to load chat history',
                type: 'error'
            });
        } finally {
            isLoading = false;
        }
    }

    async function sendMessage() {
        if (!currentMessage.trim() || !currentConversation) return;

        const userMessage = currentMessage;
        currentMessage = '';

        // Add user message to feed immediately
        const userMsg: MessageFeed = {
            id: messageFeed.length,
            host: true,
            name: 'You',
            timestamp: formatDate(new Date().toISOString()),
            message: userMessage,
            color: 'preset-tonal-primary'
        };
        messageFeed = [...messageFeed, userMsg];

        // Scroll to bottom
        setTimeout(() => {
            if (autoScrollEnabled) scrollChatBottom('smooth');
        }, 0);

        try {
            const response = await api.chats.sendMessage({
                content: userMessage,
                conversation_id: currentConversation.id
            } as ChatMessage);

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.data) {
                // Add AI response to feed
                const aiMsg: MessageFeed = {
                    id: messageFeed.length + 1,
                    host: false,
                    name: 'AI',
                    timestamp: formatDate(new Date().toISOString()),
                    message: response.data.content,
                    color: 'preset-tonal-secondary'
                };
                messageFeed = [...messageFeed, aiMsg];

                // Scroll to bottom for AI response
        setTimeout(() => scrollChatBottom('smooth'), 0);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to send message',
                type: 'error'
            });
        }
    }

    async function deleteChat(conversationId: number) {
        isDeleting = true;
        try {
            const response = await api.chats.deleteConversation(conversationId);
            if (response.error) {
                throw new Error(response.error);
            }
            
            conversations = conversations.filter(c => c.id !== conversationId);
            if (currentConversation?.id === conversationId) {
                currentConversation = null;
                messageFeed = [];
            }
            
            toast.create({
                title: 'Success',
                description: 'Chat deleted successfully',
                type: 'success'
            });
            DeleteChatModalOpenState = false;
        } catch (err) {
            console.error('Error deleting chat:', err);
            toast.create({
                title: 'Error',
                description: 'Failed to delete chat',
                type: 'error'
            });
        } finally {
            isDeleting = false;
        }
    }

    function scrollChatBottom(behavior: 'auto' | 'smooth' = 'auto') {
        if (elemChat) {
            elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
        }
    }

    function onPromptKeydown(event: KeyboardEvent) {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    onMount(() => {
        fetchConversations();
        fetchNamespaces();
        scrollChatBottom();

        if (elemChat) {
            elemChat.addEventListener('scroll', () => {
                const distanceToBottom = elemChat.scrollHeight - elemChat.scrollTop - elemChat.clientHeight;
                autoScrollEnabled = distanceToBottom < 50;
            });
        }
    });
</script>

<section class="card rounded-container overflow-hidden h-full">
    <div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
        <!-- Navigation -->
        <div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r-[1px] border-surface-200-800 h-full">
            <!-- Header -->
            <header class="border-b-[1px] border-surface-200-800 p-4">
                <div class="flex justify-between items-center">
                    <h2 class="h2">Your Chats</h2>
                    <button 
                        class="btn preset-filled-primary-500"
                        onclick={() => CreateChatModalOpenState = true}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : 'New Chat'}
                    </button>
                </div>
            </header>
            <!-- List -->
            <div class="p-4 space-y-4 overflow-y-auto h-full">
                {#if isLoading}
                    <div class="flex justify-center items-center h-32">
                        <div class="spinner"></div>
                    </div>
                {:else if conversations.length === 0}
                    <div class="text-center text-surface-600-400">
                        No chats yet. Create a new chat to get started.
                    </div>
                {:else}
                <div class="flex flex-col space-y-1">
                        {#each conversations as conv}
                        <button
                                class="card p-2 w-full flex items-center space-x-4 {currentConversation?.id === conv.id
                ? 'preset-filled-primary-500'
                : 'bg-surface-hover-token'}"
                                onclick={() => loadChatHistory(conv.id)}
                            >
                                <SpaceAvatar 
                                    name={namespaceMap[conv.namespace_id]?.name || `Space ${conv.namespace_id}`}
                                    size="size-8"
                                    isSelected={currentConversation?.id === conv.id}
                                />
                            <span class="flex-1 text-start">
                                    {namespaceMap[conv.namespace_id]?.name || `Space ${conv.namespace_id}`}
              </span>
                                <small class="opacity-50">{formatDate(conv.started_at)}</small>
                        </button>
                    {/each}
                </div>
                {/if}
            </div>
        </div>
        <!-- Chat -->
        <div class="grid grid-rows-[1fr_auto] h-full">
            <!-- Conversation -->
            <section bind:this={elemChat} class="p-4 overflow-y-auto space-y-4 h-full">
                {#if isLoading}
                    <div class="flex justify-center items-center h-32">
                        <div class="spinner"></div>
                    </div>
                {:else if !currentConversation}
                    <div class="text-center text-surface-600-400">
                        Select a chat or create a new one to start messaging.
                    </div>
                {:else if messageFeed.length === 0}
                    <div class="text-center text-surface-600-400">
                        No messages yet. Start the conversation!
                    </div>
                {:else}
                {#each messageFeed as bubble}
                        {#if bubble.host}
                            <div class="grid grid-cols-[1fr_auto] gap-2 justify-items-end">
                                <div class="card py-1 px-4 rounded-tr-none preset-tonal-secondary flex items-center">
                                    <p class="text-lg text-center w-full">{bubble.message}</p>
                                </div>
                                <SpaceAvatar 
                                    name="You"
                                    size="size-12"
                                />
                            </div>
                        {:else}
                            <div class="grid grid-cols-[auto_1fr] gap-2">
                                <SpaceAvatar 
                                    name={currentConversation ? namespaceMap[currentConversation.namespace_id]?.name || `Space ${currentConversation.namespace_id}` : 'AI'}
                                    size="size-12"
                                />
                                <div class="p-4 rounded-tl-none space-y-2">
                                    <header class="flex justify-between items-center">
                                        <p class="font-bold">{bubble.name}</p>
                                        <small class="opacity-50 pl-4">{bubble.timestamp}</small>
                                    </header>
                                    <p>{bubble.message}</p>
                                </div>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </section>
            <!-- Prompt -->
            <section class="border-t-[1px] border-surface-200-800 p-4">
                <div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800 rounded-container-token">
                    <textarea
                        bind:value={currentMessage}
                        class="bg-transparent border-0 ring-0 py-2 px-4 text-lg min-h-[60px]"
                        name="prompt"
                        placeholder="Write a message..."
                        rows="1"
                        onkeydown={onPromptKeydown}
                        disabled={!currentConversation}
                    ></textarea>
                    <button 
                        class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'} px-4" 
                        onclick={sendMessage}
                        disabled={!currentConversation}
                    >
                        <IconSend class="size-5" />
                    </button>
                </div>
            </section>
        </div>
    </div>
</section>

<!-- Create Chat Modal -->
<Modal
    open={CreateChatModalOpenState}
    onOpenChange={(e) => (CreateChatModalOpenState = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-6 space-y-6 shadow-xl max-w-screen-md w-[90vw]"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <article>
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="h3">Select a Space</h3>
                    <a href="/dashboard/namespaces" class="btn preset-tonal">
                        Manage Spaces
                    </a>
                </div>
                
                {#if isLoadingNamespaces}
                    <div class="flex justify-center items-center h-32">
                        <div class="spinner"></div>
                    </div>
                {:else if namespaces.length === 0}
                    <div class="card p-6 text-center space-y-4">
                        <p class="text-surface-600-400">No spaces available. Create a space to start chatting.</p>
                        <a href="/dashboard/namespaces" class="btn preset-filled-primary-500">
                            Create Space
                        </a>
                    </div>
                {:else}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each namespaces as namespace}
                            <button
                                class="card p-4 text-left hover:preset-tonal {selectedNamespaceId === namespace.id ? 'preset-filled-primary-500' : ''}"
                                onclick={() => selectedNamespaceId = namespace.id}
                            >
                                <div class="space-y-2">
                                    <h4 class="font-bold">{namespace.name}</h4>
                                    <p class="text-sm text-surface-600-400 line-clamp-2">{namespace.description}</p>
                                    <div class="text-xs text-surface-600-400">
                                        Created {formatDate(namespace.created_at)}
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </article>
        <footer class="flex justify-end space-x-2">
            <button class="btn preset-tonal" onclick={() => CreateChatModalOpenState = false}>Cancel</button>
            <button 
                class="btn preset-filled-primary-500" 
                onclick={() => selectedNamespaceId && startNewChat(selectedNamespaceId)}
                disabled={isCreating || !selectedNamespaceId}
            >
                {isCreating ? 'Creating...' : 'Start Chat'}
            </button>
        </footer>
    {/snippet}
</Modal>

<!-- Delete Chat Modal -->
<Modal
    open={DeleteChatModalOpenState}
    onOpenChange={(e) => (DeleteChatModalOpenState = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <article>
            <p class="opacity-60 mb-4">
                Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <button 
                class="btn preset-filled-error w-full" 
                onclick={() => currentConversation && deleteChat(currentConversation.id)}
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete Chat'}
            </button>
        </article>
    {/snippet}
</Modal>

<style lang="postcss">
</style>
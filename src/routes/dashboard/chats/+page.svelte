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
    import IconMenu from '@lucide/svelte/icons/menu';
    import SpaceAvatar from '$lib/components/SpaceAvatar.svelte';
    import TypingIndicator from '$lib/components/TypingIndicator.svelte';

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
    let messageFeed = $state<MessageFeed[]>([]);
    let isWaitingForResponse = $state(false);
    let responseStartTime = $state<number | null>(null);
    let responseTime = $state<number | null>(null);
    let showNavigation = $state(true);

    interface MessageFeed {
        id: number;
        host: boolean;
        name: string;
        timestamp: string;
        message: string;
        color: string;
    }

    interface AIResponse {
        message: {
            content: string;
            conversation_id: number;
            id: number;
            sender_type: string;
            time_sent: string;
        }
    }

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
        
        // Update message feed with user message
        messageFeed = [...messageFeed, userMsg];
        isWaitingForResponse = true;
        responseStartTime = Date.now();
        responseTime = null;

        // Scroll to bottom for user message
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

            if (response.data && 'message' in response.data) {
                const aiResponse = response.data as AIResponse;
                // Calculate response time
                if (responseStartTime) {
                    responseTime = Date.now() - responseStartTime;
                }
                
                // Add AI response to feed
                const aiMsg: MessageFeed = {
                    id: messageFeed.length,
                    host: false,
                    name: 'AI',
                    timestamp: formatDate(aiResponse.message.time_sent),
                    message: aiResponse.message.content,
                    color: 'preset-tonal-secondary'
                };
                
                // Update message feed with AI message
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
        } finally {
            isWaitingForResponse = false;
            responseStartTime = null;
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

    function toggleNavigation() {
        showNavigation = !showNavigation;
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

<section class="card rounded-container flex flex-row h-[calc(100vh-4rem)]">
        <!-- Navigation -->
         <div class="flex flex-col border-r-[1px] bg-surface-50-950 z-51 min-w-[400px] max-w-[400px] border-surface-200-800 h-full overflow-hidden transition-all duration-300 ease-in-out
            {showNavigation ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:relative md:z-0
            fixed left-0 z-50">
            <!-- Header -->
            <header class="border-b-[1px] border-surface-200-800 p-4 flex-shrink-0">
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
            <div class="p-4 space-y-4 overflow-y-auto flex-1">
                {#if isLoading}
                    <div class="flex justify-center items-center h-32">
                        <div class="spinner"></div>
                    </div>
                {:else if conversations.length === 0}
                    <div class="text-center text-surface-600-400 ">
                        No chats yet. Create a new chat to get started.
                    </div>
                {:else}
                <div class="flex flex-col space-y-1">
                        {#each conversations as conv}
                        <button
                                class="card p-2 w-full flex items-center space-x-4 {currentConversation?.id === conv.id
                ? 'preset-filled-primary-500'
                : 'bg-surface-hover-token'}"
                                onclick={() => {
                                    loadChatHistory(conv.id);
                                    if (window.innerWidth < 768) {
                                        showNavigation = false;
                                    }
                                }}
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
        <div class="flex flex-col flex-1 w-full h-full overflow-hidden relative">
            <!-- Mobile Navigation Toggle -->
            <button 
                class="btn-icon bg-surface-50-950 absolute top-4 left-4 z-50 md:hidden"
                onclick={toggleNavigation}
            >
                <IconMenu class="size-5" />
            </button>
            <!-- Conversation -->
            <section bind:this={elemChat} class="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
                {#if isLoading}
                    <div class="flex justify-center items-center ">
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
                                    <p class="text-normal text-center">{bubble.message}</p>
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
                                    <p class="font-bold">
                                        {bubble.name}
                                        {#if responseTime !== null && bubble.id === messageFeed.length - 1}
                                            <span class="text-xs font-normal ml-2 text-surface-600-400">
                                                Response time: {responseTime < 1000 ? `${responseTime}ms` : `${(responseTime / 1000).toFixed(2)}s`}
                                            </span>
                                        {/if}
                                    </p>
                                        <small class="opacity-50 pl-4">{bubble.timestamp}</small>
                                </header>
                                <p>{bubble.message}</p>
                                </div>
                        </div>
                    {/if}
                {/each}
                
                {#if isWaitingForResponse}
                    <TypingIndicator 
                        namespaceName={currentConversation ? namespaceMap[currentConversation.namespace_id]?.name || `Space ${currentConversation.namespace_id}` : 'AI'} 
                    />
                {/if}
                {/if}
            </section>
            <!-- Prompt -->
            <section class="border-t-[1px] border-surface-200-800 p-4 flex-shrink-0">
                <div class="flex items-start gap-2">
                    <div class="flex flex-col gap-2">
                        <button 
                            class="btn-icon preset-tonal" 
                            onclick={() => DeleteChatModalOpenState = true}
                            disabled={!currentConversation || isDeleting}
                            title="Delete Chat"
                        >
                            <IconTrash class="size-4" />
                        </button>
                        <a 
                            href="/dashboard/namespaces" 
                            class="btn-icon preset-tonal"
                            title="Manage Spaces"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                            </svg>
                        </a>
                    </div>
                    <div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800 rounded-container-token flex-1">
                    <textarea
                            bind:value={currentMessage}
                            class="bg-transparent border-0 ring-0 py-3 px-4 text-lg h-[72px] resize-none"
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
                </div>
            </section>
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
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 0;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background-color: var(--color-surface-500);
        border-radius: 50%;
        display: inline-block;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) {
        animation-delay: 0s;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-4px);
            opacity: 1;
        }
    }
</style>
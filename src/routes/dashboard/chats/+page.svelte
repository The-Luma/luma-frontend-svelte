<script lang="ts">
    import IconSend from '@lucide/svelte/icons/send-horizontal';
    import { onMount } from 'svelte';
    import { FileUpload } from '@skeletonlabs/skeleton-svelte';
    import IconUpload from '@lucide/svelte/icons/upload';
    import { getContext } from 'svelte';
    import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
    

    let elemChat: HTMLElement;
    let autoScrollEnabled = true;
    // let isLoading = $state(false);
    let isLoading = false;


    interface MessageFeed {
        id: number;
        sender: 'user' | 'bot';
        name: string;
        timestamp: string;
        message: string;
        color: string;
    }

    let messageFeed: MessageFeed[] = [];

    let currentMessage = '';

  
    function addMessage() {
        if (!currentMessage.trim()) return;

        const timestamp = `Today @ ${getCurrentTimestamp()}`;

        // Human message
        const humanMsg: MessageFeed = {
            id: messageFeed.length,
            sender: 'user',
            name: 'You',
            timestamp,
            message: currentMessage,
            color: 'preset-tonal-primary'
        };

        messageFeed = [...messageFeed, humanMsg];
        currentMessage = '';

        // Scroll only if autoScroll is still enabled
        setTimeout(() => {
            if (autoScrollEnabled) scrollChatBottom('smooth');
        }, 0);

        // Simulated AI response (always scroll)
        setTimeout(() => {
            const llmMsg: MessageFeed = {
            id: messageFeed.length + 1,
            sender: 'bot',
            name: 'AI',
            timestamp: `Today @ ${getCurrentTimestamp()}`,
            message: "This is a simulated AI response to your message.",
            color: 'preset-tonal-secondary'
            };
            messageFeed = [...messageFeed, llmMsg];

            // Always scroll for bot messages
            setTimeout(() => scrollChatBottom('smooth'), 0);
        }, 1000);
    }

    function scrollChatBottom(behavior: 'auto' | 'smooth' = 'auto') {
        if (elemChat) {
            elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
        }
    }

    function getCurrentTimestamp(): string {
        return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

  
    function onPromptKeydown(event: KeyboardEvent) {
      if (event.code === 'Enter') {
        event.preventDefault();
        addMessage();
      }
    }
  
    onMount(() => {
        scrollChatBottom();

        elemChat.addEventListener('scroll', () => {
            const distanceToBottom = elemChat.scrollHeight - elemChat.scrollTop - elemChat.clientHeight;
            autoScrollEnabled = distanceToBottom < 50;
        });
});

</script>

<div class="card p-4">
    <div class="flex justify-between items-center mb-4">
        <h1 class="h1">Chat</h1>
        <button 
            class="btn preset-filled-primary-500"
            disabled={isLoading}
        >
            {isLoading ? 'Creating Chat...' : 'Create New Chat'}
        </button>
    </div>

    <section class="card bg-surface-100-900 rounded-container overflow-hidden w-full h-[80vh]">
        <div class="grid grid-rows-[1fr_auto] h-full">
          <!-- Chat Feed -->
            <section
                bind:this={elemChat}
                class="p-4 overflow-y-auto space-y-4"
            >
                {#each messageFeed as bubble}
                <div class={`flex ${bubble.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                    class={`card p-4 space-y-2 max-w-[75%] ${bubble.color} ${
                        bubble.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                    >
                    <header class="flex justify-between items-center text-sm opacity-70">
                        <span class="font-bold">{bubble.name}</span>
                        <span>{bubble.timestamp}</span>
                    </header>
                    <p>{bubble.message}</p>
                    </div>
                </div>
                {/each}
            </section>
      
            <!-- Message Input -->
            <section class="border-t-[1px] border-surface-200-800 p-4">
                <div
                    class="input-group grid-cols-[auto_1fr_auto] divide-x divide-surface-200-800 rounded-container-token"
                >
                    <button class="btn preset-filled">
                        <IconUpload class="size-4" />
                        <span>Select File</span>
                    </button>
                    <textarea
                        bind:value={currentMessage}
                        class="bg-transparent border-0 ring-0"
                        name="prompt"
                        placeholder="Write a message..."
                        rows="1"
                        onkeydown={onPromptKeydown}
                    ></textarea>
                    <button
                        class={`input-group-cell ${currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'}`}
                        onclick={addMessage}
                    >
                        <IconSend class="size-4" />
                    </button>
                </div>
            </section>
        </div>
    </section>      
</div>

<style lang="postcss">

</style>
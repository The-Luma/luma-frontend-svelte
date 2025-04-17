<script lang="ts">
    import SpaceAvatar from './SpaceAvatar.svelte';
    
    export let namespaceName: string;
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
    <SpaceAvatar 
        name={namespaceName}
        size="size-12"
    />
    <div class="p-4 rounded-tl-none space-y-2">
        <header class="flex justify-between items-center">
            <p class="font-bold">AI</p>
        </header>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</div>

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
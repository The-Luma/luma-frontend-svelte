<script lang="ts">
    let userInput = $state(''); 
    let password = $state('');
    let isLoading = $state(false);
</script>

<div class="card p-4">
    <h1 class="h1">Chats</h1>
    <div class="card preset-filled-surface-100-900 border-surface-200-800 p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Hello there</h2>
        </header>
        <form class="space-y-6">
            <label class="label">
                <input
                    class="input"
                    type="text"
                    placeholder="Just Start Chatting"
                    bind:value={userInput}
                    required
                    disabled={isLoading}
                />
            </label>

            <button 
                type="submit" 
                class="btn preset-filled-primary-500 w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send?'}
            </button>
        </form>
    </div>
</div> 
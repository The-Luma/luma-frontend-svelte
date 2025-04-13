<script lang="ts">
    let userInput = '';
    let isLoading = false;

    let messages: { sender: 'user' | 'bot'; text: string }[] = [];

    function sendMessage() {
        const trimmed = userInput.trim();
        if (!trimmed) return;

        messages = [...messages, { sender: 'user', text: trimmed }];
        userInput = '';

        // Simulate bot response
        isLoading = true;
        setTimeout(() => {
            messages = [...messages, { sender: 'bot', text: `${trimmed}` }];
            isLoading = false;
        }, 600);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }
</script>


<div class="card p-4">
    <h1 class="h1">Chats</h1>
    
    <div class="card preset-filled-surface-100-900 border-surface-200-800 p-8 w-[90%] max-w-[480px] space-y-8">
        <div class="chat-box">
            {#each [...messages].reverse() as msg}
              <div class="message {msg.sender}">
                <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
              </div>
            {/each}
        </div>
          
        
        <div class="input-row">
            <input
                class="input"
                bind:value={userInput}
                on:keydown={handleKeydown}
                placeholder="Type your message..."
            />
            <button class="btn preset-filled-primary-500 w-full" on:click={sendMessage}>Send</button>
        </div>
    </div>
</div> 
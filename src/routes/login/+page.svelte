<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';

    const toastStore = getToastStore();
    let userInput = ''; 
    let password = '';

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        console.log('User Input:', userInput);
        console.log('Password:', password);

        // validation to check if it's an email or username
        if (userInput.includes('@')) {
            console.log('Input is an Email');
        } else {
            console.log('Input is a Username');
        }

        // Mock authentication
        if (userInput === 'testuser' && password === 'password123') {
            console.log('Authentication successful');
            toastStore.trigger({
                message: 'Login successful!',
                background: 'variant-filled-success'
            });
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            console.log('Authentication failed');
            toastStore.trigger({
                message: 'Invalid username or password',
                background: 'variant-filled-error'
            });
        }
    };
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card variant-glass-surface p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Sign in to your account</h2>
        </header>

        <form class="space-y-6" on:submit={handleSubmit}>
            <label class="label">
                <span>Email or Username</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Enter email or username"
                    bind:value={userInput}
                    required
                />
            </label>

            <label class="label">
                <div class="flex justify-between items-center">
                    <span>Password</span>
                    <a href="/forgot-password" class="anchor">Forgot password?</a>
                </div>
                <input
                    class="input"
                    type="password"
                    placeholder="Enter password"
                    bind:value={password}
                    required
                />
            </label>

            <button type="submit" class="btn variant-filled-primary w-full">
                Sign in
            </button>
        </form>
    </div>
</div>

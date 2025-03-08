<script lang="ts">
    let email = '';
    let username = '';
    let password = '';
    let confirmPassword = '';

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        // TODO: Implement sign up logic
        console.log('Sign up form submitted', { email, username, password });
    };
</script>

<div class="flex justify-center items-center min-h-[100dvh]">
    <div class="card variant-glass-surface p-8 w-[90%] max-w-[480px] space-y-8">
        <header class="text-center space-y-4">
            <h2 class="h2">Welcome to Luma!</h2>
            <p class="text-secondary">Create your admin account to get started</p>
        </header>

        <form class="space-y-6" on:submit={handleSubmit}>
            <label class="label">
                <span>Email</span>
                <input
                    class="input"
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    required
                />
            </label>

            <label class="label">
                <span>Username</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Choose a username"
                    bind:value={username}
                    required
                />
            </label>

            <label class="label">
                <span>Password</span>
                <input
                    class="input"
                    type="password"
                    placeholder="Create a password"
                    bind:value={password}
                    required
                />
            </label>

            <label class="label">
                <span>Confirm Password</span>
                <input
                    class="input"
                    type="password"
                    placeholder="Confirm your password"
                    bind:value={confirmPassword}
                    required
                />
            </label>

            <button type="submit" class="btn variant-filled-primary w-full">
                Create Admin Account
            </button>
        </form>
    </div>
</div> 
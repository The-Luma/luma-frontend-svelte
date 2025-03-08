<script>
    let userInput = ''; 
    let password = '';

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('User Input:', userInput);
        console.log('Password:', password);

        // validation to check if it's an email or username
        if (userInput.includes('@')) {
            console.log('Input is an Email');
        } else {
            console.log('Input is a Username');
        }

        // call backend to authenticate user
        // if successful, redirect to dashboard
        // else, show error message
        // Mock authentication
        if (userInput === 'testuser' && password === 'password123') {
            console.log('Authentication successful');
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            console.log('Authentication failed');
            alert('Invalid username or password');
        }
    };
</script>

<style lang="postcss">
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
</style>

<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <!-- Replace the image to luma logo or remove the image -->
        <img class="mx-auto h-10 w-auto" 
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
            alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
        </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" on:submit={handleSubmit}>
            <div>
                <label for="userInput" class="block text-sm font-medium text-gray-900">Email or Username</label>
                <div class="mt-2">
                    <input 
                        type="text" 
                        id="userInput" 
                        bind:value={userInput} 
                        autocomplete="username" 
                        required
                        placeholder="Enter email or username"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                    <div class="text-sm">
                        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>
                </div>
                <div class="mt-2">
                    <input 
                        type="password" 
                        id="password" 
                        bind:value={password} 
                        autocomplete="current-password" 
                        required
                        placeholder="Enter password"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <button 
                    type="submit" 
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign in
                </button>
            </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
            Do not have an account?
            <a href="./sign-up" class="font-semibold text-indigo-600 hover:text-indigo-500">Create an Account</a>
        </p>
    </div>
</div>

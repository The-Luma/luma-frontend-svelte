<script lang="ts">
    type SignUpForm = {
        email: string;
        username: string;
        password: string;
    };

    let formData: SignUpForm = {
        email: '',
        username: '',
        password: ''
    };

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        console.log('Form data:', formData);
        // TODO: Add API call to handle sign up
    };
</script>

<style lang="postcss">
</style>

<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
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
                <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
                <div class="mt-2">
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={formData.email} 
                        autocomplete="email" 
                        required
                        placeholder="Email"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                </div>
            </div>
            <div>
                <label for="username" class="block text-sm font-medium text-gray-900">Username</label>
                <div class="mt-2">
                    <input 
                        type="text" 
                        id="username" 
                        bind:value={formData.username} 
                        required
                        placeholder="Username"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                </div>
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                <div class="mt-2">
                    <input 
                        type="password" 
                        id="password" 
                        bind:value={formData.password} 
                        autocomplete="new-password" 
                        required
                        placeholder="Password"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <button 
                    type="submit" 
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign Up
                </button>
            </div>
        </form>
    </div>
</div>
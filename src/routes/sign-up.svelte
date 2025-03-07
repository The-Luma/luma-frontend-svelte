<!-- src/routes/sign-up.svelte -->
<script>
    import { AppBar, Input, Button } from '@skeletonlabs/skeleton';

    let email = '';
    let username = '';
    let password = '';

    async function handleSubmit(e) {
        e.preventDefault();
        console.log({ email, username, password });
        // Add your signup logic here
    }

    async function checkUserRegistration() {
        try {
            const response = await fetch('./check-registration');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.registered) {
                console.log("User registered, showing login page.");
            } else {
                console.log("User not registered, redirecting to sign-in.");
                window.location.href = 'sign-in.html';
            }
        } catch (error) {
            console.error('Error checking registration:', error);
            window.location.href = 'sign-in.html';
        }
    }

    // Runs when component mounts
    checkUserRegistration();
</script>

<!-- Using Skeleton's AppBar for navigation -->
<AppBar background="bg-gray-900" border="border-b-2 border-black">
    <svelte:fragment slot="lead">
        <h1 class="pl-2 text-white">luma</h1>
    </svelte:fragment>
</AppBar>

<form 
    on:submit={handleSubmit}
    class="text-center w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-black p-5 rounded-md"
>
    <div class="text-center mb-[15px]">Hello User!</div>
    
    <div class="flex items-center mb-[10px] gap-2">
        <label class="whitespace-nowrap">User email:</label>
        <Input 
            type="text" 
            name="email" 
            placeholder="Enter your email"
            bind:value={email}
            class="flex-grow"
        />
    </div>
    
    <div class="flex items-center mb-[10px] gap-2">
        <label class="whitespace-nowrap">Username:</label>
        <Input 
            type="text" 
            name="username" 
            placeholder="Enter your username"
            bind:value={username}
            class="flex-grow"
        />
    </div>
    
    <div class="flex items-center mb-[10px] gap-2">
        <label class="whitespace-nowrap">Password:</label>
        <Input 
            type="password" 
            name="password" 
            placeholder="Enter your password"
            bind:value={password}
            class="flex-grow"
        />
    </div>
    
    <Button type="submit" class="mt-2 w-full">Sign Up</Button>
</form>






<div class="container h-full mx-auto flex justify-center items-center">

	Hello World
	
</div>

<style lang="postcss">

</style>
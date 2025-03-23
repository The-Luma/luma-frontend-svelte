<script lang="ts">
	import { isServerUp, isAuthenticated, isAdminSetup } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!browser) return;

		if (!$isServerUp) {
			goto('/backend-down');
		} else if ($isAuthenticated) {
			goto('/me');
		} else if (!$isAdminSetup) {
			goto('/admin-setup');
		} else {
			goto('/login');
		}
	});
</script>

<div class=" mx-auto p-4 space-y-8">
	<div class="flex justify-center items-center min-h-[50dvh]">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
</div>

<style lang="postcss">

</style>
 
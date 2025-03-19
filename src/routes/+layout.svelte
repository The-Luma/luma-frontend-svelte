<script lang="ts">
	import '../app.css';
	import { AppShell, initializeStores, Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { checkServerUp, checkAuth, checkAdminSetup, setupTokenRefresh, isLoading, isAuthenticated, isServerUp } from '$lib/stores/auth';
	import { onMount, onDestroy } from 'svelte';

	import { browser } from '$app/environment';

	// Initialize stores for Toast
	initializeStores();
	const toastStore = getToastStore();


	let cleanupTokenRefresh: (() => void) | undefined;
	let initialized = false;

	async function initializeAuth() {
		if (!browser || initialized) return;

		try {
			if (!$isServerUp) {
				const isUp = await checkServerUp();
				if (!isUp) {
					toastStore.trigger({
						message: 'Backend service is unavailable.',
						background: 'variant-filled-error'
					});
					return;
				}
			}

			// Skip auth check if we're already authenticated (e.g. after login)
			if (!$isAuthenticated) {
				const isAuthed = await checkAuth();
				if (isAuthed) {
					cleanupTokenRefresh = setupTokenRefresh();
				}
			}
			await checkAdminSetup();
		} catch (error) {
			console.error('Error during auth initialization:', error);
		} finally {
			initialized = true;
		}
	}

	onMount(() => {
		initializeAuth();
	});

	onDestroy(() => {
		if (cleanupTokenRefresh) {
			cleanupTokenRefresh();
		}
	});
</script>

{#if !initialized && $isLoading}
	<div class="fixed inset-0 bg-surface-100-800/20 backdrop-blur-xs z-50">
		<div class="flex justify-center items-center h-full">
			<span class="loading loading-spinner loading-lg" />
		</div>
	</div>
{/if}


<Toast />
<div data-theme="luma-original-theme">
	<AppShell>
		<slot />
	</AppShell>
</div>

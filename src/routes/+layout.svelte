<script lang="ts">
	import '../app.postcss';
	import { AppShell, initializeStores } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { checkAuth, checkAdminSetup, setupTokenRefresh, isLoading, isAuthenticated } from '$lib/stores/auth';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Initialize stores
	initializeStores();

	let cleanupTokenRefresh: (() => void) | undefined;
	let initialized = false;

	async function initializeAuth() {
		if (!browser || initialized) return;
		
		try {
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
	<div class="fixed inset-0 bg-surface-100-800/20 backdrop-blur-sm z-50">
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

<script lang="ts">
	import '../app.css';
	import { ToastProvider, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { checkServerUp, checkAuth, checkAdminSetup, setupTokenRefresh, isLoading, isAuthenticated, isServerUp, auth, isAdminSetup } from '$lib/stores/auth';
	import { onMount, onDestroy } from 'svelte';
	import { initializeTheme } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { navigationItems, settingsItem } from '$lib/config/navigation.config';
	import { page } from '$app/stores';

	// Icons
	import IconMessageSquare from 'lucide-svelte/icons/message-square';
	import IconUser from 'lucide-svelte/icons/user';
	import IconFolder from 'lucide-svelte/icons/folder';
	import IconLayers from 'lucide-svelte/icons/layers';
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconLogOut from 'lucide-svelte/icons/log-out';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Initiaze Toast
	// export const toast: ToastContext = getContext('toast');

	let cleanupTokenRefresh: (() => void) | undefined;
	let initialized = $state(false);
	let currentRoute = $state('');

	// Handle navigation
	function handleNavigation(newValue: string) {
		currentRoute = newValue;
		switch (newValue) {
			case 'chats':
				goto('/dashboard/chats');
				break;
			case 'profile':
				goto('/dashboard/profile');
				break;
			case 'files':
				goto('/dashboard/files');
				break;
			case 'namespaces':
				goto('/dashboard/namespaces');
				break;
			case 'settings':
				goto('/dashboard/settings');
				break;
		}
	}

	function handleDashboardHome() {
		currentRoute = '';
		goto('/dashboard');
	}

	async function handleLogout() {
		try {
			await auth.logout();
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	onMount(async () => {
		if (!browser) return;

		// Initialize theme
		initializeTheme();

		// Check server status
		await checkServerUp();

		// Only proceed with auth checks if server is up
		if ($isServerUp) {
			// Check admin setup status
			await checkAdminSetup();

			// If admin is not set up, redirect to admin setup
			if (!$isAdminSetup) {
				goto('/admin-setup');
				return;
			}

			// Check authentication status
			await checkAuth();

			// If authenticated, setup token refresh
			if ($isAuthenticated) {
				cleanupTokenRefresh = setupTokenRefresh();
			}
		}

		initialized = true;
	});

	onDestroy(() => {
		if (cleanupTokenRefresh) {
			cleanupTokenRefresh();
		}
	});
</script>

<svelte:head>
	<title>Luma</title>
	<style>
  		@custom-variant dark (&:is(.dark *));
	</style>
</svelte:head>

{#if !initialized && $isLoading}
	<div class="fixed inset-0 bg-surface-100-800/20 backdrop-blur-xs z-50">
		<div class="flex justify-center items-center h-full">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	</div>
{/if}

<ToastProvider >
	{#if $page.url.pathname.startsWith('/dashboard')}
		<div class="h-full flex flex-col">
			<!-- Header -->
			<header class="bg-surface-100-800 border-b border-surface-200-700">
				<div class="flex items-center justify-between px-4 py-2">
					<div class="flex items-center gap-4">
						<button class="btn variant-ghost-surface" onclick={handleDashboardHome}>
							<h1 class="h2">Luma</h1>
						</button>
					</div>
					<div class="flex items-center gap-4">
						<ThemeSwitcher />
						<button class="btn variant-ghost-surface" onclick={handleLogout}>
							<IconLogOut class="w-5 h-5" />
						</button>
					</div>
				</div>
			</header>

			<!-- Main Content Area -->
			<div class="flex h-full md:flex-row flex-col">
				<!-- Desktop Navigation Rail -->
				<div class="hidden md:block">
					<Navigation.Rail value={currentRoute} onValueChange={handleNavigation}>
						{#snippet tiles()}
							{#each navigationItems as item}
								<Navigation.Tile id={item.id} label={item.label}>
									<svelte:component this={item.icon} />
								</Navigation.Tile>
							{/each}
						{/snippet}
						{#snippet footer()}
							<Navigation.Tile id={settingsItem.id} label={settingsItem.label}>
								<svelte:component this={settingsItem.icon} />
							</Navigation.Tile>
						{/snippet}
					</Navigation.Rail>
				</div>

				<!-- Main Content -->
				<div class="flex-1 h-full">
					{@render children?.()}
				</div>

				<div class="md:hidden">
					<Navigation.Bar value={currentRoute} onValueChange={handleNavigation}>
						{#each navigationItems as item}
							<Navigation.Tile id={item.id} label={item.label}>
								<svelte:component this={item.icon} />
							</Navigation.Tile>
						{/each}
						<Navigation.Tile id={settingsItem.id} label={settingsItem.label}>
							<svelte:component this={settingsItem.icon} />
						</Navigation.Tile>
					</Navigation.Bar>
				</div>
			</div>
		</div>
	{:else}
		{@render children?.()}
	{/if}
</ToastProvider>


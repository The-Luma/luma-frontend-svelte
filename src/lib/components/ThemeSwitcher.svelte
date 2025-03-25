<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { currentTheme, setTheme, themes, isDarkMode, toggleDarkMode } from '$lib/stores/theme';
	import IconX from 'lucide-svelte/icons/x';
	import IconSearch from 'lucide-svelte/icons/search';
	import IconPaintbrushVertical from 'lucide-svelte/icons/paintbrush-vertical';
	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';

	let openState = $state(false);
	let searchQuery = $state('');

	const themeList = themes.map(theme => ({
		id: theme,
		name: theme.charAt(0).toUpperCase() + theme.slice(1)
	}));

	$effect(() => {
		// Apply theme when it changes
		document.documentElement.setAttribute('data-theme', $currentTheme);
	});

	function popoverClose() {
		openState = false;
		searchQuery = '';
	}

	const filteredThemes = $derived(
		themeList.filter((theme) =>
			theme.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="flex items-center gap-2">

	<Popover
		open={openState}
		onOpenChange={(e) => (openState = e.open)}
		positioning={{ placement: 'bottom-end' }}
		triggerBase="btn variant-ghost-surface"
		contentBase="card bg-surface-200-800 p-4 space-y-4 w-[320px]"
		arrow
		arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	>
		{#snippet trigger()}
			<IconPaintbrushVertical class="w-5 h-5" />
		{/snippet}
		{#snippet content()}
			<header class="flex justify-between items-center">
				<p class="font-bold text-xl">Select Theme</p>
				<button class="btn-icon hover:preset-tonal" on:click={popoverClose}>
					<IconX class="w-5 h-5" />
				</button>
			</header>

			<div class="relative">
				<IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
				<input
					type="text"
					class="input pl-10 w-full"
					placeholder="Search themes..."
					bind:value={searchQuery}
				/>
			</div>

			<div class="space-y-2 max-h-[300px] overflow-y-auto">
				{#each filteredThemes as theme}
					<button
						class="btn variant-ghost-surface w-full justify-start gap-2 {theme.id === $currentTheme
							? 'variant-filled-primary'
							: ''}"
						on:click={() => {
							setTheme(theme.id);
							popoverClose();
						}}
					>
						<div class="w-4 h-4 rounded-full" style="background-color: var(--color-{theme.id}-500)" />
						{theme.name}
					</button>
				{/each}
			</div>
		{/snippet}
	</Popover>
	<button 
		class="btn variant-ghost-surface" 
		on:click={toggleDarkMode}
		title={$isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
	>
		{#if $isDarkMode}
			<IconSun class="w-5 h-5" />
		{:else}
			<IconMoon class="w-5 h-5" />
		{/if}
	</button>
</div>

<style>
	img {
		transition: transform 0.3s ease;
	}
</style>
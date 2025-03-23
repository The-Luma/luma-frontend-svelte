<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import themeSwitcherIcon from '$lib/assets/icons/theme-switcher.svg';

	// Available themes
	const themes = [
		'catppuccin', 'cerberus', 'concord', 'crimson', 'fennec',
		'hamlindigo', 'legacy', 'mint', 'modern', 'mona',
		'nosh', 'nouveau', 'pine', 'reign', 'rocket',
		'rose', 'sahara', 'seafoam', 'terminus', 'vintage',
		'vox', 'wintry'
	];

	const currentTheme = writable('terminus');
	const isDarkMode = writable(false);

	function changeTheme(event: Event) {
		const theme = (event.target as HTMLSelectElement).value;
		currentTheme.set(theme);
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	function toggleDarkMode() {
		isDarkMode.update(mode => {
			const newMode = !mode;
			document.documentElement.classList.toggle('dark', newMode);
			localStorage.setItem('darkMode', String(newMode));
			return newMode;
		});
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme && themes.includes(savedTheme)) {
			currentTheme.set(savedTheme);
			document.documentElement.setAttribute('data-theme', savedTheme);
		}
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
		isDarkMode.set(savedDarkMode);
		document.documentElement.classList.toggle('dark', savedDarkMode);
	});
</script>

<div class="flex items-center gap-4">
	<select
		class="select variant-filled-surface"
		bind:value={$currentTheme}
		on:change={changeTheme}
	>
		{#each themes as theme}
			<option value={theme}>{theme}</option>
		{/each}
	</select>

	<button
		class="btn variant-ghost-surface"
		on:click={toggleDarkMode}
		title={$isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
	>
		<img
			src={themeSwitcherIcon}
			alt="Theme switcher"
			class="w-6 h-6"
			class:rotate-180={$isDarkMode}
		/>
	</button>
</div>

<style>
    	.icon svg {
		/* Change the color here, e.g., to blue */
		fill: blue;
		transition: transform 0.3s ease;
	}
	img {
		transition: transform 0.3s ease;
	}
</style>
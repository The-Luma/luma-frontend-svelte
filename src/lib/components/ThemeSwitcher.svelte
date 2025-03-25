<script lang="ts">
	import { onMount } from 'svelte';
	import themeSwitcherIcon from '$lib/assets/icons/theme-switcher.svg';
	import { currentTheme, isDarkMode, themes, setTheme, toggleDarkMode } from '$lib/stores/theme';

	function handleThemeChange(event: Event) {
		const theme = (event.target as HTMLSelectElement).value;
		setTheme(theme);
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
		on:change={handleThemeChange}
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
	img {
		transition: transform 0.3s ease;
	}
</style>
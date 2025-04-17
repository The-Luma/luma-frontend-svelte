import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Available themes
export const themes = [
    'catppuccin', 'cerberus', 'concord', 'crimson', 'fennec',
    'hamlindigo', 'legacy', 'mint', 'modern', 'mona',
    'nosh', 'nouveau', 'pine', 'reign', 'rocket',
    'rose', 'sahara', 'seafoam', 'terminus', 'vintage',
    'vox', 'wintry'
] as const;

export type Theme = typeof themes[number];

// Theme store
export const currentTheme = writable<Theme>('terminus');
export const isDarkMode = writable(false);

// Theme management functions
export function setTheme(theme: Theme) {
    if (!browser) return;
    
    currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

export function toggleDarkMode() {
    if (!browser) return;
    
    isDarkMode.update(mode => {
        const newMode = !mode;
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('darkMode', String(newMode));
        return newMode;
    });
}

export function initializeTheme() {
    if (!browser) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.includes(savedTheme)) {
        setTheme(savedTheme);
    } else {
        setTheme('terminus');
    }

    // Load saved dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    isDarkMode.set(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
} 
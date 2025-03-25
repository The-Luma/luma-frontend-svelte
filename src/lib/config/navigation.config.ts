import type { IconProps } from 'lucide-svelte';
import IconMessageSquare from 'lucide-svelte/icons/message-square';
import IconUser from 'lucide-svelte/icons/user';
import IconFolder from 'lucide-svelte/icons/folder';
import IconLayers from 'lucide-svelte/icons/layers';
import IconSettings from 'lucide-svelte/icons/settings';

export interface NavigationItem {
    id: string;
    label: string;
    icon: any; // Using any for now since Lucide types are complex
    path: string;
}

export const navigationItems: NavigationItem[] = [
    {
        id: 'chats',
        label: 'Chats',
        icon: IconMessageSquare,
        path: '/dashboard/chats'
    },
    {
        id: 'namespaces',
        label: 'My Spaces',
        icon: IconLayers,
        path: '/dashboard/namespaces'
    },
    {
        id: 'profile',
        label: 'My Profile',
        icon: IconUser,
        path: '/dashboard/profile'
    },
];

export const settingsItem: NavigationItem = {
    id: 'settings',
    label: 'Settings',
    icon: IconSettings,
    path: '/dashboard/settings'
}; 
<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton-svelte';
    import { createAvatar } from '@dicebear/core';
    import { glass } from '@dicebear/collection';

    export let name: string;
    export let size: 'size-8' | 'size-12' = 'size-8';
    export let showLetter = true;
    export let isSelected = false;

    const colors = [
        "eb4747", "eb6247", "eb7e47", "eb9947", "ebb447",
        "ebd047", "ebeb47", "d0eb47", "b4eb47", "99eb47",
        "7eeb47", "62eb47", "47eb47", "47eb62", "47eb7e",
        "47eb99", "47ebb4", "47ebd0", "47ebeb", "47d0eb",
        "47b4eb", "4799eb", "477eeb", "4762eb", "4747eb",
        "6247eb", "7e47eb", "9947eb", "b447eb", "d047eb",
        "eb47eb", "eb47d0", "eb4799", "eb477e", "eb4762"
    ];

    function generateAvatar(seed: string) {
        return createAvatar(glass, {
            seed,
            size: 128,
            backgroundColor: colors,
        }).toDataUri();
    }

    $: avatarSrc = generateAvatar(name);
    $: firstLetter = name.charAt(0).toUpperCase();
    $: containerSize = size === 'size-8' ? 'w-8 h-8' : 'w-12 h-12';
    $: letterSize = size === 'size-8' ? 'text-sm' : 'text-base';
    $: wrapperClass = isSelected ? 'rotating-avatar' : '';
    $: shouldShowLetter = showLetter && !isSelected;
</script>

<div class="relative {containerSize} {wrapperClass}">
    <Avatar 
        src={avatarSrc}
        {name}
        {size}
    />
    {#if shouldShowLetter}
        <div class="absolute inset-0 flex items-center justify-center text-white font-bold {letterSize}">
            {firstLetter}
        </div>
    {/if}
</div>

<style>
    .rotating-avatar {
        animation: rotate 3s linear infinite;
    }
    
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style> 
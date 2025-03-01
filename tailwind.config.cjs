const { join } = require('path');
const { skeleton } = require('@skeletonlabs/tw-plugin');
const { myCustomTheme } = require('./src/lib'); // Import your theme

module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}', // scan app's files
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}') // includes Skeleton Labs components
    ],
    theme: {
        extend: {}, // Add custom Tailwind extensions here if needed
    },
    plugins: [
        skeleton({
            themes: {
                custom: [myCustomTheme], // Register your theme
                preset: ['skeleton'] // Optional: include default Skeleton theme
            }
        })
    ],
};
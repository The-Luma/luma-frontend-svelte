/**
 * Gets the current base URL of the application
 * This will work in both development and production environments
 */
export function getBaseUrl(): string {
    if (typeof window === 'undefined') {
        // Server-side rendering
        return '';
    }
    
    // Get the current URL
    const url = window.location.href;
    // Remove any path and query parameters
    return url.split('/').slice(0, 3).join('/');
}

/**
 * Constructs a full URL for a given path
 * @param path The path to append to the base URL
 */
export function getFullUrl(path: string): string {
    const baseUrl = getBaseUrl();
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
} 
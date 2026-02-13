/**
 * Dark Mode Module
 * Manages all dark mode functionality and theme switching
 */

/**
 * Initialize dark mode
 * Loads saved preference and sets up event listeners
 */
export function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Load dark mode preference from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateToggleIcon(darkModeToggle);
    }

    // Add click listener to toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    console.log('Dark mode initialized');
}

/**
 * Toggle between light and dark mode
 */
function toggleDarkMode() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDarkMode ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('darkMode', newTheme === 'dark');

    const toggle = document.getElementById('darkModeToggle');
    updateToggleIcon(toggle);
}

/**
 * Update the toggle button icon based on current theme
 * @param {HTMLElement} toggle - The toggle button element
 */
function updateToggleIcon(toggle) {
    if (!toggle) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.querySelector('.toggle-icon').textContent = isDarkMode ? '☀️' : '🌙';
}

/**
 * Check if dark mode is currently enabled
 * @returns {boolean} - True if dark mode is enabled
 */
export function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Get the current theme
 * @returns {string} - The current theme ('light' or 'dark')
 */
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Set theme manually
 * @param {string} theme - The theme to set ('light' or 'dark')
 */
export function setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('darkMode', theme === 'dark');
        const toggle = document.getElementById('darkModeToggle');
        updateToggleIcon(toggle);
    }
}

/**
 * Main application entry point
 * Imports and initializes all modules
 */

import { createHeader, initHeader } from './header.js';
import { createFooter, initFooter } from './footer.js';
import { initHero } from './hero.js';
import { log } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    log('Application loaded', 'info');

    // Inject header and footer
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    if (headerContainer) {
        headerContainer.innerHTML = createHeader();
    }
    if (footerContainer) {
        footerContainer.innerHTML = createFooter();
    }

    // Initialize all modules
    initHeader();
    initFooter();
    initHero();

    log('All modules initialized', 'info');
});

/**
 * Main application entry point
 * Imports and initializes all modules
 */

import { createHeader, initHeader } from './header.js';
import { createFooter, initFooter } from './footer.js';
import { initHero } from './hero.js';
import { initPokedex } from './pokedex.js';
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

    // Check if we're on the Pokedex page
    const pokedexContainer = document.getElementById('pokedexContainer');
    if (pokedexContainer) {
        initPokedex();
    }

    log('All modules initialized', 'info');
});

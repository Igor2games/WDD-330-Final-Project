/**
 * Main application entry point
 * Imports and initializes all modules
 */

import { createHeader, initHeader } from './header.js';
import { createFooter, initFooter } from './footer.js';
import { initHero } from './hero.js';
import { initPokedex } from './pokedex.js';
import { initShop } from './pokemarket.js';
import { initCartPage } from './cart-page.js';
import { initOrderComplete } from './order-complete.js';
import { initNewsletter } from './newsletter.js';
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

    const shopGrid = document.getElementById('shopGrid');
    if (shopGrid) {
        initShop();
    }

    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        initCartPage();
    }

    const orderId = document.getElementById('orderId');
    if (orderId) {
        initOrderComplete();
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        initNewsletter();
    }

    log('All modules initialized', 'info');
});

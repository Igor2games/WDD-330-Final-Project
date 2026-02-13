/**
 * Header Module
 * Manages the header component for all pages
 */

import { initDarkMode } from './dark.js';

export function createHeader() {
  const headerHTML = `
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <a href="index.html" data-base-link="home">
            <img src="images/pokeball.svg" alt="Pokecenter Logo" class="logo-icon" data-asset="logo">
            <span class="logo-text">Pokecenter</span>
          </a>
        </div>
        <nav class="navbar">
          <ul>
            <li><a href="index.html" data-base-link="home">Home</a></li>
            <li><a href="pages/pokedex.html" data-base-link="pokedex">Pokedex</a></li>
            <li><a href="pages/pokemarket.html" data-base-link="pokemarket">Shop</a></li>
            <li><a href="pages/newsletter.html" data-base-link="newsletter">Newsletter</a></li>
            <li><a href="pages/battle-simulator.html" data-base-link="battle-simulator">Battle Simulator</a></li>
          </ul>
        </nav>
        <div class="header-actions">
          <a class="cart-link" id="cartLink" href="pages/cart.html" data-base-link="cart" aria-label="View cart">
            <span class="cart-icon">🛒</span>
          </a>
          <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle dark mode">
            <span class="toggle-icon">🌙</span>
          </button>
        </div>
      </div>
    </header>
  `;
  return headerHTML;
}

export function initHeader() {
  // Initialize dark mode functionality
  initDarkMode();

  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  const logoImg = document.querySelector('[data-asset="logo"]');
  if (logoImg) {
    logoImg.setAttribute('src', `${basePath}images/pokeball.svg`);
  }

  const linkMap = {
    home: `${basePath}index.html`,
    pokedex: `${basePath}pages/pokedex.html`,
    pokemarket: `${basePath}pages/pokemarket.html`,
    cart: `${basePath}pages/cart.html`,
    newsletter: `${basePath}pages/newsletter.html`,
    'battle-simulator': `${basePath}pages/battle-simulator.html`,
  };

  document.querySelectorAll('[data-base-link]')
    .forEach((link) => {
      const key = link.getAttribute('data-base-link');
      if (key && linkMap[key]) {
        link.setAttribute('href', linkMap[key]);
      }
    });

  console.log('Header initialized');
}

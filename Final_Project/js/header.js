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
          <a href="index.html">
            <img src="images/pokeball.svg" alt="Pokecenter Logo" class="logo-icon">
            <span class="logo-text">Pokecenter</span>
          </a>
        </div>
        <nav class="navbar">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="pages/pokedex.html">Pokedex</a></li>
            <li><a href="pages/pokemarket.html">Shop</a></li>
            <li><a href="pages/newsletter.html">Newsletter</a></li>
            <li><a href="pages/battle-simulator.html">Battle Simulator</a></li>
          </ul>
        </nav>
        <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle dark mode">
          <span class="toggle-icon">🌙</span>
        </button>
      </div>
    </header>
  `;
  return headerHTML;
}

export function initHeader() {
  // Initialize dark mode functionality
  initDarkMode();

  console.log('Header initialized');
}

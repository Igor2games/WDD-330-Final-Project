/**
 * Header Module
 * Manages the header component for all pages
 */

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

  console.log('Header initialized');
}

function toggleDarkMode() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDarkMode ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('darkMode', newTheme === 'dark');

  const toggle = document.getElementById('darkModeToggle');
  updateToggleIcon(toggle);
}

function updateToggleIcon(toggle) {
  if (!toggle) return;
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.querySelector('.toggle-icon').textContent = isDarkMode ? '☀️' : '🌙';
}

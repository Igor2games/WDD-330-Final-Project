/**
 * Footer Module
 * Manages the footer component for all pages
 */

export function createFooter() {
  const currentYear = new Date().getFullYear();
  const footerHTML = `
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>About Pokecenter</h4>
            <p>Your one-stop hub for all Pokemon-related activities and adventures.</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="pages/pokedex.html">Pokedex</a></li>
              <li><a href="pages/video.html">Video</a></li>
              <li><a href="pages/pokemarket.html">Pokemarket</a></li>
              <li><a href="pages/newsletter.html">Newsletter</a></li>
              <li><a class="is-disabled" href="#" aria-disabled="true" tabindex="-1">Battle Simulator</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Email: info@pokecenter.com</p>
            <p>© ${currentYear} Pokecenter. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `;
  return footerHTML;
}

export function initFooter() {
  const footerElement = document.querySelector('footer');
  if (footerElement) {
    // Add any interactive footer functionality here if needed
    console.log('Footer initialized');
  }
}

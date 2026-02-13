/**
 * Newsletter Module
 * Handles simple form success messaging
 */

export function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    const success = document.querySelector('.newsletter-success');
    const resetButton = document.getElementById('newsletterReset');

    if (!form || !success) return;

    success.style.display = 'none';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.style.display = 'none';
        success.style.display = 'block';
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            form.reset();
            success.style.display = 'none';
            form.style.display = 'grid';
        });
    }
}

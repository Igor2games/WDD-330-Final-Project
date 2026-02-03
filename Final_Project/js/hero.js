/**
 * Hero Module
 * Handles the hero section with dynamic Pokémon image
 */

import { getRandomPokemon, getPokemonImageUrl } from './pokemon-api.js';
import { log } from './utils.js';

/**
 * Initialize the hero section with a random Pokémon
 */
export async function initHero() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    try {
        log('Fetching random Pokémon for hero...', 'info');

        // Fetch random Pokémon
        const pokemon = await getRandomPokemon();
        const imageUrl = getPokemonImageUrl(pokemon);

        log(`Pokémon image URL: ${imageUrl}`, 'info');

        // Create the image element
        const heroImage = document.createElement('img');
        heroImage.src = imageUrl;
        heroImage.alt = pokemon.name;
        heroImage.className = 'hero-pokemon-image';

        // Wait for image to load before inserting
        heroImage.onload = () => {
            log(`Successfully loaded image for ${pokemon.name}`, 'info');
        };

        heroImage.onerror = () => {
            log(`Failed to load image: ${imageUrl}`, 'warn');
        };

        // Insert image directly into hero section (not heroContent)
        heroSection.appendChild(heroImage);

        log(`Hero Pokémon set to: ${pokemon.name}`, 'info');
    } catch (error) {
        log(`Error initializing hero: ${error.message}`, 'error');
        // Continue without the image if fetch fails
    }
}

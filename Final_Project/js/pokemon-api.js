/**
 * PokéAPI Module
 * Handles all interactions with the PokéAPI
 */

import { fetchData, log } from './utils.js';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

/**
 * Fetch a random Pokémon
 * @returns {Promise<Object>} - Pokemon data
 */
export async function getRandomPokemon() {
    try {
        // PokéAPI has 1025 Pokemon (as of generation 9)
        const randomId = Math.floor(Math.random() * 1025) + 1;
        const url = `${POKEAPI_BASE}/pokemon/${randomId}`;
        const data = await fetchData(url);
        log(`Fetched Pokémon: ${data.name}`, 'info');
        return data;
    } catch (error) {
        log(`Error fetching random Pokémon: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Fetch a specific Pokémon by ID or name
 * @param {string|number} identifier - Pokemon ID or name
 * @returns {Promise<Object>} - Pokemon data
 */
export async function getPokemon(identifier) {
    try {
        const url = `${POKEAPI_BASE}/pokemon/${identifier}`;
        const data = await fetchData(url);
        return data;
    } catch (error) {
        log(`Error fetching Pokémon ${identifier}: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Get the best available image URL for a Pokémon
 * @param {Object} pokemonData - Pokemon data object from API
 * @returns {string} - Image URL
 */
export function getPokemonImageUrl(pokemonData) {
    // Try to get the official artwork first, fallback to default sprite
    return (
        pokemonData.sprites?.other?.['official-artwork']?.front_default ||
        pokemonData.sprites?.front_default ||
        '/images/placeholder.png'
    );
}

/**
 * Fetch Pokémon species information (for description)
 * @param {number} speciesId - Species ID
 * @returns {Promise<Object>} - Species data
 */
export async function getPokemonSpecies(speciesId) {
    try {
        const url = `${POKEAPI_BASE}/pokemon-species/${speciesId}`;
        const data = await fetchData(url);
        return data;
    } catch (error) {
        log(`Error fetching species ${speciesId}: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Search for Pokémon by type
 * @param {string} type - Pokémon type (e.g., 'fire', 'water')
 * @returns {Promise<Object>} - Type data with Pokémon list
 */
export async function getPokemonByType(type) {
    try {
        const url = `${POKEAPI_BASE}/type/${type}`;
        const data = await fetchData(url);
        return data;
    } catch (error) {
        log(`Error fetching type ${type}: ${error.message}`, 'error');
        throw error;
    }
}

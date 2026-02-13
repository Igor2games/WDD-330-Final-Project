/**
 * Pokedex Module
 * Manages dynamic loading and display of Pokemon data from PokeAPI
 */

import { fetchData } from './utils.js';

let allPokemon = [];
let filteredPokemon = [];
let searchTerm = '';
const selectedTypes = new Set();
const selectedGenerations = new Set();
let modalElement;
let modalBodyElement;
const FILTER_STORAGE_KEY = 'pokedexFilters';

/**
 * Initialize the Pokedex page
 */
export async function initPokedex() {
    try {
        showLoadingIndicator();

        // Load the pokedex reference list
        const pokedexList = await fetchData('../data/pokedex.json');

        // Fetch detailed data for each Pokemon
        allPokemon = await Promise.all(
            pokedexList.pokemon.map(pokemon => fetchPokemonData(pokemon))
        );

        filteredPokemon = allPokemon;

        // Set up search and filter functionality
        setupSearchAndFilter();
        setupModal();
        setupCardClickHandler();

        // Render the initial list based on saved filters
        applyFilters();

        hideLoadingIndicator();
        console.log('Pokedex initialized successfully');
    } catch (error) {
        console.error('Error initializing Pokedex:', error);
        showErrorMessage();
    }
}

/**
 * Fetch detailed Pokemon data from PokeAPI
 * @param {Object} pokemonRef - Pokemon reference from pokedex.json
 * @returns {Promise<Object>} - Detailed Pokemon data
 */
async function fetchPokemonData(pokemonRef) {
    try {
        // Fetch Pokemon details (types, abilities, image, stats)
        const pokemonData = await fetchData(pokemonRef.pokemonUrl);

        // Fetch species data (description, generation, color)
        const speciesData = await fetchData(pokemonRef.speciesUrl);

        const evolutionChainData = await fetchData(speciesData.evolution_chain.url);
        const evolutionList = extractEvolutionChain(evolutionChainData.chain);

        // Combine the data
        return {
            id: pokemonRef.id,
            name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
            types: pokemonData.types.map(t => t.type.name),
            image: pokemonData.sprites.other['official-artwork'].front_default ||
                pokemonData.sprites.front_default,
            stats: pokemonData.stats,
            abilities: pokemonData.abilities.map(a => a.ability.name),
            height: pokemonData.height,
            weight: pokemonData.weight,
            description: speciesData.flavor_text_entries
                .find(entry => entry.language.name === 'en')?.flavor_text
                .replace(/\n/g, ' ')
                .replace(/\f/g, ' ')
                .replace(/POKéMON/g, 'POKÉMON') || 'No description available',
            generation: speciesData.generation.name,
            color: speciesData.color.name,
            evolutions: evolutionList
        };
    } catch (error) {
        console.error(`Error fetching Pokemon ${pokemonRef.id}:`, error);
        return null;
    }
}

/**
 * Render the Pokedex grid with Pokemon cards
 * @param {Array} pokemonList - List of Pokemon to display
 */
function renderPokedexGrid(pokemonList) {
    const container = document.getElementById('pokedexContainer');

    if (!pokemonList || pokemonList.length === 0) {
        container.innerHTML = '<p class="no-results">No Pokémon found.</p>';
        return;
    }

    container.innerHTML = pokemonList
        .filter(pokemon => pokemon !== null)
        .map(pokemon => createPokemonCard(pokemon))
        .join('');
}

/**
 * Create a Pokemon card HTML
 * @param {Object} pokemon - Pokemon data
 * @returns {string} - HTML for Pokemon card
 */
function createPokemonCard(pokemon) {
    const typesList = pokemon.types.map(type =>
        `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join('');

    return `
    <div class="pokemon-card" data-id="${pokemon.id}" data-name="${pokemon.name.toLowerCase()}" data-types="${pokemon.types.join(',')}">
      <div class="pokemon-image">
        <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
      </div>
      <div class="pokemon-info">
        <div class="pokemon-header">
          <h3 class="pokemon-name">${pokemon.name}</h3>
          <span class="pokemon-id">#${String(pokemon.id).padStart(4, '0')}</span>
        </div>
        <div class="pokemon-types">
          ${typesList}
        </div>
        <p class="pokemon-description">${pokemon.description}</p>
        <div class="pokemon-details">
          <div class="detail-item">
            <span class="detail-label">Height:</span>
            <span class="detail-value">${(pokemon.height / 10).toFixed(1)}m</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Weight:</span>
            <span class="detail-value">${(pokemon.weight / 10).toFixed(1)}kg</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Gen:</span>
            <span class="detail-value">${pokemon.generation}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupCardClickHandler() {
    const container = document.getElementById('pokedexContainer');
    if (!container) return;

    container.addEventListener('click', (event) => {
        const card = event.target.closest('.pokemon-card');
        if (!card) return;

        const pokemonName = card.getAttribute('data-name');
        const pokemon = allPokemon.find(item => item && item.name.toLowerCase() === pokemonName);
        if (pokemon) {
            openPokemonModal(pokemon);
        }
    });
}

function setupModal() {
    if (modalElement) return;

    modalElement = document.createElement('div');
    modalElement.className = 'pokedex-modal';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.innerHTML = `
        <div class="pokedex-modal__backdrop" data-modal-close></div>
        <div class="pokedex-modal__content" role="dialog" aria-modal="true">
            <button class="pokedex-modal__close" data-modal-close aria-label="Close">×</button>
            <div class="pokedex-modal__body" id="pokedexModalBody"></div>
        </div>
    `;

    document.body.appendChild(modalElement);
    modalBodyElement = document.getElementById('pokedexModalBody');

    modalElement.addEventListener('click', (event) => {
        if (event.target.hasAttribute('data-modal-close')) {
            closePokemonModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalElement.classList.contains('is-open')) {
            closePokemonModal();
        }
    });

    modalElement.addEventListener('click', (event) => {
        const evoTarget = event.target.closest('[data-evolution-name]');
        if (!evoTarget) return;

        const evoName = evoTarget.getAttribute('data-evolution-name');
        const targetPokemon = allPokemon.find(item => item && item.name.toLowerCase() === evoName);
        if (targetPokemon) {
            openPokemonModal(targetPokemon);
        }
    });
}

function openPokemonModal(pokemon) {
    if (!modalElement || !modalBodyElement) return;

    const evolutionItems = pokemon.evolutions.isBranching
        ? createBranchingEvolutionMarkup(pokemon.evolutions)
        : pokemon.evolutions.list
            .map(evo => createEvolutionButton(evo))
            .join('<span class="evolution-arrow">→</span>');

    const abilities = pokemon.abilities
        .map(ability => `<span class="ability-chip">${capitalize(ability)}</span>`)
        .join('');

    modalBodyElement.innerHTML = `
        <div class="modal-header">
            <img src="${pokemon.image}" alt="${pokemon.name}" class="modal-image">
            <div class="modal-title">
                <h2>${pokemon.name}</h2>
                <p class="modal-id">#${String(pokemon.id).padStart(4, '0')}</p>
                <div class="modal-types">
                    ${pokemon.types.map(type => `<span class="type-badge type-${type.toLowerCase()}">${capitalize(type)}</span>`).join('')}
                </div>
            </div>
        </div>
        <p class="modal-description">${pokemon.description}</p>
        <div class="modal-attributes">
            <div><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)}m</div>
            <div><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)}kg</div>
            <div><strong>Generation:</strong> ${formatGeneration(pokemon.generation)}</div>
        </div>
        <div class="modal-section">
            <h3>Abilities</h3>
            <div class="ability-list">${abilities}</div>
        </div>
        <div class="modal-section">
            <h3>Evolutions</h3>
            <div class="evolution-list">
                ${evolutionItems || '<span class="no-evolution">No evolutions</span>'}
            </div>
        </div>
    `;

    modalElement.classList.add('is-open');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closePokemonModal() {
    if (!modalElement) return;
    modalElement.classList.remove('is-open');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function extractEvolutionChain(chain) {
    const toNode = (node) => {
        const idMatch = node.species.url.match(/pokemon-species\/(\d+)\//);
        return {
            name: node.species.name,
            id: idMatch ? Number(idMatch[1]) : null
        };
    };

    const traverseLinear = (node) => {
        const list = [];
        let current = node;
        while (current && current.species) {
            list.push(toNode(current));
            current = current.evolves_to && current.evolves_to[0];
        }
        return list;
    };

    if (chain.evolves_to && chain.evolves_to.length > 1) {
        return {
            isBranching: true,
            root: toNode(chain),
            branches: chain.evolves_to.map(traverseLinear)
        };
    }

    return {
        isBranching: false,
        list: traverseLinear(chain)
    };
}

function createEvolutionButton(evo) {
    const targetPokemon = allPokemon.find(item => item && item.name.toLowerCase() === evo.name.toLowerCase());
    const evoImage = targetPokemon?.image || '';
    return `
        <button class="evolution-item" data-evolution-name="${evo.name.toLowerCase()}" aria-label="${evo.name}">
            <span class="evolution-circle">
                ${evoImage ? `<img src="${evoImage}" alt="${capitalize(evo.name)}" />` : evo.name.charAt(0).toUpperCase()}
            </span>
            <span class="evolution-name">${capitalize(evo.name)}</span>
        </button>
    `;
}

function createBranchingEvolutionMarkup(evolutionData) {
    const branchItems = evolutionData.branches
        .map(branch => branch[0])
        .filter(Boolean)
        .map(evo => createEvolutionButton(evo))
        .join('');

    return `
        <div class="evolution-branching">
            <div class="evolution-center">
                ${createEvolutionButton(evolutionData.root)}
            </div>
            <div class="evolution-branches">
                ${branchItems}
            </div>
        </div>
    `;
}

/**
 * Set up search and filter functionality
 */
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.value = searchTerm;
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            saveFilterState();
            applyFilters();
        });
    }

    buildFilters();
    restoreFilterState();
}

/**
 * Filter Pokemon based on search term
 * @param {string} searchTerm - The search term
 */
function applyFilters() {
    filteredPokemon = allPokemon.filter((pokemon) => {
        if (!pokemon) return false;

        const matchesSearch =
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.id.toString().includes(searchTerm);

        const matchesTypes = selectedTypes.size === 0
            ? true
            : Array.from(selectedTypes).every((type) => pokemon.types.includes(type));

        const matchesGeneration = selectedGenerations.size === 0
            ? true
            : selectedGenerations.has(pokemon.generation);

        return matchesSearch && matchesTypes && matchesGeneration;
    });

    renderPokedexGrid(filteredPokemon);
}

function buildFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;

    const types = new Set();
    const generations = new Set();

    allPokemon.forEach((pokemon) => {
        if (!pokemon) return;
        pokemon.types.forEach((type) => types.add(type));
        generations.add(pokemon.generation);
    });

    const typeOptions = Array.from(types).sort();
    const generationOptions = Array.from(generations).sort((a, b) => generationOrder(a) - generationOrder(b));

    filterContainer.innerHTML = `
        <div class="filter-group">
            <span class="filter-label">Types:</span>
            <div class="filter-options">
                ${typeOptions.map((type) => `
                    <label class="filter-option type-filter">
                        <input type="checkbox" value="${type}" data-filter="type" aria-label="${capitalize(type)}">
                        <span class="type-icon type-${type.toLowerCase()}" title="${capitalize(type)}"></span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="filter-group">
            <span class="filter-label">Generation:</span>
            <div class="filter-options">
                ${generationOptions.map((gen) => `
                    <label class="filter-option generation-filter">
                        <input type="checkbox" value="${gen}" data-filter="generation" aria-label="${formatGeneration(gen)}">
                        <span class="generation-pill">${formatGeneration(gen)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    filterContainer.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
            const { value } = e.target;
            const filterType = e.target.getAttribute('data-filter');

            if (filterType === 'type') {
                if (e.target.checked) {
                    selectedTypes.add(value);
                } else {
                    selectedTypes.delete(value);
                }
            }

            if (filterType === 'generation') {
                if (e.target.checked) {
                    selectedGenerations.add(value);
                } else {
                    selectedGenerations.delete(value);
                }
            }

            saveFilterState();
            applyFilters();
        });
    });
}

function saveFilterState() {
    const state = {
        searchTerm,
        types: Array.from(selectedTypes),
        generations: Array.from(selectedGenerations)
    };

    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
}

function restoreFilterState() {
    const savedState = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!savedState) return;

    try {
        const parsed = JSON.parse(savedState);
        searchTerm = parsed.searchTerm || '';

        selectedTypes.clear();
        (parsed.types || []).forEach(type => selectedTypes.add(type));

        selectedGenerations.clear();
        (parsed.generations || []).forEach(gen => selectedGenerations.add(gen));

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchTerm;
        }

        document.querySelectorAll('[data-filter="type"]').forEach((checkbox) => {
            checkbox.checked = selectedTypes.has(checkbox.value);
        });

        document.querySelectorAll('[data-filter="generation"]').forEach((checkbox) => {
            checkbox.checked = selectedGenerations.has(checkbox.value);
        });
    } catch (error) {
        console.warn('Failed to restore filter state:', error);
    }
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatGeneration(value) {
    return value.replace('generation-', 'Gen ').toUpperCase();
}

function generationOrder(value) {
    const order = {
        'generation-i': 1,
        'generation-ii': 2,
        'generation-iii': 3,
        'generation-iv': 4,
        'generation-v': 5,
        'generation-vi': 6,
        'generation-vii': 7,
        'generation-viii': 8,
        'generation-ix': 9
    };

    return order[value] || 999;
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.style.display = 'block';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * Show error message
 */
function showErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'block';
    }
}

/**
 * Hide error message
 */
function hideErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

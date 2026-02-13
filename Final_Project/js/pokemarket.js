/**
 * Pokemarket Module
 * Combines FakeStore and PokeAPI data for the shop page
 */

import { fetchData, debounce, log } from './utils.js';
import { getFakeStoreProducts } from './fakestore-api.js';
import { addToCart } from './cart.js';

const SHOP_DATA_URL = '../data/shop-items.json';

let shopItems = [];
let activeCategory = '';
let searchTerm = '';

export async function initShop() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const searchInput = document.getElementById('shopSearch');
    const categorySelect = document.getElementById('shopCategory');
    const refreshButton = document.getElementById('shopRefresh');

    if (searchInput) {
        searchInput.addEventListener('input', debounce((event) => {
            searchTerm = event.target.value.trim().toLowerCase();
            renderShopGrid();
        }, 200));
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (event) => {
            activeCategory = event.target.value;
            renderShopGrid();
        });
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', () => loadShopData());
    }

    grid.addEventListener('click', (event) => {
        const button = event.target.closest('[data-add-to-cart]');
        if (!button) return;
        const itemId = button.getAttribute('data-add-to-cart');
        const item = shopItems.find(entry => entry.id === itemId);
        if (item) {
            addToCart(item, 1);
            animateAddButton(button);
            animateCartIcon();
        }
    });

    await loadShopData();
}

async function loadShopData() {
    const loading = document.getElementById('shopLoading');
    const error = document.getElementById('shopError');

    try {
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';

        const shopData = await fetchData(SHOP_DATA_URL);
        const baseItems = Array.isArray(shopData.items) ? shopData.items : [];

        const fakeProducts = await getFakeStoreProducts({ limit: baseItems.length });

        const pokeDetails = await Promise.all(
            baseItems.map(item => fetchData(item.apiUrl))
        );

        shopItems = baseItems.map((item, index) =>
            buildShopItem(item, pokeDetails[index], fakeProducts[index])
        );

        populateCategories(getGameCategories(shopItems));
        renderShopGrid();
    } catch (loadError) {
        log(`Shop load failed: ${loadError.message}`, 'error');
        if (error) error.style.display = 'block';
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function buildShopItem(itemRef, pokeItem, fakeProduct) {
    const description = getPokeDescription(pokeItem);

    return {
        id: itemRef.id,
        name: itemRef.name || formatName(pokeItem?.name || itemRef.id),
        price: Number(itemRef.price) || 0,
        currency: itemRef.currency || 'P',
        category: getGameCategory(itemRef, pokeItem),
        description: description,
        image: pokeItem?.sprites?.default || fakeProduct?.image || '../images/placeholder.png',
        rating: fakeProduct?.rating?.rate || null,
        source: {
            pokeUrl: itemRef.apiUrl,
            fakeStoreId: fakeProduct?.id || null
        }
    };
}

function getPokeDescription(pokeItem) {
    if (!pokeItem) return 'A trusted item for trainers.';

    const effectEntry = pokeItem.effect_entries?.find(entry => entry.language.name === 'en');
    if (effectEntry?.short_effect) {
        return effectEntry.short_effect;
    }

    const flavorEntry = pokeItem.flavor_text_entries?.find(entry => entry.language.name === 'en');
    if (flavorEntry?.text) {
        return flavorEntry.text.replace(/\s+/g, ' ').trim();
    }

    return 'A trusted item for trainers.';
}

function populateCategories(categories) {
    const select = document.getElementById('shopCategory');
    if (!select || !Array.isArray(categories)) return;

    select.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

function renderShopGrid() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const filtered = shopItems.filter(item => {
        const matchesCategory = !activeCategory || item.category === activeCategory;
        const matchesSearch = !searchTerm
            || item.name.toLowerCase().includes(searchTerm)
            || item.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (!filtered.length) {
        grid.innerHTML = '<p class="no-results">No items found.</p>';
        return;
    }

    grid.innerHTML = filtered.map(item => createShopCard(item)).join('');
}

function createShopCard(item) {
    const rating = item.rating ? `<span class="shop-rating">${item.rating.toFixed(1)}★</span>` : '';

    return `
        <article class="shop-card">
            <div class="shop-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="shop-info">
                <div class="shop-header">
                    <h3>${item.name}</h3>
                    <span class="shop-price">${formatCoins(item.price, item.currency)}</span>
                </div>
                <p class="shop-category">${formatName(item.category)}</p>
                <p class="shop-description">${item.description}</p>
                <div class="shop-actions">
                    ${rating}
                    <button class="btn" data-add-to-cart="${item.id}" type="button">Add to Cart</button>
                </div>
            </div>
        </article>
    `;
}

function formatCoins(amount, currency) {
    return `${amount} ${currency}`;
}

function formatName(value) {
    if (!value) return '';
    return value
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getGameCategory(itemRef, pokeItem) {
    const name = (itemRef?.id || pokeItem?.name || '').toLowerCase();
    if (name.includes('ball')) {
        return 'Pokeball';
    }
    return 'Consumable';
}

function getGameCategories(items) {
    const categories = Array.from(
        new Set(items.map(item => item.category).filter(Boolean))
    );

    if (!categories.length) {
        return ['Pokeball', 'Consumable'];
    }

    const order = ['Pokeball', 'Consumable'];
    return categories.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

function animateCartIcon() {
    const cartLink = document.getElementById('cartLink');
    if (!cartLink) return;

    cartLink.classList.remove('cart-bump');
    void cartLink.offsetWidth;
    cartLink.classList.add('cart-bump');
    cartLink.addEventListener('animationend', () => {
        cartLink.classList.remove('cart-bump');
    }, { once: true });
}

function animateAddButton(button) {
    if (!button) return;
    button.classList.remove('is-added');
    void button.offsetWidth;
    button.classList.add('is-added');
    button.addEventListener('animationend', () => {
        button.classList.remove('is-added');
    }, { once: true });
}

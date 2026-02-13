/**
 * FakeStore API Module
 * Handles all interactions with the FakeStore API
 */

import { fetchData, log } from './utils.js';

const FAKESTORE_BASE = 'https://fakestoreapi.com';

/**
 * Fetch all categories
 * @returns {Promise<string[]>}
 */
export async function getFakeStoreCategories() {
    try {
        return await fetchData(`${FAKESTORE_BASE}/products/categories`);
    } catch (error) {
        log(`Error fetching FakeStore categories: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Fetch products
 * @param {Object} options
 * @param {number} options.limit
 * @param {string} options.category
 * @returns {Promise<Object[]>}
 */
export async function getFakeStoreProducts({ limit, category } = {}) {
    try {
        const endpoint = category
            ? `${FAKESTORE_BASE}/products/category/${encodeURIComponent(category)}`
            : `${FAKESTORE_BASE}/products`;

        const data = await fetchData(endpoint);
        if (limit) {
            return data.slice(0, limit);
        }
        return data;
    } catch (error) {
        log(`Error fetching FakeStore products: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Fetch a single product by id
 * @param {number} productId
 * @returns {Promise<Object>}
 */
export async function getFakeStoreProduct(productId) {
    try {
        return await fetchData(`${FAKESTORE_BASE}/products/${productId}`);
    } catch (error) {
        log(`Error fetching FakeStore product ${productId}: ${error.message}`, 'error');
        throw error;
    }
}

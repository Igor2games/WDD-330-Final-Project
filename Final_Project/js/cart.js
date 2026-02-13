/**
 * Cart Module
 * Handles cart state, totals, and storage
 */

const CART_STORAGE_KEY = 'pokemarketCart';
const ORDER_STORAGE_KEY = 'pokemarketOrder';

function readCart() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartItems() {
    return readCart();
}

export function addToCart(item, quantity = 1) {
    const items = readCart();
    const existing = items.find(entry => entry.id === item.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            currency: item.currency || 'P',
            image: item.image,
            quantity: quantity
        });
    }

    saveCart(items);
    return items;
}

export function removeFromCart(itemId) {
    const items = readCart().filter(item => item.id !== itemId);
    saveCart(items);
    return items;
}

export function updateCartQuantity(itemId, quantity) {
    const items = readCart();
    const target = items.find(item => item.id === itemId);
    if (!target) return items;

    const safeQuantity = Number.isFinite(quantity) ? Math.max(1, quantity) : 1;
    target.quantity = safeQuantity;
    saveCart(items);
    return items;
}

export function clearCart() {
    saveCart([]);
}

export function getCartSummary(taxRate = 0.07) {
    const items = readCart();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;

    return {
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        taxes,
        total
    };
}

export function saveOrderSummary(summary) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(summary));
}

export function getOrderSummary() {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

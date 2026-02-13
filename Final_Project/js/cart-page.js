/**
 * Cart Page Module
 * Renders cart items and handles checkout flow
 */

import { getCartSummary, removeFromCart, updateCartQuantity, saveOrderSummary } from './cart.js';

const TAX_RATE = 0.07;

export function initCartPage() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    const checkoutButton = document.getElementById('checkoutButton');

    cartContainer.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-item]');
        if (!removeButton) return;
        const itemId = removeButton.getAttribute('data-remove-item');
        removeFromCart(itemId);
        renderCart();
    });

    cartContainer.addEventListener('change', (event) => {
        const quantityInput = event.target.closest('[data-quantity]');
        if (!quantityInput) return;
        const itemId = quantityInput.getAttribute('data-quantity');
        const quantity = Number(quantityInput.value);
        updateCartQuantity(itemId, quantity);
        renderCart();
    });

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const summary = getCartSummary(TAX_RATE);
            saveOrderSummary({
                orderId: generateOrderId(),
                totalLabel: formatCoins(summary.total)
            });
            window.location.href = 'transaction-complete.html';
        });
    }

    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const summary = getCartSummary(TAX_RATE);

    if (!cartContainer || !emptyState) return;

    if (!summary.items.length) {
        cartContainer.innerHTML = '';
        emptyState.style.display = 'block';
        updateSummary(summary);
        return;
    }

    emptyState.style.display = 'none';
    cartContainer.innerHTML = summary.items.map(item => createCartItem(item)).join('');
    updateSummary(summary);
}

function createCartItem(item) {
    return `
        <article class="cart-item">
            <div class="cart-item__image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="cart-item__details">
                <h3>${item.name}</h3>
                <p class="cart-item__price">${formatCoins(item.price, item.currency)}</p>
                <label class="cart-item__qty">
                    Qty
                    <input type="number" min="1" value="${item.quantity}" data-quantity="${item.id}" />
                </label>
            </div>
            <button class="btn btn-secondary" type="button" data-remove-item="${item.id}">Remove</button>
        </article>
    `;
}

function updateSummary(summary) {
    const count = document.getElementById('cartItemCount');
    const subtotal = document.getElementById('cartSubtotal');
    const taxes = document.getElementById('cartTaxes');
    const total = document.getElementById('cartTotal');

    if (count) count.textContent = summary.itemCount;
    if (subtotal) subtotal.textContent = formatCoins(summary.subtotal);
    if (taxes) taxes.textContent = formatCoins(summary.taxes);
    if (total) total.textContent = formatCoins(summary.total);
}

function formatCoins(amount, currency = 'P') {
    return `${amount.toFixed(2)} ${currency}`;
}

function generateOrderId() {
    const seed = Math.floor(Math.random() * 1000000);
    return `#${String(seed).padStart(6, '0')}`;
}

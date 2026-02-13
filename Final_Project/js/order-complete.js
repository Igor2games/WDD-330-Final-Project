/**
 * Order Complete Module
 * Displays confirmation details for the last order
 */

import { getOrderSummary } from './cart.js';

export function initOrderComplete() {
    const orderIdElement = document.getElementById('orderId');
    const orderTotalElement = document.getElementById('orderTotal');
    if (!orderIdElement || !orderTotalElement) return;

    const summary = getOrderSummary();
    if (!summary) return;

    orderIdElement.textContent = summary.orderId || orderIdElement.textContent;
    orderTotalElement.textContent = summary.totalLabel || orderTotalElement.textContent;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  initShippingMethod();
});

function renderCheckoutSummary() {
  const itemsContainer = document.querySelector('.order-items');
  const totalsEl = document.querySelector('.totals');

  if (!itemsContainer) {
    console.warn('Order items container not found on pickup checkout page');
    return;
  }

  let items = [];
  try {
    items = JSON.parse(localStorage.getItem('checkoutItems') || '[]');
  } catch (e) {
    items = [];
  }

  // Fallback to entire cart if no explicitly selected items are found
  if (!items || items.length === 0) {
    try {
      items = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
      items = [];
    }
  }

  // Render items
  itemsContainer.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'order-item';
    empty.innerHTML = `
      <div class="order-info" style="grid-column: 1 / -1;">
        <div class="order-name">No items</div>
        <div class="order-meta">Your checkout selection is empty.</div>
      </div>`;
    itemsContainer.appendChild(empty);
  } else {
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'order-item';
      const totalPrice = (Number(item.price) * Number(item.quantity || 1)) || 0;
      li.innerHTML = `
        <img class="order-thumb" src="${item.image}" alt="${item.name}">
        <div class="order-info">
          <div class="order-name">${item.name}</div>
          <div class="order-meta">x${item.quantity || 1}</div>
        </div>
        <div class="order-price">$${totalPrice.toFixed(2)}</div>
      `;
      itemsContainer.appendChild(li);
    });
  }

  // Update totals (Subtotal, Shipping, Discount, Total)
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
  const shipping = 0; // Pickup shipping is free
  const discount = items.length > 0 ? 0 : 0; // Fixed demo discount, mirrors cart summary
  const total = subtotal + shipping - discount;

  if (totalsEl) {
    const subtotalSpan = totalsEl.querySelector('.row:not(.discount):not(.shipping):not(.total) span:last-child');
    const discountSpan = totalsEl.querySelector('.row.discount span:last-child');
    const shippingSpan = totalsEl.querySelector('.row.shipping span:last-child');
    const totalSpan = totalsEl.querySelector('.row.total span:last-child');
    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    if (discountSpan) discountSpan.textContent = `-$${discount.toFixed(2)}`;
    if (shippingSpan) shippingSpan.textContent = `$${shipping.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
  }
}

function initShippingMethod() {
  const optionCards = document.querySelectorAll('.method-options .method-card');
  if (!optionCards || optionCards.length === 0) return;

  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const method = card.dataset.method;
      optionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      try { localStorage.setItem('checkoutMethod', method); } catch (e) {}

      if (method === 'standard') {
        // Navigate to shipping checkout page
        window.location.href = 'shop_checkout_ship.html';
      }
    });
  });
}
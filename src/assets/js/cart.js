// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
});

function initCartPage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  renderCartItems(cart);
  renderCartSummary(cart);
}

function renderCartItems(cart) {
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="item-image" />
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="item-controls">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function renderCartSummary(cart) {
  const cartSummaryContainer = document.getElementById('cartSummary');
  
  if (cart.length === 0) {
    cartSummaryContainer.innerHTML = '';
    return;
  }

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  cartSummaryContainer.innerHTML = `
    <h3 class="summary-title">Order Summary</h3>
    <div class="summary-row">
      <span class="summary-label">Subtotal (${cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
      <span class="summary-value">$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Shipping</span>
      <span class="summary-value">${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Tax</span>
      <span class="summary-value">$${tax.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Total</span>
      <span class="summary-value">$${total.toFixed(2)}</span>
    </div>
    <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
  `;
}

function updateQuantity(itemId, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(item => item.id === itemId);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== itemId);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems(cart);
    renderCartSummary(cart);
    updateCartButton();
  }
}

function removeItem(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item.id !== itemId);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems(cart);
  renderCartSummary(cart);
  updateCartButton();
}

function checkout() {
  alert('Checkout functionality would be implemented here. This would typically redirect to a payment page.');
}

function updateCartButton() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
  
  if (cartBtn) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartBtn.setAttribute('data-count', count);
    
    // Add count badge if items exist
    if (count > 0) {
      let badge = cartBtn.querySelector('.count-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'count-badge';
        badge.style.cssText = `
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        `;
        cartBtn.appendChild(badge);
      }
      badge.textContent = count;
    } else {
      const badge = cartBtn.querySelector('.count-badge');
      if (badge) badge.remove();
    }
  }
}

// Initialize cart button state
updateCartButton();

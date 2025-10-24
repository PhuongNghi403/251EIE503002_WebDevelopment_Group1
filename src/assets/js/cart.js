// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
  initCartEventListeners();
  initGlobalCartListeners();
});

function initCartPage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  renderCartItems(cart);
  renderCartSummary(cart);
  initCartSelectionListeners();
}

function renderCartItems(cart) {
  const cartItemsContainer = document.querySelector('.cart-items');
  
  if (!cartItemsContainer) {
    console.warn('Cart items container not found');
    return;
  }
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <tr class="empty-cart-row">
        <td colspan="7" class="empty-cart">
          <div class="empty-cart-content">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <tr class="cart-item" data-item-id="${item.id}">
      <td class="item-checkbox">
        <input type="checkbox" id="item${index + 1}" checked>
        <label for="item${index + 1}"></label>
      </td>
      <td class="item-info-cell">
        <div class="item-info">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
          </div>
        </div>
      </td>
      <td class="unit-price">$${item.price.toFixed(2)}</td>
      <td class="quantity-cell">
        <div class="quantity-selector">
          <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </td>
      <td class="variant-cell">
        <div class="variant-selector">
          <select class="variant-dropdown">
            <option value="10kg">10kg</option>
            <option value="5kg">5kg</option>
            <option value="15kg">15kg</option>
          </select>
        </div>
      </td>
      <td class="item-total">$${(item.price * item.quantity).toFixed(2)}</td>
      <td class="delete-cell">
        <button class="delete-btn" onclick="removeItem(${item.id})" aria-label="Remove item">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#FF0000" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

  // Bind selection listeners after rendering
  initCartSelectionListeners();
}

function getSelectedCartItems(cart) {
  const checkedBoxes = document.querySelectorAll('.cart-item input[type="checkbox"]:checked');
  const selectedIds = new Set(Array.from(checkedBoxes).map(cb => parseInt(cb.closest('.cart-item').dataset.itemId)));
  return cart.filter(item => selectedIds.has(item.id));
}

function initCartSelectionListeners() {
  const selectAll = document.getElementById('selectAll');
  const itemCheckboxes = document.querySelectorAll('.cart-item input[type="checkbox"]');

  if (selectAll) {
    selectAll.addEventListener('change', (e) => {
      const checked = e.target.checked;
      itemCheckboxes.forEach(cb => cb.checked = checked);
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      renderCartSummary(cart);
    });
  }

  itemCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const allCount = document.querySelectorAll('.cart-item input[type="checkbox"]').length;
      const checkedCount = document.querySelectorAll('.cart-item input[type="checkbox"]:checked').length;
      if (selectAll) selectAll.checked = allCount > 0 && checkedCount === allCount;
      renderCartSummary(cart);
    });
  });
}

function renderCartSummary(cart) {
  const selectedItemsSpan = document.querySelector('.selected-items');
  const subtotalSpan = document.querySelector('.price-row .price-value');
  const discountSpan = document.querySelector('.price-row.discount .price-value');
  const totalSpan = document.querySelector('.price-row.total .price-value');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  if (cart.length === 0) {
    if (selectedItemsSpan) selectedItemsSpan.textContent = 'Selected (0 items)';
    if (subtotalSpan) subtotalSpan.textContent = '$0.00';
    if (discountSpan) discountSpan.textContent = '-$0.00';
    if (totalSpan) totalSpan.textContent = '$0.00';
    return;
  }

  const selectedCart = getSelectedCartItems(cart);
  const subtotal = selectedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = selectedCart.length > 0 ? 20 : 0; // Fixed discount for demo when items selected
  const total = subtotal - discount;

  if (selectedItemsSpan) {
    const totalItems = selectedCart.reduce((total, item) => total + item.quantity, 0);
    selectedItemsSpan.textContent = `Selected (${totalItems} items)`;
  }
  
  if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  if (discountSpan) discountSpan.textContent = `-$${discount.toFixed(2)}`;
  if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
  
  if (checkoutBtn) {
    checkoutBtn.onclick = checkout;
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const selectedCart = getSelectedCartItems(cart);
  if (selectedCart.length === 0) {
    alert('Please select at least one item to proceed to payment.');
    return;
  }
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  if (!isLoggedIn) {
    alert('Please login or sign up to proceed with checkout.');
    window.location.href = 'login-signup.html';
    return;
  }
  
  alert('Redirecting to payment page with selected items...');
  // window.location.href = 'checkout.html';
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
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cart, action: 'update', itemId }
    }));
  }
}

function removeItem(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const removedItem = cart.find(item => item.id === itemId);
  cart = cart.filter(item => item.id !== itemId);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems(cart);
  renderCartSummary(cart);
  updateCartButton();
  
  // Show notification
  if (removedItem) {
    showNotification(`${removedItem.name} removed from cart`, 'info');
  }
  
  // Dispatch cart update event
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'remove', itemId }
  }));
}

function checkout() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  if (!isLoggedIn) {
    alert('Please login or sign up to proceed with checkout.');
    window.location.href = 'login-signup.html';
    return;
  }
  
  // Proceed with checkout
  alert('Redirecting to payment page...');
  // window.location.href = 'checkout.html';
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

// Initialize cart event listeners
function initCartEventListeners() {
  // Handle add to cart buttons in recommendations
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = btn.closest('.recommendation-card');
      const productName = card.querySelector('.card-title').textContent;
      const productImage = card.querySelector('img').src;
      const productPrice = parseFloat(card.querySelector('.card-price').textContent.replace('$', ''));
      
      // Add to cart
      addToCart(productName, productImage, productPrice);
      
      // Show success message
      showNotification(`${productName} added to cart!`, 'success');
    });
  });
  
  // Handle wishlist buttons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = btn.closest('.recommendation-card');
      const productName = card.querySelector('.card-title').textContent;
      const productImage = card.querySelector('img').src;
      
      addToWishlist(productName, productImage);
    });
  });
}




// Initialize global cart listeners
function initGlobalCartListeners() {
  // Listen for cart updates from other pages
  window.addEventListener('cartUpdated', (event) => {
    const { cart, action, productName } = event.detail;
    
    // Refresh cart display if we're on cart page
    if (document.body.dataset.page === 'cart') {
      renderCartItems(cart);
      renderCartSummary(cart);
    }
    
    updateCartButton();
  });
  
  // Listen for cart count updates
  window.addEventListener('cartCountUpdated', (event) => {
    updateCartButton();
  });
  
  // Listen for storage changes (cross-tab communication)
  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      const cart = JSON.parse(event.newValue || '[]');
      if (document.body.dataset.page === 'cart') {
        renderCartItems(cart);
        renderCartSummary(cart);
      }
      updateCartButton();
    }
  });
}

// Initialize cart button state
updateCartButton();


// Global add to cart function
function addToCart(productName, productImage, price = 0) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: productName,
      image: productImage,
      price: price,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  if (typeof updateCartButton === 'function') {
    updateCartButton();
  }
  
  // Dispatch cart update event
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'add', productName }
  }));
}

// Global add to wishlist function
function addToWishlist(productName, productImage, category = 'General') {
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const existingItem = wishlist.find(item => item.name === productName);
  
  if (!existingItem) {
    wishlist.push({
      id: Date.now(),
      name: productName,
      image: productImage,
      category: category,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    if (typeof updateWishlistButton === 'function') {
      updateWishlistButton();
    }
    
    showNotification(`${productName} added to favorites!`, 'success');
    
    // Dispatch wishlist update event
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { wishlist, action: 'add', productName }
    }));
  } else {
    showNotification(`${productName} is already in your favorites!`, 'info');
  }
}

// Update wishlist button with count badge
function updateWishlistButton() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishlistBtn = document.querySelector('.icon-btn[aria-label="Wishlist"]');
  
  if (wishlistBtn) {
    const count = wishlist.length;
    wishlistBtn.setAttribute('data-count', count);
    
    if (count > 0) {
      let badge = wishlistBtn.querySelector('.count-badge');
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
        wishlistBtn.appendChild(badge);
      }
      badge.textContent = count;
    } else {
      const badge = wishlistBtn.querySelector('.count-badge');
      if (badge) badge.remove();
    }
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#88BAFF'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-family: 'Lexend Deca', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

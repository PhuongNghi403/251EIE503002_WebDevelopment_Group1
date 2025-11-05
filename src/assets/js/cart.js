// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
  initCartEventListeners();
  initGlobalCartListeners();
  initItemTitleNavigation();
  initRecommendations();

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" class="icon-trash">
            <!-- Nắp thùng -->
            <path d="M3 6H21" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
                  stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>

            <!-- Thân thùng -->
            <rect x="5" y="6" width="14" height="15" rx="1.5"
                  stroke="#FF0000" stroke-width="2"/>

            <!-- Hai thanh dọc bên trong -->
            <path d="M10 10V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 10V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
          </svg>

        </button>
      </td>
    </tr>
  `).join('');

  // Bind selection listeners after rendering
  initCartSelectionListeners();

  // Make product titles look clickable
  cartItemsContainer.querySelectorAll('.item-name').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'View product details';
  });
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

// Navigate to product detail when clicking a product title in cart
function initItemTitleNavigation() {
  // Avoid duplicate bindings
  if (document.body.dataset.cartTitleNavBound === 'true') return;
  document.body.dataset.cartTitleNavBound = 'true';

  document.addEventListener('click', (e) => {
    if (document.body.dataset.page !== 'cart') return;
    const titleEl = e.target.closest('.item-name');
    if (!titleEl) return;

    e.preventDefault();
    e.stopPropagation();

    const name = (titleEl.textContent || '').trim();
    if (!name) return;

    // Try to resolve product id from window.PRODUCTS_DATA
    let idParam = '';
    try {
      const catalog = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const target = norm(name);
      const match = catalog.find(p => norm(p.name) === target) ||
                    catalog.find(p => norm(p.name).includes(target)) ||
                    catalog.find(p => target.includes(norm(p.name)));
      if (match && match.id) idParam = String(match.id);
    } catch (_) {}

    let href = 'product_detail.html';
    if (idParam) {
      href += `?id=${encodeURIComponent(idParam)}`;
    } else {
      href += `?name=${encodeURIComponent(name)}`;
    }
    window.location.href = href;
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
  const discount = selectedCart.length > 0 ? 0 : 0; // Fixed discount for demo when items selected
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
  // Persist selected items for checkout summary
  try {
    localStorage.setItem('checkoutItems', JSON.stringify(selectedCart));
  } catch (e) {
    console.warn('Failed to store checkout items:', e);
  }
  // Redirect directly to pickup checkout page (no login required)
  window.location.href = 'shop_checkout/shop_checkout_pickup.html';
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
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const selectedCart = getSelectedCartItems(cart);
  if (selectedCart.length === 0) {
    alert('Please select at least one item to proceed to payment.');
    return;
  }
  // Persist selected items for checkout summary
  try {
    localStorage.setItem('checkoutItems', JSON.stringify(selectedCart));
  } catch (e) {
    console.warn('Failed to store checkout items:', e);
  }
  // Redirect directly to pickup checkout page (no login required)
  window.location.href = 'shop_checkout/shop_checkout_pickup.html';
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
function addToWishlist(productName, productImage, category = 'General', price = 0) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const existingItem = wishlist.find(item => item.name === productName);
  
  if (!existingItem) {
    wishlist.push({
      id: Date.now(),
      name: productName,
      image: productImage,
      category: category,
      price: Number(price) || 0,
      originalPrice: Number(price) || 0,
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
/********************
 * AI RECOMMENDATIONS
 ********************/
function getCurrentCartInfoFromDOM() {
  const rows = document.querySelectorAll('.cart-table tbody tr');
  const items = [];
  rows.forEach(tr => {
    const slug = tr.getAttribute('data-slug') || tr.dataset.slug || ''; // bạn set data-slug ở <tr>
    const type = tr.getAttribute('data-type') || tr.dataset.type || '';
    const category = tr.getAttribute('data-category') || tr.dataset.category || '';
    const brand = tr.getAttribute('data-brand') || tr.dataset.brand || '';
    const qty = parseInt(tr.getAttribute('data-qty') || tr.dataset.qty || '1', 10) || 1;
    if (slug) items.push({ slug, type, category, brand, qty });
  });
  return items;
}

// helper: save/load lịch sử type gần nhất để fallback khi giỏ trống
const LAST_TYPES_KEY = 'pc_last_cart_types';

function saveLastTypes(typesSet) {
  try {
    localStorage.setItem(LAST_TYPES_KEY, JSON.stringify([...typesSet]));
  } catch {}
}

function loadLastTypes() {
  try {
    const raw = localStorage.getItem(LAST_TYPES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

// chấm điểm ứng viên theo độ liên quan
function scoreProduct(p, signals) {
  // signals: { types:Set, categories:Set, brands:Set, inCart:Set }
  if (signals.inCart.has(p.slug)) return -1e9; // loại nếu đã trong giỏ

  let s = 0;
  if (signals.types.has(p.type)) s += 3;
  if (signals.categories.has(p.category)) s += 2;
  if (signals.brands.has(p.brand)) s += 1;

  // Jitter nhỏ để tránh thứ tự cố định:
  s += Math.random() * 0.2;

  return s;
}

// chọn N món gợi ý từ PRODUCTS_DATA theo signals
function pickRecommendations(products, signals, limit = 4) {
  const scored = products
    .filter(p => p && p.slug && p.name) // sanity
    .map(p => ({ p, score: scoreProduct(p, signals) }))
    .filter(x => x.score > -1e8);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.p);
}

// render theo HTML bạn đã dùng sẵn (giữ class để khớp CSS)
function renderRecommendationsGrid(products) {
  const grid = document.querySelector('.recommendations-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const toCard = (item) => {
    // Normalize price from PRODUCTS_DATA which uses an object { current, original, currency }
    const currentPriceNum = (typeof item.price === 'object')
      ? Number(item.price?.current ?? item.price?.discounted ?? item.price?.original ?? 0)
      : Number(item.price ?? 0);
    const price = `$${(currentPriceNum || 0).toFixed(2)}`;
    const img = item.image || item.banner || item.thumbnail || '../assets/images/placeholder.svg';
    const safeName = (item.name || '').replace(/"/g,'&quot;');

    const card = document.createElement('div');
    card.className = 'recommendation-card';

    card.innerHTML = `
      <div class="card-image">
        <img src="${img}" alt="${item.name}"/>
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <div class="card-actions">
          <span class="card-price">${price}</span>
          <div class="card-buttons">
            <button class="wishlist-btn" aria-label="Add to Wishlist" data-name="${safeName}" data-image="${img}" data-price="${currentPriceNum}" data-category="${item.category || 'General'}">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#6B6358" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button class="add-to-cart-btn" data-name="${safeName}" data-image="${img}" data-price="${currentPriceNum}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    return card;
  };

  // chỉ hiển thị đúng 4 card ngang như bạn yêu cầu
  const show = products.slice(0, 4);
  show.forEach(p => grid.appendChild(toCard(p)));

  // Attach add-to-cart handler using the unified signature addToCart(name, image, price)
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.getAttribute('data-name') || '';
      const image = btn.getAttribute('data-image') || '';
      const price = parseFloat(btn.getAttribute('data-price') || '0') || 0;
      if (typeof addToCart === 'function') {
        addToCart(name, image, price);
        showNotification(`${name} added to cart!`, 'success');
      } else {
        console.info('[recommendations] addToCart missing. Clicked:', name);
      }
    });
  });

  // Attach wishlist handler to add favorites from recommendations
  grid.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const name = btn.getAttribute('data-name') || '';
      const image = btn.getAttribute('data-image') || '';
      const category = btn.getAttribute('data-category') || 'General';
      const price = parseFloat(btn.getAttribute('data-price') || '0') || 0;
      if (typeof addToWishlist === 'function') {
        addToWishlist(name, image, category, price);
        showNotification(`${name} added to favorites!`, 'success');
      } else {
        console.info('[recommendations] addToWishlist missing. Clicked:', name);
      }
    });
  });
}

// main: cập nhật gợi ý
function updateRecommendationsFromProducts(limit = 4) {
  const all = (window.PRODUCTS_DATA || []).slice();
  if (!all.length) {
    console.warn('[recommendations] PRODUCTS_DATA is empty or not loaded.');
    return;
  }

  // lấy giỏ hiện tại
  const cartItems = getCurrentCartInfoFromDOM();
  const inCartSlugs = new Set(cartItems.map(x => x.slug).filter(Boolean));

  // tạo signals
  let typeSet = new Set(cartItems.map(x => x.type).filter(Boolean));
  let categorySet = new Set(cartItems.map(x => x.category).filter(Boolean));
  let brandSet = new Set(cartItems.map(x => x.brand).filter(Boolean));

  // nếu giỏ trống: dùng loại gần nhất trong lịch sử
  if (inCartSlugs.size === 0) {
    const lastTypes = loadLastTypes();
    if (lastTypes.length) {
      typeSet = new Set(lastTypes);
    } else {
      // fallback: nếu chưa có lịch sử, lấy 1-2 type phổ biến nhất trong PRODUCTS_DATA
      const typeCount = {};
      all.forEach(p => { typeCount[p.type] = (typeCount[p.type] || 0) + 1; });
      const topTypes = Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
      typeSet = new Set(topTypes);
    }
  } else {
    // lưu loại hiện tại để lần sau giỏ trống còn biết đường recommend
    saveLastTypes(typeSet);
  }

  const signals = {
    types: typeSet,
    categories: categorySet,
    brands: brandSet,
    inCart: inCartSlugs
  };

  const picked = pickRecommendations(all, signals, Math.max(4, limit));
  renderRecommendationsGrid(picked);
}

// Gọi khi trang sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  updateRecommendationsFromProducts(8); // cho rộng tập chọn rồi render 4 card
});
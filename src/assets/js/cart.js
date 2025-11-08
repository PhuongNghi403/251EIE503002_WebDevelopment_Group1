// =======================
// Cart & Wishlist (clean)
// =======================

// Boot
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
  initCartSelectionListeners();
  initItemTitleNavigation();
  initGlobalCartListeners();

  // Recommendations
  updateRecommendationsFromProducts(8); // pick rộng rồi render 4

  // Badges
  updateCartButton();
  updateWishlistButton();

  // Delegation cho wishlist (1 nơi duy nhất)
  bindWishlistDelegation();

  // Khôi phục trạng thái active của các nút tim
  hydrateWishlistButtons();
});

// --------------------
// Cart render & logic
// --------------------
function initCartPage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  // hydrate previously applied discount (if any and still valid)
  try {
    const saved = (localStorage.getItem('appliedDiscountCode') || '').trim().toUpperCase();
    if (saved && window.findDiscount) {
      const d = window.findDiscount(saved);
      window.__APPLIED_DISCOUNT__ = d || null;
    }
  } catch (_) { window.__APPLIED_DISCOUNT__ = null; }

  renderCartItems(cart);
  renderCartSummary(cart);
  bindDiscountControls();
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
            <path d="M3 6H21" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
                  stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
            <rect x="5" y="6" width="14" height="15" rx="1.5" stroke="#FF0000" stroke-width="2"/>
            <path d="M10 10V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 10V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

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

// Click product title in cart -> navigate to detail
function initItemTitleNavigation() {
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

    // Try resolve product id from window.PRODUCTS_DATA
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
    href += idParam ? `?id=${encodeURIComponent(idParam)}` : `?name=${encodeURIComponent(name)}`;
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
    if (discountSpan) { discountSpan.textContent = '-$0.00'; discountSpan.classList.remove('applied'); }
    if (totalSpan) totalSpan.textContent = '$0.00';
    return;
  }

  const selectedCart = getSelectedCartItems(cart);
  const subtotal = selectedCart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // compute discount based on applied code (persisted in window.__APPLIED_DISCOUNT__)
  let discount = 0;
  const applied = window.__APPLIED_DISCOUNT__ || null;
  if (applied && subtotal > 0) {
    discount = applied.type === 'percent' ? subtotal * (Number(applied.value) || 0) / 100 : (Number(applied.value) || 0);
    if (!isFinite(discount) || discount < 0) discount = 0;
    if (discount > subtotal) discount = subtotal;
  }
  const total = Math.max(0, subtotal - discount);

  if (selectedItemsSpan) {
    const totalItems = selectedCart.reduce((total, item) => total + item.quantity, 0);
    selectedItemsSpan.innerHTML = `<strong>Selected</strong> (${totalItems} items)`; // ✅ dùng innerHTML
  }

  if (subtotalSpan) subtotalSpan.textContent = `${subtotal.toFixed(2)}`;
  if (discountSpan) {
    discountSpan.textContent = `-${discount.toFixed(2)}`;
    discountSpan.classList.toggle('applied', discount > 0);
  }
  if (totalSpan) totalSpan.textContent = `${total.toFixed(2)}`;

  if (checkoutBtn) checkoutBtn.onclick = checkout;
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const selectedCart = getSelectedCartItems(cart);
  if (selectedCart.length === 0) {
    alert('Please select at least one item to proceed to payment.');
    return;
  }
  try {
    localStorage.setItem('checkoutItems', JSON.stringify(selectedCart));
  } catch (e) {
    console.warn('Failed to store checkout items:', e);
  }
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

  if (removedItem) {
    showNotification(`${removedItem.name} removed from cart`, 'info');
  }

  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'remove', itemId }
  }));
}

function updateCartButton() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');

  if (!cartBtn) return;

  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartBtn.setAttribute('data-count', count);

  if (count > 0) {
    let badge = cartBtn.querySelector('.count-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'count-badge';
      badge.style.cssText = `
        position: absolute; top: -5px; right: -5px;
        background: #ff4757; color: white; border-radius: 50%;
        width: 18px; height: 18px; font-size: 12px; display: flex;
        align-items: center; justify-content: center; font-weight: bold;
      `;
      cartBtn.appendChild(badge);
    }
    badge.textContent = count;
  } else {
    const badge = cartBtn.querySelector('.count-badge');
    if (badge) badge.remove();
  }
}

// ---------------------------
// Global listeners & storage
// ---------------------------
function initGlobalCartListeners() {
  window.addEventListener('cartUpdated', () => {
    if (document.body.dataset.page === 'cart') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      renderCartItems(cart);
      renderCartSummary(cart);
    }
    updateCartButton();
  });

  window.addEventListener('cartCountUpdated', () => {
    updateCartButton();
  });

  window.addEventListener('storage', (event) => {
    // Cross-tab sync
    if (event.key === 'cart') {
      const cart = JSON.parse(event.newValue || '[]');
      if (document.body.dataset.page === 'cart') {
        renderCartItems(cart);
        renderCartSummary(cart);
      }
      updateCartButton();
    }
    if (event.key === 'wishlist') {
      hydrateWishlistButtons();
      updateWishlistButton();
    }
  });
}

// ----------------
// Add to cart API
// ----------------
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
      price: Number(price) || 0,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();

  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'add', productName }
  }));
}

// --------------------
// Wishlist API (clean)
// --------------------
function addToWishlist(productName, productImage, category = 'General', price = 0, idKey = '') {
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

  // Khóa so khớp ổn định: ưu tiên idKey, fallback name chuẩn hóa
  const key = idKey || normName(productName);
  const index = wishlist.findIndex(it => (it.idKey || normName(it.name)) === key);

  // helper: bật/tắt active theo key (an toàn với tên có ký tự đặc biệt)
  const setButtonsActiveByKey = (active) => {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const bKey = btn.getAttribute('data-id') || normName(btn.getAttribute('data-name') || '');
      if (bKey === key) btn.classList.toggle('active', !!active);
    });
  };

  if (index === -1) {
    // CHƯA CÓ → THÊM
    wishlist.push({
      id: Date.now(),
      idKey: key,
      name: productName,
      image: productImage,
      category,
      price: Number(price) || 0,
      originalPrice: Number(price) || 0,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistButton();
    showNotification(`${productName} added to favorites!`, 'success');

    setButtonsActiveByKey(true);

    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { wishlist, action: 'add', productName, idKey: key }
    }));
    return true; // ADDED
  } else {
    // ĐÃ CÓ → XÓA
    const removed = wishlist.splice(index, 1)[0];
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistButton();
    showNotification(`${removed?.name || productName} removed from favorites!`, 'info');

    setButtonsActiveByKey(false);

    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { wishlist, action: 'remove', productName, idKey: key }
    }));
    return false; // REMOVED
  }
}

function updateWishlistButton() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishlistBtn = document.querySelector('.icon-btn[aria-label="Wishlist"]');
  if (!wishlistBtn) return;

  const count = wishlist.length;
  wishlistBtn.setAttribute('data-count', count);

  if (count > 0) {
    let badge = wishlistBtn.querySelector('.count-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'count-badge';
      badge.style.cssText = `
        position: absolute; top: -5px; right: -5px;
        background: #ff4757; color: white; border-radius: 50%;
        width: 18px; height: 18px; font-size: 12px; display: flex;
        align-items: center; justify-content: center; font-weight: bold;
      `;
      wishlistBtn.appendChild(badge);
    }
    badge.textContent = count;
  } else {
    const badge = wishlistBtn.querySelector('.count-badge');
    if (badge) badge.remove();
  }
}

// Delegation cho .wishlist-btn (tránh lặp bind ở nhiều nơi)
function bindWishlistDelegation() {
  // tránh bind nhiều lần
  if (document.body.dataset.wishBound === '1') return;
  document.body.dataset.wishBound = '1';

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const name = btn.getAttribute('data-name') || '';
    const image = btn.getAttribute('data-image') || '';
    const category = btn.getAttribute('data-category') || 'General';
    const price = parseFloat(btn.getAttribute('data-price') || '0') || 0;
    const idKey = btn.getAttribute('data-id') || ''; // nếu bạn có slug/id thì set data-id trên HTML

    const added = addToWishlist(name, image, category, price, idKey);
    // set trạng thái đúng theo toggle
    btn.classList.toggle('active', added);

  });

  // nghe sự kiện cross-tab / nội bộ để đồng bộ lại
  window.addEventListener('wishlistUpdated', hydrateWishlistButtons);
  window.addEventListener('storage', (e) => {
    if (e.key === 'wishlist') hydrateWishlistButtons();
  });
}
// === Wishlist helpers (ADD THIS) ===
function normName(s){
  return (s || '').trim().replace(/\s+/g,' ').toLowerCase();
}
function getWishlistKeySet(){
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {}
  // Ưu tiên idKey nếu có, fallback theo tên đã normalize
  return new Set(list.map(it => it.idKey || normName(it.name)));
}
// Đồng bộ trạng thái active cho tất cả nút tim
function hydrateWishlistButtons() {
  const set = getWishlistKeySet();
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    // nếu có data-id thì ưu tiên, không thì dùng name chuẩn hóa
    const idKey = btn.getAttribute('data-id') || '';
    const nameKey = normName(btn.getAttribute('data-name') || '');
    const key = idKey || nameKey;
    if (!key) return;
    if (set.has(key)) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}
function initWishlistObserver() {
  const mo = new MutationObserver((muts) => {
    // chỉ cần có .wishlist-btn mới là hydrate lại
    for (const m of muts) {
      if ([...m.addedNodes].some(n => n.nodeType === 1 && (n.matches?.('.wishlist-btn') || n.querySelector?.('.wishlist-btn')))) {
        hydrateWishlistButtons();
        break;
      }
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
}

// --- Khởi chạy (gọi sớm sau DOMContentLoaded) ---
window.addEventListener('DOMContentLoaded', () => {
  bindWishlistDelegation();
  hydrateWishlistButtons();     // lần đầu
  initWishlistObserver();       // theo dõi render động
});
// ----------------------
// Discount Input Binding
// ----------------------
function bindDiscountControls() {
  const input = document.querySelector('.discount-code .code-input');
  const btn = document.getElementById('applyDiscountBtn');
  if (!input || !btn) return;

  // initialize state of button (enable when input has any letters)
  const syncBtn = () => {
    const hasLetters = /[A-Za-z]/.test((input.value || '').trim());
    btn.disabled = !hasLetters;
    btn.classList.toggle('active', hasLetters && !btn.disabled);
  };
  syncBtn();

  input.addEventListener('input', syncBtn);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const raw = (input.value || '').trim();
    if (!/[A-Za-z]/.test(raw)) return; // still guard

    const code = raw.toUpperCase();
    if (typeof window.findDiscount === 'function') {
      const found = window.findDiscount(code);
      if (found) {
        window.__APPLIED_DISCOUNT__ = found;
        try { localStorage.setItem('appliedDiscountCode', code); } catch {}
        if (typeof window.validateDiscount === 'function') {
          window.validateDiscount(code); // will show success toast
        }
        // re-render summary with discount applied
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        renderCartSummary(cart);
      } else {
        window.__APPLIED_DISCOUNT__ = null;
        try { localStorage.removeItem('appliedDiscountCode'); } catch {}
        // notify invalid
        if (typeof showNotification === 'function') {
          showNotification(`Code "${code}" is invalid or expired.`, 'error');
        }
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        renderCartSummary(cart);
      }
    }
  });
}

// ----------------------
// Discount Codes API 💸
// ----------------------
function saveDiscountCode(code, discountValue, type = 'percent', expires = null) {
  let discounts = JSON.parse(localStorage.getItem('discountCodes') || '[]');
  code = (code || '').trim().toUpperCase();
  const exists = discounts.find(d => d.code === code);
  if (!exists) {
    discounts.push({
      code,
      value: Number(discountValue) || 0,
      type,       // 'percent' | 'fixed'
      expires,    // ISO string hoặc null
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('discountCodes', JSON.stringify(discounts));
  }
  window.dispatchEvent(new CustomEvent('discountUpdated', { detail: { discounts } }));
}

function getDiscountCodes() {
  try { return JSON.parse(localStorage.getItem('discountCodes') || '[]'); }
  catch { return []; }
}

function removeDiscountCode(code) {
  code = (code || '').trim().toUpperCase();
  const discounts = getDiscountCodes().filter(d => d.code !== code);
  localStorage.setItem('discountCodes', JSON.stringify(discounts));
  window.dispatchEvent(new CustomEvent('discountUpdated', { detail: { discounts } }));
}

// Tính tiền sau giảm dựa trên code đầu tiên (bạn có thể mở rộng nhiều code)
function applyDiscountToTotal(subtotal) {
  const discounts = getDiscountCodes();
  if (!discounts.length) return { total: subtotal, discount: 0 };

  const d = discounts[0];
  let discountAmount = 0;
  if (d.type === 'percent') discountAmount = subtotal * (d.value / 100);
  else if (d.type === 'fixed') discountAmount = d.value;

  const total = Math.max(0, subtotal - discountAmount);
  return { total, discount: discountAmount };
}

// ------------------------
// Notification (tiny toast)
// ------------------------
function showNotification(message, type = 'info') {
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.textContent = message;
  el.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#88BAFF'};
    color: #fff; padding:12px 20px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index:1000;
    font-family: 'Lexend Deca', sans-serif; font-size:14px; font-weight:500;
    transform: translateX(100%); transition: transform .3s ease;
  `;
  document.body.appendChild(el);
  setTimeout(() => { el.style.transform = 'translateX(0)'; }, 100);
  setTimeout(() => {
    el.style.transform = 'translateX(100%)';
    setTimeout(() => { el.remove(); }, 300);
  }, 3000);
}

// ======================
// AI RECOMMENDATIONS
// ======================
function getCurrentCartInfoFromDOM() {
  const rows = document.querySelectorAll('.cart-table tbody tr');
  const items = [];
  rows.forEach(tr => {
    const slug = tr.getAttribute('data-slug') || tr.dataset.slug || '';
    const type = tr.getAttribute('data-type') || tr.dataset.type || '';
    const category = tr.getAttribute('data-category') || tr.dataset.category || '';
    const brand = tr.getAttribute('data-brand') || tr.dataset.brand || '';
    const qty = parseInt(tr.getAttribute('data-qty') || tr.dataset.qty || '1', 10) || 1;
    if (slug) items.push({ slug, type, category, brand, qty });
  });
  return items;
}

const LAST_TYPES_KEY = 'pc_last_cart_types';
function saveLastTypes(typesSet) {
  try { localStorage.setItem(LAST_TYPES_KEY, JSON.stringify([...typesSet])); } catch {}
}
function loadLastTypes() {
  try {
    const raw = localStorage.getItem(LAST_TYPES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch { return []; }
}

function scoreProduct(p, signals) {
  if (signals.inCart.has(p.slug)) return -1e9;
  let s = 0;
  if (signals.types.has(p.type)) s += 3;
  if (signals.categories.has(p.category)) s += 2;
  if (signals.brands.has(p.brand)) s += 1;
  s += Math.random() * 0.2;
  return s;
}

function pickRecommendations(products, signals, limit = 4) {
  const scored = products
    .filter(p => p && p.slug && p.name)
    .map(p => ({ p, score: scoreProduct(p, signals) }))
    .filter(x => x.score > -1e8);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.p);
}

function renderRecommendationsGrid(products) {
  const grid = document.querySelector('.recommendations-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const toCard = (item) => {
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
            <button class="wishlist-btn" aria-label="Add to Wishlist"
              data-name="${safeName}" data-image="${img}"
              data-price="${currentPriceNum}" data-category="${item.category || 'General'}">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <!-- stroke-only heart -->
                <path fill="none" stroke="#6B6358" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3
                     19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button class="add-to-cart-btn" data-name="${safeName}" data-image="${img}" data-price="${currentPriceNum}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    return card;
  };

  const show = products.slice(0, 4);
  show.forEach(p => grid.appendChild(toCard(p)));

  // Add-to-cart handlers cho card (gắn theo grid vì card vừa render)
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || '';
      const image = btn.getAttribute('data-image') || '';
      const price = parseFloat(btn.getAttribute('data-price') || '0') || 0;
      addToCart(name, image, price);
      showNotification(`${name} added to cart!`, 'success');
    });
  });

  // sau khi render, đánh dấu các wishlist đã có
  hydrateWishlistButtons();
}

function updateRecommendationsFromProducts(limit = 4) {
  const all = (window.PRODUCTS_DATA || []).slice();
  if (!all.length) {
    console.warn('[recommendations] PRODUCTS_DATA is empty or not loaded.');
    return;
  }

  const cartItems = getCurrentCartInfoFromDOM();
  const inCartSlugs = new Set(cartItems.map(x => x.slug).filter(Boolean));

  let typeSet = new Set(cartItems.map(x => x.type).filter(Boolean));
  let categorySet = new Set(cartItems.map(x => x.category).filter(Boolean));
  let brandSet = new Set(cartItems.map(x => x.brand).filter(Boolean));

  if (inCartSlugs.size === 0) {
    const lastTypes = loadLastTypes();
    if (lastTypes.length) {
      typeSet = new Set(lastTypes);
    } else {
      const typeCount = {};
      all.forEach(p => { typeCount[p.type] = (typeCount[p.type] || 0) + 1; });
      const topTypes = Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
      typeSet = new Set(topTypes);
    }
  } else {
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

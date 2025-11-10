// Favorite/Wishlist functionality

// Global products data cache
let productsData = [];

// Load products from products.js (fallback to XML if needed)
async function loadProductsData() {
  try {
    if (Array.isArray(window.PRODUCTS_DATA) && window.PRODUCTS_DATA.length > 0) {
      productsData = window.PRODUCTS_DATA.map(p => ({
        id: p.id,
        name: p.name,
        price: typeof p.price?.current === 'number' ? p.price.current : parseFloat(p.price?.current || '0'),
        originalPrice: typeof p.price?.original === 'number' ? p.price.original : parseFloat(p.price?.original || '0'),
        category: p.category || 'General',
        image: p.thumbnail || (Array.isArray(p.images) ? p.images[0] : ''),
        rating: (p.rating && typeof p.rating.avg === 'number') ? p.rating.avg : parseFloat(p.rating?.avg || '0'),
        soldCount: p.soldCount || '0'
      }));
      console.log('Products data loaded from products.js:', productsData.length, 'products');
      return productsData;
    }
  } catch (error) {
    console.warn('Failed to load products from products.js, will try XML.', error);
  }

  // Fallback: attempt to load XML if products.js is unavailable
  try {
    const response = await fetch('../assets/data/products.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const products = xmlDoc.querySelectorAll('product');
    productsData = Array.from(products).map(product => ({
      id: product.getAttribute('id'),
      name: product.querySelector('name')?.textContent || '',
      price: parseFloat(product.querySelector('discounted_price')?.textContent || product.querySelector('original_price')?.textContent || '0'),
      originalPrice: parseFloat(product.querySelector('original_price')?.textContent || '0'),
      category: product.querySelector('category')?.textContent || 'General',
      image: product.querySelector('image_url')?.textContent || '',
      rating: parseFloat(product.querySelector('rating')?.textContent || '0'),
      soldCount: product.querySelector('sold_count')?.textContent || '0'
    }));
    console.log('Products data loaded from XML:', productsData.length, 'products');
    return productsData;
  } catch (error) {
    console.error('Error loading products data (XML fallback):', error);
    return [];
  }
}

// Get product data by name
function getProductDataByName(productName) {
  return productsData.find(product => 
    product.name.toLowerCase() === productName.toLowerCase() ||
    product.name.toLowerCase().includes(productName.toLowerCase()) ||
    productName.toLowerCase().includes(product.name.toLowerCase())
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initFavoritePage();
  initFavoriteEventListeners();
  initGlobalFavoriteListeners();
  initFavoriteSelectionListeners();
});

async function initFavoritePage() {
  // Load products data first
  await loadProductsData();
  
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  
  // Enhance existing wishlist items with correct price and category from dataset
  wishlist = wishlist.map(item => {
    const productData = getProductDataByName(item.name);
    if (productData && (!item.price || item.price === 0 || item.category === 'General')) {
      return {
        ...item,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category
      };
    }
    return item;
  });
  
  // Save enhanced wishlist back to localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  updateFavoritesDisplay(wishlist);
}

// Decide how to render favorites depending on page markup
function updateFavoritesDisplay(wishlist) {
  const grid = document.getElementById('favoriteGrid');
  if (grid) {
    renderFavoriteGrid(wishlist);
  } else {
    renderFavoriteItems(wishlist);
    renderFavoriteSummary(wishlist);
  }
}

// Render favorites into card grid (#favoriteGrid)
function renderFavoriteGrid(wishlist) {
  const grid = document.getElementById('favoriteGrid');
  if (!grid) return;

  if (!Array.isArray(wishlist) || wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-favorite-grid">
        <h2>Your Favorites List is Empty</h2>
        <p>Looks like you haven't added any items to your favorites yet.</p>
        <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
      </div>
    `;
    return;
  }

  grid.innerHTML = wishlist.map(item => `
    <article class="favorite-card" data-item-id="${item.id}">
      <div class="favorite-card-img">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <h3 class="favorite-card-title">${item.name}</h3>

      <div class="favorite-card-footer">
        <span class="favorite-card-price">$${(item.price || 0).toFixed(2)}</span>

        <div class="favorite-card-actions">
          <button class="add-to-cart-btn" data-item-id="${item.id}">Add to Cart</button>
          <button class="favorite-heart-btn active" aria-label="Remove from Favorites" data-item-id="${item.id}">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                      2 5.42 4.42 3 7.5 3
                      c1.74 0 3.41.81 4.5 2.09
                      C13.09 3.81 14.76 3 16.5 3
                      19.58 3 22 5.42 22 8.5
                      c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#E02D3C" stroke="#4D2B12" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Bind card actions
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const itemId = parseInt(btn.dataset.itemId);
      addFavoriteToCart(itemId);
    });
  });

  grid.querySelectorAll('.favorite-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const itemId = parseInt(btn.dataset.itemId);
      removeFromFavorites(itemId);
    });
  });
}

function renderFavoriteItems(wishlist) {
  const favoriteItemsContainer = document.querySelector('.favorite-items');
  
  if (!favoriteItemsContainer) {
    console.warn('Favorite items container not found');
    return;
  }
  
  if (wishlist.length === 0) {
    favoriteItemsContainer.innerHTML = `
      <tr class="empty-favorite-row">
        <td colspan="7" class="empty-favorite">
          <div class="empty-favorite-content">
            <h2>Your Favorites List is Empty</h2>
            <p>Looks like you haven't added any items to your favorites yet.</p>
            <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  favoriteItemsContainer.innerHTML = wishlist.map((item, index) => `
    <tr class="favorite-item" data-item-id="${item.id}">
      <td class="item-checkbox">
        <input type="checkbox" id="favorite${index + 1}">
        <label for="favorite${index + 1}"></label>
      </td>
      <td class="item-info-cell">
        <div class="item-info">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <div class="item-category">${item.category || 'General'}</div>
          </div>
        </div>
      </td>
      <td class="unit-price">$${(item.price || 0).toFixed(2)}</td>
      <td class="category-cell">${item.category || 'General'}</td>
      <td class="date-cell">${formatDate(item.addedAt)}</td>
      <td class="actions-cell">
        <button class="add-to-cart-btn" data-item-id="${item.id}">Add to Cart</button>
      </td>
      <td class="remove-cell">
        <button class="delete-btn" onclick="removeFromFavorites(${item.id})" aria-label="Remove favorite">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#FF0000" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

  // Bind selection listeners after rendering
  initFavoriteSelectionListeners();
  
  // Bind add-to-cart listeners after rendering
  initAddToCartListeners();
}

function getSelectedFavoriteItems(wishlist) {
  const checkedBoxes = document.querySelectorAll('.favorite-item input[type="checkbox"]:checked');
  const selectedIds = new Set(Array.from(checkedBoxes).map(cb => parseInt(cb.closest('.favorite-item').dataset.itemId)));
  return wishlist.filter(item => selectedIds.has(item.id));
}

function initFavoriteSelectionListeners() {
  const selectAll = document.getElementById('selectAll');
  const itemCheckboxes = document.querySelectorAll('.favorite-item input[type="checkbox"]');

  if (selectAll) {
    selectAll.addEventListener('change', (e) => {
      const checked = e.target.checked;
      itemCheckboxes.forEach(cb => cb.checked = checked);
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      renderFavoriteSummary(wishlist);
    });
  }

  itemCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const allCount = document.querySelectorAll('.favorite-item input[type="checkbox"]').length;
      const checkedCount = document.querySelectorAll('.favorite-item input[type="checkbox"]:checked').length;
      if (selectAll) selectAll.checked = allCount > 0 && checkedCount === allCount;
      renderFavoriteSummary(wishlist);
    });
  });
}

function renderFavoriteSummary(wishlist) {
  const selectedItemsSpan = document.querySelector('.selected-items');
  const totalFavoritesSpan = document.querySelector('.stat-row .stat-value');
  const categoriesSpan = document.querySelectorAll('.stat-row .stat-value')[1];
  
  if (wishlist.length === 0) {
    if (selectedItemsSpan) selectedItemsSpan.textContent = 'Selected (0 items)';
    if (totalFavoritesSpan) totalFavoritesSpan.textContent = '0';
    if (categoriesSpan) categoriesSpan.textContent = '0';
    return;
  }

  const selectedList = getSelectedFavoriteItems(wishlist);
  const categories = [...new Set(wishlist.map(item => item.category || 'General'))];

  if (selectedItemsSpan) {
    selectedItemsSpan.textContent = `Selected (${selectedList.length} items)`;
  }
  
  if (totalFavoritesSpan) {
    totalFavoritesSpan.textContent = wishlist.length;
  }
  
  if (categoriesSpan) {
    categoriesSpan.textContent = categories.length;
  }
}

function addFavoriteToCart(itemId) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const item = wishlist.find(item => item.id === itemId);
  
  if (item) {
    // Add to cart using the global addToCart function
    if (typeof addToCart === 'function') {
      addToCart(item.name, item.image, item.price || 0);
      showNotification(`${item.name} added to cart!`, 'success');
    } else {
      // Fallback if addToCart is not available
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(cartItem => cartItem.name === item.name);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: Date.now(),
          name: item.name,
          image: item.image,
          price: item.price || 0,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      showNotification(`${item.name} added to cart!`, 'success');
    }
  }
}

function removeFromFavorites(itemId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const removedItem = wishlist.find(item => item.id === itemId);
  wishlist = wishlist.filter(item => item.id !== itemId);
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateFavoritesDisplay(wishlist);
  updateWishlistButton();
  
  // Show notification
  if (removedItem) {
    showNotification(`${removedItem.name} removed from favorites`, 'info');
  }
  
  // Dispatch wishlist update event
  window.dispatchEvent(new CustomEvent('wishlistUpdated', {
    detail: { wishlist, action: 'remove', itemId }
  }));
}

function addAllToCart() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const selectedItems = document.querySelectorAll('.favorite-item input[type="checkbox"]:checked');
  
  if (selectedItems.length === 0) {
    showNotification('Please select items to add to cart', 'info');
    return;
  }
  
  let addedCount = 0;
  selectedItems.forEach(checkbox => {
    const row = checkbox.closest('.favorite-item');
    const itemId = parseInt(row.dataset.itemId);
    const item = wishlist.find(item => item.id === itemId);
    
    if (item) {
      addFavoriteToCart(itemId);
      addedCount++;
    }
  });
  
  showNotification(`${addedCount} items added to cart!`, 'success');
}

function clearAllFavorites() {
  if (confirm('Are you sure you want to remove all items from your favorites?')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
    updateFavoritesDisplay([]);
    updateWishlistButton();
    showNotification('All favorites cleared', 'info');
    
    // Dispatch wishlist update event
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { wishlist: [], action: 'clear' }
    }));
  }
}

// Add all favorites to cart (grid or table); then navigate to cart
function addAllFavoritesToCart() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

  // Table selection (if present)
  const selected = document.querySelectorAll('.favorite-item input[type="checkbox"]:checked');
  let itemsToAdd = [];
  if (selected && selected.length > 0) {
    const ids = Array.from(selected).map(cb => parseInt(cb.closest('.favorite-item').dataset.itemId));
    itemsToAdd = wishlist.filter(item => ids.includes(item.id));
  } else {
    itemsToAdd = wishlist;
  }

  if (!itemsToAdd || itemsToAdd.length === 0) {
    showNotification('No favorites to add.', 'info');
    return;
  }

  let addedCount = 0;
  itemsToAdd.forEach(item => {
    addFavoriteToCart(item.id);
    addedCount++;
  });

  showNotification(`${addedCount} items added to cart!`, 'success');
}

function updateWishlistButton() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishlistBtn = document.querySelector('.icon-btn[aria-label="Wishlist"]');
  
  if (wishlistBtn) {
    const count = wishlist.length;
    wishlistBtn.setAttribute('data-count', count);
    
    // Add count badge if items exist
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

// Initialize favorite event listeners
function initFavoriteEventListeners() {
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
      if (typeof addToCart === 'function') {
        addToCart(productName, productImage, productPrice);
      }
      
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
  
  // Handle bulk actions
  const addAllBtn = document.querySelector('.add-all-to-cart-btn') || document.querySelector('.favorite-addall-btn');
  const clearAllBtn = document.querySelector('.clear-all-btn');
  
  if (addAllBtn) {
    addAllBtn.addEventListener('click', addAllFavoritesToCart);
  }
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllFavorites);
  }
  
  // Handle select all checkbox
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.favorite-item input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
    });
  }
}

// Add to wishlist function (global)
async function addToWishlist(productName, productImage, category = 'General') {
  // Ensure products data is loaded
  if (productsData.length === 0) {
    await loadProductsData();
  }
  
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const existingItem = wishlist.find(item => item.name === productName);
  
  if (!existingItem) {
    // Get product data from XML
    const productData = getProductDataByName(productName);
    
    wishlist.push({
      id: Date.now(),
      name: productName,
      image: productImage,
      category: productData ? productData.category : category,
      price: productData ? productData.price : 0,
      originalPrice: productData ? productData.originalPrice : 0,
      addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistButton();
    showNotification(`${productName} added to favorites!`, 'success');
    
    // Dispatch wishlist update event
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { wishlist, action: 'add', productName }
    }));
  } else {
    showNotification(`${productName} is already in your favorites!`, 'info');
  }
}

// Add to cart function (global)
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
  
  // Update cart button if function exists
  if (typeof updateCartButton === 'function') {
    updateCartButton();
  }
  
  // Dispatch cart update event
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'add', productName }
  }));
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

// Initialize global favorite listeners
function initGlobalFavoriteListeners() {
  // Listen for wishlist updates from other pages
  window.addEventListener('wishlistUpdated', (event) => {
    const { wishlist, action, productName } = event.detail;
    
    // Refresh favorite display if we're on favorite page
    if (document.body.dataset.page === 'favorite') {
      updateFavoritesDisplay(wishlist);
    }
    
    updateWishlistButton();
  });
  
  // Listen for storage changes (cross-tab communication)
  window.addEventListener('storage', (event) => {
    if (event.key === 'wishlist') {
      const wishlist = JSON.parse(event.newValue || '[]');
      if (document.body.dataset.page === 'favorite') {
        updateFavoritesDisplay(wishlist);
      }
      updateWishlistButton();
    }
  });
}

// Utility function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Initialize wishlist button state
updateWishlistButton();

function initAddToCartListeners() {
  // Handle add-to-cart buttons in the favorites table
  document.querySelectorAll('.favorite-item .add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const itemId = parseInt(btn.getAttribute('data-item-id'));
      addFavoriteToCart(itemId);
    });
  });
}

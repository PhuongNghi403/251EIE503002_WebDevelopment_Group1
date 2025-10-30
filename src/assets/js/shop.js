document.addEventListener('DOMContentLoaded', () => {
  // Initialize shop functionality
  initShopPage();
  initNavigation();
  loadProductsFromData();
  initProductCarousel();
  initProductInteractions();
  initWishlistAndCart();
  initMarkupWishlistButtons();
  initCardTitleNavigation();
  initProductCardButtons();
  initGlobalCartListeners();
});

// Initialize shop page
function initShopPage() {
  const page = document.body.dataset.page;
  if (page !== 'shop') return;
  
  console.log('Shop page initialized');
}

// Navigation active state
function initNavigation() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });
}

// Product carousel functionality
function initProductCarousel() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const productTitle = document.getElementById('productTitle');
  const cards = document.querySelectorAll('.card');
  
  if (!prevBtn || !nextBtn || !productTitle || cards.length === 0) return;
  
  let currentIndex = 2; // Start with DROOLS (index 2)
  
  // Product data for titles
  const productData = [
    { title: "FILLET 'O' LAKES - KIT CAT" },
    { title: "ENCORE - CAT FOOD" },
    { title: "DROOLS - PUPPY NUTRIOUS WET FOOD" },
    { title: "ROYAL CANIN - CARE DIGEST SENSITIVE" },
    { title: "ROYAL CANIN - CARE DIGEST SENSITIVE" }
  ];
  
  function updateActiveCard() {
  cards.forEach(c => c.classList.remove('active'));
  if (cards[currentIndex]) cards[currentIndex].classList.add('active');

  if (productData[currentIndex]) {
    productTitle.textContent = productData[currentIndex].title;
  }

  // Update hero-right image to match the active card
  const heroImg = document.querySelector('.hero-right .hero-figure img');
  const activeCard = cards[currentIndex];
  if (heroImg && activeCard) {
    const cardImg = activeCard.querySelector('img');
    // fade
    heroImg.style.opacity = '0';
    setTimeout(() => {
      heroImg.src = cardImg.src;
      heroImg.alt = cardImg.alt || productTitle.textContent;
      heroImg.style.opacity = '1';
    }, 150);
  }
}


  
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
    
    // Add visual feedback for disabled buttons
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex === cards.length - 1 ? '0.5' : '1';
  }
  
  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateActiveCard();
      updateButtons();
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateActiveCard();
      updateButtons();
    }
  }
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Initialize
  updateActiveCard();
  updateButtons();
}

// Navigate to product detail when clicking the card title
function initCardTitleNavigation() {
  const titles = document.querySelectorAll('.product-card .card-title');
  if (!titles || titles.length === 0) return;

  titles.forEach(title => {
    if (title.dataset.navBound === 'true') return;
    title.dataset.navBound = 'true';

    title.style.cursor = 'pointer';
    title.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = title.closest('.product-card');
      const name = title.textContent?.trim() || '';

      let idParam = '';
      try {
        if (Array.isArray(window.productsData) && window.productsData.length) {
          const match = window.productsData.find(p => p.element === card || p.name === name);
          if (match && match.id) idParam = String(match.id);
        }
      } catch (_) {}

      // Build navigation URL (same directory as shop.html)
      let href = 'product_detail.html';
      if (idParam) {
        href += `?id=${encodeURIComponent(idParam)}`;
      } else if (name) {
        href += `?name=${encodeURIComponent(name)}`;
      }
      window.location.href = href;
    });
  });
}

// Bind wishlist buttons that already exist in the shop.html markup
function initMarkupWishlistButtons() {
  const buttons = document.querySelectorAll('.product-card .wishlist-btn');
  if (!buttons || buttons.length === 0) return;

  buttons.forEach(btn => {
    // Avoid duplicate listeners
    if (btn.dataset.wishlistBound === 'true') return;
    btn.dataset.wishlistBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;

      const productName = card.querySelector('.card-title')?.textContent?.trim() || '';
      const productImage = card.querySelector('img')?.src || '';

      try {
        // Use the global addToWishlist if available (defined later in this file)
        if (typeof addToWishlist === 'function') {
          addToWishlist(productName, productImage);
        } else {
          // Fallback local implementation
          let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          const existingItem = wishlist.find(item => item.name === productName);
          if (!existingItem) {
            wishlist.push({
              id: Date.now(),
              name: productName,
              image: productImage,
              category: 'General',
              addedAt: new Date().toISOString()
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            if (typeof updateWishlistButton === 'function') updateWishlistButton();
            showNotification(`${productName} added to favorites!`, 'success');
            window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist, action: 'add', productName } }));
          } else {
            showNotification(`${productName} is already in your favorites!`, 'info');
          }
        }
      } catch (err) {
        console.error('Wishlist add failed:', err);
        showNotification('Unable to add to favorites right now.', 'error');
      }
    });
  });
}

// Product interactions (hover effects, click handlers)
function initProductInteractions() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    // Add click handler for product details
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = card.querySelector('h3').textContent;
      const productImage = card.querySelector('img').src;
      
      // Show product details modal or navigate to product page
      showProductDetails(productName, productImage);
    });
    
    // Add keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    
    // Make cards focusable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent}`);
  });
}


// Wishlist and cart functionality
function initWishlistAndCart() {
  const wishlistBtn = document.querySelector('.icon-btn[aria-label="Wishlist"]');
  const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
  
  // Initialize wishlist and cart from localStorage
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Update wishlist button state
  function updateWishlistButton() {
    if (wishlistBtn) {
      const count = wishlist.length;
      wishlistBtn.setAttribute('data-count', count);
      wishlistBtn.style.position = 'relative';
      
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
  
  // Update cart button state
  function updateCartButton() {
    if (cartBtn) {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      cartBtn.setAttribute('data-count', count);
      cartBtn.style.position = 'relative';
      
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
  
  // Add to wishlist function
  function addToWishlist(productName, productImage, category = 'General') {
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
  
  // Add to cart function (local scope for carousel cards)
  function addToCartCarousel(productName, productImage, price = 0) {
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
    updateCartButton();
    showNotification(`${productName} đã được thêm vào giỏ hàng!`, 'success');
  }
  
  // Add wishlist and cart buttons to product cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const productName = card.querySelector('h3').textContent;
    const productImage = card.querySelector('img').src;
    const productPrice = parseFloat(card.dataset.price) || 0;
    
    // Create action buttons container
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'product-actions';
    actionsContainer.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    // Wishlist button
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'action-btn wishlist-btn';
    wishlistBtn.innerHTML = '♡';
    wishlistBtn.title = 'Add to wishlist';
    wishlistBtn.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.9);
      color: #ff4757;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s ease;
    `;
    
    // Cart button
    const cartBtn = document.createElement('button');
    cartBtn.className = 'action-btn cart-btn';
    cartBtn.innerHTML = '+';
    cartBtn.title = 'Add to cart';
    cartBtn.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.9);
      color: #88BAFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      transition: all 0.3s ease;
    `;
    
    // Event listeners
    wishlistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToWishlist(productName, productImage);
    });
    
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCartCarousel(productName, productImage, productPrice);
    });
    
    // Hover effects
    wishlistBtn.addEventListener('mouseenter', () => {
      wishlistBtn.style.background = '#ff4757';
      wishlistBtn.style.color = 'white';
      wishlistBtn.style.transform = 'scale(1.1)';
    });
    
    wishlistBtn.addEventListener('mouseleave', () => {
      wishlistBtn.style.background = 'rgba(255,255,255,0.9)';
      wishlistBtn.style.color = '#ff4757';
      wishlistBtn.style.transform = 'scale(1)';
    });
    
    cartBtn.addEventListener('mouseenter', () => {
      cartBtn.style.background = '#88BAFF';
      cartBtn.style.color = 'white';
      cartBtn.style.transform = 'scale(1.1)';
    });
    
    cartBtn.addEventListener('mouseleave', () => {
      cartBtn.style.background = 'rgba(255,255,255,0.9)';
      cartBtn.style.color = '#88BAFF';
      cartBtn.style.transform = 'scale(1)';
    });
    
    actionsContainer.appendChild(wishlistBtn);
    actionsContainer.appendChild(cartBtn);
    
    // Make card position relative and add actions
    card.style.position = 'relative';
    card.appendChild(actionsContainer);
    
    // Show actions on hover
    card.addEventListener('mouseenter', () => {
      actionsContainer.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      actionsContainer.style.opacity = '0';
    });
  });
  
  // Initialize button states
  updateWishlistButton();
  updateCartButton();
  
  // Avoid duplicate bindings; product buttons are initialized once on DOMContentLoaded
}

// Initialize product card buttons (Buy Now, Cart buttons)
function initProductCardButtons() {
  // Handle Buy Now buttons
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = btn.closest('.product-card');
      const productName = productCard.querySelector('.card-title').textContent;
      const productImage = productCard.querySelector('img').src;
      const currentPrice = productCard.querySelector('.current-price').textContent;
      const price = parseFloat(currentPrice.replace('$', '').replace(',', ''));
      
      // Add to cart then go to cart immediately to confirm order
      addToCart(productName, productImage, price);
      window.location.href = 'shop_checkout_pickup.html';
    });
  });
  
  // Handle Cart buttons in product cards
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = btn.closest('.product-card');
      const productName = productCard.querySelector('.card-title').textContent;
      const productImage = productCard.querySelector('img').src;
      const currentPrice = productCard.querySelector('.current-price').textContent;
      const price = parseFloat(currentPrice.replace('$', '').replace(',', ''));
      
      // Add to cart
      addToCart(productName, productImage, price);
    });
  });
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
  updateCartButton();
  showNotification(`${productName} added to cart!`, 'success');
  
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, action: 'add', productName }
  }));
}

// Update cart button with count
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
  
  // Dispatch global cart update event
  window.dispatchEvent(new CustomEvent('cartCountUpdated', {
    detail: { count }
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

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize smooth scroll
initSmoothScroll();

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

// Update wishlist button with count
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

// Initialize global cart listeners
function initGlobalCartListeners() {
  // Listen for cart updates from other pages
  window.addEventListener('cartUpdated', (event) => {
    const { cart, action, productName } = event.detail;
    updateCartButton();
    
    if (action === 'add') {
      showNotification(`${productName} added to cart!`, 'success');
    }
  });
  
  // Listen for cart count updates
  window.addEventListener('cartCountUpdated', (event) => {
    updateCartButton();
  });
  
  // Listen for storage changes (cross-tab communication)
  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      updateCartButton();
    } else if (event.key === 'wishlist') {
      updateWishlistButton();
    }
  });
  
  // Listen for wishlist updates
  window.addEventListener('wishlistUpdated', (event) => {
    updateWishlistButton();
  });
}

// Initialize product filtering
function initProductFiltering() {
  const categoryFilters = document.querySelectorAll('input[name="category"]');
  const petTypeFilters = document.querySelectorAll('input[name="pet_type"]');
  const priceSlider = document.getElementById('priceSlider');
  
  // Category filtering
  categoryFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Pet type filtering
  petTypeFilters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
  
  // Price range filtering
  if (priceSlider) {
    priceSlider.addEventListener('input', updatePriceDisplay);
    priceSlider.addEventListener('input', applyFilters);
  }
}

// Update price display
function updatePriceDisplay() {
  const slider = document.getElementById('priceSlider');
  const priceDisplay = document.getElementById('currentPriceRange');
  
  if (slider && priceDisplay) {
    const value = parseInt(slider.value);
    const priceRanges = ['$0', '$100', '$200', '$300', '$400', '>$500'];
    priceDisplay.textContent = priceRanges[value];
  }
}

// Apply filters to products
function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
    .map(cb => cb.value);
  const selectedPetTypes = Array.from(document.querySelectorAll('input[name="pet_type"]:checked'))
    .map(cb => cb.value);
  
  // Get price range from slider
  const priceSlider = document.getElementById('priceSlider');
  const priceValue = priceSlider ? parseInt(priceSlider.value) : 5;
  const priceRanges = [0, 100, 200, 300, 400, 500];
  const maxPrice = priceRanges[priceValue];
  
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    let shouldShow = true;
    
    // Get product data
    const cardCategory = card.getAttribute('data-category') || '';
    const cardPrice = parseFloat(card.getAttribute('data-price') || 0);
    
    // If no filters are selected, show all items (only apply price filter)
    if (selectedCategories.length === 0 && selectedPetTypes.length === 0) {
      if (priceValue === 5) {
        // Show all products if ">$500" is selected
        shouldShow = true;
      } else {
        // Check if price is within range
        if (cardPrice > maxPrice) {
          shouldShow = false;
        }
      }
    } else {
      // Apply category filter if any categories are selected
      if (selectedCategories.length > 0) {
        const categoryMatch = selectedCategories.some(selectedCat => {
          // Direct word matching for categories
          if (selectedCat === 'dog-toy') {
            return cardCategory.toLowerCase().includes('dog') && cardCategory.toLowerCase().includes('toy');
          } else if (selectedCat === 'cat-food-dry') {
            return cardCategory.toLowerCase().includes('cat') && cardCategory.toLowerCase().includes('food') && cardCategory.toLowerCase().includes('dry');
          } else if (selectedCat === 'cat-food-wet') {
            return cardCategory.toLowerCase().includes('cat') && cardCategory.toLowerCase().includes('food') && cardCategory.toLowerCase().includes('wet');
          } else if (selectedCat === 'dog-food-dry') {
            return cardCategory.toLowerCase().includes('dog') && cardCategory.toLowerCase().includes('food') && cardCategory.toLowerCase().includes('dry');
          }
          return false;
        });
        
        if (!categoryMatch) {
          shouldShow = false;
        }
      }
      
      // Apply pet type filter if any pet types are selected
      if (selectedPetTypes.length > 0 && shouldShow) {
        const petTypeMatch = selectedPetTypes.some(petType => {
          if (petType === 'dogs') {
            return cardCategory.toLowerCase().includes('dog');
          } else if (petType === 'cats') {
            return cardCategory.toLowerCase().includes('cat');
          }
          return false;
        });
        
        if (!petTypeMatch) {
          shouldShow = false;
        }
      }
      
      // Apply price filter
      if (shouldShow) {
        if (priceValue === 5) {
          // Show all products if ">$500" is selected
          shouldShow = true;
        } else {
          // Check if price is within range
          if (cardPrice > maxPrice) {
            shouldShow = false;
          }
        }
      }
    }
    
    // Show/hide card
    card.style.display = shouldShow ? 'block' : 'none';
  });
  
  // Update results count
  updateResultsCount();
}

// Update results count
function updateResultsCount() {
  const productCards = document.querySelectorAll('.product-card');
  let visibleCount = 0;
  
  productCards.forEach(card => {
    if (card.style.display !== 'none') {
      visibleCount++;
    }
  });
  
  const resultsCount = document.querySelector('.results-count');
  if (resultsCount) {
    resultsCount.textContent = `${visibleCount} product${visibleCount !== 1 ? 's' : ''} found`;
  }
}

// Load products from XML and update HTML
async function loadProductsFromXML() {
  try {
    const response = await fetch('../assets/data/products.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const products = xmlDoc.querySelectorAll('product');
    const productCards = document.querySelectorAll('.product-card');
    
    // Store products data globally for filtering
    window.productsData = [];
    
    // Map XML products to HTML cards
    products.forEach((product, index) => {
      if (index < productCards.length) {
        const card = productCards[index];
        const cardDetails = card.querySelector('.card-details');
        
        if (cardDetails) {
          // Get data from XML
          const name = product.querySelector('name')?.textContent || '';
          const discountedPrice = product.querySelector('discounted_price')?.textContent || '0';
          const originalPrice = product.querySelector('original_price')?.textContent || '0';
          const rating = product.querySelector('rating')?.textContent || '0';
          const soldCount = product.querySelector('sold_count')?.textContent || '0';
          const category = product.querySelector('category')?.textContent || '';
          
          // Store product data for filtering
          window.productsData.push({
            id: product.getAttribute('id'),
            name: name,
            discountedPrice: parseFloat(discountedPrice),
            originalPrice: parseFloat(originalPrice),
            rating: parseFloat(rating),
            soldCount: soldCount,
            category: category,
            element: card
          });
          
          // Update card title (item-name)
          const cardTitle = cardDetails.querySelector('.card-title');
          if (cardTitle) {
            cardTitle.textContent = name;
          }
          
          // Update price (unit-price)
          const currentPriceElement = cardDetails.querySelector('.current-price');
          const originalPriceElement = cardDetails.querySelector('.original-price');
          
          if (currentPriceElement) {
            currentPriceElement.textContent = `$${parseFloat(discountedPrice).toFixed(2)}`;
          }
          
          if (originalPriceElement) {
            originalPriceElement.textContent = `$${parseFloat(originalPrice).toFixed(2)}`;
          }
          
          // Update rating and sold count
          const ratingElement = cardDetails.querySelector('.rating');
          const soldElement = cardDetails.querySelector('.sold');
          
          if (ratingElement) {
            ratingElement.textContent = `⭐ (${rating})`;
          }
          
          if (soldElement) {
            soldElement.textContent = `${soldCount} Sold`;
          }
          
          // Add weight information (using category as weight placeholder)
          const weightElement = cardDetails.querySelector('.item-weight');
          if (!weightElement) {
            // Create weight element if it doesn't exist
            const weightDiv = document.createElement('div');
            weightDiv.className = 'item-weight';
            weightDiv.textContent = `Category: ${category}`;
            weightDiv.style.cssText = `
              font-size: 12px;
              color: #666;
              margin-top: 4px;
            `;
            cardDetails.appendChild(weightDiv);
          } else {
            weightElement.textContent = `Category: ${category}`;
          }
          
          // Add data attributes for filtering
          card.setAttribute('data-category', category);
          card.setAttribute('data-price', discountedPrice);
          
          console.log(`Product ${index + 1}:`, {
            name: name,
            category: category,
            price: discountedPrice,
            card: card
          });
        }
      }
    });
    
  // Initialize filtering
  initProductFiltering();
  
  // Update results count after loading
  updateResultsCount();
  
  // Initialize wishlist button
  updateWishlistButton();
  
  console.log('Products loaded from XML successfully');
  } catch (error) {
    console.error('Error loading products from XML:', error);
  }
}

// Load products from JS data (window.PRODUCTS_DATA) and update HTML
function loadProductsFromData() {
  try {
    const products = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
    const productCards = document.querySelectorAll('.product-card');

    // Fallback to XML if no JS data available
    if (!products.length) {
      console.warn('No PRODUCTS_DATA found; falling back to XML');
      loadProductsFromXML();
      return;
    }

    // Store products data globally for filtering and navigation
    window.productsData = [];

    products.forEach((p, index) => {
      if (index < productCards.length) {
        const card = productCards[index];
        const cardDetails = card.querySelector('.card-details');

        // Normalize properties
        const name = p.name || '';
        const discounted = Number(p.discounted_price ?? p.discountedPrice ?? 0);
        const original = Number(p.original_price ?? p.originalPrice ?? discounted);
        const rating = Number(p.rating ?? 0);
        const soldCount = String(p.sold_count ?? p.soldCount ?? '0');
        const category = p.category ?? '';

        // Store product data for later filtering and navigation
        window.productsData.push({
          id: String(p.id ?? index + 1),
          name,
          discountedPrice: discounted,
          originalPrice: original,
          rating,
          soldCount,
          category,
          element: card
        });

        if (cardDetails) {
          const cardTitle = cardDetails.querySelector('.card-title');
          if (cardTitle) cardTitle.textContent = name;

          const currentPriceElement = cardDetails.querySelector('.current-price');
          const originalPriceElement = cardDetails.querySelector('.original-price');
          if (currentPriceElement) currentPriceElement.textContent = `$${discounted.toFixed(2)}`;
          if (originalPriceElement) originalPriceElement.textContent = `$${original.toFixed(2)}`;

          const ratingElement = cardDetails.querySelector('.rating');
          const soldElement = cardDetails.querySelector('.sold');
          if (ratingElement) ratingElement.textContent = `⭐ (${rating})`;
          if (soldElement) soldElement.textContent = `${soldCount} Sold`;
        }
      }
    });

    updateResultsCount && updateResultsCount();
  } catch (err) {
    console.error('Failed to load products from JS data:', err);
    loadProductsFromXML();
  }
}



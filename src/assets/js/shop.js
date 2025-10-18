document.addEventListener('DOMContentLoaded', () => {
  // Initialize shop functionality
  initShopPage();
  initNavigation();
  initProductCarousel();
  initProductInteractions();
  initWishlistAndCart();
  initTailoredNutrition();
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
  const prevBtn = document.querySelector('.nav-btn[aria-label="Previous"]');
  const nextBtn = document.querySelector('.nav-btn[aria-label="Next"]');
  const productRow = document.querySelector('.product-row');
  const cards = document.querySelectorAll('.card');
  
  if (!prevBtn || !nextBtn || !productRow || cards.length === 0) return;
  
  let currentIndex = 0;
  const cardsPerView = getCardsPerView();
  
  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1200) return 3;
    return 5;
  }
  
  function updateCarousel() {
    const translateX = -currentIndex * (100 / cardsPerView);
    productRow.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
    
    // Add visual feedback for disabled buttons
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex >= cards.length - cardsPerView ? '0.5' : '1';
  }
  
  function nextSlide() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
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
  
  // Touch/swipe support for mobile
  let startX = 0;
  let endX = 0;
  
  productRow.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  productRow.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      currentIndex = Math.min(currentIndex, Math.max(0, cards.length - newCardsPerView));
      updateCarousel();
    }
  });
  
  // Initialize
  updateCarousel();
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

// Show product details (placeholder for future product detail page)
function showProductDetails(productName, productImage) {
  // For now, show an alert. In the future, this could open a modal or navigate to product detail page
  alert(`Product: ${productName}\n\nThis would normally show detailed product information, pricing, and add to cart functionality.`);
  
  // Future implementation could be:
  // window.location.href = `product-detail.html?product=${encodeURIComponent(productName)}`;
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
  function addToWishlist(productName, productImage) {
    const existingItem = wishlist.find(item => item.name === productName);
    if (!existingItem) {
      wishlist.push({
        id: Date.now(),
        name: productName,
        image: productImage,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      updateWishlistButton();
      showNotification(`${productName} added to wishlist!`, 'success');
    } else {
      showNotification(`${productName} is already in your wishlist!`, 'info');
    }
  }
  
  // Add to cart function
  function addToCart(productName, productImage, price = 0) {
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
  }
  
  // Add wishlist and cart buttons to product cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const productName = card.querySelector('h3').textContent;
    const productImage = card.querySelector('img').src;
    
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
      addToCart(productName, productImage);
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

// Tailored Nutrition section interactions
function initTailoredNutrition() {
  const featureBlocks = document.querySelectorAll('.feature-block');
  
  featureBlocks.forEach(block => {
    // Add click handler for feature blocks
    block.addEventListener('click', (e) => {
      e.preventDefault();
      const title = block.querySelector('.feature-title').textContent;
      showFeatureDetails(title);
    });
    
    // Add keyboard support
    block.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        block.click();
      }
    });
    
    // Make blocks focusable
    block.setAttribute('tabindex', '0');
    block.setAttribute('role', 'button');
    block.setAttribute('aria-label', `Learn more about ${block.querySelector('.feature-title').textContent}`);
    
    // Add intersection observer for animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial state for animation
    block.style.opacity = '0';
    block.style.transform = 'translateY(30px)';
    block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    observer.observe(block);
  });
}

// Show feature details (placeholder for future feature detail page)
function showFeatureDetails(featureTitle) {
  const descriptions = {
    'Nutrition And Health': 'Learn about the importance of proper nutrition for your pet\'s overall health and well-being. Our expert team can help you choose the right food for your pet\'s specific needs.',
    'Custom Diets': 'Every pet is unique. We offer personalized diet plans tailored to your pet\'s age, breed, health conditions, and lifestyle. Consult with our nutrition experts today.',
    'Expert Guidance': 'Get professional advice from our certified pet nutritionists. We provide comprehensive guidance on feeding schedules, portion control, and dietary supplements.'
  };
  
  const description = descriptions[featureTitle] || 'Learn more about this feature and how it can benefit your pet.';
  
  // For now, show an alert. In the future, this could open a modal or navigate to a detailed page
  alert(`${featureTitle}\n\n${description}\n\nThis would normally show detailed information and allow you to book a consultation with our experts.`);
  
  // Future implementation could be:
  // window.location.href = `nutrition-consultation.html?feature=${encodeURIComponent(featureTitle)}`;
}
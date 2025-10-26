// Product Detail Page Script
// Syncs product data from XML by id and wires Buy Now / Add to Cart

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initProductDetailFromXML();
    initProductDetailButtons();
    updateCartButton();
  });

  async function initProductDetailFromXML() {
    const params = new URLSearchParams(window.location.search);
    const idParamRaw = params.get('id');
    const idParam = idParamRaw ? idParamRaw.trim() : null;
    const nameParamRaw = params.get('name');
    const nameParam = nameParamRaw ? nameParamRaw.trim() : null;

    if (!idParam && !nameParam) {
      // Fallback to previous param-based init if no id or name provided
      initProductDetailFromParams();
      return;
    }

    try {
      const xml = await fetch('../assets/data/products.xml').then(r => r.text());
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');
      
      // Try by id first (robust matching)
      let productNode = null;
      if (idParam) {
        productNode = Array.from(xmlDoc.querySelectorAll('products > product')).find(p => (p.getAttribute('id') || '').trim() === idParam);
      }

      // If not found by id, try by name
      if (!productNode && nameParam) {
        const normalized = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        const targetName = normalized(nameParam);
        productNode = Array.from(xmlDoc.querySelectorAll('products > product')).find(p => {
          const n = p.querySelector('name')?.textContent || '';
          return normalized(n) === targetName;
        });
      }

      if (!productNode) {
        console.warn('Product not found. Params -> id:', idParam, 'name:', nameParam);
        showNotification('Product not found in XML. Using defaults.', 'info');
        initProductDetailFromParams();
        return;
      }

      const product = xmlProductToObject(productNode);
      populateProductDetail(product);
    } catch (err) {
      console.error('Failed to load products.xml', err);
      showNotification('Unable to load product data. Using defaults.', 'error');
      initProductDetailFromParams();
    }
  }

  function xmlProductToObject(node) {
    const get = (tag) => node.querySelector(tag)?.textContent?.trim() || '';
    const discountedPrice = parseFloat(get('discounted_price')) || 0;
    const originalPrice = parseFloat(get('original_price')) || discountedPrice;
    const name = get('name');
    const rating = parseFloat(get('rating')) || 0;
    const soldCount = get('sold_count');
    const category = get('category');
    const brand = get('brand');
    const description = get('product_description');
    const benefits = Array.from(node.querySelectorAll('benefits > benefit')).map(b => b.textContent.trim());
    const nutrition = Object.fromEntries(Array.from(node.querySelectorAll('nutrition_facts > *')).map(el => [el.tagName.toLowerCase(), el.textContent.trim()]));
    const imageUrl = get('image_url');

    return {
      id: node.getAttribute('id'),
      name,
      rating,
      soldCount,
      originalPrice,
      discountedPrice,
      category,
      brand,
      description,
      benefits,
      nutrition,
      image: imageUrl || guessImageForProduct(name)
    };
  }



  function formatLabel(s) {
    return (s || '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
  }

  function populateProductDetail(product) {
    const titleEl = document.querySelector('.detail-title');
    const priceEl = document.querySelector('.detail-price');
    const imageEl = document.querySelector('.detail-image');
    const ratingEl = document.querySelector('.detail-rating');
    const descEl = document.querySelector('.detail-desc');

    if (titleEl) titleEl.textContent = product.name || 'Product';
    if (priceEl) priceEl.textContent = `$${(product.discountedPrice ?? 0).toFixed(2)}`;
    if (imageEl) imageEl.src = product.image;
    if (ratingEl) ratingEl.textContent = `${(product.rating ?? 0).toFixed(1)} ★`;
    if (descEl && product.description) descEl.textContent = product.description;

    // Store current price for add-to-cart
    if (priceEl) priceEl.dataset.price = String(product.discountedPrice ?? 0);

    // Category
    const categoryValueEl = document.querySelector('.detail-category .category-value');
    if (categoryValueEl) categoryValueEl.textContent = product.category || '';

    // Benefits list
    const benefitsList = document.querySelector('.detail-benefits');
    if (benefitsList) {
      benefitsList.innerHTML = '';
      if (Array.isArray(product.benefits) && product.benefits.length) {
        product.benefits.forEach(b => {
          const li = document.createElement('li');
          li.textContent = b;
          benefitsList.appendChild(li);
        });
      }
    }

    // Nutrition facts table
    const nutritionBody = document.querySelector('.detail-nutrition tbody');
    if (nutritionBody) {
      nutritionBody.innerHTML = '';
      const entries = Object.entries(product.nutrition || {});
      entries.forEach(([key, value]) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');
        th.textContent = formatLabel(key);
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        nutritionBody.appendChild(tr);
      });
      if (entries.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'No nutrition information available.';
        tr.appendChild(td);
        nutritionBody.appendChild(tr);
      }
    }
  }

  // Fallback initializer using query params (name/price/image/rating)
  function initProductDetailFromParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || 'Sample Product';
    const price = parseFloat(params.get('price') || '0');
    const image = params.get('image') || '../assets/images/Shop/BoneShapedPetToys.svg';
    const rating = params.get('rating') || '4.0';

    const titleEl = document.querySelector('.detail-title');
    const priceEl = document.querySelector('.detail-price');
    const imageEl = document.querySelector('.detail-image');
    const ratingEl = document.querySelector('.detail-rating');

    if (titleEl) titleEl.textContent = name;
    if (priceEl) { priceEl.textContent = `$${(!isNaN(price) ? price.toFixed(2) : '0.00')}`; priceEl.dataset.price = String(price || 0); }
    if (imageEl) imageEl.src = image;
    if (ratingEl) ratingEl.textContent = `${Number(rating).toFixed(1)} ★`;
  }

  function initProductDetailButtons() {
    document.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { name, image, price } = getCurrentProduct();
        addToCart(name, image, price);
        window.location.href = 'cart.html';
      });
    });

    document.querySelectorAll('.btn-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { name, image, price } = getCurrentProduct();
        addToCart(name, image, price);
        showNotification(`${name} added to cart!`, 'success');
      });
    });
  }

  function getCurrentProduct() {
    const name = document.querySelector('.detail-title')?.textContent || 'Sample Product';
    const image = document.querySelector('.detail-image')?.src || '../assets/images/Shop/BoneShapedPetToys.svg';
    const priceText = document.querySelector('.detail-price')?.dataset?.price || document.querySelector('.detail-price')?.textContent?.replace('$', '') || '0';
    const price = parseFloat(priceText);
    return { name, image, price: isNaN(price) ? 0 : price };
  }

  // addToCart - mirrors behavior used across pages
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

    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cart, action: 'add', productName }
    }));
  }

  function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#88BAFF'};
      color: white; padding: 12px 20px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000;
      font-family: 'Lexend Deca', sans-serif; font-size: 14px; font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 2000);
  }

  function updateCartButton() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
    if (!cartBtn) return;
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBtn.setAttribute('data-count', count);

    let badge = cartBtn.querySelector('.count-badge');
    if (!badge && count > 0) {
      badge = document.createElement('span');
      badge.className = 'count-badge';
      badge.style.cssText = `
        position: absolute; top: -5px; right: -5px; background: #ff4757; color: white;
        border-radius: 50%; width: 18px; height: 18px; font-size: 12px;
        display: flex; align-items: center; justify-content: center; font-weight: bold;`;
      cartBtn.style.position = 'relative';
      cartBtn.appendChild(badge);
    }
    if (badge) badge.textContent = count;
    if (badge && count === 0) badge.remove();
  }
})();
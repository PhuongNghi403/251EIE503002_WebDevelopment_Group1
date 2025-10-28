// Product Detail Page Script
// Syncs product data from XML by id and wires Buy Now / Add to Cart

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initProductDetailFromData();
    initProductDetailButtons();
    updateCartButton();
  });

  // Prefer JS data source, fallback to XML/params
  function initProductDetailFromData() {
    const params = new URLSearchParams(window.location.search);
    const idParamRaw = params.get('id');
    const idParam = idParamRaw ? idParamRaw.trim() : null;
    const nameParamRaw = params.get('name');
    const nameParam = nameParamRaw ? nameParamRaw.trim() : null;

    // If no params, use generic fallback
    if (!idParam && !nameParam) {
      initProductDetailFromParams();
      return;
    }

    const data = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
    if (!data.length) {
      // No JS data, fallback to XML
      initProductDetailFromXML();
      return;
    }

    const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    let item = null;
    if (idParam) {
      item = data.find(p => String(p.id).trim() === idParam);
    }
    if (!item && nameParam) {
      const target = normalize(nameParam);
      item = data.find(p => normalize(p.name) === target);
    }

    if (!item) {
      showNotification('Product not found in data. Using defaults.', 'info');
      initProductDetailFromParams();
      return;
    }

    const product = {
      id: String(item.id || ''),
      name: item.name || 'Sample Product',
      rating: Number(item.rating ?? 0),
      soldCount: String(item.sold_count ?? item.soldCount ?? '0'),
      originalPrice: Number(item.original_price ?? item.originalPrice ?? item.discounted_price ?? 0),
      discountedPrice: Number(item.discounted_price ?? item.discountedPrice ?? 0),
      category: item.category || '',
      brand: item.brand || '',
      description: item.description || '',
      benefits: Array.isArray(item.benefits) ? item.benefits : [],
      nutrition: item.nutrition || {},
      image: item.image_url || item.image || guessImageForProduct(item.name || '')
    };

    populateProductDetail(product);
  }

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

  function guessImageForProduct(name) {
    // Fallback image mapping based on product name
    const imageMap = {
      'SQUEAKY SPORTS BALL SET': '../assets/images/Shop/Basketball.svg',
      'BONE-SHAPED PET TOYS': '../assets/images/Shop/BoneShapedPetToys.svg',
      'HIGH-GRIP TRAINING BALL': '../assets/images/Shop/BallForDog.svg',
      'KIT CAT FILLET': '../assets/images/Shop/FilletOLakes.svg',
      'ENCORE COMPLETE': '../assets/images/Shop/EncoreCatFood.svg',
      'WELLNESS SIGNATURE': '../assets/images/Shop/Wellness.svg',
      'FRISKIES': '../assets/images/Shop/Friskies.svg',
      'CHERIE': '../assets/images/Shop/Therie.svg',
      'PEDIGREE': '../assets/images/Shop/Pedigree.svg',
      'STUFFED ANIMALS': '../assets/images/Shop/StuffedAnimals.svg',
      'RAWHIDE BONE': '../assets/images/Shop/DogToysRawhide.svg'
    };
    
    for (const [key, image] of Object.entries(imageMap)) {
      if (name.toUpperCase().includes(key)) {
        return image;
      }
    }
    
    return '../assets/images/Shop/BoneShapedPetToys.svg'; // Default fallback
  }

  function formatLabel(s) {
    return (s || '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
  }

  function populateProductDetail(product) {
    const titleEl = document.querySelector('.detail-title');
    const priceEl = document.querySelector('.detail-price');
    const originalPriceEl = document.querySelector('.detail-original-price');
    const imageEl = document.querySelector('.detail-image');
    const ratingEl = document.querySelector('.detail-rating');
    const soldEl = document.querySelector('.detail-sold');
    const descEl = document.querySelector('.detail-desc');

    if (titleEl) titleEl.textContent = product.name || 'Product';
    if (priceEl) priceEl.textContent = `$${(product.discountedPrice ?? 0).toFixed(2)}`;
    if (originalPriceEl && product.originalPrice !== product.discountedPrice) {
      originalPriceEl.textContent = `$${(product.originalPrice ?? 0).toFixed(2)}`;
      originalPriceEl.style.display = 'inline';
    } else if (originalPriceEl) {
      originalPriceEl.style.display = 'none';
    }
    if (imageEl) imageEl.src = product.image;
    if (ratingEl) ratingEl.textContent = `${(product.rating ?? 0).toFixed(1)} ★`;
    if (soldEl) soldEl.textContent = `${product.soldCount || '0'} sold`;
    if (descEl && product.description) descEl.textContent = product.description;

    // Store current price for add-to-cart
    if (priceEl) priceEl.dataset.price = String(product.discountedPrice ?? 0);

    // Category
    const categoryValueEl = document.querySelector('.detail-category .category-value');
    if (categoryValueEl) categoryValueEl.textContent = product.category || '';

    // Brand
    const brandValueEl = document.querySelector('.detail-brand .brand-value');
    if (brandValueEl) brandValueEl.textContent = product.brand || '';

    // Benefits list
    const benefitsList = document.querySelector('.benefits-list');
    if (benefitsList) {
      benefitsList.innerHTML = '';
      if (Array.isArray(product.benefits) && product.benefits.length) {
        product.benefits.forEach(b => {
          const li = document.createElement('li');
          li.textContent = b;
          benefitsList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No specific benefits listed';
        benefitsList.appendChild(li);
      }
    }

    // Nutrition facts table
    const nutritionSection = document.querySelector('.detail-nutrition');
    if (nutritionSection && product.nutrition && Object.keys(product.nutrition).length > 0) {
      nutritionSection.style.display = 'block';
      
      // Update nutrition values
      Object.entries(product.nutrition).forEach(([key, value]) => {
        const valueEl = document.querySelector(`.${key}-value`);
        if (valueEl) {
          valueEl.textContent = value;
        }
      });
    } else if (nutritionSection) {
      nutritionSection.style.display = 'none';
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

  // Make functions available globally if needed
  window.initProductDetailFromXML = initProductDetailFromXML;
  window.initProductDetailFromParams = initProductDetailFromParams;
  window.initProductDetailFromData = initProductDetailFromData;
})();
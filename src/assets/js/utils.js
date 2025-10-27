(function () {
  // DOM helpers
  window.$ = (s, r = document) => r.querySelector(s);
  window.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  window.setText = (el, t) => { if (el) el.textContent = t || ""; };

  // Validators
  window.isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");
  window.isPhone = (v) => {
    const result = /^\+?\d[\d\s-]{7,}$/.test(v || "");
    console.log('isPhone validation:', v, '->', result);
    return result;
  };
  window.isPassword = (v) => {
    const result = (v || "").length >= 8;
    console.log('isPassword validation:', v, 'length:', (v || "").length, '->', result);
    return result;
  };

  // Local storage helpers
  window.getUsers = () => JSON.parse(localStorage.getItem("pc_users") || "[]");
  window.setUsers = (list) => localStorage.setItem("pc_users", JSON.stringify(list));
  window.setSession = (user) => localStorage.setItem("pc_user", JSON.stringify(user));

  // Activity logging
  window.logUserActivity = (email, activity) => {
    const users = window.getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return;
    users[idx].activities = Array.isArray(users[idx].activities) ? users[idx].activities : [];
    users[idx].activities.push({
      type: activity.type || "event",
      timestamp: new Date().toISOString(),
      detail: activity.detail || ""
    });
    window.setUsers(users);
  };
  
  // Global header badge updaters (work across all pages)
  window.updateCartBadgeCount = function() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
      if (!cartBtn) return;

      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      cartBtn.setAttribute('data-count', count);

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
        badge.textContent = String(count);
      } else {
        const badge = cartBtn.querySelector('.count-badge');
        if (badge) badge.remove();
      }
    } catch (e) {
      console.error('updateCartBadgeCount error:', e);
    }
  };

  window.updateWishlistBadgeCount = function() {
    try {
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
        badge.textContent = String(count);
      } else {
        const badge = wishlistBtn.querySelector('.count-badge');
        if (badge) badge.remove();
      }
    } catch (e) {
      console.error('updateWishlistBadgeCount error:', e);
    }
  };

  // Keep badges in sync across pages and tabs
  document.addEventListener('DOMContentLoaded', function() {
    window.updateCartBadgeCount();
    window.updateWishlistBadgeCount();
  });

  // Respond to custom events emitted by page scripts
  window.addEventListener('cartUpdated', function() {
    window.updateCartBadgeCount();
  });
  window.addEventListener('cartCountUpdated', function() {
    window.updateCartBadgeCount();
  });
  window.addEventListener('wishlistUpdated', function() {
    window.updateWishlistBadgeCount();
  });

  // Cross-tab updates via storage events
  window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
      window.updateCartBadgeCount();
    } else if (event.key === 'wishlist') {
      window.updateWishlistBadgeCount();
    }
  });
  
})();
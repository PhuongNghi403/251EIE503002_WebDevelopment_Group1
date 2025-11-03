// Product Detail Page – Full UI behaviors
// NOTE: keeps your existing data/init/cart functions and adds UI wiring.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // --- Your existing initializers ---
    if (typeof initProductDetailFromData === "function") initProductDetailFromData();
    if (typeof initProductDetailButtons === "function") initProductDetailButtons();
    if (typeof updateCartButton === "function") updateCartButton();

    // --- New UI initializers ---
    initBackButton();
    initGallery();
    initThumbNav();
    initQuantity();
    initOptions();
    initTabs();
    initWishlist();
    initReviewBars();
    initAddToCart();
    renderRelated();
  });

  // ========== BACK BUTTON ==========
  function initBackButton() {
    const back = document.querySelector(".back-btn");
    if (!back) return;
    back.addEventListener("click", (e) => {
      // nếu history không có, fallback về trang shop
      if (window.history.length > 1) return; // đã có onclick="history.back()" trong HTML
      e.preventDefault();
      window.location.href = "../pages/shop.html";
    });
  }

  // ========== GALLERY ==========
  function initGallery() {
    const mainImg = document.querySelector(".detail-media .main-image img, .detail-image");
    const track = document.querySelector(".thumbs-track");
    if (!mainImg || !track) return;

    const thumbs = [...track.querySelectorAll(".thumb")];
    // click để đổi ảnh
    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        const src = t.dataset.src || t.querySelector("img")?.src;
        if (src) mainImg.src = src;
        thumbs.forEach((x) => x.classList.remove("is-active"));
        t.classList.add("is-active");
        // snap vào giữa
        const center = t.offsetLeft - track.clientWidth / 2 + t.clientWidth / 2;
        track.scrollTo({ left: Math.max(center, 0), behavior: "smooth" });
      });

      // keyboard
      if (!t.hasAttribute("tabindex")) t.tabIndex = 0;
      t.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          t.click();
        }
      });
    });

    // set active ảnh đầu tiên nếu chưa set
    if (!track.querySelector(".thumb.is-active") && thumbs.length) {
      thumbs[0].classList.add("is-active");
      const firstSrc = thumbs[0].dataset.src || thumbs[0].querySelector("img")?.src;
      if (firstSrc) mainImg.src = firstSrc;
    }
  }

  // ========== THUMBS PREV/NEXT (robust) ==========
function initThumbNav() {
  const wrap = document.querySelector(".detail-media .thumbs");
  if (!wrap) return;

  const track = wrap.querySelector(".thumbs-track");
  const prev  = wrap.querySelector(".thumb-nav.prev");
  const next  = wrap.querySelector(".thumb-nav.next");
  if (!track || (!prev && !next)) return;

  // make sure they don't submit any form accidentally
  if (prev && !prev.hasAttribute("type")) prev.setAttribute("type", "button");
  if (next && !next.hasAttribute("type")) next.setAttribute("type", "button");

  // how far to scroll each time
  const step = () => Math.max(140, Math.floor(track.clientWidth * 0.6));

  // to cope with smooth scrolling + snap rounding
  const EPS = 3; // px tolerance

  const atStart = () => track.scrollLeft <= EPS;
  const atEnd = () => (track.scrollLeft >= (track.scrollWidth - track.clientWidth - EPS));

  const update = () => {
    if (prev) prev.disabled = atStart();
    if (next) next.disabled = atEnd();
  };

  const move = (dir) => {
    track.scrollBy({ left: dir * step(), behavior: "smooth" });
    // optimistic update so the user sees state change fast
    setTimeout(update, 16);
  };

  prev?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));

  // keep state in sync while scrolling / after it ends
  track.addEventListener("scroll", update, { passive: true });

  // Some browsers fire 'scrollend' (nice-to-have)
  if ("onscrollend" in window) {
    track.addEventListener("scrollend", update);
  } else {
    // Fallback: small debounce after last scroll event
    let t;
    track.addEventListener("scroll", () => {
      clearTimeout(t);
      t = setTimeout(update, 80);
    }, { passive: true });
  }

  // on layout changes
  window.addEventListener("resize", update);

  // initial state
  update();
}


  // ========== QUANTITY CONTROL ==========
  function initQuantity() {
    const box = document.querySelector(".quantity-control");
    if (!box) return;
    const minus = box.querySelector(".minus");
    const plus = box.querySelector(".plus");
    const input = box.querySelector("input");

    const clamp = (v) => Math.max(1, Math.min(99, v|0));

    const setVal = (v) => {
      const nv = clamp(v);
      input.value = nv;
      input.setAttribute("aria-valuenow", nv);
    };

    minus?.addEventListener("click", () => setVal((+input.value || 1) - 1));
    plus?.addEventListener("click", () => setVal((+input.value || 1) + 1));
    input?.addEventListener("input", () => setVal(+input.value || 1));

    // hợp nhất số lượng khi add to cart
    document.querySelectorAll(".btn-cart, .btn-buy").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qty = +input.value || 1;
        btn.dataset.qty = String(qty); // lấy ở hook addToCart/checkout
      });
    });
  }

  // ========== OPTIONS (màu/vị/kích cỡ) ==========
  function initOptions() {
    document.querySelectorAll(".option-group .options").forEach((group) => {
      group.addEventListener("click", (e) => {
        const btn = e.target.closest(".option");
        if (!btn) return;
        [...group.children].forEach((x) => x.classList.remove("is-active"));
        btn.classList.add("is-active");
        group.setAttribute("data-selected", btn.dataset.value || btn.textContent.trim());
      });
      // keyboard chọn bằng Enter/Space
      group.querySelectorAll(".option").forEach((opt) => {
        if (!opt.hasAttribute("tabindex")) opt.tabIndex = 0;
        opt.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            opt.click();
          }
        });
      });
    });

    // gắn option vào addToCart
    const getSelectedOptions = () => {
      const out = {};
      document.querySelectorAll(".option-group .options").forEach((g) => {
        const label = g.closest(".option-group")?.querySelector(".option-label")?.textContent?.trim() || "Option";
        const val = g.getAttribute("data-selected") ||
          g.querySelector(".option.is-active")?.dataset.value ||
          g.querySelector(".option.is-active")?.textContent?.trim();
        if (val) out[label] = val;
      });
      return out;
    };

    // hook sang addToCart/buy
    document.querySelectorAll(".btn-cart, .btn-buy").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.dataset.selectedOptions = JSON.stringify(getSelectedOptions());
      });
    });

    // patch nhẹ addToCart nếu tồn tại
    if (typeof window.addToCart === "function") {
      const originalAddToCart = window.addToCart;
      window.addToCart = function (name, image, price = 0) {
        // lấy qty & options đã gắn ở dataset của nút vừa bấm (nếu có)
        const lastTrigger =
          document.activeElement?.classList.contains("btn-cart") ||
          document.activeElement?.classList.contains("btn-buy")
            ? document.activeElement
            : null;

        const qty = lastTrigger ? parseInt(lastTrigger.dataset.qty || "1", 10) || 1 : 1;
        const opts = lastTrigger?.dataset.selectedOptions
          ? JSON.parse(lastTrigger.dataset.selectedOptions)
          : {};

        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const key = name + " " + JSON.stringify(opts);
        const found = cart.find((it) => (it.key || (it.name + " " + JSON.stringify(it.options || {}))) === key);

        if (found) {
          found.quantity = (found.quantity || 1) + qty;
        } else {
          cart.push({
            id: Date.now(),
            key,
            name,
            image,
            price,
            quantity: qty,
            options: opts,
            addedAt: new Date().toISOString(),
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        if (typeof updateCartButton === "function") updateCartButton();
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart, action: "add", productName: name } }));
      };
    }
  }

  // ========== TABS ==========
  function initTabs() {
    const tabsWrap = document.querySelector(".detail-tabs");
    if (!tabsWrap) return;
    const tabs = [...tabsWrap.querySelectorAll(".tab")];
    const panels = [...document.querySelectorAll("[role='tabpanel'], .panel")];

    const SHOW = (id) => {
      tabs.forEach((t) => {
        const active = t.id === id;
        t.setAttribute("aria-selected", active ? "true" : "false");
        t.classList.toggle("is-active", active);
      });
      panels.forEach((p) => {
        const match = p.id === (tabs.find((t) => t.id === id)?.getAttribute("aria-controls") || p.id);
        p.hidden = !match;
      });
      sessionStorage.setItem("pd.activeTab", id);
    };

    tabs.forEach((t) => {
      t.addEventListener("click", () => SHOW(t.id));
      if (!t.hasAttribute("tabindex")) t.tabIndex = 0;
      t.addEventListener("keydown", (e) => {
        // Arrow Left/Right để chuyển tab
        const idx = tabs.indexOf(t);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          tabs[(idx + 1) % tabs.length].focus();
          tabs[(idx + 1) % tabs.length].click();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          tabs[(idx - 1 + tabs.length) % tabs.length].focus();
          tabs[(idx - 1 + tabs.length) % tabs.length].click();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          t.click();
        }
      });
    });

    // khôi phục tab đã mở trước đó
    const saved = sessionStorage.getItem("pd.activeTab");
    if (saved && tabs.find((t) => t.id === saved)) SHOW(saved);
    else SHOW(tabs[0]?.id);
  }

 // ========== WISHLIST ==========
function initWishlist() {
  // chọn tất cả nút tim: trong product detail & related cards
  document.querySelectorAll(".btn.outline[aria-label='Add to wishlist'], .p-card__fav, .btn-fav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.classList.toggle("is-liked");

      // lấy thông tin sản phẩm (ưu tiên từ card, fallback detail)
      const card = btn.closest(".p-card") || document.querySelector(".detail-info");
      const name =
        card?.querySelector(".detail-title, .p-card__name")?.textContent.trim() ||
        "Unknown Product";
      const image =
        card?.querySelector("img")?.src ||
        document.querySelector(".detail-image")?.src ||
        "";

      // đọc danh sách wishlist hiện tại
      let list = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = list.find((x) => x.name === name);

      if (exists) {
        // nếu đã tồn tại → xóa
        list = list.filter((x) => x.name !== name);
        btn.classList.remove("is-liked");
        notify(`Removed from wishlist `);
      } else {
        // nếu chưa có → thêm mới
        list.push({ id: Date.now(), name, image });
        btn.classList.add("is-liked");
        notify(`Added to wishlist `);
      }

      // lưu lại
      localStorage.setItem("wishlist", JSON.stringify(list));
    });
  });

  // hiệu ứng thông báo nhỏ
  function notify(msg) {
    const n = document.createElement("div");
    n.textContent = msg;
    n.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #4D2B12;
      color: #F4E8DA;
      padding: 10px 16px;
      border-radius: 12px;
      z-index: 9999;
      font: 500 14px 'Lexend Deca', sans-serif;
      box-shadow: 0 4px 10px rgba(0,0,0,.2);
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 1400);
  }
}

  // ========== ADD TO CART BUTTONS ==========
function initAddToCart() {
  document.querySelectorAll(
    ".btn.outline[aria-label='Add to cart'], .btn.btn--small.btn--outline"
  ).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const card = btn.closest(".p-card") || document.querySelector(".detail-info");
      const name =
        card.querySelector(".title, .p-card__name")?.textContent.trim() || "Unknown Product";
      const image =
        card.querySelector("img")?.src || document.querySelector(".detail-image")?.src || "";
      const priceText =
        card.querySelector(".price-current")?.textContent ||
        card.querySelector(".p-card__price span")?.textContent ||
        "$0";
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const found = cart.find((x) => x.name === name);
      if (found) found.quantity += 1;
      else cart.push({ id: Date.now(), name, image, price, quantity: 1 });

      localStorage.setItem("cart", JSON.stringify(cart));

      showCartToast(`${name} added to cart 🛒`);
    });
  });
}

// --- Small notification popup
function showCartToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #4D2B12;
    color: #F4E8DA;
    padding: 10px 18px;
    border-radius: 12px;
    font: 500 14px 'Lexend Deca', sans-serif;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}


  // ========== REVIEW BAR ANIMATION ==========
  function initReviewBars() {
    document.querySelectorAll(".bar .bar-fill").forEach((el) => {
      const pct = parseFloat(el.dataset.percent || "0");
      el.style.width = "0%";
      requestAnimationFrame(() => {
        el.style.transition = "width .7s ease";
        el.style.width = Math.max(0, Math.min(100, pct)) + "%";
      });
    });
  }
})();
function renderSummaryBars(selector = '#summaryBars') {
  const list = document.querySelector(selector);
  if (!list) return;

  const rows = Array.from(list.querySelectorAll('.bar-row'));
  let total = rows.reduce((acc, r) => acc + (Number(r.dataset.count) || 0), 0);

  // tránh chia 0
  if (total <= 0) {
    rows.forEach(r => {
      const fill = r.querySelector('.bar-fill');
      if (fill) fill.style.width = '0%';
      const bar = r.querySelector('.bar');
      if (bar) bar.setAttribute('aria-valuenow', '0');
    });
    return;
  }

  rows.forEach(r => {
    const count = Number(r.dataset.count) || 0;
    const pct = Math.max(0, Math.min(100, (count / total) * 100));
    const fill = r.querySelector('.bar-fill');
    const bar  = r.querySelector('.bar');
    const qty  = r.querySelector('.qty');

    if (fill) fill.style.width = pct + '%';
    if (bar)  bar.setAttribute('aria-valuenow', Math.round(pct));

    if (qty) {
      // hiện “100+” nếu data-plus="true"
      qty.textContent = count.toString() + (r.dataset.plus === 'true' ? ' +' : '');
    }
  });
}

// Animate khi cuộn tới (optional, cho đẹp)
function observeBarsAppear(selector = '#summaryBars') {
  const target = document.querySelector(selector);
  if (!target) return;

  const once = { once: true };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        renderSummaryBars(selector);
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  obs.observe(target, once);
}

document.addEventListener('DOMContentLoaded', () => {
  // gọi trực tiếp hoặc dùng observer (chọn 1)
  // renderSummaryBars();
  observeBarsAppear(); // mượt hơn khi user lướt tới
});

function renderRelated() {
  const container = document.querySelector(".container.related .cards");
  if (!container || !window.products) return;
  container.innerHTML = "";
  
  window.products.slice(0, 4).forEach((p) => {
    container.innerHTML += `
      <article class="p-card">
        <div class="p-card__img">
          <img src="${p.image}" alt="${p.name}">
          <button class="p-card__fav" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36..."/></svg>
          </button>
        </div>
        <div class="p-card__body">
          <h3 class="p-card__name">${p.name}</h3>
          <div class="p-card__price"><span>$${p.price}</span></div>
          <div class="p-card__cta">
            <button class="btn btn--small btn--primary">Buy Now</button>
            <button class="btn btn--small btn--outline" aria-label="Add to cart">
              <svg class="icon-cart" viewBox="0 0 24 24"><path d="M6 6h15..."/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  });
}


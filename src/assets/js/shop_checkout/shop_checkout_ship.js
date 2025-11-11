document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  initMethodSelectionState();
  initShippingMethod();
  initAddressModal();
  initQrPayment();
  renderSavedCards();
  initCardSelectionClick();
  initAddCard();
  initUpdateCard();
  initPayNowGuard();
  initOtpPayment();
});

// Track edit state for saved cards
let editingCardIndex = null;
let editingPending = false;
// Ensure correct product image paths in checkout summaries
function resolveCheckoutImage(item) {
  const src = (item && item.image) ? String(item.image) : '';
  // Absolute or data URIs: use as-is
  if (/^(https?:|data:|\/)/.test(src)) return src;

  const norm = (s) => (String(s || '').trim().replace(/\s+/g, ' ').toLowerCase());
  let preferred = src;

  // Try to find canonical product thumbnail by name from PRODUCTS_DATA
  try {
    const list = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
    const match = list.find(p => norm(p.name) === norm(item && item.name));
    if (match) {
      preferred = match.thumbnail || (Array.isArray(match.images) ? match.images[0] : preferred) || preferred;
    }
  } catch {}

  // Normalize any path that contains assets/ to be correct from shop_checkout pages
  const idx = preferred.indexOf('assets/');
  if (idx >= 0) {
    const tail = preferred.slice(idx);
    return '../../' + tail;
  }
  // Fallback: strip leading ../ segments and prefix ../../ for assets
  const rel = preferred.replace(/^(?:\.\.\/)+/, '');
  if (rel.startsWith('assets/')) return '../../' + rel;
  return preferred;
}

function renderCheckoutSummary() {
  const itemsContainer = document.querySelector('.order-items');
  const totalsEl = document.querySelector('.totals');

  if (!itemsContainer) {
    console.warn('Order items container not found on shipping checkout page');
    return;
  }

  let items = [];
  try {
    items = JSON.parse(localStorage.getItem('checkoutItems') || '[]');
  } catch (e) {
    items = [];
  }

  // Fallback to entire cart if no explicitly selected items are found
  if (!items || items.length === 0) {
    try {
      items = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
      items = [];
    }
  }

  // Render items identical to pickup/cart summary
  itemsContainer.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'order-item';
    empty.innerHTML = `
      <div class="order-info" style="grid-column: 1 / -1;">
        <div class="order-name">No items</div>
        <div class="order-meta">Your checkout selection is empty.</div>
      </div>`;
    itemsContainer.appendChild(empty);
  } else {
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'order-item';
      const totalPrice = (Number(item.price) * Number(item.quantity || 1)) || 0;
      li.innerHTML = `
        <img class="order-thumb" src="${resolveCheckoutImage(item)}" alt="${item.name}">
        <div class="order-info">
          <div class="order-name">${item.name}</div>
          <div class="order-meta">x${item.quantity || 1}</div>
        </div>
        <div class="order-price">$${totalPrice.toFixed(2)}</div>
      `;
      itemsContainer.appendChild(li);
    });
  }

  // Totals: mirror cart behavior (no shipping charge to keep totals aligned)
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
  const discount = items.length > 0 ? 0 : 0; // Same as cart summary
  // Apply $5 shipping fee if 'standard' method is selected; otherwise $0
  let method = 'standard';
  try { method = localStorage.getItem('checkoutMethod') || 'standard'; } catch (e) {}
  const shipping = method === 'standard' ? 5 : 0;
  const total = subtotal + shipping - discount;

  if (totalsEl) {
    const subtotalSpan = totalsEl.querySelector('.row:not(.discount):not(.shipping):not(.total) span:last-child');
    const discountSpan = totalsEl.querySelector('.row.discount span:last-child');
    const shippingSpan = totalsEl.querySelector('.row.shipping span:last-child');
    const totalSpan = totalsEl.querySelector('.row.total span:last-child');
    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    if (discountSpan) discountSpan.textContent = `-$${discount.toFixed(2)}`;
    if (shippingSpan) shippingSpan.textContent = `$${shipping.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
  }

  // Persist totals for QR generation
  window.checkoutTotals = { subtotal, discount, shipping, total };
}

// Reflect selected method state if it was chosen on pickup page
function initMethodSelectionState() {
  let method = 'standard';
  try { method = localStorage.getItem('checkoutMethod') || 'standard'; } catch (e) {}
  // Mark the corresponding card as active if present
  const cards = document.querySelectorAll('.method-options .method-card');
  cards.forEach(c => {
    const isActive = c.dataset.method === method;
    c.classList.toggle('active', isActive);
    const radio = c.querySelector('input[type="radio"]');
    if (radio) radio.checked = isActive;
  });
}

function initQrPayment() {
  const qrTab = document.querySelector('.pay-tabs .pay-tab:last-child');
  const modal = document.querySelector('.qr-modal');
  const canvas = document.getElementById('qrCanvas');
  const amountEl = document.getElementById('qrAmount');
  const customerEl = document.getElementById('qrCustomer');
  const closeBtn = document.querySelector('.qr-close');
  const timerEl = document.getElementById('qrTimer');
  const doneBtn = document.querySelector('.done-qr');
  const cancelBtn = document.querySelector('.cancel-qr');
  const noteEl = modal ? modal.querySelector('.qr-note') : null;
  const doneModal = document.querySelector('.done-modal');
  const doneOk = document.querySelector('.done-ok');
  const doneClose = document.querySelector('.done-close');
  const doneView = document.querySelector('.done-view');
  let qrGatePending = false;

  function fireCuteConfetti() {
    const conf = window.confetti;
    if (!conf) return;
    const base = {
      particleCount: 90,
      spread: 70,
      startVelocity: 50,
      ticks: 200,
      scalar: 0.9,
      gravity: 0.8,
      origin: { y: 0.2 },
      zIndex: 1002,
      colors: ['#FFD1DC','#FFC3A0','#CDE7BE','#C6DEF1','#FAD2E1','#FDE3A7','#EFD3D7']
    };
    conf(Object.assign({}, base, { origin: { x: 0.2, y: 0.2 } }));
    conf(Object.assign({}, base, { origin: { x: 0.5, y: 0.2 } }));
    conf(Object.assign({}, base, { origin: { x: 0.8, y: 0.2 } }));
  }

  if (!qrTab || !modal || !canvas || !amountEl || !customerEl) return;

  let qrInstance = null;
  let countdownId = null;

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }
  
  // *** LOGIC MỚI: ĐÃ THÊM ***
  function regenerateQr() {
      const total = currentTotal();
      const name = getCustomerName();
      // Thêm token để QR luôn mới
      const value = `PAWFECTPAY|amount=${total.toFixed(2)}|token=${Date.now()}_${Math.random().toString(36).slice(2,10)}|customer=${name}`;
      if (!qrInstance) {
          qrInstance = new QRious({ element: canvas, value, size: 240 });
      } else {
          qrInstance.value = value;
      }
      amountEl.textContent = `$${total.toFixed(2)}`;
      customerEl.textContent = name;
  }

  // *** LOGIC MỚI: ĐÃ CẬP NHẬT (10 phút, tự làm mới) ***
  function startCountdown() {
    if (!timerEl) return;
    let remaining = 10 * 60 * 1000; // 10 minutes
    timerEl.textContent = formatTime(remaining);
    canvas && canvas.classList.remove('hidden');
    if (doneBtn) doneBtn.disabled = false;
    if (noteEl) noteEl.textContent = 'Scan with your banking app. QR refreshes every 10 minutes.';
    if (countdownId) clearInterval(countdownId);
    countdownId = setInterval(() => {
        remaining -= 1000;
        timerEl.textContent = formatTime(remaining);
        if (remaining <= 0) {
            // Hết giờ -> tạo QR mới và bắt đầu lại
            regenerateQr();
            remaining = 10 * 60 * 1000;
            timerEl.textContent = formatTime(remaining);
        }
    }, 1000);
  }

  // *** LOGIC MỚI: ĐÃ CẬP NHẬT (10 phút) ***
  function stopCountdown(reset = true) {
    if (countdownId) {
      clearInterval(countdownId);
      countdownId = null;
    }
    if (reset && timerEl) timerEl.textContent = '10:00'; // Cập nhật thành 10:00
    canvas && canvas.classList.remove('hidden');
    if (doneBtn) doneBtn.disabled = false;
    if (noteEl && reset) noteEl.textContent = 'Scan with your banking app. QR refreshes every 10 minutes.';
  }

  function getCustomerName() {
    const meta = document.querySelector('.saved-cards .selected .card-meta');
    if (meta && meta.textContent.includes('·')) {
      const parts = meta.textContent.split('·');
      return (parts[parts.length - 1] || '').trim() || 'Guest';
    }
    return 'Guest';
  }

  // *** ĐÃ XÓA buildQrPayload (vì regenerateQr thay thế) ***

  function currentTotal() {
    if (window.checkoutTotals && typeof window.checkoutTotals.total === 'number') {
      return window.checkoutTotals.total;
    }
    const totalSpan = document.querySelector('.totals .row.total span:last-child');
    if (!totalSpan) return 0;
    const match = (totalSpan.textContent || '').match(/\$([0-9.,]+)/);
    return match ? parseFloat(match[1].replace(',', '')) : 0;
  }

  // *** ĐÃ XÓA updateQr (vì regenerateQr thay thế) ***

  // If policy modal is accepted while gating QR, immediately show success modal
  document.addEventListener('policyAccepted', () => {
    if (!qrGatePending) return;
    qrGatePending = false;
    if (!doneModal) return;
    try {
      const totals = window.checkoutTotals || {};
      const totalEl = document.getElementById('doneTotal');
      if (totalEl && typeof totals.total === 'number') totalEl.textContent = `$${totals.total.toFixed(2)}`;
    } catch (e) {}
    const d = new Date();
    const dateEl = document.getElementById('doneOrderDate');
    if (dateEl) dateEl.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const generatedId = `UEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const orderEl = document.getElementById('doneOrderNumber');
    if (orderEl) orderEl.textContent = generatedId;
    const shipEl = document.getElementById('doneShipping');
    const activeMethod = document.querySelector('.method-options .method-card.active');
    let shippingText = 'Standard Shipping';
    if (activeMethod && activeMethod.dataset.method === 'pickup') {
      shippingText = 'Store Pick-up';
    } else {
      const summary = getSelectedAddressSummary();
      shippingText = summary ? `Standard Shipping — ${summary}` : 'Standard Shipping';
    }
    if (shipEl) shipEl.textContent = shippingText;

    try {
      let items = [];
      try { items = JSON.parse(localStorage.getItem('checkoutItems') || '[]'); } catch (_) { items = []; }
      if (!items || items.length === 0) {
        try { items = JSON.parse(localStorage.getItem('cart') || '[]'); } catch (_) { items = []; }
      }
      const totalsObj = (window.checkoutTotals || {});
      const total = typeof totalsObj.total === 'number' ? totalsObj.total : items.reduce((s,i)=>s + (Number(i.price) * Number(i.quantity||1)), 0);
      const nowIso = new Date().toISOString();
      const lastOrder = {
        id: generatedId,
        method: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'pickup' : 'shipping',
        shipping: shippingText,
        createdAt: nowIso,
        total,
        items,
        status: 'processing',
        timeline: [
          { key: 'confirmed', title: 'Order Placed', time: nowIso, note: 'Your order has been confirmed and payment received.' },
          { key: 'processing', title: 'Preparing Order', time: nowIso, note: 'We are getting your order ready.' },
          { key: 'ready', title: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'Ready To Pick-up' : 'Shipped', time: nowIso, note: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'Show your order ID at reception to receive items.' : 'Your package is on the way.' },
          { key: 'completed', title: 'Order Completed', time: nowIso, note: 'Thank you for your purchase!' }
        ]
      };
      localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
    } catch (_err) {}
    doneModal.classList.add('show');
    doneModal.setAttribute('aria-hidden', 'false');
    fireCuteConfetti();
  });

  // Bỏ mở QR tự động khi click tab; mở sau OTP
  window.__qrOpenFromOtp = window.__qrOpenFromOtp || false;

  // NEW: chọn tab + toggle UI thẻ
  const cardTab = document.querySelector('.pay-tabs .pay-tab:first-child');

  function selectPayTab(tabEl) {
    const all = document.querySelectorAll('.pay-tabs .pay-tab');
    all.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-selected', 'true');
  }

  function setCardUiVisible(visible) {
    const saved = document.querySelector('.saved-cards');
    const form = document.querySelector('.payment-form');
    if (saved) saved.style.display = visible ? '' : 'none';
    if (form) form.style.display = visible ? '' : 'none';
  }

  // Khởi tạo: Card đang active → hiện UI thẻ
  setCardUiVisible(true);

  cardTab && cardTab.addEventListener('click', () => {
    selectPayTab(cardTab);
    setCardUiVisible(true);
    // Không mở modal ở đây
  });

  qrTab && qrTab.addEventListener('click', () => {
    // Luôn cho phép chọn tab QR
    selectPayTab(qrTab);
    setCardUiVisible(false);

    // Chỉ mở modal QR nếu flow xuất phát từ OTP confirm
    if (!window.__qrOpenFromOtp) return;
    window.__qrOpenFromOtp = false;
    regenerateQr();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    startCountdown();
  });

  closeBtn && closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    stopCountdown(true);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      stopCountdown(true);
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      alert('Payment canceled');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      stopCountdown(true);
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      stopCountdown(true);
      if (doneModal) {
        // Populate basic order details if available
        try {
          const totals = window.checkoutTotals || {};
          const totalEl = document.getElementById('doneTotal');
          if (totalEl && typeof totals.total === 'number') totalEl.textContent = `$${totals.total.toFixed(2)}`;
        } catch (e) {}
        // Basic timestamp
        const d = new Date();
        const dateEl = document.getElementById('doneOrderDate');
        if (dateEl) dateEl.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        // Order number
        const generatedId = `UEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const orderEl = document.getElementById('doneOrderNumber');
        if (orderEl) orderEl.textContent = generatedId;
        // Shipping detail based on current selection
        const shipEl = document.getElementById('doneShipping');
        const activeMethod = document.querySelector('.method-options .method-card.active');
        let shippingText = 'Standard Shipping';
        if (activeMethod && activeMethod.dataset.method === 'pickup') {
          shippingText = 'Store Pick-up';
        } else {
          const summary = getSelectedAddressSummary();
          shippingText = summary ? `Standard Shipping — ${summary}` : 'Standard Shipping';
        }
        if (shipEl) shipEl.textContent = shippingText;

        // Persist latest order in localStorage for profile page
        try {
          let items = [];
          try { items = JSON.parse(localStorage.getItem('checkoutItems') || '[]'); } catch (_) { items = []; }
          if (!items || items.length === 0) {
            try { items = JSON.parse(localStorage.getItem('cart') || '[]'); } catch (_) { items = []; }
          }
          const totalsObj = (window.checkoutTotals || {});
          const total = typeof totalsObj.total === 'number' ? totalsObj.total : items.reduce((s,i)=>s + (Number(i.price) * Number(i.quantity||1)), 0);
          const nowIso = new Date().toISOString();
          const lastOrder = {
            id: generatedId,
            method: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'pickup' : 'shipping',
            shipping: shippingText,
            createdAt: nowIso,
            total,
            items,
            status: 'processing',
            timeline: [
              { key: 'confirmed', title: 'Order Placed', time: nowIso, note: 'Your order has been confirmed and payment received.' },
              { key: 'processing', title: 'Preparing Order', time: nowIso, note: 'We are getting your order ready.' },
              { key: 'ready', title: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'Ready To Pick-up' : 'Shipped', time: nowIso, note: (activeMethod && activeMethod.dataset.method === 'pickup') ? 'Show your order ID at the reception to receive items.' : 'Your package is on the way.' },
              { key: 'completed', title: 'Order Completed', time: nowIso, note: 'Thank you for your purchase!' }
            ]
          };
          localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        } catch (_err) {}
        doneModal.classList.add('show');
        doneModal.setAttribute('aria-hidden', 'false');
        fireCuteConfetti();
      }
    });
  }

  // Done modal listeners
  doneClose && doneClose.addEventListener('click', () => {
    doneModal && doneModal.classList.remove('show');
    doneModal && doneModal.setAttribute('aria-hidden', 'true');
  });
  doneOk && doneOk.addEventListener('click', () => {
    doneModal && doneModal.classList.remove('show');
    doneModal && doneModal.setAttribute('aria-hidden', 'true');
  });
  doneModal && doneModal.addEventListener('click', (e) => {
    if (e.target === doneModal) {
      doneModal.classList.remove('show');
      doneModal.setAttribute('aria-hidden', 'true');
    }
  });

  doneView && doneView.addEventListener('click', () => {
    // Navigate to the relocated profile order status page
    window.location.href = '../profile/profile_orderstatus.html';
  });

  // Keep QR in sync if totals change while the modal is open
  const totalsEl = document.querySelector('.totals');
  if (totalsEl) {
    const obs = new MutationObserver(() => {
      // *** THAY ĐỔI: Gọi regenerateQr() thay vì updateQr() ***
      if (modal.classList.contains('show')) regenerateQr();
    });
    obs.observe(totalsEl, { subtree: true, childList: true, characterData: true });
  }
}

// Enable switching to pickup checkout when the pickup method is selected
function initShippingMethod() {
  const optionCards = document.querySelectorAll('.method-options .method-card');
  if (!optionCards || optionCards.length === 0) return;

  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const method = card.dataset.method;
      optionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      try { localStorage.setItem('checkoutMethod', method); } catch (e) {}

      if (method === 'pickup') {
        // Navigate to pickup checkout page
        window.location.href = 'shop_checkout_pickup.html';
      } else if (method === 'standard') {
        // Stay on shipping page and ensure $5 fee is applied
        renderCheckoutSummary();
      }
    });
  });
}

// Summarize the selected address for receipts/modals
function getSelectedAddressSummary() {
  try {
    const list = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    let id = localStorage.getItem('selectedAddressId');
    let addr = null;
    if (id) addr = list.find(a => a.id === id) || null;
    if (!addr) addr = list.find(a => a.isDefault) || list[0] || null;
    if (!addr) return '';
    return `${addr.address}, ${addr.ward}, ${addr.city}`;
  } catch (e) { return ''; }
}

// Add Shipping Address modal: open, validate, save, and render summary
function initAddressModal() {
  const addBtn = document.querySelector('.address-empty .add-address, .address-empty .btn');
  const modal = document.querySelector('.address-modal');
  if (!addBtn || !modal) return;

  const closeBtn = modal.querySelector('.address-close');
  const cancelBtn = modal.querySelector('.address-cancel');
  const saveBtn = modal.querySelector('.address-save');

  const fullName = document.getElementById('addrFullName');
  const phone = document.getElementById('addrPhone');
  const addressLine = document.getElementById('addrAddress');
  const ward = document.getElementById('addrWard');
  const city = document.getElementById('addrCity');
  const def = document.getElementById('addrDefault');
  let editingAddressId = null;

  // Multiple addresses storage helpers
  function getAddresses() {
    try { return JSON.parse(localStorage.getItem('savedAddresses') || '[]'); } catch (e) { return []; }
  }
  function setAddresses(list) {
    try { localStorage.setItem('savedAddresses', JSON.stringify(list)); } catch (e) {}
  }
  function getSelectedId() {
    try { return localStorage.getItem('selectedAddressId'); } catch (e) { return null; }
  }
  function setSelectedId(id) {
    try { localStorage.setItem('selectedAddressId', id); } catch (e) {}
  }
  function migrateSingleAddressIfNeeded() {
    try {
      const legacy = JSON.parse(localStorage.getItem('shippingAddress') || 'null');
      const existing = getAddresses();
      if (legacy && (!existing || existing.length === 0)) {
        const id = 'addr_' + String(Date.now());
        const obj = { id, ...legacy };
        setAddresses([obj]);
        setSelectedId(id);
        localStorage.removeItem('shippingAddress');
      }
    } catch (e) {}
  }

  function open() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => { fullName && fullName.focus(); }, 50);
  }
  function close() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function clearFields() {
    if (fullName) fullName.value = '';
    if (phone) phone.value = '';
    if (addressLine) addressLine.value = '';
    if (ward) ward.value = '';
    if (city) city.value = '';
    if (def) def.checked = false;
  }

  function fillFields(addr) {
    if (!addr) return;
    if (fullName) fullName.value = addr.fullName || '';
    if (phone) phone.value = addr.phone || '';
    if (addressLine) addressLine.value = addr.address || '';
    if (ward) ward.value = addr.ward || '';
    if (city) city.value = addr.city || '';
    if (def) def.checked = !!addr.isDefault;
  }

  addBtn.addEventListener('click', () => { clearFields(); open(); });
  closeBtn && closeBtn.addEventListener('click', close);
  cancelBtn && cancelBtn.addEventListener('click', (e) => { e.preventDefault(); close(); });
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  function validate() {
    const fields = [fullName, phone, addressLine, ward, city];
    const firstInvalid = fields.find(f => !f || !String(f.value).trim());
    if (firstInvalid) {
      firstInvalid.focus();
      alert('Please fill in all required fields.');
      return false;
    }
    const digits = (phone && phone.value || '').replace(/\D/g, '');
    if (digits.length < 9) {
      phone && phone.focus();
      alert('Please enter a valid phone number.');
      return false;
    }
    return true;
  }

  function renderAddressSection() {
    const container = document.querySelector('.checkout-section .address-list')
      || document.querySelector('.checkout-section .address-empty')
      || document.querySelector('.checkout-section > .address-card');
    if (!container) return;
    const list = getAddresses();
    if (!list || list.length === 0) {
      if (container.classList.contains('address-list') || container.classList.contains('address-card')) {
        container.outerHTML = `
          <div class="address-empty" style="background:#FAF4EC;border:1px solid #E9E4DC;border-radius:12px;padding:16px;display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;">
            <div style="width:36px;height:36px;border-radius:10px;background:#FFF;border:1px solid #EEE2D4;display:flex;align-items:center;justify-content:center;color:#7B5E47;">📍</div>
            <div>
              <div style="font:600 14px/1.2 'Lexend Deca';color:#4D2B12;">No saved addresses yet</div>
              <div style="font:400 12px/1.2 'Lexend Deca';color:#7B5E47;">Please add your address to continue</div>
            </div>
            <button class="btn add-address" style="background:#FFF;">+ Add Shipping Address</button>
          </div>`;
      }
      return;
    }
    const selectedId = getSelectedId() || (list.find(a => a.isDefault)?.id || list[0].id);
    setSelectedId(selectedId);
    const html = `
      <div class="address-list">
        <div class="address-list-header">
          <div class="label">Select shipping address</div>
          <button class="btn add-address">Add New</button>
        </div>
        <div class="address-list-body">
          ${list.map(a => `
            <div class="address-card">
              <label class="address-select-row">
                <input type="radio" name="addressSelect" class="address-select" data-id="${a.id}" ${a.id === selectedId ? 'checked' : ''} />
                <div class="address-info">
                  <div class="address-line1">${a.fullName} · ${a.phone}${a.isDefault ? ' · Default' : ''}</div>
                  <div class="address-line2">${a.address}, ${a.ward}, ${a.city}</div>
                </div>
              </label>
              <div class="address-card-actions">
                <button class="btn ghost address-update" data-id="${a.id}">Update</button>
                <button class="btn ghost address-delete" data-id="${a.id}">Delete</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
    container.outerHTML = html;
  }

  saveBtn && saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const obj = {
      id: editingAddressId || ('addr_' + String(Date.now())),
      fullName: String(fullName.value).trim(),
      phone: String(phone.value).trim(),
      address: String(addressLine.value).trim(),
      ward: String(ward.value).trim(),
      city: String(city.value).trim(),
      isDefault: !!(def && def.checked)
    };
    migrateSingleAddressIfNeeded();
    const list = getAddresses();
    let next = Array.isArray(list) ? [...list] : [];
    const idx = next.findIndex(a => a.id === obj.id);
    if (idx >= 0) {
      next[idx] = obj;
    } else {
      next.push(obj);
      setSelectedId(obj.id);
    }
    if (obj.isDefault) next = next.map(a => ({ ...a, isDefault: a.id === obj.id }));
    setAddresses(next);
    renderAddressSection();
    close();
  });

  // Load existing addresses on page load (migrate legacy single address if needed)
  migrateSingleAddressIfNeeded();
  renderAddressSection();

  // Delegate actions for dynamically inserted buttons
  document.addEventListener('click', (e) => {
    const addNewBtn = e.target.closest && e.target.closest('.address-add-new, .add-address');
    const updateBtn = e.target.closest && e.target.closest('.address-update');
    const deleteBtn = e.target.closest && e.target.closest('.address-delete');
    if (addNewBtn) {
      editingAddressId = null;
      clearFields();
      open();
    } else if (updateBtn) {
      const id = updateBtn.getAttribute('data-id');
      editingAddressId = id;
      const list = getAddresses();
      const found = list.find(a => a.id === id);
      if (found) fillFields(found); else clearFields();
      open();
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const confirmDelete = window.confirm('Are you sure you want to delete this address?');
      if (!confirmDelete) return;
      let list = getAddresses();
      const idx = list.findIndex(a => a.id === id);
      if (idx >= 0) {
        list.splice(idx, 1);
        setAddresses(list);
        const selectedId = getSelectedId();
        if (selectedId === id) {
          const nextSelected = (list.find(a => a.isDefault)?.id) || (list[0]?.id) || null;
          if (nextSelected) setSelectedId(nextSelected); else try { localStorage.removeItem('selectedAddressId'); } catch (e) {}
        }
        renderAddressSection();
      }
    }
  });

  document.addEventListener('change', (e) => {
    const radio = e.target.closest && e.target.closest('.address-select');
    if (radio && radio.checked) {
      const id = radio.getAttribute('data-id');
      if (id) setSelectedId(id);
    }
  });
}

// Render saved cards from localStorage, keeping the existing default card visible
function renderSavedCards() {
  const container = document.querySelector('.saved-cards');
  if (!container) return;
  const addBtn = container.querySelector('.add-card');
  let saved = [];
  let selectedName = null;
  try {
    saved = JSON.parse(localStorage.getItem('savedCards') || '[]');
    selectedName = localStorage.getItem('selectedCardName');
  } catch (e) {}

  if (!Array.isArray(saved) || saved.length === 0 || !addBtn) return;

  // Insert new cards before the Add button
  saved.forEach((card, idx) => {
    const row = document.createElement('div');
    row.className = 'card-row';
    row.setAttribute('data-card-index', String(idx));
    row.innerHTML = `
      <div class="card-left">
        <span class="card-brand">${card.brand || 'CARD'}</span>
        <span class="card-number">${card.masked || '•••• •••• •••• ' + (card.last4 || '0000')}</span>
        <span class="card-meta">${card.meta || ''}</span>
      </div>
      <button class="btn ghost edit">Edit</button>
      <button class="btn ghost delete">Delete</button>
    `;
    addBtn.parentNode.insertBefore(row, addBtn);
    if (selectedName && card.name && card.name === selectedName) {
      // Unselect others, select this
      container.querySelectorAll('.card-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      const radioSelected = row.querySelector('input[type="radio"]');
      if (radioSelected) radioSelected.checked = true;
    }
  });
}

// Allow selecting any saved card by clicking its row
function initCardSelectionClick() {
  const container = document.querySelector('.saved-cards');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit');
    const deleteBtn = e.target.closest('.delete');
    const row = e.target.closest('.card-row');
    if (!row) return;

    // Handle Edit: prefill the payment form with this card's data
    if (editBtn) {
      const idxAttr = row.getAttribute('data-card-index');
      let card = null;
      if (idxAttr) {
        // Saved card with full data in localStorage
        try {
          const saved = JSON.parse(localStorage.getItem('savedCards') || '[]');
          const idx = parseInt(idxAttr, 10);
          card = saved[idx];
        } catch (err) {}
      }
      if (!card) {
        // Fallback: derive from DOM
        const brand = (row.querySelector('.card-brand')?.textContent || 'VISA').trim();
        const metaTxt = (row.querySelector('.card-meta')?.textContent || '').trim();
        const name = metaTxt.includes('·') ? (metaTxt.split('·').pop() || '').trim() : metaTxt;
        const expiryMatch = metaTxt.match(/Expires\s+(\d{2}\/\d{2})/);
        const expiry = expiryMatch ? expiryMatch[1] : '';
        let number = '4242424242424242';
        let cvv = '123';
        if (/^MASTERCARD/i.test(brand)) { number = '5555555555554444'; cvv = '123'; }
        else if (/^AMEX/i.test(brand)) { number = '378282246310005'; cvv = '1234'; }
        card = { brand, number, cvv, name, expiry };
      }
      prefillPaymentFormFromCard(card);
      // Set edit state and focus Card Number
      const idxAttr2 = row.getAttribute('data-card-index');
      editingCardIndex = idxAttr2 ? parseInt(idxAttr2, 10) : null;
      editingPending = true;
      const numEl = document.getElementById('cardNumber');
      if (numEl) numEl.focus();
      return;
    }

    // Handle Delete: remove from DOM and storage if applicable
    if (deleteBtn) {
      const proceed = window.confirm('Are you sure you want to delete this saved card?');
      if (!proceed) return;
      const idxAttr = row.getAttribute('data-card-index');
      if (idxAttr) {
        try {
          const saved = JSON.parse(localStorage.getItem('savedCards') || '[]');
          const idx = parseInt(idxAttr, 10);
          if (!isNaN(idx)) {
            saved.splice(idx, 1);
            localStorage.setItem('savedCards', JSON.stringify(saved));
          }
        } catch (err) {}
        refreshSavedCardsDom();
      } else {
        row.remove();
      }
      // Clear edit state on delete
      editingCardIndex = null;
      editingPending = false;
      return;
    }

    // Otherwise, selecting the row marks it as the active card
    container.querySelectorAll('.card-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    const meta = row.querySelector('.card-meta');
    if (meta) {
      const txt = meta.textContent || '';
      let name = txt;
      if (txt.includes('·')) {
        const parts = txt.split('·');
        name = (parts[parts.length - 1] || '').trim();
      }
      try { localStorage.setItem('selectedCardName', name); } catch (err) {}
    }
  });
}

// Validate inputs and add a new saved card
function initAddCard() {
  const addBtn = document.querySelector('.saved-cards .add-card');
  if (!addBtn) return;
  addBtn.addEventListener('click', () => {
    if (editingPending) {
      alert('You have edited a card. Please click "Update Card" to save changes first.');
      const numElFocus = document.getElementById('cardNumber');
      if (numElFocus) numElFocus.focus();
      return;
    }
    const numEl = document.getElementById('cardNumber');
    const nameEl = document.getElementById('cardName');
    const expiryEl = document.getElementById('expiry');
    const cvvEl = document.getElementById('cvv');
    const termsEl = document.querySelector('.terms input[type="checkbox"]');

    const number = (numEl?.value || '').replace(/\s+/g, '');
    const name = (nameEl?.value || '').trim();
    const expiry = (expiryEl?.value || '').trim();
    const cvv = (cvvEl?.value || '').trim();
    const agreed = !!termsEl && termsEl.checked === true;

    // Basic validation
    const errors = [];
    if (!number || !/^\d{13,19}$/.test(number)) errors.push('Card number must be 13–19 digits.');
    if (!name) errors.push('Cardholder name is required.');
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errors.push('Expiry must be in MM/YY format.');
    if (!/^\d{3,4}$/.test(cvv)) errors.push('CVV must be 3–4 digits.');
    if (!agreed) errors.push('You must agree to the terms.');

    [numEl, nameEl, expiryEl, cvvEl].forEach(el => el && el.setAttribute('aria-invalid', 'false'));
    if (errors.length) {
      // Focus Card Number when inputs are not filled yet
      if (numEl) numEl.focus();
      if (numEl && (!number || !/^\d{13,19}$/.test(number))) numEl.setAttribute('aria-invalid', 'true');
      if (nameEl && !name) nameEl.setAttribute('aria-invalid', 'true');
      if (expiryEl && !/^\d{2}\/\d{2}$/.test(expiry)) expiryEl.setAttribute('aria-invalid', 'true');
      if (cvvEl && !/^\d{3,4}$/.test(cvv)) cvvEl.setAttribute('aria-invalid', 'true');
      alert(errors.join('\n'));
      return;
    }

    // Determine brand (simple heuristic)
    let brand = 'CARD';
    if (number.startsWith('4')) brand = 'VISA';
    else if (/^5[1-5]/.test(number)) brand = 'MASTERCARD';
    else if (/^3[47]/.test(number)) brand = 'AMEX';

    const last4 = number.slice(-4);
    const masked = `•••• •••• •••• ${last4}`;
    const meta = `Expires ${expiry} · ${name}`;

    // Persist to localStorage
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem('savedCards') || '[]'); } catch (e) { saved = []; }
    saved.push({ brand, last4, masked, meta, name, number, cvv, expiry });
    try {
      localStorage.setItem('savedCards', JSON.stringify(saved));
      localStorage.setItem('selectedCardName', name);
    } catch (e) {}

    // Inject into DOM and mark as selected
    const container = document.querySelector('.saved-cards');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'card-row selected';
    row.setAttribute('data-card-index', String((saved.length - 1)));
    row.innerHTML = `
      <div class="card-left">
        <span class="card-brand">${brand}</span>
        <span class="card-number">${masked}</span>
        <span class="card-meta">${meta}</span>
      </div>
      <button class="btn ghost edit">Edit</button>
      <button class="btn ghost delete">Delete</button>
    `;
    const addButton = container.querySelector('.add-card');
    container.querySelectorAll('.card-row').forEach(r => r.classList.remove('selected'));
    if (addButton) addButton.parentNode.insertBefore(row, addButton);

    // Clear form after successful add
    if (numEl) numEl.value = '';
    if (nameEl) nameEl.value = '';
    if (expiryEl) expiryEl.value = '';
    if (cvvEl) cvvEl.value = '';

    alert('Card added successfully!');
  });
}

function initUpdateCard() {
  const updateBtn = document.querySelector('.saved-cards .update-card');
  if (!updateBtn) return;
  updateBtn.addEventListener('click', () => {
    if (!editingPending) {
      alert('No card is currently being edited. Click "Edit" on a saved card first.');
      return;
    }

    const numEl = document.getElementById('cardNumber');
    const nameEl = document.getElementById('cardName');
    const expiryEl = document.getElementById('expiry');
    const cvvEl = document.getElementById('cvv');
    const termsEl = document.querySelector('.terms input[type="checkbox"]');

    const number = (numEl?.value || '').replace(/\s+/g, '');
    const name = (nameEl?.value || '').trim();
    const expiry = (expiryEl?.value || '').trim();
    const cvv = (cvvEl?.value || '').trim();
    const agreed = !!termsEl && termsEl.checked === true;

    const errors = [];
    if (!number || !/^\d{13,19}$/.test(number)) errors.push('Card number must be 13–19 digits.');
    if (!name) errors.push('Cardholder name is required.');
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errors.push('Expiry must be in MM/YY format.');
    if (!/^\d{3,4}$/.test(cvv)) errors.push('CVV must be 3–4 digits.');
    if (!agreed) errors.push('You must agree to the terms.');

    [numEl, nameEl, expiryEl, cvvEl].forEach(el => el && el.setAttribute('aria-invalid', 'false'));
    if (errors.length) {
      if (numEl) numEl.focus();
      if (numEl && (!number || !/^\d{13,19}$/.test(number))) numEl.setAttribute('aria-invalid', 'true');
      if (nameEl && !name) nameEl.setAttribute('aria-invalid', 'true');
      if (expiryEl && !/^\d{2}\/\d{2}$/.test(expiry)) expiryEl.setAttribute('aria-invalid', 'true');
      if (cvvEl && !/^\d{3,4}$/.test(cvv)) cvvEl.setAttribute('aria-invalid', 'true');
      alert(errors.join('\n'));
      return;
    }

    // Brand and masked formatting
    let brand = 'CARD';
    if (number.startsWith('4')) brand = 'VISA';
    else if (/^5[1-5]/.test(number)) brand = 'MASTERCARD';
    else if (/^3[47]/.test(number)) brand = 'AMEX';
    const last4 = number.slice(-4);
    const masked = `•••• •••• •••• ${last4}`;
    const meta = `Expires ${expiry} · ${name}`;

    // Update either saved card (has index) or default row
    if (editingCardIndex !== null) {
      try {
        const saved = JSON.parse(localStorage.getItem('savedCards') || '[]');
        if (editingCardIndex >= 0 && editingCardIndex < saved.length) {
          saved[editingCardIndex] = { brand, last4, masked, meta, name, number, cvv, expiry };
          localStorage.setItem('savedCards', JSON.stringify(saved));
        }
      } catch (err) {}
      refreshSavedCardsDom();
    } else {
      const selectedRow = document.querySelector('.saved-cards .card-row.selected') || document.querySelector('.saved-cards .card-row');
      if (selectedRow) {
        const brandEl = selectedRow.querySelector('.card-brand');
        const numberEl = selectedRow.querySelector('.card-number');
        const metaEl = selectedRow.querySelector('.card-meta');
        if (brandEl) brandEl.textContent = brand;
        if (numberEl) numberEl.textContent = masked;
        if (metaEl) metaEl.textContent = meta;
      }
    }

    editingCardIndex = null;
    editingPending = false;
    alert('Card updated successfully.');
  });
}

function initPayNowGuard() {
  const payBtn = document.querySelector('.order-card .btn.pay');
  if (!payBtn) return;
  payBtn.addEventListener('click', (e) => {
    if (editingPending) {
      e.preventDefault();
      alert('You have unsaved changes to a card. Click "Update Card" before proceeding.');
      const numElFocus = document.getElementById('cardNumber');
      if (numElFocus) numElFocus.focus();
    }
  });
}

// OTP flow for card payments on shipping page
function initOtpPayment() {
  const payBtn = document.querySelector('.order-card .btn.pay');
  const termsEl = document.querySelector('.terms input[type="checkbox"]');
  const cardTab = document.querySelector('.pay-tabs .pay-tab:first-child');
  // *** LOGIC MỚI: ĐÃ THÊM ***
  const qrTab = document.querySelector('.pay-tabs .pay-tab:last-child');
  const otpModal = document.querySelector('.otp-modal');
  const otpClose = document.querySelector('.otp-close');
  const otpConfirm = document.querySelector('.otp-confirm');
  const otpResend = document.querySelector('.otp-resend');
  const otpInput = document.getElementById('otpCodeInput');
  const otpPhoneEl = document.getElementById('otpPhone');
  const timerEl = document.getElementById('otpTimer');
  let countdownId = null;
  let otpGatePending = true;

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function startOtpCountdown() {
    let remaining = 2 * 60 * 1000; // 2 minutes
    if (timerEl) timerEl.textContent = formatTime(remaining);
    if (countdownId) clearInterval(countdownId);
    countdownId = setInterval(() => {
      remaining -= 1000;
      if (timerEl) timerEl.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(countdownId);
        countdownId = null;
        if (timerEl) timerEl.textContent = '00:00';
      }
    }, 1000);
  }

  function stopOtpCountdown(reset = true) {
    if (countdownId) {
      clearInterval(countdownId);
      countdownId = null;
    }
    if (reset && timerEl) timerEl.textContent = '02:00';
  }

  // *** LOGIC MỚI: ĐÃ CẬP NHẬT (bỏ cardTab check) ***
  if (!payBtn || !otpModal) return;

  // Nếu user vừa Accept policy khi gating OTP, mở OTP ngay
  document.addEventListener('policyAccepted', () => {
    if (!otpGatePending) return;
    // Re-check login before proceeding, to ensure auth gate runs before terms
    let user = null;
    try { user = JSON.parse(localStorage.getItem('pc_user') || 'null'); } catch (_) {}
    const loggedIn = !!(user && typeof user === 'object' && Object.keys(user).length);
    if (!loggedIn) {
      alert('Please log in or sign up before placing an order.');
      try { window.location.href = '../login-signup.html'; } catch (_) {}
      return;
    }
    otpGatePending = false;
    openOtp();
  });

  function resolvePhoneText() {
    const phoneInput = document.getElementById('addrPhone');
    const val = (phoneInput?.value || '').trim();
    return val || 'your phone';
  }

  function openOtp() {
    if (otpPhoneEl) otpPhoneEl.textContent = resolvePhoneText();
    if (otpInput) otpInput.value = '';
    otpModal.classList.add('show');
    otpModal.setAttribute('aria-hidden', 'false');
    startOtpCountdown();
  }

  // *** LOGIC MỚI: ĐÃ CẬP NHẬT (bỏ check active tab) ***
  payBtn.addEventListener('click', (e) => {
    // ĐÃ XÓA: if (!cardTab.classList.contains('active')) return;
    if (editingPending) {
      e.preventDefault();
      alert('You have unsaved changes to a card. Click "Update Card" before proceeding.');
      const numElFocus = document.getElementById('cardNumber');
      if (numElFocus) numElFocus.focus();
      return;
    }
    // Require login before placing an order / entering OTP flow
    let user = null;
    try { user = JSON.parse(localStorage.getItem('pc_user') || 'null'); } catch (_) {}
    const loggedIn = !!(user && typeof user === 'object' && Object.keys(user).length);
    if (!loggedIn) {
      e.preventDefault();
      alert('Please log in or sign up before placing an order.');
      try { window.location.href = '../login-signup.html'; } catch (_) {}
      return;
    }
    if (!termsEl || !termsEl.checked) {
      e.preventDefault();
      alert('Please agree to the terms before paying.');
      // Gate via policy modal and open OTP immediately after acceptance
      otpGatePending = true;
      if (window.policyModal && typeof window.policyModal.ensureAccepted === 'function') {
        try { window.policyModal.ensureAccepted(payBtn); } catch (_) { window.policyModal.open?.(); }
      } else {
        try { window.policyModal?.open(); } catch (_) {}
      }
      return;
    }
    e.preventDefault();
    openOtp();
  });

  otpConfirm && otpConfirm.addEventListener('click', () => {
    // Accept any OTP entered by user
    const code = otpInput ? otpInput.value.trim() : '';

    // Yêu cầu OTP đúng 6 chữ số
    if (!/^\d{6}$/.test(code)) {
      alert('OTP không hợp lệ. Mã mới đã được gửi lại.');
      if (otpInput) otpInput.value = '';
      startOtpCountdown();
      return;
    }

    // OTP hợp lệ -> đóng OTP và tiếp tục luồng "Done"
    otpModal.classList.remove('show');
    otpModal.setAttribute('aria-hidden', 'true');
    stopOtpCountdown(true);

    // *** LOGIC MỚI: ĐÃ THÊM (Kiểm tra tab QR) ***
    if (qrTab && qrTab.classList.contains('active')) {
        // Nếu là tab QR, chỉ cần click() để mở modal QR (với countdown 10p mới)
        window.__qrOpenFromOtp = true;
        qrTab.click(); 
        return;
    }

    // (Chỉ chạy nếu là tab Card)
    const doneModal = document.querySelector('.done-modal');
    if (doneModal) {
      try {
        const totals = window.checkoutTotals || {};
        const totalEl = document.getElementById('doneTotal');
        if (totalEl && typeof totals.total === 'number') totalEl.textContent = `$${totals.total.toFixed(2)}`;
      } catch (e) {}
      const d = new Date();
      const dateEl = document.getElementById('doneOrderDate');
      if (dateEl) dateEl.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const generatedId = `UEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const orderEl = document.getElementById('doneOrderNumber');
      if (orderEl) orderEl.textContent = generatedId;
      const shipEl = document.getElementById('doneShipping');
      const summary = getSelectedAddressSummary();
      const shippingText = summary ? `Standard Shipping — ${summary}` : 'Standard Shipping';
      if (shipEl) shipEl.textContent = shippingText;
      // Persist latest order for profile page
      try {
        let items = [];
        try { items = JSON.parse(localStorage.getItem('checkoutItems') || '[]'); } catch (_) { items = []; }
        if (!items || items.length === 0) {
          try { items = JSON.parse(localStorage.getItem('cart') || '[]'); } catch (_) { items = []; }
        }
        const totalsObj = (window.checkoutTotals || {});
        const total = typeof totalsObj.total === 'number' ? totalsObj.total : items.reduce((s,i)=>s + (Number(i.price) * Number(i.quantity||1)), 0);
        const nowIso = new Date().toISOString();
        const lastOrder = {
          id: generatedId,
          method: 'shipping',
          shipping: shippingText,
          createdAt: nowIso,
          total,
          items,
          status: 'processing',
          timeline: [
            { key: 'confirmed', title: 'Order Placed', time: nowIso, note: 'Your order has been confirmed and payment received.' },
            { key: 'processing', title: 'Preparing Order', time: nowIso, note: 'We are getting your order ready.' },
            { key: 'ready', title: 'Shipped', time: nowIso, note: 'Your package is on the way.' },
            { key: 'completed', title: 'Order Completed', time: nowIso, note: 'Thank you for your purchase!' }
          ]
        };
        localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
      } catch (_err) {}
      doneModal.classList.add('show');
      doneModal.setAttribute('aria-hidden', 'false');
      try {
        const conf = window.confetti; if (conf) conf({ particleCount: 80, spread: 70, origin: { y: 0.2 } });
      } catch (e) {}
    }
  });

  otpResend && otpResend.addEventListener('click', () => {
    alert('A new OTP has been sent.');
    if (otpInput) otpInput.value = '';
    startOtpCountdown();
  });

  otpClose && otpClose.addEventListener('click', () => {
    otpModal.classList.remove('show');
    otpModal.setAttribute('aria-hidden', 'true');
    stopOtpCountdown(true);
  });
  otpModal.addEventListener('click', (e) => {
    if (e.target === otpModal) {
      otpModal.classList.remove('show');
      otpModal.setAttribute('aria-hidden', 'true');
      stopOtpCountdown(true);
    }
  });
}

function prefillPaymentFormFromCard(card) {
  const numEl = document.getElementById('cardNumber');
  const nameEl = document.getElementById('cardName');
  const expiryEl = document.getElementById('expiry');
  const cvvEl = document.getElementById('cvv');
  if (numEl) numEl.value = (card?.number || '').replace(/(\d{4})(?=\d)/g, '$1 ');
  if (nameEl) nameEl.value = card?.name || '';
  if (expiryEl) expiryEl.value = card?.expiry || '';
  if (cvvEl) cvvEl.value = card?.cvv || '';
}

function refreshSavedCardsDom() {
  const container = document.querySelector('.saved-cards');
  if (!container) return;
  const addBtn = container.querySelector('.add-card');
  container.querySelectorAll('.card-row[data-card-index]').forEach(r => r.remove());
  if (addBtn) {
    renderSavedCards();
  }
}
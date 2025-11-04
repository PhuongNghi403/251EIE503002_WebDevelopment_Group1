document.addEventListener('DOMContentLoaded', () => {

  // --- DATABASE (Giả lập) ---
  const packageOptions = {
    'basic': { name: 'Cozy Room (Basic)', price: 40 },
    'premium': { name: 'Premium Retreat', price: 55 },
    'luxury': { name: 'Luxury Suite', price: 75 }
  };
  
  // --- STATE (Trạng thái của booking) ---
  let bookingState = {
    package: packageOptions['premium'], // Mặc định
    duration: 1, 
    treats: [], 
    addOns: [], 
    discount: { code: null, percentage: 0 },
  };
  
  // --- DOM ELEMENTS (Lấy các phần tử Sidebar) ---
  const pkgNameEl = document.getElementById('package-name');
  const pkgPriceEl = document.getElementById('package-price');
  const dayCountEl = document.getElementById('day-count');
  const checkinDateEl = document.getElementById('checkin-date');
  const checkoutDateEl = document.getElementById('checkout-date');
  
  const treatsListEl = document.getElementById('treats-list');
  const addOnsListEl = document.getElementById('addons-list');
  const treatsCountEl = document.getElementById('treats-count');
  const addOnsCountEl = document.getElementById('addons-count');
  
  const summaryServiceEl = document.getElementById('summary-service');
  const summaryPackageRateEl = document.getElementById('summary-package-rate');
  const summaryDurationEl = document.getElementById('summary-duration');
  const summarySubtotalEl = document.getElementById('summary-subtotal');
  const summaryTreatsEl = document.getElementById('summary-treats');
  const summaryAddonsEl = document.getElementById('summary-addons');
  const summaryDiscountEl = document.getElementById('summary-discount');
  const summaryTotalEl = document.getElementById('summary-total');

  // --- DOM ELEMENTS (Lấy các phần tử Form Step 2) ---
  const continueToStep3Btn = document.getElementById('continue-to-step3-btn');
  const requiredFields = document.querySelectorAll('#booking-step2-form [required]');

  // --- FUNCTIONS ---

  /**
   * Chuyển đổi giá trị string (vd: "$55") thành số (vd: 55)
   */
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    }
    return 0;
  };

  /**
   * Tải gói đã chọn từ localStorage
   */
  function loadPackageFromStorage() {
    const nameFromStorage = localStorage.getItem('selectedPackageName');
    let packageKey = 'premium'; // Mặc định

    if (nameFromStorage) {
        const foundKey = Object.keys(packageOptions).find(key => 
            packageOptions[key].name === nameFromStorage
        );
        if (foundKey) packageKey = foundKey;
    }
    
    bookingState.package = packageOptions[packageKey];
  }

  /**
   * Tải treats/addons từ localStorage
   */
  // --- Helper: ép kiểu số an toàn & chuẩn hóa dữ liệu ---
  const toNumber = (val, fallback = 0) => {
    if (val == null) return fallback;
    const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? fallback : n;
  };

  const normalizeList = (items, defaultQty = 1) => {
    const arr = Array.isArray(items) ? items : [];
    return arr.map(i => ({
      name: i?.name || '',
      price: toNumber(i?.price, 0),
      qty: toNumber(i?.qty, defaultQty),
    }));
  };

  const dedupeByName = (items) => {
    const map = new Map();
    items.forEach(i => {
      const key = i.name || '';
      if (!key) return;
      if (map.has(key)) {
        const prev = map.get(key);
        map.set(key, { ...prev, qty: prev.qty + i.qty });
      } else {
        map.set(key, { ...i });
      }
    });
    return Array.from(map.values());
  };

  function loadDataFromStorage() {
    const treatsRaw = JSON.parse(localStorage.getItem('selectedTreats') || '[]');
    const addonsRaw = JSON.parse(localStorage.getItem('selectedAddons') || '[]');

    // Chuẩn hóa & lọc
    const treatsNorm = normalizeList(treatsRaw, 0).filter(i => i.qty > 0);
    const addonsNorm = dedupeByName(normalizeList(addonsRaw, 1)).filter(i => i.qty > 0);

    bookingState.treats = treatsNorm;
    bookingState.addOns = addonsNorm;

    // Hiển thị ngày/duration (giữ nguyên logic hiện tại)
    bookingState.duration = parseInt(localStorage.getItem('bookingDuration') || '1', 10);
    const checkinStored = localStorage.getItem('bookingCheckinDate') || localStorage.getItem('bookingCheckin');
    const checkoutStored = localStorage.getItem('bookingCheckoutDate') || localStorage.getItem('bookingCheckout');
    checkinDateEl.textContent = checkinStored ? checkinStored : '--';
    checkoutDateEl.textContent = checkoutStored ? checkoutStored : '--';

    // Render danh sách
    renderList(treatsListEl, bookingState.treats);
    renderList(addOnsListEl, bookingState.addOns);

    // Cập nhật "x selected"
    const totalTreats = bookingState.treats.reduce((sum, item) => sum + toNumber(item.qty, 0), 0);
    const totalAddons = bookingState.addOns.length;

    if (treatsCountEl) treatsCountEl.textContent = `${totalTreats} selected`;
    if (addOnsCountEl) addOnsCountEl.textContent = `${totalAddons} selected`;
  }

  /**
   * Cập nhật Price Summary
   */
  function updateSummary() {
    const treatsTotal = bookingState.treats.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
    const addOnsTotal = bookingState.addOns.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
    
    const packagePrice = parsePrice(bookingState.package.price);
    const subtotal = packagePrice * bookingState.duration;
    
    const preDiscountTotal = subtotal + treatsTotal + addOnsTotal;
    // (Giả định discount = 0 vì không có logic nhập ở trang này)
    const discountAmount = 0;
    
    const total = preDiscountTotal - discountAmount;
    
    // Cập nhật DOM
    pkgNameEl.textContent = bookingState.package.name;
    pkgPriceEl.textContent = `$${packagePrice.toFixed(2)}`;
    dayCountEl.textContent = `${bookingState.duration} Day${bookingState.duration > 1 ? 's' : ''}`;
    
    summaryServiceEl.textContent = bookingState.package.name;
    summaryPackageRateEl.textContent = `$${packagePrice.toFixed(2)}`;
    summaryDurationEl.textContent = `${bookingState.duration} day${bookingState.duration > 1 ? 's' : ''}`;
    summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    summaryTreatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    summaryAddonsEl.textContent = `$${addOnsTotal.toFixed(2)}`;
    summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  /**
   * Render danh sách (Treats, Add-ons)
   */
  function renderList(listElement, items) {
    if (!listElement) return;
    listElement.innerHTML = '';

    if (!items || items.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No items selected.';
      li.style.cssText = "color: #9a8576; font-size: 0.9em; padding: 8px 0;";
      listElement.appendChild(li);
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'summary-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = item.name;

      const qtySpan = document.createElement('span');
      qtySpan.className = 'item-qty';
      qtySpan.textContent = `x ${toNumber(item.qty, 1)}`;

      const priceSpan = document.createElement('span');
      priceSpan.className = 'item-price';
      const price = toNumber(item.price, 0);
      const qty = toNumber(item.qty, 1);
      priceSpan.textContent = `$${(price * qty).toFixed(2)}`;

      li.appendChild(nameSpan);
      li.appendChild(qtySpan);
      li.appendChild(priceSpan);
      listElement.appendChild(li);
    });
  }

  /**
   * YÊU CẦU: Kiểm tra (validate) form
   */
  function validateForm() {
    let allValid = true;
    
    requiredFields.forEach(field => {
      const formGroup = field.closest('.form-group');
      if (!field.value || (field.type === 'select' && field.value === '')) {
        formGroup.classList.add('has-error');
        allValid = false;
      } else {
        formGroup.classList.remove('has-error');
      }
    });
    
    return allValid;
  }

  /**
   * Thêm listener cho nút "Continue"
   */
  continueToStep3Btn.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn <button> submit form (hoặc <a> chuyển trang)
    
    if (validateForm()) {
      // (Lý tưởng nhất là lưu dữ liệu form vào localStorage ở đây)
      
      // Chuyển trang
      window.location.href = 'homestaystep3.html';
    } else {
      // (Bạn có thể thêm 1 thông báo lỗi chung ở đây)
      console.log("Form is invalid");
    }
  });

  // --- INITIALIZATION (Khởi chạy) ---
  loadPackageFromStorage(); // 1. Tải gói
  loadDataFromStorage();    // 2. Tải treats/addons/duration
  updateSummary();          // 3. Tính tiền ngay lập tức
});
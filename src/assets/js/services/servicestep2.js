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
  // (Phần này đã bị xóa khỏi HTML, nhưng code JS vẫn an toàn)
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
  const bookingForm = document.getElementById('booking-step2-form');

  const paymentTabs = document.querySelector('.payment-tabs');
  const paymentTypeRadios = document.querySelectorAll('input[name="payment-type"]');
  const savedCardsList = document.querySelector('.saved-cards-list');
  const addNewCardBtn = document.querySelector('.add-new-card-btn');

  function updatePaymentVisibility() {
    const selected = document.querySelector('input[name="payment-type"]:checked')?.value;
    const isCard = selected === 'card';

    // KHÔNG đổi CSS thẻ; chỉ ẩn/hiện bằng inline style để tuân theo CSS gốc
    if (savedCardsList) savedCardsList.style.display = isCard ? '' : 'none';
    if (addNewCardBtn) addNewCardBtn.style.display = isCard ? '' : 'none';

    // Ẩn đường kẻ nét đứt cho QR (CSS riêng của QR)
    if (paymentTabs) paymentTabs.classList.toggle('hide-separator', !isCard);

    // Phòng khi có rule khác, thêm class trạng thái cho form (không ảnh hưởng card CSS)
    if (bookingForm) bookingForm.classList.toggle('qr-selected', !isCard);
  }

  paymentTypeRadios.forEach(r => r.addEventListener('change', updatePaymentVisibility));
  updatePaymentVisibility();

  const paymentDetailsForm = document.getElementById('payment-details-form'); // Lấy form chi tiết thẻ

  // Logic cho nút "Add New Card"
  if (addNewCardBtn) {
    addNewCardBtn.addEventListener('click', () => {
      if (paymentDetailsForm) {
        paymentDetailsForm.style.display = 'flex'; // Hiển thị form
        paymentDetailsForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      addNewCardBtn.style.display = 'none'; // Ẩn nút "Add"
    });
  }

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
    
    // Kiểm tra null trước khi gán
    if (checkinDateEl) checkinDateEl.textContent = checkinStored ? checkinStored : '--';
    if (checkoutDateEl) checkoutDateEl.textContent = checkoutStored ? checkoutStored : '--';

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
    
    // Cập nhật DOM (Kiểm tra null vì sidebar đã bị xóa)
    if (pkgNameEl) pkgNameEl.textContent = bookingState.package.name;
    if (pkgPriceEl) pkgPriceEl.textContent = `$${packagePrice.toFixed(2)}`;
    if (dayCountEl) dayCountEl.textContent = `${bookingState.duration} Day${bookingState.duration > 1 ? 's' : ''}`;
    
    if (summaryServiceEl) summaryServiceEl.textContent = bookingState.package.name;
    if (summaryPackageRateEl) summaryPackageRateEl.textContent = `$${packagePrice.toFixed(2)}`;
    if (summaryDurationEl) summaryDurationEl.textContent = `${bookingState.duration} day${bookingState.duration > 1 ? 's' : ''}`;
    if (summarySubtotalEl) summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTreatsEl) summaryTreatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    if (summaryAddonsEl) summaryAddonsEl.textContent = `$${addOnsTotal.toFixed(2)}`;
    if (summaryDiscountEl) summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    if (summaryTotalEl) summaryTotalEl.textContent = `$${total.toFixed(2)}`;
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
      const isEmpty = !field.value || (field.tagName?.toLowerCase() === 'select' && field.value === '');
      if (isEmpty) {
        formGroup?.classList.add('has-error');
        allValid = false;
      } else {
        formGroup?.classList.remove('has-error');
      }
    });
    return allValid;
  }

  // Continue -> Step 3
  if (continueToStep3Btn) {
    continueToStep3Btn.addEventListener('click', (e) => {
      e.preventDefault();
      // validateForm() sẽ dùng biến requiredFields phía trên (đã loại bản trùng)
      if (validateForm()) {
        window.location.href = 'homestaystep3.html';
      } else {
        console.log('Form is invalid');
      }
    });
  }
  
  // Xóa báo lỗi khi người dùng bắt đầu nhập
  requiredFields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.value) {
        field.closest('.form-group')?.classList.remove('has-error');
      }
    });
  });

  // --- INITIALIZATION (Khởi chạy) ---
  loadPackageFromStorage(); // 1. Tải gói
  loadDataFromStorage();    // 2. Tải treats/addons/duration
  updateSummary();          // 3. Tính tiền ngay lập tức
});
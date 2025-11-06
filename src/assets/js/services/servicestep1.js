document.addEventListener('DOMContentLoaded', () => {

  // --- DATABASE (Giả lập) ---
  const packageOptions = {
    'basic': { name: 'Cozy Room (Basic)', price: 40 },
    'premium': { name: 'Premium Retreat', price: 55 },
    'luxury': { name: 'Luxury Suite', price: 75 }
  };
  
  // --- STATE ---
  let bookingState = {
    package: packageOptions['premium'],
    duration: 1,
    checkinDate: null,
    treats: [],
    addOns: [],
    discount: { code: null, percentage: 0 },
  };
  
  // Biến quản lý lịch
  let currentDisplayDate = new Date(); // Ngày hôm nay
  
  // --- DOM ELEMENTS ---
  const editPkgBtn = document.getElementById('edit-pkg-btn');
  const packageModal = document.getElementById('package-modal');
  const packageRadios = document.querySelectorAll('input[name="package"]');
  const pkgNameEl = document.getElementById('package-name');
  const pkgPriceEl = document.getElementById('package-price');
  
  const btnDecreaseDay = document.getElementById('btn-decrease-day');
  const btnIncreaseDay = document.getElementById('btn-increase-day');
  const dayCountEl = document.getElementById('day-count');
  
  const checkinDateEl = document.getElementById('checkin-date');
  const checkoutDateEl = document.getElementById('checkout-date');

  const treatsListEl = document.getElementById('treats-list');
  const addOnsListEl = document.getElementById('addons-list');
  const treatsCountEl = document.getElementById('treats-count');
  const addOnsCountEl = document.getElementById('addons-count'); 
  
  const discountInput = document.getElementById('discount-code-input');
  const applyDiscountBtn = document.getElementById('apply-discount-btn');
  const discountStatusEl = document.getElementById('discount-status');
  
  const summaryServiceEl = document.getElementById('summary-service');
  const summaryPackageRateEl = document.getElementById('summary-package-rate');
  const summaryDurationEl = document.getElementById('summary-duration');
  const summarySubtotalEl = document.getElementById('summary-subtotal');
  const summaryTreatsEl = document.getElementById('summary-treats');
  const summaryAddonsEl = document.getElementById('summary-addons');
  const summaryDiscountEl = document.getElementById('summary-discount');
  const summaryTotalEl = document.getElementById('summary-total');
  
  const calGrid = document.getElementById('cal-grid');
  const calTitle = document.getElementById('cal-title');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  
  const timeGrid = document.querySelector('.time-grid');
  
  const payNowBtn = document.getElementById('pay-now-btn'); // sẽ là Continue

  // --- FUNCTIONS ---

  function renderCalendar(year, month) {
    calGrid.innerHTML = '';
    calTitle.textContent = `${new Date(year, month).toLocaleString('en-US', { month: 'long' })} ${year}`;
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + 1 + i;
      calGrid.innerHTML += `<button class="day muted" disabled>${day}</button>`;
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      let classes = 'day';
      let isDisabled = false;
      
      const dayDate = new Date(year, month, i);
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (dayDate < startOfToday) {
        classes += ' muted';
        isDisabled = true;
      }
      
      if (bookingState.checkinDate && 
          i === bookingState.checkinDate.getDate() &&
          month === bookingState.checkinDate.getMonth() &&
          year === bookingState.checkinDate.getFullYear()) {
        classes += ' selected';
      }
      
      calGrid.innerHTML += `<button class="${classes}" data-day="${i}" ${isDisabled ? 'disabled' : ''}>${i}</button>`;
    }
  }

  // Ưu tiên dữ liệu từ localStorage giống servicecard.js
  function loadPackageFromStorage() {
    const nameFromStorage = localStorage.getItem('selectedPackageName');
    const priceFromStorage = localStorage.getItem('selectedPackagePrice');
    const priceNumber = priceFromStorage ? parseFloat(priceFromStorage) : NaN;

    if (nameFromStorage && !isNaN(priceNumber)) {
      bookingState.package = { name: nameFromStorage, price: priceNumber };
    } else if (nameFromStorage) {
      const foundKey = Object.keys(packageOptions).find(
        (key) => packageOptions[key].name === nameFromStorage
      );
      bookingState.package = foundKey ? packageOptions[foundKey] : packageOptions['premium'];
    } else {
      bookingState.package = packageOptions['premium'];
    }

    // Đồng bộ radio theo data-name
    packageRadios.forEach((radio) => {
      radio.checked = radio.dataset.name === bookingState.package.name;
    });
  }

  function loadDataFromStorage() {
    const treatsData = JSON.parse(localStorage.getItem('selectedTreats')) || [];
    const addonsData = JSON.parse(localStorage.getItem('selectedAddons')) || [];
    
    bookingState.treats = treatsData; 
    bookingState.addOns = addonsData; 
    
    renderList(treatsListEl, bookingState.treats);
    renderList(addOnsListEl, bookingState.addOns);
    
    const totalTreats = bookingState.treats.reduce((sum, item) => sum + (item.qty || 0), 0);
    const totalAddons = bookingState.addOns.reduce((sum, item) => sum + (item.qty || 0), 0);
    
    treatsCountEl.textContent = `${totalTreats} selected`;
    addOnsCountEl.textContent = `${totalAddons} selected`;
  }

  function updateSummary() {
    const parsePrice = (price) => {
      if (typeof price === 'number') return isNaN(price) ? 0 : price;
      if (typeof price === 'string') return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
      return 0;
    };

    const treatsTotal = bookingState.treats.reduce(
      (sum, item) => sum + (parsePrice(item.price) * (item.qty || 0)),
      0
    );
    const addOnsTotal = bookingState.addOns.reduce(
      (sum, item) => sum + (parsePrice(item.price) * (item.qty || 0)),
      0
    );
    
    const packagePrice = parsePrice(bookingState.package?.price);
    const subtotal = packagePrice * bookingState.duration;
    
    const preDiscountTotal = subtotal + treatsTotal + addOnsTotal;
    const discountAmount = preDiscountTotal * (bookingState.discount?.percentage || 0);
    const total = preDiscountTotal - discountAmount;

    // Update UI
    pkgNameEl.textContent = bookingState.package?.name || '--';
    pkgPriceEl.textContent = `$${packagePrice.toFixed(2)}`;

    dayCountEl.textContent = `${bookingState.duration} Day${bookingState.duration > 1 ? 's' : ''}`;
    
    summaryServiceEl.textContent = bookingState.package?.name || '--';
    summaryPackageRateEl.textContent = `$${packagePrice.toFixed(2)}`;
    summaryDurationEl.textContent = `${bookingState.duration} day${bookingState.duration > 1 ? 's' : ''}`;
    summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    summaryTreatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    summaryAddonsEl.textContent = `$${addOnsTotal.toFixed(2)}`;
    summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  function renderList(listElement, items) {
    if (!listElement) return;
    listElement.innerHTML = ''; 
    
    if (items.length === 0) {
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
      qtySpan.textContent = `x ${item.qty}`;
      
      const priceSpan = document.createElement('span');
      priceSpan.className = 'item-price'; 
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : item.price;
      priceSpan.textContent = `$${(price * (item.qty || 0)).toFixed(2)}`;
      
      li.appendChild(nameSpan);
      li.appendChild(qtySpan);
      li.appendChild(priceSpan);
      listElement.appendChild(li);
    });
  }

  function formatDate(date) {
    if (!date) return "--";
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function updateDisplayedDates() {
    if (!bookingState.checkinDate) return;
    
    checkinDateEl.textContent = formatDate(bookingState.checkinDate);
    
    const checkoutDate = new Date(bookingState.checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + bookingState.duration);
    checkoutDateEl.textContent = formatDate(checkoutDate);
  }

  // --- EVENT LISTENERS ---

  // Điều khiển lịch
  calPrevBtn.addEventListener('click', () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
  });

  calNextBtn.addEventListener('click', () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
  });

  calGrid.addEventListener('click', (e) => {
    const dayButton = e.target.closest('.day');
    if (dayButton && !dayButton.disabled) {
      calGrid.querySelector('.selected')?.classList.remove('selected');
      dayButton.classList.add('selected');
      const day = parseInt(dayButton.dataset.day, 10);
      bookingState.checkinDate = new Date(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth(), day);
      updateDisplayedDates();
    }
  });

  // Tăng/Giảm Duration
  btnIncreaseDay.addEventListener('click', () => {
    bookingState.duration++;
    btnDecreaseDay.disabled = bookingState.duration === 1;
    updateSummary();
    updateDisplayedDates();
  });

  btnDecreaseDay.addEventListener('click', () => {
    if (bookingState.duration > 1) { 
      bookingState.duration--;
      updateSummary();
      updateDisplayedDates();
    }
    btnDecreaseDay.disabled = bookingState.duration === 1;
  });

  // Mở/Đóng modal chọn Package
  editPkgBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    packageModal.classList.toggle('visible');
  });

  // Chọn package mới trong modal (đọc data-* như servicecard.js)
  packageRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const el = e.target;
      const newName = el.dataset.name || bookingState.package.name;
      const newPrice = parseFloat(el.dataset.price);
      bookingState.package = {
        name: newName,
        price: !isNaN(newPrice) ? newPrice : bookingState.package.price
      };
      packageModal.classList.remove('visible'); 
      updateSummary(); 
    });
  });

  // Áp dụng Discount Code
  // applyDiscountBtn.addEventListener('click', () => {
  applyDiscountBtn.addEventListener('click', () => {
    const code = discountInput.value.trim().toUpperCase();
  
    discountStatusEl.textContent = '';
    discountStatusEl.className = 'discount-status';
  
    if (!code) {
      discountStatusEl.textContent = 'Please enter a code.';
      discountStatusEl.classList.add('status-error');
      return;
    }
  
    discountStatusEl.classList.add('status-applying');
    discountStatusEl.textContent = 'Applying discount';
  
    setTimeout(() => {
      discountStatusEl.classList.remove('status-applying');
  
      if (code === 'PAWFECT10') {
        bookingState.discount = { code: code, percentage: 0.10 };
        discountStatusEl.textContent = 'PAWFECT10 applied! (10% off)';
        discountStatusEl.className = 'discount-status status-success';
      } else if (code === 'BUDDY20') {
        bookingState.discount = { code: code, percentage: 0.20 };
        discountStatusEl.textContent = 'BUDDY20 applied! (20% off)';
        discountStatusEl.className = 'discount-status status-success';
      } else if (code === 'TRANDUYTHANH') {
        bookingState.discount = { code: code, percentage: 0.10 };
        discountStatusEl.textContent = 'TRANDUYTHANH applied! (10% off)';
        discountStatusEl.className = 'discount-status status-success';
      } else {
        bookingState.discount = { code: null, percentage: 0 };
        discountStatusEl.textContent = 'Invalid discount code.';
        discountStatusEl.className = 'discount-status status-error';
      }
  
      updateSummary(); 
      
    }, 1200); 
  });

  // Chọn giờ
  timeGrid.addEventListener('click', (e) => {
    const timeButton = e.target.closest('.time');
    if (timeButton) {
      timeGrid.querySelector('.selected')?.classList.remove('selected');
      timeButton.classList.add('selected');

      const timeText = timeButton.textContent.trim();
      localStorage.setItem('selectedTimeSlot', timeText);
    }
  });
  
  // Nút Continue (pay-now-btn): validate ngày và đi bước 2
  payNowBtn.addEventListener('click', () => {
    if (!bookingState.checkinDate) {
      showNotification("Please pick the booking date!", "error");
      return;
    }
    const selectedTimeEl = document.querySelector('.time-grid .time.selected');
    if (!selectedTimeEl) {
      showNotification("Please pick the booking time!", "error");
      return;
    }
    const selectedTimeText = selectedTimeEl.textContent.trim();
    localStorage.setItem('selectedTimeSlot', selectedTimeText);

    // Lưu thông tin ngày và duration cho step 2
    localStorage.setItem('bookingDuration', String(bookingState.duration));
    localStorage.setItem('bookingCheckin', bookingState.checkinDate.toISOString());
    const checkout = new Date(bookingState.checkinDate);
    checkout.setDate(checkout.getDate() + bookingState.duration);
    localStorage.setItem('bookingCheckout', checkout.toISOString());

    // LƯU THÊM: dữ liệu cho Order Summary của Step 2
    const bookingDetails = {
      package: { name: bookingState.package.name, price: bookingState.package.price },
      duration: bookingState.duration,
      treats: (bookingState.treats || []).map(t => ({
        name: t.name,
        price: t.price,
        quantity: t.qty || 0
      })),
      addons: (bookingState.addOns || []).map(a => ({
        name: a.name,
        price: a.price
      })),
      discount: bookingState.discount || { code: null, percentage: 0 },
      timeSlot: selectedTimeText
    };
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    // Chuỗi hiển thị ngày cho Step 2
    const checkinDisplay = formatDate(bookingState.checkinDate);
    const checkoutDisplay = formatDate(checkout);
    localStorage.setItem('bookingCheckinDate', checkinDisplay);
    localStorage.setItem('bookingCheckoutDate', checkoutDisplay);

    window.location.href = 'homestaystep2.html';
  });

  // --- Utility ---
  function showNotification(message, type = 'info') {
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
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
      }, 3000);
    }, 3000);
  }
  
  // --- INITIALIZATION ---
  renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
  loadPackageFromStorage();
  loadDataFromStorage();

  // Hiện giá ngay với mặc định 1 day
  btnDecreaseDay.disabled = bookingState.duration === 1;
  updateSummary();
});
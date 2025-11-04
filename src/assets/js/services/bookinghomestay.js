document.addEventListener('DOMContentLoaded', () => {

  // --- DATABASE (Giả lập) ---
  const packageOptions = {
    'basic': { name: 'Cozy Room (Basic)', price: 40 },
    'premium': { name: 'Premium Retreat', price: 55 },
    'luxury': { name: 'Luxury Suite', price: 75 }
  };
  
  // --- STATE (Trạng thái của booking) ---
  let bookingState = {
    package: packageOptions['premium'], // Mặc định, sẽ bị ghi đè bởi localStorage
    duration: 1, 
    checkinDate: null, // Sẽ được set khi chọn lịch
    treats: [], // Sẽ tải từ localStorage
    addOns: [], // Sẽ tải từ localStorage
    discount: { code: null, percentage: 0 },
  };
  
  // Biến quản lý lịch
  let currentDisplayDate = new Date(); // Ngày hôm nay
  
  // --- DOM ELEMENTS (Lấy các phần tử HTML) ---
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
  const continueBtn = document.getElementById('continue-btn');

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
  
  const payNowBtn = document.getElementById('pay-now-btn');

  // --- FUNCTIONS (Các hàm xử lý) ---

  /**
   * Render lịch động
   */
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

  /**
   * Tải gói đã chọn từ trang trước
   */
  function loadPackageFromStorage() {
    const nameFromStorage = localStorage.getItem('selectedPackageName');
    
    let packageKey = 'premium'; // Mặc định
    
    if (nameFromStorage) {
        const foundKey = Object.keys(packageOptions).find(key => 
            packageOptions[key].name === nameFromStorage
        );
        if (foundKey) {
            packageKey = foundKey;
        }
    }
    
    bookingState.package = packageOptions[packageKey];
    
    packageRadios.forEach(radio => {
        radio.checked = radio.value === packageKey;
    });
  }


  /**
   * Tải treats/addons từ trang trước (SỬA LỖI Ở ĐÂY)
   */
  function loadDataFromStorage() {
    const treatsData = JSON.parse(localStorage.getItem('selectedTreats')) || [];
    const addonsData = JSON.parse(localStorage.getItem('selectedAddons')) || [];
    
    bookingState.treats = treatsData; 
    bookingState.addOns = addonsData; 
    
    renderList(treatsListEl, bookingState.treats);
    renderList(addOnsListEl, bookingState.addOns);
    
    // Tính tổng số lượng
    const totalTreats = bookingState.treats.reduce((sum, item) => sum + (item.qty || 0), 0);
    const totalAddons = bookingState.addOns.reduce((sum, item) => sum + (item.qty || 0), 0);
    
    treatsCountEl.textContent = `${totalTreats} selected`;
    
    // SỬA LỖI: Bỏ comment dòng này
    addonsCountEl.textContent = `${totalAddons} selected`; 
  }


  /**
   * Cập nhật Price Summary (SỬA LỖI Ở ĐÂY)
   */
  function updateSummary() {
    // 1. Đảm bảo chúng ta có giá tiền là SỐ
    const parsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
        }
        return 0;
    };

    // 2. Tính toán
    const treatsTotal = bookingState.treats.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
    const addOnsTotal = bookingState.addOns.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
    
    const packagePrice = parsePrice(bookingState.package.price);
    const subtotal = packagePrice * bookingState.duration;
    
    const preDiscountTotal = subtotal + treatsTotal + addOnsTotal;
    const discountAmount = preDiscountTotal * bookingState.discount.percentage;
    
    const total = preDiscountTotal - discountAmount;

    // 3. Cập nhật DOM (giao diện)
    
    pkgNameEl.textContent = bookingState.package.name;
    pkgPriceEl.textContent = `$${packagePrice.toFixed(2)}`;

    dayCountEl.textContent = `${bookingState.duration} Day${bookingState.duration > 1 ? 's' : ''}`;
    
    // SỬA LỖI: Cập nhật tất cả các dòng
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
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      priceSpan.textContent = `$${(price * item.qty).toFixed(2)}`;
      
      li.appendChild(nameSpan);
      li.appendChild(qtySpan);
      li.appendChild(priceSpan);
      listElement.appendChild(li);
    });
  }
  
  /**
   * Định dạng ngày (vd: Nov 3, 2025)
   */
  function formatDate(date) {
    if (!date) return "--";
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * YÊU CẦU: Hàm cập nhật ngày check-in/out trên UI
   */
  function updateDisplayedDates(isContinueClick = false) {
    if (!bookingState.checkinDate) {
        if (isContinueClick) { 
             showNotification("Please select a check-in date!", "error");
        }
        return false; // Trả về false nếu thất bại
    }
    
    checkinDateEl.textContent = formatDate(bookingState.checkinDate);
    
    let checkoutDate = new Date(bookingState.checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + bookingState.duration);
    checkoutDateEl.textContent = formatDate(checkoutDate);

    if (isContinueClick) {
       showNotification("Dates updated in summary!", "success");
    }
    return true; // Trả về true nếu thành công
  }

  // --- EVENT LISTENERS (Gắn các hành động) ---

  // 1. Điều khiển lịch
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
      const day = parseInt(dayButton.dataset.day);
      bookingState.checkinDate = new Date(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth(), day);
      
      // SỬA LỖI: Cập nhật "live"
      updateDisplayedDates(false); 
    }
  });

  // 2. Nút Continue (Chỉ để xác nhận)
  continueBtn.addEventListener('click', () => updateDisplayedDates(true)); // true = bấm continue

  // 3. Tăng/Giảm Duration (SỬA LỖI: Cập nhật "live")
  btnIncreaseDay.addEventListener('click', () => {
    bookingState.duration++;
    btnDecreaseDay.disabled = false;
    updateSummary();
    updateDisplayedDates(false); // Cập nhật ngày checkout ngay lập tức
  });

  btnDecreaseDay.addEventListener('click', () => {
    if (bookingState.duration > 1) { 
      bookingState.duration--;
      updateSummary();
      updateDisplayedDates(false); // Cập nhật ngày checkout ngay lập tức
    }
    
    if (bookingState.duration === 1) {
      btnDecreaseDay.disabled = true;
    }
  });

  // 4. Mở/Đóng modal chọn Package
  editPkgBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    packageModal.classList.toggle('visible');
  });

  // 5. Chọn package mới trong modal
  packageRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      bookingState.package = packageOptions[selectedValue];
      packageModal.classList.remove('visible'); 
      updateSummary(); 
    });
  });

  // 6. Áp dụng Discount Code
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
      } else { 
        bookingState.discount = { code: null, percentage: 0 };
        discountStatusEl.textContent = 'Invalid discount code.';
        discountStatusEl.className = 'discount-status status-error';
      }
      
      updateSummary(); 
      
    }, 1200); 
  });

  // 7. Chọn giờ
  timeGrid.addEventListener('click', (e) => {
    const timeButton = e.target.closest('.time');
    if (timeButton) {
      timeGrid.querySelector('.selected')?.classList.remove('selected');
      timeButton.classList.add('selected');
    }
  });
  
  // 8. YÊU CẦU: Nút Pay Now
  payNowBtn.addEventListener('click', () => {
    window.location.href = 'homestaystep2.html';
  });

  // --- Utility Functions ---
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
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);
    }, 3000);
  }
  
  // --- INITIALIZATION (Khởi chạy) ---
  renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
  loadPackageFromStorage(); // Tải gói đã chọn
  loadDataFromStorage(); // Tải treats/addons
  
  // SỬA LỖI: Bỏ comment dòng này để tính tiền
  updateSummary(); 
});
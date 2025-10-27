document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });
  // Calendar: Select a day
  // ----------------------------
  const dayButtons = document.querySelectorAll('.calendar .day');
  let selectedDayButton = document.querySelector('.calendar .day.selected, .calendar .day.selected-date') || null;

  dayButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;

      // Remove highlight from all days
      dayButtons.forEach((b) => {
        b.classList.remove('selected', 'selected-date');
        b.removeAttribute('aria-current');
      });

      // Add highlight to clicked day
      btn.classList.add('selected', 'selected-date'); // keep .selected for CSS, add .selected-date per requirement
      btn.setAttribute('aria-current', 'date');
      selectedDayButton = btn;
    });
  });

  // ----------------------------
  // Calendar: Month navigation logs
  // ----------------------------
  const calNavButtons = document.querySelectorAll('.calendar-header .cal-nav');
  calNavButtons.forEach((navBtn) => {
    navBtn.addEventListener('click', () => {
      const label = navBtn.getAttribute('aria-label') || '';
      if (label.toLowerCase().includes('previous')) {
        console.log('Previous Month');
      } else if (label.toLowerCase().includes('next')) {
        console.log('Next Month');
      } else {
        // Fallback: infer by position (first = prev, last = next)
        const isFirst = navBtn === calNavButtons[0];
        console.log(isFirst ? 'Previous Month' : 'Next Month');
      }
    });
  });

  // ----------------------------
  // Time Slot Selection
  // ----------------------------
  const timeButtons = document.querySelectorAll('.time-grid .time');
  let selectedTimeButton = document.querySelector('.time-grid .time.selected, .time-grid .time.selected-time') || null;

  timeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove highlight from all times
      timeButtons.forEach((b) => {
        b.classList.remove('selected', 'selected-time');
        b.removeAttribute('aria-current');
      });

      // Add highlight to clicked time
      btn.classList.add('selected', 'selected-time'); // keep .selected for CSS, add .selected-time per requirement
      btn.setAttribute('aria-current', 'time');
      selectedTimeButton = btn;
    });
  });

  // ----------------------------
  // Sidebar Accordion Toggle
  // ----------------------------
  // Target the "Treats for buddy" and "Add-ons" summary headers; toggle their associated content.
  const accordionHeaders = document.querySelectorAll('.summary-accordion .accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const details = header.closest('details.summary-accordion');
      if (!details) return;

      const content = details.querySelector('.accordion-body'); // HTML uses .accordion-body (not .accordion-content)
      const chevron = header.querySelector('.chevron');

      const nowOpen = !details.open;
      details.open = nowOpen;

      if (content) {
        content.classList.toggle('expanded', nowOpen);
      }
      if (chevron) {
        // Rotate chevron instead of changing text (SVG in current markup)
        chevron.style.transform = nowOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });

  // ----------------------------
  // Discount Code: Apply button
  // ----------------------------
  const discountInput = document.querySelector('.discount-row .input');
  const applyBtn = document.querySelector('.discount-row .btn.apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const code = (discountInput?.value || '').trim();
      console.log('Apply Discount clicked', code);
      if (code) {
        showNotification('Mã giảm giá đã được áp dụng thành công!', 'success');
      } else {
        showNotification('Vui lòng nhập mã giảm giá', 'error');
      }
    });
  }

  // ----------------------------
  // Continue button
  // ----------------------------
  const continueBtn = document.querySelector('.actions .btn.primary');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const calTitleEl = document.querySelector('.calendar-header .cal-title');
      const monthYear = calTitleEl ? calTitleEl.textContent.trim() : '';

      const selectedDateNumber = selectedDayButton ? selectedDayButton.textContent.trim() : null;
      const selectedDate = selectedDateNumber && monthYear
        ? `${monthYear} ${selectedDateNumber}`
        : null;

      const selectedTime = selectedTimeButton ? selectedTimeButton.textContent.trim() : null;

      console.log('Continue clicked. Date:', selectedDate, 'Time:', selectedTime);
      // Visual feedback (optional): keep in active state briefly
      continueBtn.classList.add('is-active');
      setTimeout(() => continueBtn.classList.remove('is-active'), 250);
    });
  }

  // ----------------------------
  // PAY NOW button
  // ----------------------------
  const payNowBtn = document.querySelector('.btn.pay-now');
  if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
      alert('Proceeding to payment...');
    });
  }

  // Initialize booking-specific functionality
  initBookingSelections();
  initBookingQuantityControls();

  // ----------------------------
  // Read and render selected package from localStorage
  // ----------------------------
  const pkgNameFromLS = localStorage.getItem('selectedPackageName');
  const pkgPriceFromLS = localStorage.getItem('selectedPackagePrice');

  if (pkgNameFromLS || pkgPriceFromLS) {
    // Prefer existing .selected-package block if present; otherwise update current summary-block
    const selectedPkgContainer = document.querySelector('.selected-package');

    if (selectedPkgContainer) {
      // If a .selected-package structure exists (compat with other pages)
      const titleEl = selectedPkgContainer.querySelector('h4');
      const priceEl = selectedPkgContainer.querySelector('.package-price');

      if (titleEl && pkgNameFromLS) titleEl.textContent = pkgNameFromLS;
      if (priceEl && pkgPriceFromLS) {
        // Keep format "$55 <span class='unit'>per night</span>" if unit present elsewhere
        priceEl.innerHTML = `${pkgPriceFromLS}<span class="unit">per night</span>`;
      }
    } else {
      // Update current booking sidebar "Select Package" block
      const summaryBlocks = document.querySelectorAll('.summary-card .summary-block');
      let selectPackageBlock = null;
      summaryBlocks.forEach((block) => {
        const label = block.querySelector('.block-label');
        if (label && label.textContent.trim().toLowerCase() === 'select package') {
          selectPackageBlock = block;
        }
      });

      if (selectPackageBlock) {
        const nameEl = selectPackageBlock.querySelector('.pkg-name');
        const priceEl = selectPackageBlock.querySelector('.price');

        if (nameEl && pkgNameFromLS) nameEl.textContent = pkgNameFromLS;
        if (priceEl && pkgPriceFromLS) priceEl.textContent = pkgPriceFromLS;
      }
    }
  }

  // Render selected add-ons and treats into summary lists
  function renderList(selector, items) {
    const ul = document.querySelector(selector);
    if (!ul) return;
    ul.innerHTML = items.map(i => `
      <li class="summary-item">
        <span class="item-name">${i.name}</span>
        <span class="item-qty">x ${i.qty}</span>
        <span class="item-price">${i.price}</span>
      </li>
    `).join('');
  }

  const addons = JSON.parse(localStorage.getItem('selectedAddons') || '[]');
  const treats = JSON.parse(localStorage.getItem('selectedTreats') || '[]');
  renderList('.addons-list', addons);
  renderList('.treats-list', treats);

  // Discount Code (new UI)
  const codeInputEl = document.getElementById('discount-code-input');
  const applyBtnEl = document.getElementById('apply-discount-btn');
  const statusEl = document.getElementById('discount-status');

  if (applyBtnEl && codeInputEl && statusEl) {
    applyBtnEl.addEventListener('click', () => {
      const code = (codeInputEl.value || '').trim();

      // clear old status classes
      statusEl.classList.remove('status-applying', 'status-success', 'status-error');
      statusEl.textContent = '';

      // applying state
      statusEl.classList.add('status-applying');
      statusEl.textContent = 'Applying discount';

      setTimeout(() => {
        statusEl.classList.remove('status-applying');

        if (code.toUpperCase() === 'TRANDUYTHANH') {
          statusEl.classList.add('status-success');
          statusEl.textContent = 'Discount applied';
        } else {
          statusEl.classList.add('status-error');
          statusEl.textContent = 'Invalid promo code. Please check the code and try again.';
        }
      }, 1200);
    });
  }
});

// Booking-specific selection state
const bookingSelectionState = {
  package: { name: null, price: 0 },
  addons: new Map(),
  treats: new Map(),
};

// Package add-ons data for booking page
const bookingPackageAddonsData = {
  'Cozy Room (Basic)': [
    { name: 'Gourmet Meal Upgrade', price: 5 },
    { name: 'Vet Visit', price: 25 },
    { name: 'Pet Taxi', price: 10 },
    { name: 'Live Camera', price: 12 },
  ],
  'Premium Retreat': [
    { name: 'Aromatherapy Bedtime', price: 8 },
    { name: 'Vet Visit', price: 25 },
    { name: 'Pet Taxi', price: 10 },
    { name: 'Live Camera', price: 12 },
  ],
  'Luxury Suite': [
    { name: 'Gourmet Meal Upgrade', price: 5 },
    { name: 'Vet Visit', price: 25 },
    { name: 'Pet Taxi', price: 10 },
    { name: 'Pet Yoga & Relaxation Session', price: 12 },
  ],
};

function initBookingSelections() {
  // Initialize selected package from sidebar
  const selectedPkgCard = document.querySelector('.selected-package');
  if (selectedPkgCard) {
    const nameEl = selectedPkgCard.querySelector('h4');
    const priceEl = selectedPkgCard.querySelector('.package-price');
    const pkgName = nameEl ? nameEl.textContent.trim() : null;
    const priceText = priceEl ? priceEl.textContent.trim() : '$0';
    const priceNum = parseCurrency(priceText);

    bookingSelectionState.package = { name: pkgName, price: priceNum };
  }

  // Bind treat buttons for booking page
  bindBookingTreatButtons();

  // Initial totals
  updateBookingSelectedCounts();
  updateBookingPriceSummary();
}

function parseCurrency(text) {
  // Extract first $number in text
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function bindBookingTreatButtons() {
  const treatItems = document.querySelectorAll('.package-sidebar .treat-item');
  treatItems.forEach((item) => {
    const nameEl = item.querySelector('.treat-name');
    const priceEl = item.querySelector('.treat-price');
    const btn = item.querySelector('.add-btn');
    if (!nameEl || !priceEl || !btn) return;

    const name = nameEl.textContent.trim();
    const price = parseCurrency(priceEl.textContent.trim());

    // Initialize state
    if (!bookingSelectionState.treats.has(name)) {
      bookingSelectionState.treats.set(name, false);
    }

    btn.addEventListener('click', () => {
      const isSelected = bookingSelectionState.treats.get(name) === true;
      bookingSelectionState.treats.set(name, !isSelected);
      btn.textContent = isSelected ? '+' : '✓';
      item.classList.toggle('selected', !isSelected);
      updateBookingSelectedCounts();
      updateBookingPriceSummary();
    });
  });
}

function findBookingSidebarAccordionByTitle(titleText) {
  const headers = document.querySelectorAll('.package-sidebar .accordion-header');
  for (const header of headers) {
    const label = header.querySelector('span');
    if (label && label.textContent.trim().toLowerCase() === titleText.toLowerCase()) {
      return header;
    }
  }
  return null;
}

function updateBookingSelectedCounts() {
  // Add-ons count
  const addonsHeader = findBookingSidebarAccordionByTitle('Add-ons');
  if (addonsHeader) {
    const countEl = addonsHeader.querySelector('.selected-count');
    if (countEl) {
      const addonsSelected = Array.from(bookingSelectionState.addons.values()).filter(Boolean).length;
      countEl.textContent = `${addonsSelected} selected`;
    }
  }
  // Treats count
  const treatsHeader = findBookingSidebarAccordionByTitle('Treats for buddy');
  if (treatsHeader) {
    const countEl = treatsHeader.querySelector('.selected-count');
    if (countEl) {
      const treatsSelected = Array.from(bookingSelectionState.treats.values()).filter(Boolean).length;
      countEl.textContent = `${treatsSelected} selected`;
    }
  }
}

function updateBookingPriceSummary() {
  const priceSummary = document.querySelector('.package-sidebar .price-summary');
  if (!priceSummary) return;

  // Base: package price per night
  const packageRate = bookingSelectionState.package.price;

  // Add-ons total
  let addonsTotal = 0;
  const pkgData = bookingPackageAddonsData[bookingSelectionState.package.name] || [];
  pkgData.forEach(({ name, price }) => {
    if (bookingSelectionState.addons.get(name)) {
      addonsTotal += price;
    }
  });

  // Treats total
  let treatsTotal = 0;
  document.querySelectorAll('.package-sidebar .treat-item').forEach((item) => {
    const nameEl = item.querySelector('.treat-name');
    const priceEl = item.querySelector('.treat-price');
    if (!nameEl || !priceEl) return;
    const name = nameEl.textContent.trim();
    const price = parseCurrency(priceEl.textContent.trim());
    if (bookingSelectionState.treats.get(name)) {
      treatsTotal += price;
    }
  });

  const subtotal = packageRate + addonsTotal + treatsTotal;
  const fee = +(subtotal * 0.05).toFixed(2);

  // Update rows
  const rows = priceSummary.querySelectorAll('.price-row');
  rows.forEach((row) => {
    const label = row.children[0]?.textContent?.trim();
    const valueEl = row.children[1];
    if (!label || !valueEl) return;
    if (label === 'Package Rate') {
      valueEl.textContent = `$${packageRate}/night`;
    } else if (label === 'Subtotal') {
      valueEl.textContent = `$${subtotal.toFixed(2)}`;
    } else if (label === 'Service Fee') {
      valueEl.textContent = `$${fee.toFixed(2)}`;
    }
  });
}

function initBookingQuantityControls() {
  setupBookingQtyForItems('.addon-item', 'selectedAddons', '.addon-name', '.addon-price');
  setupBookingQtyForItems('.treat-item', 'selectedTreats', '.treat-name', '.treat-price');
}

function setupBookingQtyForItems(itemSelector, storageKey, nameSel, priceSel) {
  document.querySelectorAll(itemSelector).forEach((item) => {
    const minus = item.querySelector('.qty-minus');
    const plus = item.querySelector('.qty-plus');
    const numberEl = item.querySelector('.qty-number');

    if (!minus || !plus || !numberEl) return;

    const name = item.querySelector(nameSel)?.textContent.trim() || '';
    const priceText = item.querySelector(priceSel)?.textContent.trim() || '$0';
    const match = priceText.match(/\$[\d.]+/);
    const price = match ? match[0] : '$0';

    const getArr = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
    const saveArr = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr));

    function writeQty(qty) {
      let arr = getArr();
      const idx = arr.findIndex((x) => x.name === name);
      if (idx >= 0) {
        if (qty <= 0) arr.splice(idx, 1);
        else { arr[idx].qty = qty; arr[idx].price = price; }
      } else if (qty > 0) {
        arr.push({ name, price, qty });
      }
      saveArr(arr);
      updateBookingSelectedCountsForSummary(storageKey);
    }

    let qty = parseInt(numberEl.textContent || '0', 10);

    plus.addEventListener('click', () => {
      qty += 1;
      numberEl.textContent = String(qty);
      writeQty(qty);
    });

    minus.addEventListener('click', () => {
      if (qty > 0) {
        qty -= 1;
        numberEl.textContent = String(qty);
        writeQty(qty);
      }
    });
  });
}

function updateBookingSelectedCountsForSummary(storageKey) {
  const arr = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const count = arr.reduce((sum, i) => sum + (i.qty || 0), 0);
  const header = storageKey === 'selectedAddons'
    ? findBookingSidebarAccordionByTitle('Add-ons')
    : findBookingSidebarAccordionByTitle('Treats for buddy');
  const countEl = header?.querySelector('.selected-count');
  if (countEl) countEl.textContent = `${count} selected`;
}

// Show notification function
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
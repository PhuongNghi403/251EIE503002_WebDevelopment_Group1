document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });

  // Initialize sidebar selections and pricing based on page
  if (page === 'groomingspa') {
    initGroomingSpaFunctionality();
  } else if (page === 'homestayboarding') {
    initHomestayBoardingFunctionality();
  }
});

// ========================================================================
// LOGIC TRANG HOMESTAY (ĐỘC LẬP)
// ========================================================================
function initHomestayBoardingFunctionality() {
  // State management for homestay boarding
  let selectedPackage = { name: 'Cozy Room (Basic)', price: 40 };
  let selectedAddons = new Map(); // addonName -> { price: number, element: HTMLElement }
  let selectedTreats = new Map(); // treatName -> { price: number, quantity: number, element: HTMLElement }

  // Package data with their specific add-ons
  const packageData = {
    'Cozy Room (Basic)': {
      price: 40,
      addons: [
        { name: 'Gourmet Meal Upgrade', price: 5, desc: 'Chef-crafted wet meals made with real meat, veggies, and an evening snack' },
        { name: 'Vet Visit', price: 25, desc: "A professional vet checks your pet's health, coat, and overall condition" },
        { name: 'Pet Taxi', price: 10, desc: 'Pawfect Care staff picks up and returns your pet within a 5 km radius' },
        { name: 'Live Camera', price: 12, desc: 'HD livestream of your pet 24/7' }
      ]
    },
    'Premium Retreat': {
      price: 55,
      addons: [
        { name: 'Aromatherapy Bedtime', price: 8, desc: 'Relaxing and soothing aroma therapy session before bedtime' },
        { name: 'Vet Visit', price: 25, desc: "A professional vet checks your pet's health, coat, and overall condition" },
        { name: 'Pet Taxi', price: 10, desc: 'Pawfect Care staff picks up and returns your pet within a 5 km radius' },
        { name: 'Live Camera', price: 12, desc: 'HD livestream of your pet 24/7' }
      ]
    },
    'Luxury Suite': {
      price: 75,
      addons: [
        { name: 'Gourmet Meal Upgrade', price: 5, desc: 'Chef-crafted wet meals made with real meat, veggies, and an evening snack' },
        { name: 'Vet Visit', price: 25, desc: "A professional vet checks your pet's health, coat, and overall condition" },
        { name: 'Pet Taxi', price: 10, desc: 'Pawfect Care staff picks up and returns your pet within a 5 km radius' },
        { name: 'Live Camera', price: 12, desc: 'HD livestream of your pet 24/7' }
      ]
    }
  };

  // Initialize package selection from main content
  initPackageSelectionFromMain();

  // Initialize add-ons event delegation
  const addonsAccordion = document.querySelector('.accordion-section .accordion-content');
  if (addonsAccordion) {
    addonsAccordion.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-btn');
      if (!addBtn) return;

      const addonItem = addBtn.closest('.addon-item');
      if (!addonItem) return;

      const addonName = addonItem.querySelector('.addon-name')?.textContent.trim();
      const addonPrice = parseFloat(addBtn.dataset.price) || 0;

      if (!addonName) return;

      // Toggle addon selection
      if (selectedAddons.has(addonName)) {
        selectedAddons.delete(addonName);
        addBtn.textContent = '+';
        addBtn.classList.remove('selected');
        addonItem.classList.remove('selected');
      } else {
        selectedAddons.set(addonName, { price: addonPrice, element: addonItem });
        addBtn.textContent = '✓';
        addBtn.classList.add('selected');
        addonItem.classList.add('selected');
      }

      // Update selected count for add-ons
      updateSelectedCount('Add-ons', selectedAddons.size);
      // Update price summary
      updatePriceSummary();
    });
  }

  // Initialize treats event delegation
  const treatsGrid = document.querySelector('.treats-grid');
  if (treatsGrid) {
    treatsGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-btn');
      const removeBtn = e.target.closest('.remove-btn');
      if (!addBtn && !removeBtn) return;

      const treatItem = (addBtn || removeBtn).closest('.treat-item');
      if (!treatItem) return;

      const treatName = treatItem.dataset.treatName;
      const treatPrice = parseFloat((addBtn || removeBtn).dataset.price) || 0;
      if (!treatName) return;

      if (addBtn) {
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity += 1;
          selectedTreats.set(treatName, treatData);
        } else {
          selectedTreats.set(treatName, { price: treatPrice, quantity: 1, element: treatItem });
        }
      } else if (removeBtn) {
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity -= 1;
          if (treatData.quantity <= 0) {
            selectedTreats.delete(treatName);
          } else {
            selectedTreats.set(treatName, treatData);
          }
        }
      }

      const currentQuantity = selectedTreats.has(treatName) ? selectedTreats.get(treatName).quantity : 0;
      updateQuantityDisplay(treatItem, currentQuantity);

      const totalTreats = Array.from(selectedTreats.values()).reduce((sum, t) => sum + t.quantity, 0);
      updateSelectedCount('Treats for buddy', totalTreats);

      updatePriceSummary();
    });
  }

  // --- CÁC HÀM CON CỦA HOMESTAY ---

  function initPackageSelectionFromMain() {
    const bookNowButtons = document.querySelectorAll('.pkg-card a.btn.primary');
    bookNowButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        
        // YÊU CẦU: Thêm lại preventDefault để không chuyển trang
        event.preventDefault(); 
        
        const pkgCard = this.closest('.pkg-card');
        if (!pkgCard) return;

        const packageTitle = pkgCard.querySelector('.pkg-title')?.textContent.trim();
        const packagePriceText = pkgCard.querySelector('.pkg-price')?.textContent.trim();
        if (!packageTitle || !packagePriceText) return;

        const priceMatch = packagePriceText.match(/\$(\d+)/);
        const packagePrice = priceMatch ? parseInt(priceMatch[1]) : 0;

        selectedPackage = { name: packageTitle, price: packagePrice };

        selectedAddons.clear();
        selectedTreats.clear();
        document.querySelectorAll('.treats-grid .treat-item').forEach(item => {
          updateQuantityDisplay(item, 0);
        });

        updateSidebarForPackage(packageTitle, packagePrice);
        showNotification(`${packageTitle} has been selected!`, 'success');
      });
    });
  }

  function updateSidebarForPackage(packageName, packagePrice) {
    // Selector cho trang Homestay
    const packageNameEl = document.querySelector('.selected-package h4');
    const packagePriceEl = document.querySelector('.selected-package .package-price');

    if (packageNameEl) packageNameEl.textContent = packageName;
    if (packagePriceEl) packagePriceEl.innerHTML = `$${packagePrice.toFixed(2)}<span class="unit">per night</span>`;

    updateAddonsForPackage(packageName); // Gọi hàm con bên dưới

    updateSelectedCount('Add-ons', 0);
    updateSelectedCount('Treats for buddy', 0);

    updatePriceSummary();
  }

  function updateAddonsForPackage(packageName) {
    const addonsContainer = document.querySelector('.accordion-section .accordion-content');
    if (!addonsContainer) return;
    
    const packageInfo = packageData[packageName]; 
    if (!packageInfo) {
      console.error("Package data not found for:", packageName);
      addonsContainer.innerHTML = '<p>No add-ons available for this package.</p>';
      return;
    }
    
    addonsContainer.innerHTML = ''; // Xóa add-ons cũ
    
    packageInfo.addons.forEach(addon => {
      const addonItem = document.createElement('div');
      addonItem.className = 'addon-item';
      addonItem.setAttribute('data-price', addon.price);
      
      addonItem.innerHTML = `
        <div class="addon-info">
          <div class="addon-header">
            <span class="addon-name">${addon.name}</span>
          </div>
          <p class="addon-desc">${addon.desc || ''}</p>
          <div class="addon-price">$${addon.price}<span class="unit"> /per pet</span></div>
        </div>
        <button class="add-btn" data-price="${addon.price}">+</button>
      `;
      addonsContainer.appendChild(addonItem);
    });
  }


  function updateSelectedCount(accordionTitle, count) {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      const titleSpan = header.querySelector('span:first-child');
      if (titleSpan && titleSpan.textContent.trim() === accordionTitle) {
        const countSpan = header.querySelector('.selected-count');
        if (countSpan) countSpan.textContent = `${count} selected`;
      }
    });
  }

  function updateQuantityDisplay(treatItem, quantity) {
    const treatNameElement = treatItem.querySelector('.treat-name');
    if (!treatNameElement) return;

    let quantitySpan = treatNameElement.querySelector('.quantity-display');
    if (quantity > 0) {
      if (!quantitySpan) {
        quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-display';
        quantitySpan.style.color = '#888';
        quantitySpan.style.fontSize = '0.9em';
        quantitySpan.style.marginLeft = '4px';
        treatNameElement.appendChild(quantitySpan);
      }
      quantitySpan.textContent = ` x${quantity}`;
    } else {
      if (quantitySpan) quantitySpan.remove();
    }
  }

  function updatePriceSummary() {
    const packageRate = isNaN(selectedPackage.price) ? 0 : selectedPackage.price;

    let addonsTotal = 0;
    selectedAddons.forEach(addon => {
      addonsTotal += isNaN(addon.price) ? 0 : addon.price;
    });

    let treatsTotal = 0;
    selectedTreats.forEach(treat => {
      const price = isNaN(treat.price) ? 0 : treat.price;
      const quantity = isNaN(treat.quantity) ? 0 : treat.quantity;
      treatsTotal += price * quantity;
    });

    const total = packageRate + addonsTotal + treatsTotal;

    const packageRateEl = document.querySelector('.package-rate-value');
    const addonsEl = document.querySelector('.addons-total-value');
    const treatsEl = document.querySelector('.treats-total-value');
    const totalEl = document.querySelector('.total-value');

    if (packageRateEl) packageRateEl.textContent = `$${packageRate.toFixed(2)}`;
    if (addonsEl) addonsEl.textContent = `$${addonsTotal.toFixed(2)}`;
    if (treatsEl) treatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // --- HẾT CÁC HÀM CON CỦA HOMESTAY ---

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Lưu gói đã chọn
      localStorage.setItem('selectedPackageName', selectedPackage.name);
      localStorage.setItem('selectedPackagePrice', String(selectedPackage.price));

      // Lưu Add-ons (mỗi add-on qty = 1)
      const addonsToSave = [];
      selectedAddons.forEach((value, key) => {
        addonsToSave.push({ name: key, price: value.price, qty: 1 });
      });
      localStorage.setItem('selectedAddons', JSON.stringify(addonsToSave));

      // Lưu Treats (số lượng từ state)
      const treatsToSave = [];
      selectedTreats.forEach((value, key) => {
        if ((value.quantity || 0) > 0) {
          treatsToSave.push({ name: key, price: value.price, qty: value.quantity });
        }
      });
      localStorage.setItem('selectedTreats', JSON.stringify(treatsToSave));

      // Điều hướng sang Spa Step 1
      window.location.href = 'spastep1.html';
    });
  }

  // Chạy khi tải trang
  // Lấy gói từ localStorage (nếu quay lại trang) hoặc dùng gói đầu tiên
  const savedPkgName = localStorage.getItem('selectedPackageName');
  const savedPkgPrice = parseInt(localStorage.getItem('selectedPackagePrice'), 10);
  
  if (savedPkgName && !isNaN(savedPkgPrice)) {
    selectedPackage = { name: savedPkgName, price: savedPkgPrice };
  } else {
    // Nếu không có gì, dùng gói đầu tiên làm mặc định
    selectedPackage = { name: 'Cozy Room (Basic)', price: 40 };
    localStorage.setItem('selectedPackageName', selectedPackage.name);
    localStorage.setItem('selectedPackagePrice', selectedPackage.price.toString());
  }
  
  updateSidebarForPackage(selectedPackage.name, selectedPackage.price);
  updatePriceSummary();
}

// ========================================================================
// LOGIC TRANG GROOMING SPA (PHỤC HỒI LẠI CODE CŨ CỦA BẠN)
// ========================================================================
function initGroomingSpaFunctionality() {
  // State management for grooming spa
  let selectedPackage = { name: 'The Polished Pup', price: 45 };
  let selectedAddons = new Map(); // addonName -> { price: number, element: HTMLElement }
  let selectedTreats = new Map(); // treatName -> { price: number, quantity: number, element: HTMLElement }

  // SỬA LỖI: Dùng đúng packageData của Grooming (Fix bug trong ảnh)
  const packageData = {
    'The Polished Pup': {
      price: 45,
      addons: [
        { name: 'Dental Care Plus', price: 5, desc: 'Full Teeth Brushing & Gum Massage...' },
        { name: 'Upgraded Shampoo', price: 10, desc: 'Medicated Bath or Whitening Shampoo...' },
        { name: 'Pet Taxi', price: 10, desc: 'Pawfect Care staff picks up and returns your pet...' },
        { name: 'Live Camera', price: 12, desc: 'HD livestream of your pet 24/7' }
      ]
    },
    'The Zen Paws Experience': {
      price: 65,
      addons: [
        { name: 'Vet Visit', price: 25, desc: "A professional vet checks your pet's health..." },
        { name: 'Pet Taxi', price: 10, desc: 'Pawfect Care staff picks up and returns your pet...' },
        { name: 'Live Camera', price: 12, desc: 'HD livestream of your pet 24/7' }
      ]
    }
  };

  // Initialize package selection from main content
  initPackageSelectionFromMain();

  // Initialize add-ons event delegation
  const addonsAccordion = document.querySelector('.accordion-content');
  if (addonsAccordion) {
    addonsAccordion.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-btn');
      if (!addBtn) return;

      const addonItem = addBtn.closest('.addon-item');
      if (!addonItem) return;

      const addonName = addonItem.querySelector('.addon-name')?.textContent.trim();
      const addonPrice = parseFloat(addBtn.dataset.price) || 0;

      if (!addonName) return;

      if (selectedAddons.has(addonName)) {
        selectedAddons.delete(addonName);
        addBtn.textContent = '+';
        addBtn.classList.remove('selected');
        addonItem.classList.remove('selected');
      } else {
        selectedAddons.set(addonName, { price: addonPrice, element: addonItem });
        addBtn.textContent = '✓';
        addBtn.classList.add('selected');
        addonItem.classList.add('selected');
      }

      updateSelectedCount('Add-ons', selectedAddons.size);
      updatePriceSummary();
    });
  }

  // Initialize treats event delegation
  const treatsGrid = document.querySelector('.treats-grid');
  if (treatsGrid) {
    treatsGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-btn');
      const removeBtn = e.target.closest('.remove-btn');
      
      if (!addBtn && !removeBtn) return;

      const treatItem = (addBtn || removeBtn).closest('.treat-item');
      if (!treatItem) return;

      const treatName = treatItem.dataset.treatName;
      const treatPrice = parseFloat((addBtn || removeBtn).dataset.price) || 0;

      if (!treatName) {
        console.error("Could not find data-treat-name on:", treatItem);
        return;
      }

      if (addBtn) {
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity += 1;
          selectedTreats.set(treatName, treatData);
        } else {
          selectedTreats.set(treatName, { price: treatPrice, quantity: 1, element: treatItem });
        }
      } else if (removeBtn) {
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity -= 1;
          if (treatData.quantity <= 0) {
            selectedTreats.delete(treatName);
          } else {
            selectedTreats.set(treatName, treatData);
          }
        }
      }

      const currentQuantity = selectedTreats.has(treatName) ? selectedTreats.get(treatName).quantity : 0;
      updateQuantityDisplay(treatItem, currentQuantity); // Gọi hàm con

      const totalTreats = Array.from(selectedTreats.values()).reduce((sum, treat) => sum + treat.quantity, 0);
      updateSelectedCount('Treats for buddy', totalTreats);

      updatePriceSummary();
    });
  }

  // --- CÁC HÀM CON CỦA GROOMING ---

  function initPackageSelectionFromMain() {
    const bookNowButtons = document.querySelectorAll('.pkg-card .btn.primary');
    
    bookNowButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        
        const pkgCard = this.closest('.pkg-card');
        if (!pkgCard) return;
        
        const packageTitle = pkgCard.querySelector('.pkg-title')?.textContent.trim();
        const packagePriceText = pkgCard.querySelector('.pkg-price')?.textContent.trim();
        
        if (!packageTitle || !packagePriceText) return;
        
        const priceMatch = packagePriceText.match(/\$(\d+)/);
        const packagePrice = priceMatch ? parseInt(priceMatch[1]) : 0;
        
        selectedPackage = { name: packageTitle, price: packagePrice };
        
        // Reset
        selectedAddons.clear();
        selectedTreats.clear();
        document.querySelectorAll('.treats-grid .treat-item').forEach(item => {
          updateQuantityDisplay(item, 0);
        });
        
        updateSidebarForPackage(packageTitle, packagePrice);
        showNotification(`${packageTitle} has been selected!`, 'success');
      });
    });
  }

  function updateSidebarForPackage(packageName, packagePrice) {
    // SỬA LỖI: Đây là selector của trang Grooming
    const packageNameEl = document.querySelector('.package-name');
    const packagePriceEl = document.querySelector('.package-price');
    
    if (packageNameEl) packageNameEl.textContent = packageName;
    if (packagePriceEl) packagePriceEl.textContent = `$${packagePrice.toFixed(2)}`;
    
    updateAddonsForPackage(packageName); // Gọi hàm con bên dưới
    
    updateSelectedCount('Add-ons', 0);
    updateSelectedCount('Treats for buddy', 0);
    
    updatePriceSummary();
  }

  // SỬA LỖI: Thêm $ và mô tả
  function updateAddonsForPackage(packageName) {
    const addonsContainer = document.querySelector('.accordion-content');
    if (!addonsContainer) return;
    
    const packageInfo = packageData[packageName]; // Dùng packageData cục bộ
    if (!packageInfo) {
      console.error("Package data not found for:", packageName);
      addonsContainer.innerHTML = '<p>No add-ons available for this package.</p>';
      return;
    }

    addonsContainer.innerHTML = ''; // Xóa add-ons cũ
    
    packageInfo.addons.forEach(addon => {
      const addonItem = document.createElement('div');
      addonItem.className = 'addon-item';
      addonItem.setAttribute('data-price', addon.price);
      
      addonItem.innerHTML = `
        <div class="addon-info">
          <div class="addon-header">
            <span class="addon-name">${addon.name}</span>
          </div>
          <p class="addon-desc">${addon.desc || ''}</p> 
          <div class="addon-price">$${addon.price}<span class="unit">per pet</span></div>
        </div>
        <button class="add-btn" data-price="${addon.price}">+</button>
      `;
      addonsContainer.appendChild(addonItem);
    });
  }

  function updateSelectedCount(accordionTitle, count) {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      const titleSpan = header.querySelector('span:first-child');
      if (titleSpan && titleSpan.textContent.trim() === accordionTitle) {
        const countSpan = header.querySelector('.selected-count');
        if (countSpan) {
          countSpan.textContent = `${count} selected`;
        }
      }
    });
  }

  // HÀM NÀY BỊ THIẾU TRONG CODE GỐC CỦA BẠN, TÔI ĐÃ THÊM VÀO
  function updateQuantityDisplay(treatItem, quantity) {
    const treatNameElement = treatItem.querySelector('.treat-name');
    if (!treatNameElement) {
      console.error("Could not find .treat-name element within:", treatItem);
      return;
    }
    let quantitySpan = treatNameElement.querySelector('.quantity-display');
    if (quantity > 0) {
      if (!quantitySpan) {
        quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-display';
        quantitySpan.style.color = '#888';
        quantitySpan.style.fontSize = '0.9em';
        quantitySpan.style.marginLeft = '4px';
        treatNameElement.appendChild(quantitySpan);
      }
      quantitySpan.textContent = ` x${quantity}`;
    } else {
      if (quantitySpan) {
        quantitySpan.remove();
      }
    }
  }

  function updatePriceSummary() {
    const packageRate = isNaN(selectedPackage.price) ? 0 : selectedPackage.price;
    
    let addonsTotal = 0;
    selectedAddons.forEach(addon => {
      addonsTotal += isNaN(addon.price) ? 0 : addon.price;
    });
    
    let treatsTotal = 0;
    selectedTreats.forEach(treat => {
      const price = isNaN(treat.price) ? 0 : treat.price;
      const quantity = isNaN(treat.quantity) ? 0 : treat.quantity;
      treatsTotal += price * quantity;
    });
    
    const total = packageRate + addonsTotal + treatsTotal;

    const packageRateEl = document.querySelector('.package-rate-value');
    const addonsEl = document.querySelector('.addons-total-value');
    const treatsEl = document.querySelector('.treats-total-value');
    const totalEl = document.querySelector('.total-value');

    if (packageRateEl) packageRateEl.textContent = `$${packageRate.toFixed(2)}`;
    if (addonsEl) addonsEl.textContent = `$${addonsTotal.toFixed(2)}`;
    if (treatsEl) treatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // --- HẾT CÁC HÀM CON CỦA GROOMING ---

// --- HẾT CÁC HÀM CON CỦA GROOMING ---

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // --- BẮT ĐẦU BỔ SUNG: LƯU DỮ LIỆU VÀO LOCALSTORAGE ---

      // 1. Lưu gói đã chọn
      // Các biến selectedPackage, selectedAddons, selectedTreats đã được cập nhật
      // bởi các hàm khác trong file này.
      localStorage.setItem('selectedPackageName', selectedPackage.name);
      localStorage.setItem('selectedPackagePrice', String(selectedPackage.price));

      // 2. Lưu Add-ons
      const addonsToSave = [];
      selectedAddons.forEach((value, key) => {
        // Gói Spa coi mỗi add-on là 1 (không có số lượng)
        addonsToSave.push({ name: key, price: value.price, qty: 1 });
      });
      localStorage.setItem('selectedAddons', JSON.stringify(addonsToSave));

      // 3. Lưu Treats
      const treatsToSave = [];
      selectedTreats.forEach((value, key) => {
        // Chỉ lưu treat nào có số lượng > 0
        if ((value.quantity || 0) > 0) {
          treatsToSave.push({ name: key, price: value.price, qty: value.quantity });
        }
      });
      localStorage.setItem('selectedTreats', JSON.stringify(treatsToSave));

      // --- KẾT THÚC BỔ SUNG ---

      // 4. Điều hướng (vẫn như cũ)
      window.location.href = 'spastep1.html';
    });
  }

  // Chạy khi tải trang
  updateSidebarForPackage(selectedPackage.name, selectedPackage.price);
  updatePriceSummary();
}


// ========================================================================
// CÁC HÀM HỖ TRỢ CHUNG
// ========================================================================

// Toggle package details (expand/collapse)
function toggleDetails(button) {
  const pkgCard = button.closest('.pkg-card');
  const detailsSection = pkgCard.querySelector('.pkg-details-toggled');

  // an toàn: nếu thiếu section thì thoát
  if (!detailsSection) return;

  // tìm label: ưu tiên .label, nếu không có lấy <span> đầu tiên (hoặc null -> bỏ qua)
  const labelEl = button.querySelector('.label') || button.querySelector('span');

  const willOpen = !detailsSection.classList.contains('is-active');

  // toggle state
  detailsSection.classList.toggle('is-active', willOpen);
  button.classList.toggle('is-active', willOpen);

  // đổi text nếu có label
  if (labelEl) labelEl.textContent = willOpen ? 'Hide Details' : 'View Details';
}



// Switch between tabs
function switchTab(button, tabId) {
  const tabContainer = button.closest('.pkg-tabs');
  tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  tabContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  button.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Toggle accordion sections
function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const chevron = button.querySelector('.chevron');
  
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    chevron.textContent = '▼';
    chevron.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('expanded');
    chevron.textContent = '▲';
    chevron.style.transform = 'rotate(180deg)';
  }
}

// Show notification
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
    font-family: 'Lexend Deca', sans-serif;
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
    }, 300);
  }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });

  // Initialize package selection functionality
  initPackageSelection();

  // Initialize sidebar selections and pricing based on page
  if (page === 'groomingspa') {
    initGroomingSpaFunctionality();
  } else if (page === 'homestayboarding') {
    initHomestayBoardingFunctionality();
  }
});

// Homestay Boarding specific functionality
function initHomestayBoardingFunctionality() {
  // State management for homestay boarding
  let selectedPackage = { name: 'Cozy Room (Basic)', price: 40 };
  let selectedAddons = new Map(); // addonName -> { price: number, element: HTMLElement }
  let selectedTreats = new Map(); // treatName -> { price: number, quantity: number, element: HTMLElement }

  // Initialize add-ons event delegation
  const addonsAccordion = document.querySelector('.accordion-content');
  if (addonsAccordion) {
    addonsAccordion.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-btn')) {
        e.preventDefault();
        const addonItem = e.target.closest('.addon-item');
        const addonName = addonItem.querySelector('.addon-name').textContent.trim();
        const addonPrice = parseFloat(e.target.dataset.price) || 0;

        if (selectedAddons.has(addonName)) {
          // Remove addon
          selectedAddons.delete(addonName);
          e.target.textContent = '+';
          e.target.classList.remove('selected');
        } else {
          // Add addon
          selectedAddons.set(addonName, { price: addonPrice, element: addonItem });
          e.target.textContent = '✓';
          e.target.classList.add('selected');
        }

        updateSelectedCounts();
        updatePriceSummary();
      }
    });
  }

  // Initialize treats event delegation
  const treatsGrid = document.querySelector('.treats-grid');
  if (treatsGrid) {
    treatsGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-btn');
      const removeBtn = e.target.closest('.remove-btn');
      if (!addBtn && !removeBtn) return;

      e.preventDefault();
      const treatItem = (addBtn || removeBtn).closest('.treat-item');
      if (!treatItem) return;

      const treatName = treatItem.dataset.treatName;
      const treatPrice = parseFloat((addBtn || removeBtn).dataset.price) || 0;

      if (!treatName) {
        console.error("Could not find data-treat-name on:", treatItem);
        return;
      }

      if (addBtn) {
        // Increase quantity
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity += 1;
          selectedTreats.set(treatName, treatData);
        } else {
          // Add new treat
          selectedTreats.set(treatName, { 
            price: treatPrice, 
            quantity: 1, 
            element: treatItem 
          });
        }
      } else if (removeBtn) {
        // Decrease quantity
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity -= 1;

          if (treatData.quantity <= 0) {
            // Remove treat entirely
            selectedTreats.delete(treatName);
            const nameEl = treatItem.querySelector('.treat-name');
            const qtySpan = nameEl?.querySelector('.quantity-display');
            if (qtySpan) qtySpan.remove();
          } else {
            selectedTreats.set(treatName, treatData);
          }
        }
      }

      // Update counts and price summary
      updateSelectedCounts();
      updatePriceSummary();

      // Only update quantity display if treat still exists
      if (selectedTreats.has(treatName)) {
        updateTreatQuantityDisplay(treatName);
      }
    });
  }

  // Update selected counts in accordion headers
  function updateSelectedCounts() {
    // Update add-ons count
    const addonsHeader = document.querySelector('.accordion-section .accordion-header');
    if (addonsHeader) {
      const count = selectedAddons.size;
      const countSpan = addonsHeader.querySelector('.selected-count');
      if (countSpan) {
        countSpan.textContent = count > 0 ? `${count} selected` : '0 selected';
      }
    }

    // Update treats count
    const treatsHeaders = document.querySelectorAll('.accordion-section .accordion-header');
    const treatsHeader = Array.from(treatsHeaders).find(header => 
      header.textContent.includes('Treats for buddy')
    );
    if (treatsHeader) {
      const totalQuantity = Array.from(selectedTreats.values())
        .reduce((sum, treat) => sum + treat.quantity, 0);
      const countSpan = treatsHeader.querySelector('.selected-count');
      if (countSpan) {
        countSpan.textContent = totalQuantity > 0 ? `${totalQuantity} selected` : '0 selected';
      }
    }
  }

  // Function to update quantity display for treats
  function updateTreatQuantityDisplay(treatName) {
    const treatData = selectedTreats.get(treatName); // Lấy dữ liệu treat từ Map
    if (!treatData || !treatData.element) {
      console.error("Treat data or element not found for:", treatName);
      return; // Thoát nếu không tìm thấy dữ liệu hoặc element
    }

    const treatItemElement = treatData.element; // Phần tử .treat-item
    const treatNameElement = treatItemElement.querySelector('.treat-name'); // Tìm span .treat-name bên trong

    if (!treatNameElement) {
      console.error("Could not find .treat-name element within:", treatItemElement);
      return; // Thoát nếu không tìm thấy span tên
    }

    // Cố gắng tìm span hiển thị số lượng đã tồn tại bên trong .treat-name
    let quantitySpan = treatNameElement.querySelector('.quantity-display');

    if (treatData.quantity > 0) {
      // Nếu chưa có span số lượng, hãy tạo mới
      if (!quantitySpan) {
        quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-display'; // Đặt class để có thể CSS nếu cần
        quantitySpan.style.color = '#888'; // Màu xám nhạt cho dễ nhìn
        quantitySpan.style.fontSize = '0.9em'; // Kích thước nhỏ hơn tên chính
        quantitySpan.style.marginLeft = '4px'; // Khoảng cách nhỏ
        treatNameElement.appendChild(quantitySpan); // Thêm vào cuối .treat-name
      }
      // Cập nhật nội dung text của span (dù mới tạo hay đã có)
      quantitySpan.textContent = ` x${treatData.quantity}`; // Nội dung là " xN"
    } else {
      // Nếu số lượng là 0 hoặc âm, xóa span số lượng đi (nếu nó tồn tại)
      if (quantitySpan) {
        quantitySpan.remove();
      }
    }
  }

  // Update price summary
  function updatePriceSummary() {
    // Calculate totals with NaN protection
    const packageRate = isNaN(selectedPackage.price) ? 0 : selectedPackage.price;
    const addonsTotal = Array.from(selectedAddons.values())
      .reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0);
    const treatsTotal = Array.from(selectedTreats.values())
      .reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0);
    
    const total = packageRate + addonsTotal + treatsTotal; // Service fee removed

    // Update display with proper currency formatting
    const packageRateEl = document.querySelector('.package-rate-value');
    const addonsEl = document.querySelector('.addons-total-value');
    const treatsEl = document.querySelector('.treats-total-value');
    const subtotalEl = document.querySelector('.subtotal-value');
    const serviceFeeRow = document.querySelector('.price-item.service-fee');
    const totalEl = document.querySelector('.total-value');

    if (packageRateEl) packageRateEl.textContent = `${packageRate.toFixed(2)}`;
    if (addonsEl) addonsEl.textContent = `${addonsTotal.toFixed(2)}`;
    if (treatsEl) treatsEl.textContent = `${treatsTotal.toFixed(2)}`;
    if (subtotalEl) {
      const subtotalRow = subtotalEl.closest('.price-item');
      if (subtotalRow) subtotalRow.style.display = 'none';
    }
    if (serviceFeeRow) serviceFeeRow.style.display = 'none'; // Hide service fee row
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}`;
  }
  // Initialize checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Store booking details in localStorage
      const bookingDetails = {
        service: 'homestay-boarding',
        package: selectedPackage,
        addons: Array.from(selectedAddons.entries()).map(([name, data]) => ({
          name,
          price: data.price
        })),
        treats: Array.from(selectedTreats.entries()).map(([name, data]) => ({
          name,
          price: data.price,
          quantity: data.quantity
        })),
        pricing: {
          packageRate: isNaN(selectedPackage.price) ? 0 : selectedPackage.price,
          addonsTotal: Array.from(selectedAddons.values()).reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0),
          treatsTotal: Array.from(selectedTreats.values()).reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0),
          serviceFee: ((isNaN(selectedPackage.price) ? 0 : selectedPackage.price) + 
                      Array.from(selectedAddons.values()).reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0) +
                      Array.from(selectedTreats.values()).reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0)) * 0.15,
          total: ((isNaN(selectedPackage.price) ? 0 : selectedPackage.price) + 
                 Array.from(selectedAddons.values()).reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0) +
                 Array.from(selectedTreats.values()).reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0)) * 1.15
        }
      };

      localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
      
      // Redirect to booking page
      window.location.href = 'bookinghomestay.html';
    });
  }

  // Initialize global selectionState to match sidebar (Luxury Suite)
  selectionState.package.name = 'Luxury Suite';
  selectionState.package.price = 75;
  
  // Initialize sidebar selections and sync with global state
  initSidebarSelections();
}

// Grooming Spa specific functionality
function initGroomingSpaFunctionality() {
  // State management for grooming spa
  let selectedPackage = { name: 'The Polished Pup', price: 45 };
  let selectedAddons = new Map(); // addonName -> { price: number, element: HTMLElement }
  let selectedTreats = new Map(); // treatName -> { price: number, quantity: number, element: HTMLElement }

  // Package data with their specific add-ons
  const packageData = {
    'The Polished Pup': {
      price: 45,
      addons: [
        { name: 'Dental Care Plus', price: 5 },
        { name: 'Upgraded Shampoo/Conditioner', price: 10 },
        { name: 'Pet Taxi', price: 10 },
        { name: 'Live Camera', price: 12 }
      ]
    },
    'The Zen Paws Experience': {
      price: 65,
      addons: [
        { name: 'Vet Visit', price: 25 },
        { name: 'Pet Taxi', price: 10 },
        { name: 'Live Camera', price: 12 }
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

      // Toggle addon selection
      if (selectedAddons.has(addonName)) {
        // Remove addon
        selectedAddons.delete(addonName);
        addBtn.textContent = '+';
        addBtn.classList.remove('selected');
        addonItem.classList.remove('selected');
      } else {
        // Add addon
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

      // Lấy tên gốc từ data-attribute, KHÔNG dùng textContent
      const treatName = treatItem.dataset.treatName;
      const treatPrice = parseFloat((addBtn || removeBtn).dataset.price) || 0;

      if (!treatName) {
        console.error("Could not find data-treat-name on:", treatItem);
        return;
      }

      if (addBtn) {
        // Increase quantity
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity += 1;
          selectedTreats.set(treatName, treatData);
        } else {
          selectedTreats.set(treatName, { 
            price: treatPrice, 
            quantity: 1, 
            element: treatItem 
          });
        }
      } else if (removeBtn) {
        // Decrease quantity
        if (selectedTreats.has(treatName)) {
          const treatData = selectedTreats.get(treatName);
          treatData.quantity -= 1;
          
          if (treatData.quantity <= 0) {
            // Remove treat completely if quantity reaches 0
            selectedTreats.delete(treatName);
          } else {
            selectedTreats.set(treatName, treatData);
          }
        }
      }

      // Update quantity display
      const currentQuantity = selectedTreats.has(treatName) ? selectedTreats.get(treatName).quantity : 0;
      updateQuantityDisplay(treatItem, currentQuantity);

      // Update selected count for treats
      const totalTreats = Array.from(selectedTreats.values()).reduce((sum, treat) => sum + treat.quantity, 0);
      updateSelectedCount('Treats for buddy', totalTreats);

      // Update price summary
      updatePriceSummary();
    });
  }

  // Function to initialize package selection from main content
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
        
        // Extract price number
        const priceMatch = packagePriceText.match(/\$(\d+)/);
        const packagePrice = priceMatch ? parseInt(priceMatch[1]) : 0;
        
        // Update selected package
        selectedPackage = { name: packageTitle, price: packagePrice };
        
        // Clear previous selections
        selectedAddons.clear();
        selectedTreats.clear();
        
        // Update sidebar
        updateSidebarForPackage(packageTitle, packagePrice);
        
        // Show notification
        showNotification(`${packageTitle} has been selected!`, 'success');
      });
    });
  }

  // Function to update sidebar for selected package
  function updateSidebarForPackage(packageName, packagePrice) {
    // Update selected package display
    const packageNameEl = document.querySelector('.package-name');
    const packagePriceEl = document.querySelector('.package-price');
    
    if (packageNameEl) packageNameEl.textContent = packageName;
    if (packagePriceEl) packagePriceEl.textContent = `$${packagePrice.toFixed(2)}`;
    
    // Update add-ons based on package
    updateAddonsForPackage(packageName);
    
    // Reset counts
    updateSelectedCount('Add-ons', 0);
    updateSelectedCount('Treats for buddy', 0);
    
    // Update price summary
    updatePriceSummary();
  }

  // Function to update add-ons based on selected package
  function updateAddonsForPackage(packageName) {
    const addonsContainer = document.querySelector('.accordion-content');
    if (!addonsContainer) return;
    
    const packageInfo = packageData[packageName];
    if (!packageInfo) return;
    
    // Clear existing add-ons
    addonsContainer.innerHTML = '';
    
    // Create new add-ons based on package
    packageInfo.addons.forEach(addon => {
      const addonItem = document.createElement('div');
      addonItem.className = 'addon-item';
      addonItem.setAttribute('data-price', addon.price);
      
      addonItem.innerHTML = `
        <div class="addon-info">
          <div class="addon-header">
            <span class="addon-name">${addon.name}</span>
          </div>
          <div class="addon-price">${addon.price}<span class="unit">per pet</span></div>
        </div>
        <button class="add-btn" data-price="${addon.price}">+</button>
      `;
      
      addonsContainer.appendChild(addonItem);
    });
  }

  // Function to update selected count in accordion headers
  function updateSelectedCount(accordionTitle, count) {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      const titleSpan = header.querySelector('span');
      if (titleSpan && titleSpan.textContent.trim() === accordionTitle) {
        const countSpan = header.querySelector('.selected-count');
        if (countSpan) {
          countSpan.textContent = `${count} selected`;
        }
      }
    });
  }

  // Function to update quantity display for treats (Robust Version)
  function updateQuantityDisplay(treatItem, quantity) {
    const treatNameElement = treatItem.querySelector('.treat-name'); // Tìm span .treat-name
    if (!treatNameElement) {
      console.error("Could not find .treat-name element within:", treatItem);
      return; // Thoát nếu không tìm thấy span tên
    }

    // Cố gắng tìm span hiển thị số lượng đã tồn tại bên trong .treat-name
    let quantitySpan = treatNameElement.querySelector('.quantity-display');

    if (quantity > 0) {
      // Nếu chưa có span số lượng, hãy tạo mới
      if (!quantitySpan) {
        quantitySpan = document.createElement('span');
        quantitySpan.className = 'quantity-display';
        quantitySpan.style.color = '#888'; // Màu xám nhạt
        quantitySpan.style.fontSize = '0.9em'; // Nhỏ hơn
        quantitySpan.style.marginLeft = '4px'; // Khoảng cách
        treatNameElement.appendChild(quantitySpan); // Thêm vào cuối .treat-name
      }
      // Cập nhật nội dung text của span (dù mới tạo hay đã có)
      quantitySpan.textContent = ` x${quantity}`;
    } else {
      // Nếu số lượng là 0 hoặc âm, xóa span số lượng đi (nếu nó tồn tại)
      if (quantitySpan) {
        quantitySpan.remove();
      }
    }
  }

  // Function to update price summary
  function updatePriceSummary() {
    // Calculate totals with NaN protection
    const packageRate = isNaN(selectedPackage.price) ? 0 : selectedPackage.price;
    
    // Calculate add-ons total
    let addonsTotal = 0;
    selectedAddons.forEach(addon => {
      addonsTotal += isNaN(addon.price) ? 0 : addon.price;
    });
    
    // Calculate treats total
    let treatsTotal = 0;
    selectedTreats.forEach(treat => {
      const price = isNaN(treat.price) ? 0 : treat.price;
      const quantity = isNaN(treat.quantity) ? 0 : treat.quantity;
      treatsTotal += price * quantity;
    });
    
    // Calculate total (no service fee)
    const total = packageRate + addonsTotal + treatsTotal;

    // Update HTML elements with proper currency formatting
    const packageRateEl = document.querySelector('.package-rate-value');
    const addonsEl = document.querySelector('.addons-total-value');
    const treatsEl = document.querySelector('.treats-total-value');
    const totalEl = document.querySelector('.total-value');

    if (packageRateEl) packageRateEl.textContent = `${packageRate.toFixed(2)}`;
    if (addonsEl) addonsEl.textContent = `${addonsTotal.toFixed(2)}`;
    if (treatsEl) treatsEl.textContent = `${treatsTotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}`;
  }

  // Initialize checkout functionality
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Prepare booking details
      const bookingDetails = {
        package: {
          name: selectedPackage.name,
          price: selectedPackage.price
        },
        addons: Array.from(selectedAddons.entries()).map(([name, data]) => ({
          name: name,
          price: data.price
        })),
        treats: Array.from(selectedTreats.entries()).map(([name, data]) => ({
          name: name,
          price: data.price,
          quantity: data.quantity
        })),
        totals: {
          addons: Array.from(selectedAddons.values()).reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0),
          treats: Array.from(selectedTreats.values()).reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0),
          serviceFee: 8.25,
          total: (isNaN(selectedPackage.price) ? 0 : selectedPackage.price) + 
                Array.from(selectedAddons.values()).reduce((sum, addon) => sum + (isNaN(addon.price) ? 0 : addon.price), 0) +
                Array.from(selectedTreats.values()).reduce((sum, treat) => sum + ((isNaN(treat.price) ? 0 : treat.price) * (isNaN(treat.quantity) ? 0 : treat.quantity)), 0) + 8.25
        }
      };

      // Save to localStorage
      localStorage.setItem('spaBookingDetails', JSON.stringify(bookingDetails));
      
      // Navigate to booking page
      window.location.href = 'bookingspa.html';
    });
  }

  // Initial price summary update
  updatePriceSummary();
}

// Update selected package in sidebar
function updateSelectedPackage(packageName, price) {
  const selectedPackage = document.querySelector('.selected-package');
  if (!selectedPackage) return;
  
  // Update package title
  const titleElement = selectedPackage.querySelector('h4');
  if (titleElement) {
    titleElement.textContent = packageName;
  }
  
  // Update package price (keep "per night" unit)
  const priceElement = selectedPackage.querySelector('.package-price');
  if (priceElement) {
    priceElement.innerHTML = `${price}<span class="unit">per night</span>`;
  }
}

// Update visual selection state
function updatePackageSelection(selectedCard) {
  // Remove selected-card class from all package cards
  const allPkgCards = document.querySelectorAll('.pkg-card');
  allPkgCards.forEach(card => {
    card.classList.remove('selected-card');
  });
  
  // Add selected-card class to the clicked package
  selectedCard.classList.add('selected-card');
}

// Toggle package details (expand/collapse)
function toggleDetails(button) {
  const pkgCard = button.closest('.pkg-card');
  const detailsSection = pkgCard.querySelector('.pkg-details-toggled');
  
  if (detailsSection.classList.contains('is-active')) {
    detailsSection.classList.remove('is-active');
    button.innerHTML = 'View Details <span class="arrow">↓</span>';
  } else {
    detailsSection.classList.add('is-active');
    button.innerHTML = 'Hide Details <span class="arrow">↑</span>';
  }
}

// Switch between tabs
function switchTab(button, tabId) {
  // Remove active class from all tab buttons and panels
  const tabContainer = button.closest('.pkg-tabs');
  tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  tabContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  // Add active class to clicked button and corresponding panel
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

// Select package and update sidebar
function selectPackage(packageElement) {
  // Get package information
  const packageTitle = packageElement.querySelector('.pkg-title').textContent.trim();
  const packagePrice = packageElement.querySelector('.pkg-price').textContent.trim();
  const packageUnit = packageElement.querySelector('.pkg-unit').textContent.trim();
  
  // Parse price to number
  const priceValue = parseCurrency(packagePrice);
  
  // Update selection state
  selectionState.package.name = packageTitle;
  selectionState.package.price = priceValue;
  
  // Clear previous add-on and treat selections
  selectionState.addons.clear();
  selectionState.treats.clear();
  
  // Update sidebar content
  const selectedPackage = document.querySelector('.selected-package');
  if (selectedPackage) {
    // Update package title
    const titleElement = selectedPackage.querySelector('h4');
    if (titleElement) {
      titleElement.textContent = packageTitle;
    }
    
    // Update package price
    const priceElement = selectedPackage.querySelector('.package-price');
    if (priceElement) {
      priceElement.innerHTML = `${packagePrice}<span class="unit">${packageUnit}</span>`;
    }
  }
  
  // Render add-ons for the selected package
  renderSidebarAddonsForPackage(packageTitle);
  
  // Update price summary
  updatePriceSummary();
  
  // Show notification
  showNotification(`${packageTitle} has been selected!`, 'success');
}

// Show notification
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

// Sidebar selection + pricing state
const selectionState = {
  package: { name: null, price: 0 }, // price per night
  addons: new Map(),  // name -> boolean selected
  treats: new Map(),  // name -> boolean selected
};

const packageAddonsData = {
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
    { name: 'Live Camera', price: 12 },
  ],
};

function initSidebarSelections() {
  // Initialize selected package from sidebar
  const selectedPkgCard = document.querySelector('.selected-package');
  if (selectedPkgCard) {
    const nameEl = selectedPkgCard.querySelector('h4');
    const priceEl = selectedPkgCard.querySelector('.package-price');
    const pkgName = nameEl ? nameEl.textContent.trim() : null;
    const priceText = priceEl ? priceEl.textContent.trim() : '$0';
    const priceNum = parseCurrency(priceText);

    selectionState.package = { name: pkgName, price: priceNum };
    renderSidebarAddonsForPackage(pkgName);
  }

  // Bind treat buttons
  bindTreatButtons();

  // Initial totals
  updateSelectedCounts();
  updatePriceSummary();
}

function parseCurrency(text) {
  // Extract first $number in text
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function renderSidebarAddonsForPackage(pkgName) {
  const data = packageAddonsData[pkgName] || [];
  // Reset addon selection state when package changes
  selectionState.addons.clear();

  const addonsAccordion = findSidebarAccordionByTitle('Add-ons');
  if (!addonsAccordion) return;
  const content = addonsAccordion.nextElementSibling;
  if (!content) return;

  // Clear current items
  content.innerHTML = '';

  // Render 4 items
  data.forEach(({ name, price }) => {
    const item = document.createElement('div');
    item.className = 'addon-item';

    const info = document.createElement('div');
    info.className = 'addon-info';

    const header = document.createElement('div');
    header.className = 'addon-header';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'addon-name';
    nameSpan.textContent = name;

    header.appendChild(nameSpan);

    const desc = document.createElement('p');
    desc.className = 'addon-desc';
    desc.textContent = ''; // optional description not required for sidebar

    info.appendChild(header);
    info.appendChild(desc);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'addon-price';
    priceDiv.innerHTML = `$${price}<span class="unit">per entire stay</span>`;

    info.appendChild(priceDiv);

    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = '+';
    btn.addEventListener('click', () => {
      const isSelected = selectionState.addons.get(name) === true;
      selectionState.addons.set(name, !isSelected);
      btn.textContent = isSelected ? '+' : '✓';
      item.classList.toggle('selected', !isSelected);
      updateSelectedCounts();
      updatePriceSummary();
    });

    item.appendChild(info);
    item.appendChild(btn);
    content.appendChild(item);
  });
}

function bindTreatButtons() {
  // This function is not needed for groomingspa page as treats are handled in initGroomingSpaFunctionality
  // Only used for other pages that don't have quantity-based treats
  const currentPage = document.body.dataset.page;
  if (currentPage === 'groomingspa') {
    return; // Skip binding for groomingspa page
  }
  
  const treatItems = document.querySelectorAll('.package-sidebar .treat-item');
  treatItems.forEach((item) => {
    const nameEl = item.querySelector('.treat-name');
    const priceEl = item.querySelector('.treat-price');
    const btn = item.querySelector('.add-btn');
    if (!nameEl || !priceEl || !btn) return;

    const name = nameEl.textContent.trim();
    const price = parseCurrency(priceEl.textContent.trim());

    // Initialize state
    if (!selectionState.treats.has(name)) {
      selectionState.treats.set(name, false);
    }

    btn.addEventListener('click', () => {
      const isSelected = selectionState.treats.get(name) === true;
      selectionState.treats.set(name, !isSelected);
      btn.textContent = isSelected ? '+' : '✓';
      item.classList.toggle('selected', !isSelected);
      updateSelectedCounts();
      updatePriceSummary();
    });
  });
}

function findSidebarAccordionByTitle(titleText) {
  const headers = document.querySelectorAll('.package-sidebar .accordion-header');
  for (const header of headers) {
    const label = header.querySelector('span');
    if (label && label.textContent.trim().toLowerCase() === titleText.toLowerCase()) {
      return header;
    }
  }
  return null;
}

function updateSelectedCounts() {
  // Add-ons count
  const addonsHeader = findSidebarAccordionByTitle('Add-ons');
  if (addonsHeader) {
    const countEl = addonsHeader.querySelector('.selected-count');
    if (countEl) {
      const addonsSelected = Array.from(selectionState.addons.values()).filter(Boolean).length;
      countEl.textContent = `${addonsSelected} selected`;
    }
  }
  // Treats count
  const treatsHeader = findSidebarAccordionByTitle('Treats for buddy');
  if (treatsHeader) {
    const countEl = treatsHeader.querySelector('.selected-count');
    if (countEl) {
      const treatsSelected = Array.from(selectionState.treats.values()).filter(Boolean).length;
      countEl.textContent = `${treatsSelected} selected`;
    }
  }
}

function updatePriceSummary() {
  const priceSummary = document.querySelector('.package-sidebar .price-summary');
  if (!priceSummary) return;

  // Base: package price per night (assume 1 night unless later we add nights)
  const packageRate = selectionState.package.price;

  // Add-ons total
  let addonsTotal = 0;
  const pkgData = packageAddonsData[selectionState.package.name] || [];
  pkgData.forEach(({ name, price }) => {
    if (selectionState.addons.get(name)) {
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
    if (selectionState.treats.get(name)) {
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
      const currentPage = document.body.dataset.page;
      const formatted = currentPage === 'homestayboarding'
        ? `${packageRate.toFixed(2)}`
        : `${packageRate}/night`;
      valueEl.textContent = formatted;
    } else if (label === 'Add-ons') {
      valueEl.textContent = `${addonsTotal.toFixed(2)}`;
    } else if (label === 'Treats for buddy') {
      valueEl.textContent = `${treatsTotal.toFixed(2)}`;
    } else if (label === 'Total') {
      valueEl.textContent = `${subtotal.toFixed(2)}`;
    } else if (label === 'Subtotal') {
      valueEl.textContent = `${subtotal.toFixed(2)}`;
    } else if (label === 'Service Fee') {
      valueEl.textContent = `${fee.toFixed(2)}`;
    }
  });
}

// Extend package selection to re-render addons and update pricing
function initPackageSelection() {
  const packageMain = document.querySelector('.package-main');
  if (!packageMain) return;

  const bookNowButtons = packageMain.querySelectorAll('a.btn.primary');
  
  bookNowButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const pkgCard = this.closest('.pkg-card');
      if (!pkgCard) return;
      const packageTitle = pkgCard.querySelector('.pkg-title');
      const packagePrice = pkgCard.querySelector('.pkg-price');
      if (!packageTitle || !packagePrice) return;

      const packageName = packageTitle.textContent.trim();
      const priceText = packagePrice.textContent.trim();
      const priceMatch = priceText.match(/\$\d+/);
      const priceStr = priceMatch ? priceMatch[0] : '$0';
      const priceNum = parseCurrency(priceStr);

      // Update state
      selectionState.package = { name: packageName, price: priceNum };

      // Update sidebar UI
      updateSelectedPackage(packageName, priceStr);
      updatePackageSelection(pkgCard);

      // Render package-specific addons into sidebar
      renderSidebarAddonsForPackage(packageName);
      // Re-bind treat buttons (DOM stays same, but ensure listeners exist)
      bindTreatButtons();

      // Update counts and pricing
      updateSelectedCounts();
      updatePriceSummary();

      // Store selected package in localStorage for booking page
      localStorage.setItem('selectedPackageName', packageName);
      localStorage.setItem('selectedPackagePrice', priceStr);

      showNotification(`${packageName}  has been picked!`, 'success');
    });
  });
}

function initQuantityControls() {
  setupQtyForItems('.addon-item', 'selectedAddons', '.addon-name', '.addon-price');
  setupQtyForItems('.treat-item', 'selectedTreats', '.treat-name', '.treat-price');
}

function setupQtyForItems(itemSelector, storageKey, nameSel, priceSel) {
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
      updateSelectedCountsForSummary(storageKey);
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

function updateSelectedCountsForSummary(storageKey) {
  const arr = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const count = arr.reduce((sum, i) => sum + (i.qty || 0), 0);
  const header = storageKey === 'selectedAddons'
    ? findSidebarAccordionByTitle('Add-ons')
    : findSidebarAccordionByTitle('Treats for buddy');
  const countEl = header?.querySelector('.selected-count');
  if (countEl) countEl.textContent = `${count} selected`;
}
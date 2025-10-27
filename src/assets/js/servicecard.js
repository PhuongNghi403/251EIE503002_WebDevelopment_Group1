document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });

  // Initialize package selection functionality
  initPackageSelection();

  // Initialize sidebar selections and pricing
  initSidebarSelections();
  initQuantityControls(); // bind qty controls for add-ons & treats
});

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
    { name: 'Pet Yoga & Relaxation Session', price: 12 },
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
      valueEl.textContent = `$${packageRate}/night`;
    } else if (label === 'Subtotal') {
      valueEl.textContent = `$${subtotal.toFixed(2)}`;
    } else if (label === 'Service Fee') {
      valueEl.textContent = `$${fee.toFixed(2)}`;
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

      showNotification(`${packageName} đã được chọn!`, 'success');
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
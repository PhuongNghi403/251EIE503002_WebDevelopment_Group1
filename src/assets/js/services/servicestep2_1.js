/* === SERVICESTEP2_1.JS === */
/* (State, Data, and Core Logic Functions)     */

// --- DATABASE (Giả lập) ---
const packageOptions = {
    'basic': { name: 'Cozy Room (Basic)', price: 40 },
    'premium': { name: 'Premium Retreat', price: 55 },
    'luxury': { name: 'Luxury Suite', price: 75 }
};

// Dữ liệu thẻ mặc định
const defaultCardData = {
    "card_1": {
        "id": "card_1", "brand": "Visa", "full_number": "4242424242", "last4": "4242", // 10 số
        "masked": "•••• •• 4242", "expiry_month": "12", "expiry_year": "2025",
        "expiry_display": "12/25", "cardholder_name": "CHU VIET CAM", "cvv": "111", "is_default": false
    },
    "card_2": {
        "id": "card_2", "brand": "Visa", "full_number": "4012888888", "last4": "8686", // 10 số
        "masked": "•••• •• 8686", "expiry_month": "12", "expiry_year": "2025",
        "expiry_display": "12/25", "cardholder_name": "PHAM VI ANH", "cvv": "222", "is_default": true
    }
};

// --- STATE (Trạng thái của booking) ---
let bookingState = {
    package: packageOptions['premium'], // Mặc định
    duration: 1,
    treats: [],
    addOns: [],
    discount: { code: null, percentage: 0 },
    currentCardAction: 'none', // 'view', 'edit', 'add'
    currentCardId: null, // 'card_1', 'card_2'
};

// --- KHỞI TẠO DỮ LIỆU THẺ TỪ LOCALSTORAGE ---
// Tải danh sách thẻ từ localStorage. Nếu không có, dùng 2 thẻ mặc định.
let savedCardData = JSON.parse(localStorage.getItem('userSavedCards'));
if (!savedCardData || Object.keys(savedCardData).length === 0) {
    savedCardData = defaultCardData;
    localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
}

// Phí dịch vụ cố định
const SERVICE_FEE = 5.00;

// --- DOM ELEMENT STUBS ---
// Các biến này sẽ được gán giá trị thật trong tệp servicestep2_2.js
// Chúng cần được khai báo ở đây để các hàm bên dưới có thể truy cập
let summaryServiceEl, summaryDurationEl, summarySubtotalEl, summaryServiceFeeEl,
    summaryAddonsEl, summaryTreatsEl, summaryDiscountEl, summaryTotalEl,
    summaryDateTimeEl, treatsListEl, addOnsListEl, treatsCountEl, addOnsCountEl,
    checkinDateEl, checkoutDateEl, dayCountEl, continueToStep3Btn, proceedToPayBtn,
    paymentTabs, savedCardsList, addNewCardBtn, cardLimitError,
    paymentDetailsForm, paymentFormTitle, cardFormNumber, cardFormName,
    cardFormExpiry, cardFormCvv, cancelEditBtn, doneEditBtn,
    modal, modalTitle, modalMessage, modalCancelBtn, modalConfirmBtn;

// Các biến cho NodeLists
let requiredFields, paymentTypeRadios, toggleVisibilityBtns;


// --- FUNCTIONS ---

const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    }
    return 0;
};

const toNumber = (val, fallback = 0) => {
    if (val == null) return fallback;
    const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? fallback : n;
};

/**
 * Tải dữ liệu từ LocalStorage (ĐÃ SỬA + FALLBACK CHO SPA)
 */
function loadDataFromStorage() {
    const pageType = document.body.dataset.page;
    const primaryKey = 'bookingDetails';
    const altKey = pageType === 'groomingspa' ? 'spaBookingDetails' : null;
    const data =
        JSON.parse(localStorage.getItem(primaryKey) || 'null') ||
        (altKey ? JSON.parse(localStorage.getItem(altKey) || 'null') : null);

    if (!data) {
        console.warn('No booking data found in localStorage. Using defaults.');
        updateSummary();
        return;
    }

    bookingState.package = data.package || packageOptions['premium'];
    bookingState.duration = toNumber(localStorage.getItem('bookingDuration'), 1);
    bookingState.addOns = data.addons || [];
    bookingState.treats = data.treats || [];
    bookingState.discount = data.discount || JSON.parse(localStorage.getItem('selectedDiscount') || 'null') || { code: null, percentage: 0 };

    renderList(treatsListEl, bookingState.treats, true);
    renderList(addOnsListEl, bookingState.addOns, false);

    const totalTreats = bookingState.treats.reduce((sum, item) => sum + toNumber(item.quantity ?? item.qty, 0), 0);
    const totalAddons = bookingState.addOns.length;

    if (treatsCountEl) treatsCountEl.textContent = `${totalTreats} selected`;
    if (addOnsCountEl) addOnsCountEl.textContent = `${totalAddons} selected`;

    const checkinStored = localStorage.getItem('bookingCheckinDate');
    const checkoutStored = localStorage.getItem('bookingCheckoutDate');

    if (checkinDateEl) checkinDateEl.textContent = checkinStored || '--';
    if (checkoutDateEl) checkoutDateEl.textContent = checkoutStored || '--';
    if (dayCountEl) dayCountEl.textContent = `${bookingState.duration} Day${bookingState.duration > 1 ? 's' : ''}`;

    updateSummary();
}

/**
 * Cập nhật Price Summary (ĐÃ SỬA - Bỏ Service Fee + HỖ TRỢ SPA QTY)
 */
function updateSummary() {
    const isSpaFlow = (document.body?.dataset?.page === 'groomingspa') || location.pathname.includes('spa');

    const packagePrice = parsePrice(bookingState.package.price);
    const addOnsTotal = bookingState.addOns.reduce((sum, item) => sum + parsePrice(item.price), 0);
    const treatsTotal = bookingState.treats.reduce((sum, item) => {
        const qty = toNumber(item.quantity ?? item.qty, 0);
        return sum + (parsePrice(item.price) * qty);
    }, 0);

    const preDiscountTotal = isSpaFlow
        ? (packagePrice + SERVICE_FEE + addOnsTotal + treatsTotal)
        : ((packagePrice * bookingState.duration) + addOnsTotal + treatsTotal);

    const discountPct = bookingState.discount?.percentage || 0;
    const discountAmount = preDiscountTotal * discountPct;
    const total = preDiscountTotal - discountAmount;

    if (summaryServiceEl) summaryServiceEl.textContent = bookingState.package.name;
    if (!isSpaFlow) {
        if (summaryDurationEl) summaryDurationEl.textContent = `${bookingState.duration} day${bookingState.duration > 1 ? 's' : ''}`;
        if (summarySubtotalEl) summarySubtotalEl.textContent = `$${(packagePrice * bookingState.duration).toFixed(2)}`;
        if (summaryServiceFeeEl) summaryServiceFeeEl.parentElement.style.display = 'none';
    } else {
        const dateStr = localStorage.getItem('bookingCheckinDate') || '--';
        const timeStr = localStorage.getItem('selectedTimeSlot') || '';
        const dateTimeDisplay = `${dateStr}${timeStr ? ', ' + timeStr : ''}`;
        if (summaryDateTimeEl) summaryDateTimeEl.textContent = dateTimeDisplay;

        if (summaryServiceFeeEl) {
          summaryServiceFeeEl.textContent = `$${SERVICE_FEE.toFixed(2)}`;
          summaryServiceFeeEl.parentElement.style.display = '';
        }
    }

    if (summaryTreatsEl) summaryTreatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
    if (summaryAddonsEl) summaryAddonsEl.textContent = `$${addOnsTotal.toFixed(2)}`;
    if (summaryDiscountEl) summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    if (summaryTotalEl) summaryTotalEl.textContent = `$${total.toFixed(2)}`;
}

/**
 * Render danh sách (Treats, Add-ons) — HỖ TRỢ SPA QTY
 */
function renderList(listElement, items, useQuantity) {
    if (!listElement) return;
    listElement.innerHTML = '';
    if (!items || items.length === 0) {
        listElement.innerHTML = '<li class="summary-item-none">No items selected.</li>';
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
        const qty = useQuantity ? toNumber(item.quantity ?? item.qty, 1) : 1;
        qtySpan.textContent = `x ${qty}`;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'item-price';
        const price = toNumber(item.price, 0);
        priceSpan.textContent = `$${(price * qty).toFixed(2)}`;

        li.appendChild(nameSpan);
        li.appendChild(qtySpan);
        li.appendChild(priceSpan);
        listElement.appendChild(li);
    });
}

/**
 * Xử lý nút Continue / Proceed (HỢP NHẤT + ROUTE SPA)
 */
function attemptProceed(e) {
    e.preventDefault();
    if (validateForm()) {
        const existingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');

        const petInfo = {
            name: document.getElementById('pet-name')?.value?.trim() || '',
            type: document.getElementById('pet-type')?.value || '',
            age: document.getElementById('pet-age')?.value || '',
            weight: document.getElementById('pet-weight')?.value || '',
            specialRequirements: document.getElementById('special-requirements')?.value?.trim() || '',
            emergencyContact: document.getElementById('emergency-contact')?.value?.trim() || ''
        };

        const contactInfo = {
            ownerName: document.getElementById('owner-name')?.value?.trim() || '',
            phoneNumber: document.getElementById('phone-number')?.value?.trim() || '',
            email: document.getElementById('email')?.value?.trim() || '',
            address: document.getElementById('address')?.value?.trim() || ''
        };

        const selectedPaymentType = document.querySelector('input[name="payment-type"]:checked')?.value || 'card';
        const selectedCardLast4 = localStorage.getItem('selectedCardLast4') || null;

        const updatedDetails = {
            ...existingDetails,
            pet: petInfo,
            contact: contactInfo,
            payment: {
                method: selectedPaymentType,
                cardLast4: selectedPaymentType === 'card' ? selectedCardLast4 : null
            }
        };

        localStorage.setItem('bookingDetails', JSON.stringify(updatedDetails));

        const isSpaFlow = document.body.dataset.page === 'groomingspa';
        window.location.href = isSpaFlow ? 'spastep3.html' : 'homestaystep3.html';
    } else {
        console.log('Form is invalid');
        const firstError = document.querySelector('.main-content-col .form-group.has-error');
        if(firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * Logic Payment Method
 */
function updatePaymentVisibility() {
    const selected = document.querySelector('input[name="payment-type"]:checked')?.value;
    const isCard = selected === 'card';
    const cardCount = Object.keys(savedCardData).length;

    if (savedCardsList) savedCardsList.style.display = isCard ? 'flex' : 'none';
    if (addNewCardBtn) addNewCardBtn.style.display = (isCard && cardCount < 3) ? 'block' : 'none';
    if (paymentTabs) paymentTabs.classList.toggle('hide-separator', !isCard);
    
    if (!isCard && paymentDetailsForm.style.display === 'flex') {
        closePaymentForm();
    }
    // Nếu chuyển sang QR, xóa lựa chọn thẻ để tránh hiển thị thẻ ở Step 3
    if (!isCard) {
        localStorage.removeItem('selectedCardLast4');
    }
}

// Mở Form
function openPaymentForm(mode, cardId = null) {
    bookingState.currentCardAction = mode;
    bookingState.currentCardId = cardId;
    const cardData = cardId ? savedCardData[cardId] : null;

    const isViewOnly = (mode === 'view');
    if (cardFormNumber) cardFormNumber.disabled = isViewOnly;
    if (cardFormName) cardFormName.disabled = isViewOnly;
    if (cardFormExpiry) cardFormExpiry.disabled = isViewOnly;
    if (cardFormCvv) cardFormCvv.disabled = isViewOnly;
    if (doneEditBtn) doneEditBtn.style.display = isViewOnly ? 'none' : 'inline-flex';

    toggleVisibilityBtns.forEach(btn => {
        const input = btn.closest('.input-with-icon').querySelector('input');
        const iconOpen = btn.querySelector('.icon-eye-open');
        const iconClosed = btn.querySelector('.icon-eye-closed');

        input.type = 'password';
        if (iconOpen) iconOpen.style.display = 'inline';
        if (iconClosed) iconClosed.style.display = 'none';
    });

    clearFormErrors(paymentDetailsForm);

    if (mode === 'add') {
        if (paymentFormTitle) paymentFormTitle.textContent = "Add New Card";
        if (cardFormNumber) {
            cardFormNumber.value = '';
            cardFormNumber.type = 'text';
        }
        if (cardFormName) cardFormName.value = '';
        if (cardFormExpiry) cardFormExpiry.value = '';
        if (cardFormCvv) {
            cardFormCvv.value = '';
            cardFormCvv.type = 'password';
        }
    } else if (mode === 'edit') {
        if (paymentFormTitle) paymentFormTitle.textContent = "Edit Card Details";
        if (cardData) {
            if (cardFormNumber) { cardFormNumber.value = cardData.full_number; cardFormNumber.type = 'password'; }
            if (cardFormName) cardFormName.value = cardData.cardholder_name;
            if (cardFormExpiry) cardFormExpiry.value = cardData.expiry_display;
            if (cardFormCvv) { cardFormCvv.value = cardData.cvv; cardFormCvv.type = 'password'; }
        }
    } else if (mode === 'view') {
        if (paymentFormTitle) paymentFormTitle.textContent = "Payment Details";
        if (cardData) {
            if (cardFormNumber) { cardFormNumber.value = cardData.full_number; cardFormNumber.type = 'password'; }
            if (cardFormName) cardFormName.value = cardData.cardholder_name;
            if (cardFormExpiry) cardFormExpiry.value = cardData.expiry_display;
            if (cardFormCvv) { cardFormCvv.value = cardData.cvv; cardFormCvv.type = 'password'; }
        }
    }

    if (paymentDetailsForm) paymentDetailsForm.style.display = 'flex';
    if (addNewCardBtn) addNewCardBtn.style.display = 'none';
    paymentDetailsForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Đóng Form
function closePaymentForm() {
    if (paymentDetailsForm) paymentDetailsForm.style.display = 'none';
    updatePaymentVisibility();
    clearFormErrors(paymentDetailsForm);
    bookingState.currentCardAction = 'none';
    bookingState.currentCardId = null;
}

// Mở Modal Xác nhận
function openConfirmationModal(title, message, confirmText, actionType) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalConfirmBtn) modalConfirmBtn.textContent = confirmText;
    if (modal) {
         modal.style.display = 'flex';
         modalConfirmBtn.dataset.action = actionType;
         if (actionType === 'delete') {
            modalConfirmBtn.style.backgroundColor = '#DC143C';
         } else {
            modalConfirmBtn.style.backgroundColor = '#7a5b48';
         }
    }
}

// Đóng Modal Xác nhận
function closeConfirmationModal() {
    if (modal) modal.style.display = 'none';
}

// Render lại danh sách thẻ
function renderCardList() {
    if (!savedCardsList) return;
    savedCardsList.innerHTML = '';
    
    const cardIds = Object.keys(savedCardData);
    const cardCount = cardIds.length;

    if (addNewCardBtn) {
        addNewCardBtn.style.display = (cardCount < 3 && paymentTypeRadios[0].checked) ? 'block' : 'none';
    }
    if (cardLimitError) {
        cardLimitError.style.display = (cardCount >= 3) ? 'block' : 'none';
        if (cardCount >= 3) cardLimitError.textContent = "You can only save a maximum of 3 cards.";
    }
    
    cardIds.forEach(cardId => {
        const card = savedCardData[cardId];
        const li = document.createElement('li');
        li.className = 'saved-card';
        li.dataset.id = card.id;
        
        li.innerHTML = `
            <img src="../../assets/icons/Service/CreditCardIcon.svg" alt="Visa" class="card-logo">
            <div class="card-info">
                <span class="card-number">${card.masked}</span>
                <span class="card-details">${card.expiry_display} • ${card.cardholder_name}</span>
            </div>
            <div class="card-actions">
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn" aria-label="Delete card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        savedCardsList.appendChild(li);
    });
}

// --- CÁC HÀM VALIDATION ---
function showFieldError(inputId, message) {
    // Cần kiểm tra document.getElementById(inputId) trước khi truy cập
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}-error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        inputEl?.closest('.form-group')?.classList.add('has-error');
    }
}

function clearFormErrors(formElement) {
    if (!formElement) return;
    formElement.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    formElement.querySelectorAll('.form-group.has-error').forEach(el => {
        el.classList.remove('has-error');
    });
}

function validatePaymentForm() {
    let isValid = true;
    clearFormErrors(paymentDetailsForm);

    // 1. Card Number (10 digits only)
    const cardNum = cardFormNumber.value;
    if (!/^\d{10}$/.test(cardNum)) {
        showFieldError('card-number', 'Card Number must be exactly 10 digits.');
        isValid = false;
    }

    // 2. Cardholder Name (Uppercase, no diacritics/numbers)
    const cardName = cardFormName.value.trim().toUpperCase();
    if (!/^[A-Z\s]+$/.test(cardName) || cardName === '') {
        showFieldError('card-name', 'Must be uppercase letters and spaces only (e.g., NGUYEN VAN A).');
        isValid = false;
    }

    // 3. Expiry Date (MM/YY)
    const expiry = cardFormExpiry.value;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        showFieldError('expiry-date', 'Must be in MM/YY format (e.g., 12/25).');
        isValid = false;
    }

    // 4. CVV (3 digits only)
    const cvv = cardFormCvv.value;
    if (!/^\d{3}$/.test(cvv)) {
        showFieldError('cvv', 'CVV must be exactly 3 digits.');
        isValid = false;
    }
    
    return isValid;
}

// Validate tổng thể form Step 2 (Pet, Contact, Payment)
// *** ĐÃ TÍCH HỢP LOGIC VALIDATEFORM MỚI ***
function validateForm() {
    let isValid = true;

    // 1) Xóa lỗi cũ
    document.querySelectorAll('.main-content-col .error-message').forEach(el => {
        if (el.id !== 'card-limit-error') {
            el.style.display = 'none';
            el.textContent = '';
        }
    });
    document.querySelectorAll('.main-content-col .form-group.has-error')
        .forEach(el => el.classList.remove('has-error'));

    // 2) Kiểm tra các trường required
    const currentRequiredFields = document.querySelectorAll('.main-content-col form [required]');
    currentRequiredFields.forEach(field => {
        const val = String(field.value || '').trim();
        const group = field.closest('.form-group');
        const err = group ? group.querySelector('.error-message') : null;

        const isEmpty = val === '' || (field.tagName === 'SELECT' && !field.value);
        if (isEmpty) {
            group?.classList.add('has-error');
            if (err) {
                err.textContent = 'Please fill in the information';
                err.style.display = 'block';
            }
            isValid = false;
        }
    });

    // 3) Kiểm tra định dạng Phone/Email
    const phonePattern = /^\+?\d[\d\s\-]{7,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneField = document.getElementById('phone-number');
    const emergencyField = document.getElementById('emergency-contact');
    const emailField = document.getElementById('email');

    if (phoneField && phoneField.value && !phonePattern.test(phoneField.value.trim())) {
        showFieldError('phone-number', 'Invalid phone number.');
        isValid = false;
    }
    if (emergencyField && emergencyField.value && !phonePattern.test(emergencyField.value.trim())) {
        showFieldError('emergency-contact', 'Invalid phone number.');
        isValid = false;
    }
    if (emailField && emailField.value && !emailPattern.test(emailField.value.trim())) {
        showFieldError('email', 'Invalid email address.');
        isValid = false;
    }

    // 4) Kiểm tra Payment
    const selectedPaymentType = document.querySelector('input[name="payment-type"]:checked')?.value || 'card';
    const localCardLimitError = document.getElementById('card-limit-error'); // Dùng biến local

    if (selectedPaymentType === 'card') {
        // *** LOGIC MỚI: Chấp nhận nếu có thẻ active hoặc đã có selectedCardLast4 trong localStorage ***
        const activeCard = document.querySelector('.saved-cards-list .saved-card.active');
        const selectedLast4 = localStorage.getItem('selectedCardLast4');

        if (!activeCard && !selectedLast4) {
            if (localCardLimitError) {
                localCardLimitError.textContent = 'Please select a saved card or add a new one.';
                localCardLimitError.style.display = 'block';
            }
            isValid = false;
        } else {
            if (localCardLimitError) localCardLimitError.style.display = 'none';
        }
        // *** KẾT THÚC LOGIC MỚI ***

        // Nếu đang add/edit, yêu cầu form thẻ hợp lệ
        if (bookingState.currentCardAction === 'add' || bookingState.currentCardAction === 'edit') {
            if (!validatePaymentForm()) {
                isValid = false;
            }
        }
    } else {
        // QR: không yêu cầu thẻ
        if (localCardLimitError) localCardLimitError.style.display = 'none';
    }

    return isValid;
}
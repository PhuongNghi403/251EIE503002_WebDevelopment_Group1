document.addEventListener('DOMContentLoaded', () => {

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


    // Phí dịch vụ cố định (ĐÃ BỊ XÓA KHỎI HÀM TÍNH TOÁN)
    const SERVICE_FEE = 5.00;

    // --- DOM ELEMENTS (Lấy các phần tử) ---
    // Sidebar
    const summaryServiceEl = document.getElementById('summary-service');
    const summaryDurationEl = document.getElementById('summary-duration');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryServiceFeeEl = document.getElementById('summary-service-fee');
    const summaryAddonsEl = document.getElementById('summary-addons');
    const summaryTreatsEl = document.getElementById('summary-treats');
    const summaryDiscountEl = document.getElementById('summary-discount');
    const summaryTotalEl = document.getElementById('summary-total');
    const treatsListEl = document.querySelector('.summary-list.treats-list');
    const addOnsListEl = document.querySelector('.summary-list.addons-list');
    const treatsCountEl = document.querySelector('details.summary-accordion:nth-of-type(1) .count');
    const addOnsCountEl = document.querySelector('details.summary-accordion:nth-of-type(2) .count');
    
    // Ngày tháng (Từ Step 1)
    const checkinDateEl = document.querySelector('.date-range .date-col:first-child .date-value');
    const checkoutDateEl = document.querySelector('.date-range .date-col:last-child .date-value');
    const dayCountEl = document.querySelector('.day-count');

    // Form
    const continueToStep3Btn = document.getElementById('continue-to-step3-btn');
    const proceedToPayBtn = document.getElementById('proceed-to-pay-btn');
    const requiredFields = document.querySelectorAll('.main-content-col form [required]');

    // Payment
    const paymentTabs = document.querySelector('.payment-tabs');
    const paymentTypeRadios = document.querySelectorAll('input[name="payment-type"]');
    const savedCardsList = document.querySelector('.saved-cards-list');
    const addNewCardBtn = document.querySelector('.add-new-card-btn');
    const cardLimitError = document.getElementById('card-limit-error');
    
    // Payment Details Form
    const paymentDetailsForm = document.getElementById('payment-details-form');
    const paymentFormTitle = document.getElementById('payment-form-title');
    const cardFormNumber = document.getElementById('card-number');
    const cardFormName = document.getElementById('card-name');
    const cardFormExpiry = document.getElementById('expiry-date');
    const cardFormCvv = document.getElementById('cvv');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const doneEditBtn = document.getElementById('done-edit-btn');
    const toggleVisibilityBtns = document.querySelectorAll('.toggle-visibility-btn');
    
    // Confirmation Modal
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    
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
     * Tải dữ liệu từ LocalStorage (ĐÃ SỬA)
     */
    function loadDataFromStorage() {
        const pageType = document.body.dataset.page;
        const storageKey = pageType === 'groomingspa' ? 'spaBookingDetails' : 'bookingDetails';
        const data = JSON.parse(localStorage.getItem(storageKey) || 'null');

        if (!data) {
            console.warn(`No booking data found in localStorage key: ${storageKey}. Using defaults.`);
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

        const totalTreats = bookingState.treats.reduce((sum, item) => sum + toNumber(item.quantity, 0), 0);
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
     * Cập nhật Price Summary (ĐÃ SỬA - Bỏ Service Fee)
     */
    function updateSummary() {
        const packagePrice = parsePrice(bookingState.package.price);
        const addOnsTotal = bookingState.addOns.reduce((sum, item) => sum + parsePrice(item.price), 0);
        const treatsTotal = bookingState.treats.reduce((sum, item) => sum + (parsePrice(item.price) * toNumber(item.quantity, 0)), 0);

        const preDiscountTotal = (packagePrice * bookingState.duration) + addOnsTotal + treatsTotal;
        const discountPct = bookingState.discount?.percentage || 0;
        const discountAmount = preDiscountTotal * discountPct;
        const total = preDiscountTotal - discountAmount;

        if (summaryServiceEl) summaryServiceEl.textContent = bookingState.package.name;
        if (summaryDurationEl) summaryDurationEl.textContent = `${bookingState.duration} day${bookingState.duration > 1 ? 's' : ''}`;
        if (summarySubtotalEl) summarySubtotalEl.textContent = `$${(packagePrice * bookingState.duration).toFixed(2)}`;
        if (summaryTreatsEl) summaryTreatsEl.textContent = `$${treatsTotal.toFixed(2)}`;
        if (summaryAddonsEl) summaryAddonsEl.textContent = `$${addOnsTotal.toFixed(2)}`;
        if (summaryDiscountEl) summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
        if (summaryServiceFeeEl) summaryServiceFeeEl.parentElement.style.display = 'none';
        if (summaryTotalEl) summaryTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Render danh sách (Treats, Add-ons)
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
            const qty = useQuantity ? toNumber(item.quantity, 1) : 1;
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
     * Kiểm tra (validate) form
     */
    function validateForm() {
        let allValid = true;
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return; 
            
            const isEmpty = !field.value || (field.tagName?.toLowerCase() === 'select' && field.value === '');
            const errorMsg = formGroup.querySelector('.error-message');

            if (isEmpty) {
                formGroup.classList.add('has-error');
                if (errorMsg) {
                    errorMsg.textContent = 'Please fill in the information';
                    errorMsg.style.display = 'block';
                }
                allValid = false;
            } else {
                formGroup.classList.remove('has-error');
                if (errorMsg) errorMsg.style.display = 'none';
            }
        });
        return allValid;
    }

    /**
     * Xử lý nút Continue / Proceed (HỢP NHẤT)
     */
    function attemptProceed(e) {
        e.preventDefault();
        if (validateForm()) {
            // Lưu dữ liệu form vào localStorage
            const existingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');

            // Pet Information
            const petInfo = {
                name: document.getElementById('pet-name')?.value?.trim() || '',
                type: document.getElementById('pet-type')?.value || '',
                age: document.getElementById('pet-age')?.value || '',
                weight: document.getElementById('pet-weight')?.value || '',
                specialRequirements: document.getElementById('special-requirements')?.value?.trim() || '',
                emergencyContact: document.getElementById('emergency-contact')?.value?.trim() || ''
            };

            // Contact Information
            const contactInfo = {
                ownerName: document.getElementById('owner-name')?.value?.trim() || '',
                phoneNumber: document.getElementById('phone-number')?.value?.trim() || '',
                email: document.getElementById('email')?.value?.trim() || '',
                address: document.getElementById('address')?.value?.trim() || ''
            };

            // Payment Method
            const selectedPaymentType = document.querySelector('input[name="payment-type"]:checked')?.value || 'card';
            const selectedCardLast4 = localStorage.getItem('selectedCardLast4') || null;

            const updatedDetails = {
                ...existingDetails,
                pet: petInfo,
                contact: contactInfo,
                payment: {
                    method: selectedPaymentType,
                    cardLast4: selectedCardLast4
                }
            };

            localStorage.setItem('bookingDetails', JSON.stringify(updatedDetails));

            // Chuyển sang Step 3 (Review)
            window.location.href = 'homestaystep3.html';
        } else {
            console.log('Form is invalid');
            const firstError = document.querySelector('.main-content-col .form-group.has-error');
            if(firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    if (proceedToPayBtn) {
        proceedToPayBtn.addEventListener('click', attemptProceed);
    }
    if (continueToStep3Btn) {
        continueToStep3Btn.addEventListener('click', attemptProceed);
    }

    // Xóa báo lỗi khi người dùng bắt đầu nhập
    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.value) {
                field.closest('.form-group')?.classList.remove('has-error');
            }
        });
    });

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
        
        // Ẩn form chi tiết nếu chuyển sang QR
        if (!isCard && paymentDetailsForm.style.display === 'flex') {
            closePaymentForm();
        }
    }

    paymentTypeRadios.forEach(r => r.addEventListener('change', updatePaymentVisibility));

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

        // Reset trạng thái icon con mắt + kiểu input
        toggleVisibilityBtns.forEach(btn => {
            const input = btn.closest('.input-with-icon').querySelector('input');
            const iconOpen = btn.querySelector('.icon-eye-open');
            const iconClosed = btn.querySelector('.icon-eye-closed');

            // Luôn khởi tạo ở trạng thái bị che (password)
            input.type = 'password';
            if (iconOpen) iconOpen.style.display = 'inline';
            if (iconClosed) iconClosed.style.display = 'none';
        });

        clearFormErrors(paymentDetailsForm);

        if (mode === 'add') {
            if (paymentFormTitle) paymentFormTitle.textContent = "Add New Card";
            if (cardFormNumber) {
                cardFormNumber.value = '';
                cardFormNumber.type = 'text'; // Cho phép nhìn khi nhập mới
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
                // Nạp số thật nhưng để password => hiển thị chấm tròn cho tới khi bấm con mắt
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
        updatePaymentVisibility(); // Hiện lại nút Add nếu cần
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
            // Không set 'active' mặc định; chỉ khi người dùng click mới có active
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

    // Xử lý sự kiện click trên danh sách thẻ
    if (savedCardsList) {
        savedCardsList.addEventListener('click', (e) => {
            const cardItem = e.target.closest('.saved-card');
            if (!cardItem) return;

            const editButton = e.target.closest('.edit-btn');
            const deleteButton = e.target.closest('.delete-btn');
            const cardId = cardItem.dataset.id;
            const cardData = savedCardData[cardId];
            
            if (!cardData) return;

            if (editButton) {
                e.preventDefault();
                openPaymentForm('edit', cardId);
            } else if (deleteButton) {
                e.preventDefault();
                bookingState.currentCardId = cardId;
                openConfirmationModal('Delete Card?', `Do you really want to delete card ending in ${cardData.last4}?`, 'Yes, Delete', 'delete');
            } else {
                // Chỉ khi click vào item thẻ mới set active
                savedCardsList.querySelectorAll('.saved-card').forEach(c => c.classList.remove('active'));
                cardItem.classList.add('active');
                localStorage.setItem('selectedCardLast4', cardData.last4);
                openPaymentForm('view', cardId);
            }
        });
    }

    // Nút "Add New Card"
    if (addNewCardBtn) {
        addNewCardBtn.addEventListener('click', () => {
            const cardCount = Object.keys(savedCardData).length;
            if (cardCount >= 3) {
                if (cardLimitError) {
                    cardLimitError.textContent = "You can only save a maximum of 3 cards.";
                    cardLimitError.style.display = 'block';
                }
            } else {
                if (cardLimitError) cardLimitError.style.display = 'none';
                openPaymentForm('add');
            }
        });
    }
    
    // --- CÁC HÀM VALIDATION MỚI ---
    function showFieldError(inputId, message) {
        const errorEl = document.getElementById(`${inputId}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            document.getElementById(inputId)?.closest('.form-group')?.classList.add('has-error');
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

    // Nút "Done" trong form Payment Details
    if (doneEditBtn) {
        doneEditBtn.addEventListener('click', () => {
            if (currentCardAction === 'add' || currentCardAction === 'edit') {
                if (!validatePaymentForm()) {
                    return; // Dừng lại nếu form không hợp lệ
                }
            }

            if (currentCardAction === 'edit') {
                openConfirmationModal('Confirm Edit', 'Are you sure you want to save these changes?', 'Save Changes', 'edit');
            } else if (currentCardAction === 'add') {
                const newCardId = `card_${Date.now()}`;
                const newCardNum = cardFormNumber.value;
                savedCardData[newCardId] = {
                    id: newCardId, brand: "Visa", full_number: newCardNum, last4: newCardNum.slice(-4),
                    masked: `•••• •• ${newCardNum.slice(-4)}`,
                    expiry_display: cardFormExpiry.value, cardholder_name: cardFormName.value.trim().toUpperCase(), cvv: cardFormCvv.value, is_default: false
                };
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                renderCardList();
                closePaymentForm();
            } else { // view
                closePaymentForm();
            }
        });
    }

    // Nút "Cancel" trong form Payment Details
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closePaymentForm);
    }
    
    // Nút "Cancel" trong Modal
    if(modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeConfirmationModal);
    }

    // Nút "Confirm" trong Modal
    if(modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            const action = modalConfirmBtn.dataset.action;
            if (action === 'edit') {
                const newCardNum = cardFormNumber.value;
                const id = bookingState.currentCardId;
                savedCardData[id].full_number = newCardNum;
                savedCardData[id].cardholder_name = cardFormName.value.trim().toUpperCase();
                savedCardData[id].expiry_display = cardFormExpiry.value;
                savedCardData[id].cvv = cardFormCvv.value;
                savedCardData[id].masked = `•••• •• ${newCardNum.slice(-4)}`;
                savedCardData[id].last4 = newCardNum.slice(-4);
                
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                renderCardList();
                closePaymentForm();
            } else if (action === 'delete') {
                const id = bookingState.currentCardId;
                delete savedCardData[id];
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                renderCardList();
            }
            closeConfirmationModal();
        });
    }

    // Nút Icon Mắt (Toggle Visibility)
    toggleVisibilityBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.closest('.input-with-icon').querySelector('input');
            const iconOpen = btn.querySelector('.icon-eye-open');
            const iconClosed = btn.querySelector('.icon-eye-closed');

            if (!input || !iconOpen || !iconClosed) return;

            const isCardNumber = input.id === 'card-number';
            const isView = bookingState.currentCardAction === 'view';
            const selectedId = bookingState.currentCardId;

            // Khi xem: toggle hiển/ẩn số thật (full_number/cvv) thay vì chuỗi '••••'
            if (isView && selectedId && (isCardNumber || input.id === 'cvv')) {
                const realValue = isCardNumber 
                    ? savedCardData[selectedId]?.full_number 
                    : savedCardData[selectedId]?.cvv;

                if (input.type === 'password') {
                    input.type = 'text';          // hiển số thật
                    input.value = realValue || input.value;
                    iconOpen.style.display = 'none';
                    iconClosed.style.display = 'inline';
                } else {
                    input.type = 'password';      // quay lại che bằng chấm tròn
                    input.value = realValue || input.value; // giữ giá trị số thật nhưng bị che
                    iconOpen.style.display = 'inline';
                    iconClosed.style.display = 'none';
                }
                return;
            }

            // Khi add/edit: chỉ toggle type
            if (input.type === 'password') {
                input.type = 'text';
                iconOpen.style.display = 'none';
                iconClosed.style.display = 'inline';
            } else {
                input.type = 'password';
                iconOpen.style.display = 'inline';
                iconClosed.style.display = 'none';
            }
        });
    });

    // --- INITIALIZATION (Khởi chạy) ---
    renderCardList();
    updatePaymentVisibility();
    // initSavedCardSelection(); // Xóa vì không tồn tại
    loadDataFromStorage();
    // updateSummary(); // loadDataFromStorage đã gọi rồi
});
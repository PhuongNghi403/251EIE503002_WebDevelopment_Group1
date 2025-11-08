/* === SERVICESTEP2_2.JS === */
/* (DOM Element Assignment & Event Listeners)     */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS (Gán giá trị cho STUBS từ file 1) ---
    // Sidebar
    summaryServiceEl = document.getElementById('summary-service');
    summaryDurationEl = document.getElementById('summary-duration');
    summarySubtotalEl = document.getElementById('summary-subtotal');
    summaryServiceFeeEl = document.getElementById('summary-service-fee');
    summaryAddonsEl = document.getElementById('summary-addons');
    summaryTreatsEl = document.getElementById('summary-treats');
    summaryDiscountEl = document.getElementById('summary-discount');
    summaryTotalEl = document.getElementById('summary-total');
    summaryDateTimeEl = document.getElementById('summary-date-time');
    treatsListEl = document.querySelector('.summary-list.treats-list');
    addOnsListEl = document.querySelector('.summary-list.addons-list');
    treatsCountEl = document.querySelector('details.summary-accordion:nth-of-type(1) .count');
    addOnsCountEl = document.querySelector('details.summary-accordion:nth-of-type(2) .count');
    
    // Ngày tháng (Từ Step 1)
    checkinDateEl = document.querySelector('.date-range .date-col:first-child .date-value');
    checkoutDateEl = document.querySelector('.date-range .date-col:last-child .date-value');
    dayCountEl = document.querySelector('.day-count');

    // Form
    continueToStep3Btn = document.getElementById('continue-to-step3-btn');
    proceedToPayBtn = document.getElementById('proceed-to-pay-btn');
    requiredFields = document.querySelectorAll('.main-content-col form [required]');

    // Payment
    paymentTabs = document.querySelector('.payment-tabs');
    paymentTypeRadios = document.querySelectorAll('input[name="payment-type"]');
    savedCardsList = document.querySelector('.saved-cards-list');
    addNewCardBtn = document.querySelector('.add-new-card-btn');
    cardLimitError = document.getElementById('card-limit-error');
    
    // Payment Details Form
    paymentDetailsForm = document.getElementById('payment-details-form');
    paymentFormTitle = document.getElementById('payment-form-title');
    cardFormNumber = document.getElementById('card-number');
    cardFormName = document.getElementById('card-name');
    cardFormExpiry = document.getElementById('expiry-date');
    cardFormCvv = document.getElementById('cvv');
    cancelEditBtn = document.getElementById('cancel-edit-btn');
    doneEditBtn = document.getElementById('done-edit-btn');
    toggleVisibilityBtns = document.querySelectorAll('.toggle-visibility-btn');
    
    // Confirmation Modal
    modal = document.getElementById('confirmation-modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalCancelBtn = document.getElementById('modal-cancel-btn');
    modalConfirmBtn = document.getElementById('modal-confirm-btn');

    
    // --- EVENT LISTENERS ---

    // Nút Continue / Proceed
    if (proceedToPayBtn) {
        proceedToPayBtn.addEventListener('click', attemptProceed);
    }
    if (continueToStep3Btn) {
        continueToStep3Btn.addEventListener('click', attemptProceed);
    }

    // Xóa báo lỗi khi nhập
    if (requiredFields) {
        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value) {
                    field.closest('.form-group')?.classList.remove('has-error');
                }
            });
        });
    }

    // Payment Type Radio
    if (paymentTypeRadios) {
        paymentTypeRadios.forEach(r => r.addEventListener('change', updatePaymentVisibility));
    }

    // Click trên danh sách thẻ
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
    
    // Nút "Done" trong form Payment Details
    if (doneEditBtn) {
        doneEditBtn.addEventListener('click', () => {
            if (bookingState.currentCardAction === 'add' || bookingState.currentCardAction === 'edit') {
                if (!validatePaymentForm()) {
                    return;
                }
            }

            if (bookingState.currentCardAction === 'edit') {
                openConfirmationModal('Confirm Edit', 'Are you sure you want to save these changes?', 'Save Changes', 'edit');
            } else if (bookingState.currentCardAction === 'add') {
                const newCardId = `card_${Date.now()}`;
                const newCardNum = cardFormNumber.value;
                const newLast4 = newCardNum.slice(-4);
                savedCardData[newCardId] = {
                    id: newCardId, brand: "Visa", full_number: newCardNum, last4: newLast4,
                    masked: `•••• •• ${newLast4}`,
                    expiry_display: cardFormExpiry.value, 
                    cardholder_name: cardFormName.value.trim().toUpperCase(), 
                    cvv: cardFormCvv.value, 
                    is_default: false
                };
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                renderCardList();
                closePaymentForm();
                
                // Tự động active thẻ vừa thêm
                const newCardEl = savedCardsList.querySelector(`[data-id="${newCardId}"]`);
                if(newCardEl) {
                    savedCardsList.querySelectorAll('.saved-card').forEach(c => c.classList.remove('active'));
                    newCardEl.classList.add('active');
                    localStorage.setItem('selectedCardLast4', newLast4);
                }

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
            const id = bookingState.currentCardId;
            if (!id) {
                closeConfirmationModal();
                return;
            }

            if (action === 'edit') {
                const newCardNum = cardFormNumber.value;
                const newLast4 = newCardNum.slice(-4);
                savedCardData[id].full_number = newCardNum;
                savedCardData[id].cardholder_name = cardFormName.value.trim().toUpperCase();
                savedCardData[id].expiry_display = cardFormExpiry.value;
                savedCardData[id].cvv = cardFormCvv.value;
                savedCardData[id].masked = `•••• •• ${newLast4}`;
                savedCardData[id].last4 = newLast4;
                
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                // Nếu thẻ đang sửa là thẻ active, cập nhật last4
                if(localStorage.getItem('selectedCardLast4') !== newLast4) {
                     const activeCard = savedCardsList.querySelector('.saved-card.active');
                     if (activeCard && activeCard.dataset.id === id) {
                         localStorage.setItem('selectedCardLast4', newLast4);
                     }
                }

                renderCardList();
                closePaymentForm();
            } else if (action === 'delete') {
                // Nếu xóa thẻ đang active, xóa luôn lựa chọn
                if (localStorage.getItem('selectedCardLast4') === savedCardData[id]?.last4) {
                    localStorage.removeItem('selectedCardLast4');
                }
                delete savedCardData[id];
                localStorage.setItem('userSavedCards', JSON.stringify(savedCardData));
                renderCardList();
            }
            closeConfirmationModal();
        });
    }

    // Nút Icon Mắt (Toggle Visibility)
    if (toggleVisibilityBtns) {
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

                if (isView && selectedId && (isCardNumber || input.id === 'cvv')) {
                    const realValue = isCardNumber 
                        ? savedCardData[selectedId]?.full_number 
                        : savedCardData[selectedId]?.cvv;

                    if (input.type === 'password') {
                        input.type = 'text';
                        input.value = realValue || input.value;
                        iconOpen.style.display = 'none';
                        iconClosed.style.display = 'inline';
                    } else {
                        input.type = 'password';
                        input.value = realValue || input.value;
                        iconOpen.style.display = 'inline';
                        iconClosed.style.display = 'none';
                    }
                    return;
                }

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
    }

    // --- INITIALIZATION (Khởi chạy) ---
    renderCardList();
    updatePaymentVisibility();
    
    // *** LOGIC MỚI: Auto-select thẻ đầu tiên ***
    const isCardSelected = document.querySelector('input[name="payment-type"]:checked')?.value === 'card';
    const hasActiveCard = !!document.querySelector('.saved-cards-list .saved-card.active');
    
    if (isCardSelected && savedCardsList && !hasActiveCard) {
        const firstCardItem = savedCardsList.querySelector('.saved-card');
        if (firstCardItem) {
            firstCardItem.classList.add('active');
            const cardId = firstCardItem.dataset.id;
            const cardData = savedCardData[cardId]; // Lấy từ file 1
            if (cardData) {
                localStorage.setItem('selectedCardLast4', cardData.last4);
            }
        }
    }
    // *** KẾT THÚC LOGIC MỚI ***

    loadDataFromStorage();
});
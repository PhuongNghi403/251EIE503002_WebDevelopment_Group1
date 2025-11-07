document.addEventListener('DOMContentLoaded', () => {
  const details = JSON.parse(localStorage.getItem('bookingDetails') || 'null') || {};

  function toNumber(n, def = 0) {
    const v = Number(n);
    return Number.isFinite(v) ? v : def;
  }

  function parsePrice(p) {
    if (typeof p === 'string') return parseFloat(p);
    if (typeof p === 'number') return p;
    return 0;
  }

  // Pet Information
  const pet = details.pet || {};
  const contact = details.contact || {};

  const setText = (id, text) => {
    const el = document.getElementById(id) || document.querySelector(`[id="${id} "]`);
    if (el) el.textContent = text ?? '--';
  };

  setText('review-pet-name', pet.name || '--');
  setText('review-owner-name', contact.ownerName || '--');
  setText('review-pet-type', pet.type || '--');
  setText('review-phone-number', contact.phoneNumber || '--');
  setText('review-pet-age', pet.age ? `${pet.age} year${toNumber(pet.age, 0) > 1 ? 's' : ''}` : '--');
  setText('review-pet-weight', pet.weight ? `${pet.weight} kg` : '--');
  setText('review-special-notes', pet.specialRequirements || '--');

  // Booking Details (ngày và duration lấy từ Step 1/2)
  const isSpaFlow = (document.body?.dataset?.page === 'groomingspa') || location.pathname.includes('spa');
  const checkin = localStorage.getItem('bookingCheckinDate') || '--';
  const checkout = localStorage.getItem('bookingCheckoutDate') || '--';
  const duration = toNumber(localStorage.getItem('bookingDuration') ?? details.duration, 1);

  if (!isSpaFlow) {
    setText('review-checkin', checkin);
    setText('review-checkout', checkout);
    setText('review-duration', `${duration} day${duration > 1 ? 's' : ''}`);
  } else {
    const timeStr = localStorage.getItem('selectedTimeSlot') || details.timeSlot || '';
    const dateTimeDisplay = `${checkin}${timeStr ? ', ' + timeStr : ''}`;
    setText('review-date-time', dateTimeDisplay);
  }

  // Payment
  const payment = details.payment || {};
  const selectedLast4 = payment.cardLast4 || localStorage.getItem('selectedCardLast4') || null;
  let paymentNumberText = '•••• •••• •••• ----';
  let paymentExpiryText = 'Expires --/-- • --';

  if (selectedLast4) {
    paymentNumberText = `•••• •••• •••• ${selectedLast4}`;
    // Nếu có danh sách thẻ đã lưu, hiển thị tên chủ thẻ + hạn
    const savedCards = JSON.parse(localStorage.getItem('userSavedCards') || 'null') || {};
    const match = Object.values(savedCards).find(c => c.last4 === selectedLast4);
    if (match) {
      const holder = match.cardholder_name || '--';
      const expiry = match.expiry_display || '--/--';
      paymentExpiryText = `Expires ${expiry} • ${holder}`;
    }
  }

  setText('review-payment-number', paymentNumberText);
  setText('review-payment-expiry', paymentExpiryText);

  // Order Summary
  const pkgPrice = parsePrice(details.package?.price ?? localStorage.getItem('selectedPackagePrice') ?? 0);
  const addOns = details.addons || [];
  const treats = details.treats || [];
  const discountObj = details.discount || JSON.parse(localStorage.getItem('selectedDiscount') || 'null') || { code: null, percentage: 0 };
  const discountPct = toNumber(discountObj.percentage, 0);

  const addOnsTotal = addOns.reduce((sum, a) => sum + parsePrice(a.price), 0);
  const treatsTotal = treats.reduce((sum, t) => sum + (parsePrice(t.price) * toNumber(t.quantity ?? t.qty, 0)), 0);

  let preDiscountTotal;
  const SERVICE_FEE = 5.00;

  if (!isSpaFlow) {
    const subtotal = pkgPrice * duration;
    preDiscountTotal = subtotal + addOnsTotal + treatsTotal;
    setText('summary-service-duration', `${duration} day${duration > 1 ? 's' : ''}`);
    setText('summary-service-subtotal', `$${(subtotal).toFixed(2)}`);
  } else {
    preDiscountTotal = pkgPrice + SERVICE_FEE + addOnsTotal + treatsTotal;
    const spaDate = localStorage.getItem('bookingCheckinDate') || '--';
    const spaTime = localStorage.getItem('selectedTimeSlot') || details.timeSlot || '';
    const summaryDateTime = `${spaDate}${spaTime ? ', ' + spaTime : ''}`;
    setText('summary-date-time', summaryDateTime);
    setText('summary-service-fee', `$${SERVICE_FEE.toFixed(2)}`);
  }

  const discountAmount = preDiscountTotal * discountPct;
  const total = preDiscountTotal - discountAmount;

  setText('summary-service-name', details.package?.name || localStorage.getItem('selectedPackageName') || '--');
  setText('summary-service-addons', `$${addOnsTotal.toFixed(2)}`);
  setText('summary-service-treats', `$${treatsTotal.toFixed(2)}`);
  setText('summary-service-discount', `-$${discountAmount.toFixed(2)}`);
  setText('summary-service-total', `$${total.toFixed(2)}`);

  // Arrow cleanup (DOM): quét toàn bộ subtree và xóa node chỉ chứa '→'
  const mainCol = document.querySelector('.main-content-col');
  if (mainCol) {
    // Xóa mọi text node đơn lẻ có nội dung '→'
    const walker = document.createTreeWalker(mainCol, NodeFilter.SHOW_TEXT);
    const toClean = [];
    let t;
    while ((t = walker.nextNode())) {
      if (t.textContent && t.textContent.trim() === '→') {
        toClean.push(t);
      }
    }
    toClean.forEach(node => { node.textContent = ''; });

    // Gỡ element nếu chỉ chứa đúng '→'
    Array.from(mainCol.querySelectorAll('*')).forEach(el => {
      if (el.childNodes.length === 1 && el.textContent.trim() === '→') {
        el.remove();
      }
    });
  }
});
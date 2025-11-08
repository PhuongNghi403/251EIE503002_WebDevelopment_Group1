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
  const paymentIconEl = document.querySelector('.payment-method-box .payment-icon');
  const method = payment.method || 'card';

  let paymentNumberText = '•••• •••• •••• ----';
  let paymentExpiryText = 'Expires --/-- • --';

  if (method === 'card') {
    const selectedLast4 = payment.cardLast4 || localStorage.getItem('selectedCardLast4') || null;
    if (paymentIconEl) {
      paymentIconEl.src = '../../assets/icons/Service/CreditCardIcon.svg';
      paymentIconEl.alt = 'Visa';
    }
    if (selectedLast4) {
      paymentNumberText = `•••• •••• •••• ${selectedLast4}`;
      const savedCards = JSON.parse(localStorage.getItem('userSavedCards') || 'null') || {};
      const match = Object.values(savedCards).find(c => c.last4 === selectedLast4);
      if (match) {
        const holder = match.cardholder_name || '--';
        const expiry = match.expiry_display || '--/--';
        paymentExpiryText = `Expires ${expiry} • ${holder}`;
      }
    }
  } else {
    // QR Code selected: hiển thị QR icon và nội dung phù hợp
    if (paymentIconEl) {
      paymentIconEl.src = '../../assets/icons/Service/QRCodeIcon.svg';
      paymentIconEl.alt = 'QR Code';
    }
    paymentNumberText = 'QR Code • MOMO/VNPAY';
    paymentExpiryText = ''; // không áp dụng cho QR
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

  // ---- OTP + Success Flow (Spa/Homestay Step3) ----
  const payBtn = document.querySelector('.summary-review-card .btn.primary');
  const termsEl = document.querySelector('.terms-agreement input[type="checkbox"]');
  const computedTotal = total; // dùng để hiển thị trong success modal
  let otpCountdownId = null;

  function ensureStyleInjected() {
    if (document.getElementById('svc-otp-style')) return;
    const style = document.createElement('style');
    style.id = 'svc-otp-style';
    style.textContent = `
      .svc-otp-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:none;align-items:center;justify-content:center;z-index:1000}
      .svc-otp-overlay.show{display:flex}
      .svc-otp-dialog{background:#fff;border-radius:12px;padding:20px;max-width:420px;width:90%;box-shadow:0 10px 24px rgba(0,0,0,0.12);position:relative}
      .svc-otp-title{margin:0 0 8px;font:600 18px/1.3 'Lexend Deca';color:#4D2B12}
      .svc-otp-desc{margin:0 0 12px;font:400 14px/1.5 'Lexend Deca';color:#7B5E47}
      .svc-otp-input{width:100%;padding:10px;border:1px solid #E9E4DC;border-radius:8px;font:400 14px 'Lexend Deca'}
      .svc-otp-countdown{margin-top:8px;font:400 12px 'Lexend Deca';color:#7B5E47}
      .svc-otp-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:12px}
      .svc-otp-close{position:absolute;top:10px;right:12px;background:#fff;border:1px solid #EEE2D4;border-radius:8px;width:32px;height:32px;cursor:pointer}
      .svc-success-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:none;align-items:center;justify-content:center;z-index:1000}
      .svc-success-overlay.show{display:flex}
      .svc-success-dialog{background:#fff;border-radius:12px;padding:20px;max-width:500px;width:92%;box-shadow:0 10px 24px rgba(0,0,0,0.12);position:relative}
      .svc-success-title{margin:0 0 8px;font:700 20px/1.3 'Lexend Deca';color:#4D2B12}
      .svc-success-text{margin:0 0 12px;font:400 14px/1.6 'Lexend Deca';color:#7B5E47}
      .svc-success-details{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:8px}
      .svc-success-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:16px}
      .svc-success-close{position:absolute;top:10px;right:12px;background:#fff;border:1px solid #EEE2D4;border-radius:8px;width:32px;height:32px;cursor:pointer}
      /* QR Popup */
      .svc-qr-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:none;align-items:center;justify-content:center;z-index:1000}
      .svc-qr-overlay.show{display:flex}
      .svc-qr-dialog{background:#fff;border-radius:12px;padding:24px;max-width:520px;width:92%;box-shadow:0 10px 24px rgba(0,0,0,0.12);position:relative;text-align:center}
      .svc-qr-title{margin:0 0 12px;font:700 22px 'Lexend Deca';color:#4D2B12}
      .svc-qr-timer{font:600 18px 'Lexend Deca';color:#000;margin:4px 0 8px}
      .svc-qr-desc{font:400 14px 'Lexend Deca';color:#7B5E47;margin-bottom:12px}
      .svc-qr-canvas{width:240px;height:240px;margin:0 auto 12px;display:block}
      .svc-qr-amount-label{font:700 14px 'Lexend Deca';color:#4D2B12;letter-spacing:.5px}
      .svc-qr-amount{font:700 26px 'Lexend Deca';color:#000;margin:6px 0 12px}
      .svc-qr-actions{display:flex;gap:12px;justify-content:center;margin-top:8px}
      .svc-qr-close{position:absolute;top:10px;right:12px;background:#fff;border:1px solid #EEE2D4;border-radius:8px;width:32px;height:32px;cursor:pointer}
      .svc-qr-support{font:400 13px 'Lexend Deca';color:#7B5E47;margin-top:14px}
    `;
    document.head.appendChild(style);
  }

  function ensureOtpUi() {
    if (document.querySelector('.svc-otp-overlay')) return;
    ensureStyleInjected();
    const overlay = document.createElement('div');
    overlay.className = 'svc-otp-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'OTP Verification');

    overlay.innerHTML = `
      <div class="svc-otp-dialog">
        <button class="svc-otp-close" aria-label="Close">×</button>
        <h3 class="svc-otp-title">${isSpaFlow ? 'Confirm Your Appointment' : 'Confirm Your Booking'}</h3>
        <p class="svc-otp-desc">Enter the 6-digit OTP sent to <span id="svcOtpPhone">your phone</span>.</p>
        <input id="svcOtpInput" class="svc-otp-input" type="text" inputmode="numeric" maxlength="6" placeholder="Enter OTP" />
        <div class="svc-otp-countdown">Expires in <span id="svcOtpTimer">02:00</span></div>
        <div class="svc-otp-actions">
          <button class="btn ghost" id="svcOtpResend">Resend</button>
          <button class="btn" id="svcOtpConfirm">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close behaviors
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOtp(true);
    });
    overlay.querySelector('.svc-otp-close')?.addEventListener('click', () => closeOtp(true));
    overlay.querySelector('#svcOtpResend')?.addEventListener('click', onOtpResend);
    overlay.querySelector('#svcOtpConfirm')?.addEventListener('click', onOtpConfirm);
  }

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function startOtpCountdown() {
    const timerEl = document.getElementById('svcOtpTimer');
    let remaining = 2 * 60 * 1000;
    if (timerEl) timerEl.textContent = formatTime(remaining);
    if (otpCountdownId) clearInterval(otpCountdownId);
    otpCountdownId = setInterval(() => {
      remaining -= 1000;
      if (timerEl) timerEl.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(otpCountdownId);
        otpCountdownId = null;
        if (timerEl) timerEl.textContent = '00:00';
      }
    }, 1000);
  }

  function stopOtpCountdown(reset = true) {
    if (otpCountdownId) {
      clearInterval(otpCountdownId);
      otpCountdownId = null;
    }
    const timerEl = document.getElementById('svcOtpTimer');
    if (reset && timerEl) timerEl.textContent = '02:00';
  }

  function resolvePhoneText() {
    const fallback = 'your phone';
    const fromDetails = contact?.phoneNumber || '';
    if (fromDetails) return fromDetails;
    const domText = (document.getElementById('review-phone-number')?.textContent || '').trim();
    return domText || fallback;
  }

  function openOtp() {
    ensureOtpUi();
    const overlay = document.querySelector('.svc-otp-overlay');
    const phoneEl = document.getElementById('svcOtpPhone');
    const inputEl = document.getElementById('svcOtpInput');
    if (phoneEl) phoneEl.textContent = resolvePhoneText();
    if (inputEl) inputEl.value = '';
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
    startOtpCountdown();
  }

  function closeOtp(resetTimer = true) {
    const overlay = document.querySelector('.svc-otp-overlay');
    overlay?.classList.remove('show');
    overlay?.setAttribute('aria-hidden', 'true');
    stopOtpCountdown(resetTimer);
  }

  function onOtpResend() {
    alert('A new OTP has been sent.');
    const inputEl = document.getElementById('svcOtpInput');
    if (inputEl) inputEl.value = '';
    startOtpCountdown();
  }

  function ensureSuccessUi() {
    if (document.querySelector('.svc-success-overlay')) return;
    ensureStyleInjected();
    const overlay = document.createElement('div');
    overlay.className = 'svc-success-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Confirmation');

    const titleText = isSpaFlow ? 'Appointment Confirmed!' : 'Booking Confirmed!';
    const subtitle = isSpaFlow
      ? `Your grooming appointment is set.`
      : `Your homestay booking is set.`;

    // Build page-specific details
    const detailsRows = [];
    if (isSpaFlow) {
      const spaDate = localStorage.getItem('bookingCheckinDate') || '--';
      const spaTime = localStorage.getItem('selectedTimeSlot') || details.timeSlot || '';
      const dt = `${spaDate}${spaTime ? ', ' + spaTime : ''}`;
      detailsRows.push(`<div><span>Date & Time</span></div><div><strong>${dt}</strong></div>`);
    } else {
      const checkinDisplay = localStorage.getItem('bookingCheckinDate') || '--';
      const checkoutDisplay = localStorage.getItem('bookingCheckoutDate') || '--';
      const dur = toNumber(localStorage.getItem('bookingDuration') ?? details.duration, 1);
      detailsRows.push(`<div><span>Check-in</span></div><div><strong>${checkinDisplay}</strong></div>`);
      detailsRows.push(`<div><span>Check-out</span></div><div><strong>${checkoutDisplay}</strong></div>`);
      detailsRows.push(`<div><span>Duration</span></div><div><strong>${dur} day${dur > 1 ? 's' : ''}</strong></div>`);
    }
    detailsRows.push(`<div><span>Total</span></div><div><strong>$${computedTotal.toFixed(2)}</strong></div>`);

    overlay.innerHTML = `
      <div class="svc-success-dialog">
        <button class="svc-success-close" aria-label="Close">×</button>
        <h3 class="svc-success-title">${titleText}</h3>
        <p class="svc-success-text">${subtitle}</p>
        <div class="svc-success-details">
          ${detailsRows.join('')}
        </div>
        <div class="svc-success-actions">
          <a class="btn ghost" id="svcSuccessBack" href="../services/services.html">Back to Services</a>
          <a class="btn ghost" id="svcSuccessView" href="../profile/profile_servicestatus.html">View Details</a>
          <button class="btn" id="svcSuccessClose">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSuccess();
    });
    overlay.querySelector('.svc-success-close')?.addEventListener('click', () => closeSuccess());
    overlay.querySelector('#svcSuccessClose')?.addEventListener('click', () => closeSuccess());
  }

  function openSuccess() {
    ensureSuccessUi();
    const overlay = document.querySelector('.svc-success-overlay');
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
    try {
      const conf = window.confetti;
      if (conf) conf({ particleCount: 80, spread: 70, origin: { y: 0.2 } });
    } catch (_e) {}
  }

  function closeSuccess() {
    const overlay = document.querySelector('.svc-success-overlay');
    overlay?.classList.remove('show');
    overlay?.setAttribute('aria-hidden', 'true');
  }

  function onOtpConfirm() {
    // Accept any OTP entered by user
    const inputEl = document.getElementById('svcOtpInput');
    const otp = (inputEl?.value || '').trim();

    // Yêu cầu OTP đúng 6 chữ số
    if (!/^\d{6}$/.test(otp)) {
      alert('Invalid OTP. A new code has been sent.');
      if (inputEl) inputEl.value = '';
      startOtpCountdown();
      return;
    }

    // OTP hợp lệ -> đóng OTP và mở modal thành công
    closeOtp(true);

    // Nếu chọn QR Code: mở popup QR 10p, người dùng bấm CHECK mới Confirmed
    if (method === 'qr') {
      openQr(computedTotal);
      return;
    }

    // Trường hợp thẻ (card) hoặc phương thức khác: xác nhận ngay
    try {
      const nowIso = new Date().toISOString();
      const generatedId = `SV-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const baseNote = isSpaFlow ? 'Your appointment is set.' : 'Your homestay booking is set.';
      const bookingDetail = isSpaFlow
        ? {
            dateTime: `${localStorage.getItem('bookingCheckinDate') || '--'}${(localStorage.getItem('selectedTimeSlot') || details.timeSlot || '') ? ', ' + (localStorage.getItem('selectedTimeSlot') || details.timeSlot || '') : ''}`
          }
        : {
            checkin: localStorage.getItem('bookingCheckinDate') || '--',
            checkout: localStorage.getItem('bookingCheckoutDate') || '--',
            duration: toNumber(localStorage.getItem('bookingDuration') ?? details.duration, 1)
          };
      const lastServiceBooking = {
        id: generatedId,
        type: isSpaFlow ? 'spa' : 'homestay',
        createdAt: nowIso,
        total: computedTotal,
        status: 'confirmed',
        details: bookingDetail,
        timeline: [
          { key: 'confirmed', title: 'Booking Confirmed', time: nowIso, note: baseNote },
          { key: 'preparing', title: isSpaFlow ? 'Preparing Service' : 'Preparing Room', time: nowIso, note: 'We are getting things ready.' }
        ]
      };
      localStorage.setItem('lastServiceBooking', JSON.stringify(lastServiceBooking));
      localStorage.setItem('pc_has_booking_activity', 'true');
      localStorage.setItem('lastBooking', JSON.stringify({
        type: isSpaFlow ? 'spa' : 'homestay',
        total: computedTotal,
        time: nowIso,
        status: 'confirmed',
      }));
    } catch (_err) {}

    openSuccess();
  }

  if (payBtn) {
    payBtn.addEventListener('click', (e) => {
      if (!termsEl || !termsEl.checked) {
        e.preventDefault();
        alert('Please agree to the terms before paying.');
        return;
      }
      e.preventDefault();
      openOtp();
    });
  }

  // ===== QR Popup (only for QR Code payment) =====
  let qrCountdownId = null;
  let qrInstance = null;

  function ensureQrUi() {
    if (document.querySelector('.svc-qr-overlay')) return;
    ensureStyleInjected();
    const overlay = document.createElement('div');
    overlay.className = 'svc-qr-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'QR Payment');
    overlay.innerHTML = `
      <div class="svc-qr-dialog">
        <button class="svc-qr-close" aria-label="Close">×</button>
        <h3 class="svc-qr-title">Please Scan The QR Code</h3>
        <div class="svc-qr-timer" id="svcQrTimer">10:00</div>
        <p class="svc-qr-desc">Please ensure the payment amount matches your order</p>
        <canvas id="svcQrCanvas" class="svc-qr-canvas" aria-label="QR Code"></canvas>
        <div class="svc-qr-amount-label">TOTAL AMOUNT:</div>
        <div class="svc-qr-amount" id="svcQrAmount">$0.00</div>
        <div class="svc-qr-actions">
          <button class="btn ghost" id="svcQrCancel">CANCEL</button>
          <button class="btn" id="svcQrCheck">CHECK</button>
        </div>
        <p class="svc-qr-support">Contact our support at <a href="mailto:support@pawfectcare.com">support@pawfectcare.com</a></p>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeQr(true);
    });
    overlay.querySelector('.svc-qr-close')?.addEventListener('click', () => closeQr(true));
    overlay.querySelector('#svcQrCancel')?.addEventListener('click', () => closeQr(true));
    overlay.querySelector('#svcQrCheck')?.addEventListener('click', onQrCheck);
  }

  function loadQrLibIfNeeded(cb) {
    if (window.QRious) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    s.onload = cb;
    document.body.appendChild(s);
  }

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderQr(amount) {
    const canvas = document.getElementById('svcQrCanvas');
    if (!canvas) return;
    const token = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const payload = `PAWFECTPAY|svc|token=${token}|amount=${amount.toFixed(2)}`;
    if (!qrInstance) {
      qrInstance = new QRious({ element: canvas, value: payload, size: 240 });
    } else {
      qrInstance.value = payload;
    }
  }

  function startQrCountdown(amount) {
    const timerEl = document.getElementById('svcQrTimer');
    let remaining = 10 * 60 * 1000;
    if (timerEl) timerEl.textContent = formatTime(remaining);
    if (qrCountdownId) clearInterval(qrCountdownId);
    qrCountdownId = setInterval(() => {
      remaining -= 1000;
      if (timerEl) timerEl.textContent = formatTime(remaining);
      if (remaining <= 0) {
        // Hết 10p -> tự tạo QR mới và reset timer
        renderQr(amount);
        remaining = 10 * 60 * 1000;
        if (timerEl) timerEl.textContent = formatTime(remaining);
      }
    }, 1000);
  }

  function stopQrCountdown(reset = true) {
    if (qrCountdownId) {
      clearInterval(qrCountdownId);
      qrCountdownId = null;
    }
    const timerEl = document.getElementById('svcQrTimer');
    if (reset && timerEl) timerEl.textContent = '10:00';
  }

  function openQr(amount) {
    ensureQrUi();
    loadQrLibIfNeeded(() => {
      const overlay = document.querySelector('.svc-qr-overlay');
      const amountEl = document.getElementById('svcQrAmount');
      if (amountEl) amountEl.textContent = `$${amount.toFixed(2)}`;
      renderQr(amount);
      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
      startQrCountdown(amount);
    });
  }

  function closeQr(reset = true) {
    const overlay = document.querySelector('.svc-qr-overlay');
    overlay?.classList.remove('show');
    overlay?.setAttribute('aria-hidden', 'true');
    stopQrCountdown(reset);
  }

  function onQrCheck() {
    // Sau khi người dùng bấm CHECK, coi như đã quét thành công -> Confirmed
    closeQr(true);

    // Lưu record và mở success
    try {
      const nowIso = new Date().toISOString();
      const generatedId = `SV-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const baseNote = isSpaFlow ? 'Your appointment is set.' : 'Your homestay booking is set.';
      const bookingDetail = isSpaFlow
          ? {
              dateTime: `${localStorage.getItem('bookingCheckinDate') || '--'}${(localStorage.getItem('selectedTimeSlot') || details.timeSlot || '') ? ', ' + (localStorage.getItem('selectedTimeSlot') || details.timeSlot || '') : ''}`
            }
          : {
              checkin: localStorage.getItem('bookingCheckinDate') || '--',
              checkout: localStorage.getItem('bookingCheckoutDate') || '--',
              duration: toNumber(localStorage.getItem('bookingDuration') ?? details.duration, 1)
            };

      const lastServiceBooking = {
        id: generatedId,
        type: isSpaFlow ? 'spa' : 'homestay',
        createdAt: nowIso,
        total: computedTotal,
        status: 'confirmed',
        details: bookingDetail,
        timeline: [
          { key: 'confirmed', title: 'Booking Confirmed', time: nowIso, note: baseNote },
          { key: 'preparing', title: isSpaFlow ? 'Preparing Service' : 'Preparing Room', time: nowIso, note: 'We are getting things ready.' }
        ]
      };

      localStorage.setItem('lastServiceBooking', JSON.stringify(lastServiceBooking));
      localStorage.setItem('pc_has_booking_activity', 'true');
      localStorage.setItem('lastBooking', JSON.stringify({
        type: isSpaFlow ? 'spa' : 'homestay',
        total: computedTotal,
        time: nowIso,
        status: 'confirmed',
      }));
    } catch (_err) {}

    openSuccess();
  }
});
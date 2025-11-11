document.addEventListener('DOMContentLoaded', () => {
  // Đồng bộ dữ liệu đơn dịch vụ vừa đặt
  try {
    const data = JSON.parse(localStorage.getItem('lastServiceBooking') || 'null');
    if (!data) {
      // Không có đơn gần đây: hiển thị thông tin nhẹ nhàng, giữ nguyên layout
      const summary = document.querySelector('.order-summary .summary-info');
      if (summary) {
        summary.innerHTML = `
          <div class="summary-title">
            <strong>No recent service booking</strong>
            <small>Please make a booking to view status</small>
          </div>
        `;
      }
      return;
    }

    const isSpa = data.type === 'spa';
    const details = data.details || {};
    const pkgName = details.package?.name || (isSpa ? 'Grooming Session' : 'Homestay');
    const createdAt = new Date(data.createdAt || Date.now());

    const fmtDate = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const checkinDisplay = details.checkinDisplay || localStorage.getItem('bookingCheckinDate') || '';
    const checkoutDisplay = details.checkoutDisplay || localStorage.getItem('bookingCheckoutDate') || '';
    const duration = details.duration || localStorage.getItem('bookingDuration') || '';
    const timeSlot = details.timeSlot || localStorage.getItem('selectedTimeSlot') || '';

    // 1) Order Summary
    const summaryTitle = document.querySelector('.order-summary .summary-title');
    const summaryMeta = document.querySelector('.order-summary .summary-meta');

    if (summaryTitle) {
      summaryTitle.innerHTML = `
        <strong>Order #${data.id}</strong>
        <small>${isSpa ? 'Appointment confirmed' : 'Homestay is active'}</small>
      `;
    }
    if (summaryMeta) {
      const orderDateHTML = `
        <div class="meta-item">
          <span class="meta-label">Order Date</span>
          <strong>${fmtDate(createdAt)}</strong>
        </div>
      `;
      const estimateHTML = isSpa
        ? `
        <div class="meta-item">
          <span class="meta-label">Date & Time</span>
          <strong>${timeSlot || 'TBD'}</strong>
        </div>`
        : `
        <div class="meta-item">
          <span class="meta-label">Stay</span>
          <strong>${checkinDisplay || 'TBD'} → ${checkoutDisplay || 'TBD'}</strong>
        </div>`;
      const typeHTML = `
        <div class="meta-item">
          <span class="meta-label">Service Type</span>
          <strong>${isSpa ? 'Spa' : 'Homestay'}</strong>
        </div>
      `;
      summaryMeta.innerHTML = orderDateHTML + estimateHTML + typeHTML;
    }

    // 2) Aside card: Pick-up Info
    const pickupCard = document.querySelector('.pickup-info');
    if (pickupCard) {
      const titleEl = pickupCard.querySelector('.card-title');
      const rowEl = pickupCard.querySelector('.pickup-row');
      const listEl = pickupCard.querySelector('.store-info');
      if (titleEl) titleEl.textContent = 'Pick-up Information';

      let infoHTML = '';
      if (isSpa) {
        // For spa, pick-up is after service, show appointment date/time
        const apptDate = details?.dateTime || `${checkinDisplay || '--'}${timeSlot ? ', ' + timeSlot : ''}`;
        infoHTML = `
          <div class="pickup-date">
            <div class="label">Pick-up</div>
            <strong>${apptDate}</strong>
            <small>Service: ${pkgName}</small>
          </div>`;
      } else {
        // For homestay, pick-up is check-out
        infoHTML = `
          <div class="pickup-date">
            <div class="label">Pick-up</div>
            <strong>${checkoutDisplay || 'TBD'}</strong>
            <small>Duration: ${duration || ''} day(s)</small>
          </div>`;
      }
      if (rowEl) rowEl.innerHTML = infoHTML;
      if (listEl) listEl.style.display = '';
    }

    // 3) Order Details (Package, add-ons, totals)
    const detailsCard = document.querySelector('.order-details');
    if (detailsCard) {
      const metaList = detailsCard.querySelector('.meta-list');
      const totalsEl = detailsCard.querySelector('.totals');

      // Prefer details arrays; fall back to localStorage selections
      const addons = Array.isArray(details.addons) ? details.addons : (JSON.parse(localStorage.getItem('selectedAddons') || '[]') || []);
      const treats = Array.isArray(details.treats) ? details.treats : (JSON.parse(localStorage.getItem('selectedTreats') || '[]') || []);

      // Package price and duration
      const pkgPrice = Number(details.package?.price || localStorage.getItem('selectedPackagePrice') || 0);
      const stayDuration = Number(details.duration || localStorage.getItem('bookingDuration') || 1);
      const serviceFee = isSpa ? 5.00 : 0.00;

      // Compute totals
      const addonsTotalCalc = addons.reduce((s, a) => s + Number(a.price || 0), 0);
      const treatsTotalCalc = treats.reduce((s, t) => s + (Number(t.price || 0) * Number(t.qty || t.quantity || 0)), 0);
      const subtotalCalc = isSpa ? pkgPrice : (pkgPrice * (isNaN(stayDuration) ? 1 : stayDuration));
      const totalCalc = typeof data.total === 'number' && !isNaN(data.total)
        ? Number(data.total)
        : subtotalCalc + addonsTotalCalc + treatsTotalCalc + serviceFee;

      // Build meta rows
      const rows = [];
      rows.push(`<div class="row"><dt>${pkgName}</dt><dd>${isSpa ? (timeSlot || '') : `Duration: ${stayDuration || ''} day(s)`}</dd></div>`);
      if (treats.length) rows.push(`<div class="row"><dt>Treats</dt><dd>${treats.map(t => t.name).join(', ')}</dd></div>`);
      if (addons.length) rows.push(`<div class="row"><dt>Add-ons</dt><dd>${addons.map(a => a.name).join(', ')}</dd></div>`);
      if (metaList) metaList.innerHTML = rows.join('');

      // Render totals
      if (totalsEl) {
        totalsEl.innerHTML = `
          <div class="row"><span>Subtotal:</span><strong>$${(subtotalCalc).toFixed(2)}</strong></div>
          <div class="row"><span>Add-ons:</span><strong>$${(addonsTotalCalc + treatsTotalCalc).toFixed(2)}</strong></div>
          <div class="row total"><span>Total:</span><strong>$${(totalCalc).toFixed(2)}</strong></div>
        `;
      }
    }

    // 4) Status timeline (dùng data.timeline)
    const timeline = document.querySelector('.order-status .timeline');
    if (timeline && Array.isArray(data.timeline)) {
      const itemsHTML = data.timeline.map((t) => {
        const time = new Date(t.time || Date.now());
        const timeStr = `${fmtDate(time)}, ${fmtTime(time)}`;
        const title = t.title || (isSpa ? 'Appointment Update' : 'Service Update');
        const note = t.note || '';
        return `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="time">${timeStr}</div>
              <div class="title">${title}</div>
              <div class="note">${note}</div>
            </div>
          </div>
        `;
      }).join('');
      timeline.innerHTML = itemsHTML;

      // Append a standard daily schedule below the timeline
      const scheduleHTML = `
        <div class="day-schedule" aria-label="Daily Schedule">
          <div class="schedule-item"><span class="time">07:00 AM</span><span class="activity">Breakfast</span></div>
          <div class="schedule-item"><span class="time">09:00 AM</span><span class="activity">Playtime & Social</span></div>
          <div class="schedule-item"><span class="time">11:00 AM</span><span class="activity">Grooming / Spa</span></div>
          <div class="schedule-item"><span class="time">01:00 PM</span><span class="activity">Nap & Rest</span></div>
          <div class="schedule-item"><span class="time">03:00 PM</span><span class="activity">Walk & Exercise</span></div>
          <div class="schedule-item"><span class="time">06:00 PM</span><span class="activity">Dinner</span></div>
        </div>`;
      timeline.insertAdjacentHTML('beforeend', scheduleHTML);
    }
  } catch (_err) {
    // nuốt lỗi để không vỡ trang, giữ nội dung mặc định
    console.warn('Failed to render service status from storage:', _err);
  }

  // ===== Hotline Popup for "Call Staff" =====
  try {
    function ensureHotlineUi() {
      if (document.querySelector('.hotline-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'hotline-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Support Hotline');
      overlay.innerHTML = `
        <div class="hotline-dialog">
          <button class="hotline-close" aria-label="Close">×</button>
          <h3 class="hotline-title">Contact Us</h3>
          <p class="hotline-desc">We’re here to help with your pet’s care.</p>
          <div class="hotline-number" id="hotlineNumber">+84 987654321</div>
          <div class="hotline-actions">
            <a class="btn ghost" id="hotlineCopy" href="#" aria-label="Copy">COPY</a>
            <a class="btn" id="hotlineCall" href="tel:+84987654321" aria-label="Call">CALL NOW</a>
          </div>
          <div class="social">
            <a class="fb-link" id="hotlineFacebook" target="_blank" rel="noopener" href="https://www.facebook.com/tranduythanhcse" aria-label="Open Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.096 4.388 23.094 10.125 24v-8.437H7.078V12.07h3.047V9.412c0-3.015 1.792-4.683 4.533-4.683 1.313 0 2.686.235 2.686.235v2.96h-1.513c-1.49 0-1.953.931-1.953 1.887v2.259h3.328l-.532 3.492h-2.796V24C19.612 23.094 24 18.096 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      const closeBtn = overlay.querySelector('.hotline-close');
      closeBtn?.addEventListener('click', () => closeHotline());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHotline();
      });
      const copyBtn = overlay.querySelector('#hotlineCopy');
      copyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const num = overlay.querySelector('#hotlineNumber')?.textContent?.trim() || '';
        try { navigator.clipboard.writeText(num); } catch (_e) {}
      });
    }

    function openHotline(number, fbUrl) {
      ensureHotlineUi();
      const overlay = document.querySelector('.hotline-overlay');
      const numEl = overlay?.querySelector('#hotlineNumber');
      const callLink = overlay?.querySelector('#hotlineCall');
      const fbLink = overlay?.querySelector('#hotlineFacebook');
      const normalized = (number || '+84 987654321').replace(/\s+/g, '');
      if (numEl) numEl.textContent = number || '+84 987654321';
      if (callLink) callLink.setAttribute('href', `tel:${normalized}`);
      if (fbLink) fbLink.setAttribute('href', fbUrl || 'https://www.facebook.com/tranduythanhcse');
      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
    }

    function closeHotline() {
      const overlay = document.querySelector('.hotline-overlay');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    const callBtn = document.querySelector('.caretaker .actions .btn.ghost');
    if (callBtn) {
      callBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Try to read hotline from store info; fallback to default
        const storeList = document.querySelector('.store-info');
        let hotline = '+84 987654321';
        if (storeList) {
          const items = storeList.querySelectorAll('li');
          hotline = items?.[items.length - 1]?.textContent?.trim() || hotline;
        }
        const facebookUrl = 'https://www.facebook.com/tranduythanhcse';
        openHotline(hotline, facebookUrl);
      });
    }
  } catch (_e) {}

  // ===== Contact Support Popup (issues + solutions) =====
  try {
    function ensureSupportUi() {
      if (document.querySelector('.support-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'support-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Contact Support');
      overlay.innerHTML = `
        <div class="support-dialog">
          <button class="support-close" aria-label="Close">×</button>
          <h3 class="support-title">Contact Support</h3>
          <p class="support-desc">Here are common issues and solutions. If this doesn’t help, contact our staff.</p>

          <div class="support-issues">
            <details class="issue">
              <summary>Live camera doesn’t load</summary>
              <div class="solution">
                Try the direct link under the camera. Click <em>Open Live Cam</em>. If it still fails, check your network or try another browser.
              </div>
            </details>

            <details class="issue">
              <summary>Can’t extend stay</summary>
              <div class="solution">
                Extend Stay is available only for Homestay bookings and limited to +3 days. Make sure your current checkout date is set. Open the Extend Stay button from Order Summary.
              </div>
            </details>

            <details class="issue">
              <summary>Early pickup not allowed</summary>
              <div class="solution">
                Early Pickup is available only for Homestay bookings and must be exactly 1 day earlier than the current checkout. Use the Early Pickup button in Order Summary.
              </div>
            </details>

            <details class="issue">
              <summary>Totals look incorrect</summary>
              <div class="solution">
                Refresh the page to re-sync data. Subtotal reflects package (and duration for Homestay). Add-ons include both add-ons and treats. If you recently changed selections, ensure the booking is saved.
              </div>
            </details>

            <details class="issue">
              <summary>Need help contacting staff</summary>
              <div class="solution">
                Use <strong>Call Staff</strong> or <strong>Message Staff</strong> in the Caretaker card. You can also reach us via Facebook in the popup.
              </div>
            </details>
          </div>

          <div class="support-actions">
            <button class="btn ghost" id="supportCancel">CLOSE</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSupport(); });
      overlay.querySelector('.support-close')?.addEventListener('click', () => closeSupport());
      overlay.querySelector('#supportCancel')?.addEventListener('click', () => closeSupport());
    }

    function openSupport() {
      ensureSupportUi();
      const overlay = document.querySelector('.support-overlay');
      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
    }

    function closeSupport() {
      const overlay = document.querySelector('.support-overlay');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    const supportBtn = document.querySelector('.card.help .btn.primary.full');
    if (supportBtn) {
      supportBtn.addEventListener('click', (e) => { e.preventDefault(); openSupport(); });
    }
  } catch (_e) {}

  // ===== Message Staff Popup (hotline + Facebook) =====
  try {
    function ensureMessageUi() {
      if (document.querySelector('.message-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'message-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Message Staff');
      overlay.innerHTML = `
        <div class="message-dialog">
          <button class="message-close" aria-label="Close">×</button>
          <h3 class="message-title">Message Us</h3>
          <p class="message-desc">Choose a contact method below.</p>
          <div class="message-line"><span class="label">Hotline</span><span class="value" id="messageHotline">+84 987654321</span></div>
          <div class="message-actions">
            <a class="btn ghost" id="messageCopy" href="#" aria-label="Copy">COPY</a>
            <a class="btn" id="messageCall" href="tel:+84987654321" aria-label="Call">CALL NOW</a>
          </div>
          <div class="social">
            <a class="fb-link" id="messageFacebook" target="_blank" rel="noopener" href="https://www.facebook.com/tranduythanhcse" aria-label="Open Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.096 4.388 23.094 10.125 24v-8.437H7.078V12.07h3.047V9.412c0-3.015 1.792-4.683 4.533-4.683 1.313 0 2.686.235 2.686.235v2.96h-1.513c-1.49 0-1.953.931-1.953 1.887v2.259h3.328l-.532 3.492h-2.796V24C19.612 23.094 24 18.096 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      const closeBtn = overlay.querySelector('.message-close');
      closeBtn?.addEventListener('click', () => closeMessage());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMessage();
      });
      const copyBtn = overlay.querySelector('#messageCopy');
      copyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const num = overlay.querySelector('#messageHotline')?.textContent?.trim() || '';
        try { navigator.clipboard.writeText(num); } catch (_e) {}
      });
    }

    function openMessage(number, fbUrl) {
      ensureMessageUi();
      const overlay = document.querySelector('.message-overlay');
      const numEl = overlay?.querySelector('#messageHotline');
      const callLink = overlay?.querySelector('#messageCall');
      const fbLink = overlay?.querySelector('#messageFacebook');
      const normalized = (number || '+84 987654321').replace(/\s+/g, '');
      if (numEl) numEl.textContent = number || '+84 987654321';
      if (callLink) callLink.setAttribute('href', `tel:${normalized}`);
      if (fbLink) fbLink.setAttribute('href', fbUrl || 'https://www.facebook.com/tranduythanhcse');
      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
    }

    function closeMessage() {
      const overlay = document.querySelector('.message-overlay');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    const msgBtn = Array.from(document.querySelectorAll('.caretaker .actions .btn.small')).find(
      (el) => /Message\s*Staff/i.test(el.textContent || '')
    );
    if (msgBtn) {
      msgBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const storeList = document.querySelector('.store-info');
        let hotline = '+84 987654321';
        if (storeList) {
          const items = storeList.querySelectorAll('li');
          hotline = items?.[items.length - 1]?.textContent?.trim() || hotline;
        }
        const facebookUrl = 'https://www.facebook.com/tranduythanhcse';
        openMessage(hotline, facebookUrl);
      });
    }
  } catch (_e) {}

  // ===== Extend Stay Popup (calendar + validation) =====
  try {
    function ensureExtendUi() {
      if (document.querySelector('.extend-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'extend-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Extend Stay');
      overlay.innerHTML = `
        <div class="extend-dialog">
          <button class="extend-close" aria-label="Close">×</button>
          <h3 class="extend-title">Extend Stay</h3>
          <p class="extend-desc">Delay your pet's pickup date (max 3 days). A $100 fee applies.</p>
          <div class="extend-current">
            <span class="label">Current Checkout</span>
            <strong id="extendCurrent"></strong>
          </div>
          <div class="extend-picker">
            <label for="extendDateInput">New Checkout Date</label>
            <input type="date" id="extendDateInput" />
            <small class="extend-hint">Choose a date up to 3 days after current checkout.</small>
            <small class="extend-error" id="extendError" style="color:#e02020; display:none;">Invalid date. Please pick within +3 days.</small>
          </div>
          <div class="extend-fee">
            <span class="label">Extension Fee</span>
            <strong>$100.00</strong>
          </div>
          <div class="extend-actions">
            <button class="btn ghost" id="extendCancel">CANCEL</button>
            <button class="btn" id="extendConfirm">CONFIRM</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeExtend(); });
      overlay.querySelector('.extend-close')?.addEventListener('click', () => closeExtend());
      overlay.querySelector('#extendCancel')?.addEventListener('click', () => closeExtend());

      const confirmBtn = overlay.querySelector('#extendConfirm');
      confirmBtn?.addEventListener('click', () => {
        const errEl = overlay.querySelector('#extendError');
        const input = overlay.querySelector('#extendDateInput');
        const currentStr = overlay.querySelector('#extendCurrent')?.textContent || '';
        const baseStr = currentStr || (localStorage.getItem('bookingCheckoutDate') || '');
        const baseDate = new Date(baseStr);
        const newDate = new Date(input?.value || '');
        if (!(baseDate instanceof Date) || isNaN(baseDate)) { errEl && (errEl.style.display = 'block'); return; }
        if (!(newDate instanceof Date) || isNaN(newDate)) { errEl && (errEl.style.display = 'block'); return; }

        const msPerDay = 24*60*60*1000;
        const deltaDays = Math.round((newDate - baseDate) / msPerDay);
        if (deltaDays <= 0 || deltaDays > 3) { errEl && (errEl.style.display = 'block'); return; }
        if (errEl) errEl.style.display = 'none';

        // Update localStorage: checkout date and duration
        const prevDuration = Number(localStorage.getItem('bookingDuration') || 1);
        const newDuration = prevDuration + deltaDays;
        const displayDate = (d => d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' }))(newDate);
        localStorage.setItem('bookingCheckoutDate', displayDate);
        localStorage.setItem('bookingDuration', String(newDuration));

        // Update lastServiceBooking: details.checkout, details.duration, total += 100, timeline append
        const lsb = JSON.parse(localStorage.getItem('lastServiceBooking') || 'null') || {};
        lsb.details = lsb.details || {};
        lsb.details.checkout = displayDate;
        lsb.details.duration = newDuration;
        lsb.total = Number(lsb.total || 0) + 100;
        lsb.timeline = Array.isArray(lsb.timeline) ? lsb.timeline : [];
        lsb.timeline.push({ key: 'stay_extended', title: 'Stay Extended', time: new Date().toISOString(), note: `Extended by ${deltaDays} day(s). $100 fee added.` });
        localStorage.setItem('lastServiceBooking', JSON.stringify(lsb));

        closeExtend();
        // Simple approach: reload to re-render all cards with updated data
        location.reload();
      });
    }

    function openExtend() {
      ensureExtendUi();
      const overlay = document.querySelector('.extend-overlay');
      const currentEl = overlay?.querySelector('#extendCurrent');
      const input = overlay?.querySelector('#extendDateInput');
      const currentCheckout = (localStorage.getItem('bookingCheckoutDate') || '') || (typeof checkoutDisplay === 'string' ? checkoutDisplay : '');
      currentEl && (currentEl.textContent = currentCheckout || '--');

      // Prefill suggestion: +1 day
      const baseDate = new Date(currentCheckout);
      if (input && baseDate instanceof Date && !isNaN(baseDate)) {
        const suggest = new Date(baseDate.getTime() + 24*60*60*1000);
        input.valueAsDate = suggest;
      }

      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
    }

    function closeExtend() {
      const overlay = document.querySelector('.extend-overlay');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    const extendBtn = document.querySelector('.extend-btn');
    if (extendBtn) {
      extendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Only for Homestay
        const data = JSON.parse(localStorage.getItem('lastServiceBooking') || 'null');
        if (!data || data.type === 'spa') { alert('Extend Stay is available for homestay bookings only.'); return; }
        openExtend();
      });
    }
  } catch (_e) {}

  // ===== Early Pickup Popup (calendar + validation) =====
  try {
    function ensureEarlyUi() {
      if (document.querySelector('.early-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'early-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Early Pickup');
      overlay.innerHTML = `
        <div class="early-dialog">
          <button class="early-close" aria-label="Close">×</button>
          <h3 class="early-title">Early Pickup</h3>
          <p class="early-desc">Pick an earlier pickup date (max 1 day earlier). A $100 fee applies.</p>
          <div class="early-current">
            <span class="label">Current Checkout</span>
            <strong id="earlyCurrent"></strong>
          </div>
          <div class="early-picker">
            <label for="earlyDateInput">New Pickup Date</label>
            <input type="date" id="earlyDateInput" />
            <small class="early-hint">Choose a date exactly 1 day before current checkout.</small>
            <small class="early-error" id="earlyError" style="color:#e02020; display:none;">Invalid date. Please pick exactly 1 day earlier.</small>
          </div>
          <div class="early-fee">
            <span class="label">Change Fee</span>
            <strong>$100.00</strong>
          </div>
          <div class="early-actions">
            <button class="btn ghost" id="earlyCancel">CANCEL</button>
            <button class="btn" id="earlyConfirm">CONFIRM</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeEarly(); });
      overlay.querySelector('.early-close')?.addEventListener('click', () => closeEarly());
      overlay.querySelector('#earlyCancel')?.addEventListener('click', () => closeEarly());

      const confirmBtn = overlay.querySelector('#earlyConfirm');
      confirmBtn?.addEventListener('click', () => {
        const errEl = overlay.querySelector('#earlyError');
        const input = overlay.querySelector('#earlyDateInput');
        const currentStr = overlay.querySelector('#earlyCurrent')?.textContent || '';
        const baseStr = currentStr || (localStorage.getItem('bookingCheckoutDate') || '');
        const baseDate = new Date(baseStr);
        const newDate = new Date(input?.value || '');
        if (!(baseDate instanceof Date) || isNaN(baseDate)) { errEl && (errEl.style.display = 'block'); return; }
        if (!(newDate instanceof Date) || isNaN(newDate)) { errEl && (errEl.style.display = 'block'); return; }

        const msPerDay = 24*60*60*1000;
        const deltaDays = Math.round((baseDate - newDate) / msPerDay); // positive if earlier
        // Must be exactly 1 day earlier
        if (deltaDays !== 1) { errEl && (errEl.style.display = 'block'); return; }
        if (errEl) errEl.style.display = 'none';

        // Update localStorage: checkout date and duration (reduce by 1, min 1)
        const prevDuration = Number(localStorage.getItem('bookingDuration') || 1);
        const newDuration = Math.max(prevDuration - deltaDays, 1);
        const displayDate = (d => d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' }))(newDate);
        localStorage.setItem('bookingCheckoutDate', displayDate);
        localStorage.setItem('bookingDuration', String(newDuration));

        // Update lastServiceBooking: details.checkout, details.duration, total += 100, timeline append
        const lsb = JSON.parse(localStorage.getItem('lastServiceBooking') || 'null') || {};
        lsb.details = lsb.details || {};
        lsb.details.checkout = displayDate;
        lsb.details.duration = newDuration;
        lsb.total = Number(lsb.total || 0) + 100;
        lsb.timeline = Array.isArray(lsb.timeline) ? lsb.timeline : [];
        lsb.timeline.push({ key: 'early_pickup', title: 'Early Pickup Scheduled', time: new Date().toISOString(), note: `Pickup moved earlier by 1 day. $100 fee added.` });
        localStorage.setItem('lastServiceBooking', JSON.stringify(lsb));

        closeEarly();
        location.reload();
      });
    }

    function openEarly() {
      ensureEarlyUi();
      const overlay = document.querySelector('.early-overlay');
      const currentEl = overlay?.querySelector('#earlyCurrent');
      const input = overlay?.querySelector('#earlyDateInput');
      const currentCheckout = (localStorage.getItem('bookingCheckoutDate') || '') || (typeof checkoutDisplay === 'string' ? checkoutDisplay : '');
      currentEl && (currentEl.textContent = currentCheckout || '--');

      // Prefill suggestion: -1 day
      const baseDate = new Date(currentCheckout);
      if (input && baseDate instanceof Date && !isNaN(baseDate)) {
        const suggest = new Date(baseDate.getTime() - 24*60*60*1000);
        // Bound the input's max/min for safety: only allow exactly this date
        const yyyy = suggest.getFullYear();
        const mm = String(suggest.getMonth()+1).padStart(2,'0');
        const dd = String(suggest.getDate()).padStart(2,'0');
        const val = `${yyyy}-${mm}-${dd}`;
        input.value = val;
        input.setAttribute('max', val);
        input.setAttribute('min', val);
      }

      overlay?.classList.add('show');
      overlay?.setAttribute('aria-hidden', 'false');
    }

    function closeEarly() {
      const overlay = document.querySelector('.early-overlay');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    // Bind Early Pickup button in the summary actions (for Homestay only)
    const earlyBtn = Array.from(document.querySelectorAll('.order-summary .summary-actions .btn.small')).find(
      (el) => /Early\s*Pickup/i.test(el.textContent || '')
    );
    if (earlyBtn) {
      earlyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = JSON.parse(localStorage.getItem('lastServiceBooking') || 'null');
        if (!data || data.type === 'spa') { alert('Early Pickup is available for homestay bookings only.'); return; }
        openEarly();
      });
    }
  } catch (_e) {}
});
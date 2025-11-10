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
          <strong>${isSpa ? 'Spa (on-site)' : 'Homestay (boarding)'}</strong>
        </div>
      `;
      summaryMeta.innerHTML = orderDateHTML + estimateHTML + typeHTML;
    }

    // 2) Aside card: Appointment/Stay Info
    const pickupCard = document.querySelector('.pickup-info');
    if (pickupCard) {
      const titleEl = pickupCard.querySelector('.card-title');
      const rowEl = pickupCard.querySelector('.pickup-row');
      const listEl = pickupCard.querySelector('.store-info');
      if (titleEl) titleEl.textContent = isSpa ? 'Appointment Info' : 'Stay Information';

      const infoHTML = isSpa
        ? `
          <div class="pickup-date">
            <div class="label">Appointment</div>
            <strong>${timeSlot || 'TBD'}</strong>
            <small>${pkgName}</small>
          </div>`
        : `
          <div class="pickup-date">
            <div class="label">Check-in</div>
            <strong>${checkinDisplay || 'TBD'}</strong>
            <small>Package: ${pkgName}</small>
          </div>
          <div class="pickup-date">
            <div class="label">Check-out</div>
            <strong>${checkoutDisplay || 'TBD'}</strong>
            <small>Duration: ${duration || ''} day(s)</small>
          </div>`;
      if (rowEl) rowEl.innerHTML = infoHTML;

      // Spa không cần địa chỉ cửa hàng
      if (listEl) listEl.style.display = isSpa ? 'none' : '';
    }

    // 3) Order Details (Package, add-ons, totals)
    const detailsCard = document.querySelector('.order-details');
    if (detailsCard) {
      const metaList = detailsCard.querySelector('.meta-list');
      const totalsEl = detailsCard.querySelector('.totals');

      const addons = Array.isArray(details.addons) ? details.addons : [];
      const treats = Array.isArray(details.treats) ? details.treats : [];
      const subtotal = Number(details.subtotal ?? 0);
      const addonsTotal = Number(
        details.addonsTotal ?? addons.reduce((s, a) => s + Number(a.price || 0), 0)
      );
      const total = Number(data.total ?? subtotal + addonsTotal);

      const rows = [];
      
      // *** DÒNG ĐÃ SỬA LỖI (BỎ 2 DẤU \) ***
      rows.push(`<div class="row"><dt>${pkgName}</dt><dd>${isSpa ? (timeSlot || '') : `Duration: ${duration || ''} day(s)`}</dd></div>`);
      
      if (treats.length) rows.push(`<div class="row"><dt>Treats</dt><dd>${treats.map(t => t.name).join(', ')}</dd></div>`);
      if (addons.length) rows.push(`<div class="row"><dt>Add-ons</dt><dd>${addons.map(a => a.name).join(', ')}</dd></div>`);
      if (metaList) metaList.innerHTML = rows.join('');

      if (totalsEl) {
        totalsEl.innerHTML = `
          <div class="row"><span>Subtotal:</span><strong>$${subtotal.toFixed(2)}</strong></div>
          <div class="row"><span>Add-ons:</span><strong>$${addonsTotal.toFixed(2)}</strong></div>
          <div class="row total"><span>Total:</span><strong>$${total.toFixed(2)}</strong></div>
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
              <div class="photo-row">
                <div class="photo-placeholder"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      timeline.innerHTML = itemsHTML;
    }
  } catch (_err) {
    // nuốt lỗi để không vỡ trang, giữ nội dung mặc định
    console.warn('Failed to render service status from storage:', _err);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });

  // Render Order Status from localStorage
  const mount = document.getElementById('orderStatus');
  if (!mount) return;
  let order = null;
  try { order = JSON.parse(localStorage.getItem('lastOrder') || 'null'); } catch (_) { order = null; }

  if (!order) {
    mount.innerHTML = '<p>No recent orders. Complete a checkout and click "View Details" to see status here.</p>';
    return;
  }

  const fmtDate = (iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusText = order.status === 'ready' ? 'Ready' : (order.status || 'Confirmed');

  // Compute Expected Time label/value by method
  const now = new Date();
  function nextBusinessDay(d) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + 1);
    const day = nd.getDay(); // 0=Sun, 6=Sat
    if (day === 6) { // Saturday -> Monday
      nd.setDate(nd.getDate() + 2);
    } else if (day === 0) { // Sunday -> Monday
      nd.setDate(nd.getDate() + 1);
    }
    return nd;
  }
  function addBusinessDays(startDate, days, cutoffHour = 18) {
    let start = new Date(startDate);
    // If past cutoff, start counting from next business day
    if (start.getHours() >= cutoffHour) {
      start = nextBusinessDay(start);
    }
    // If start falls on weekend, roll to Monday
    if (start.getDay() === 6) { // Saturday
      start.setDate(start.getDate() + 2);
    } else if (start.getDay() === 0) { // Sunday
      start.setDate(start.getDate() + 1);
    }
    let remaining = days;
    let curr = new Date(start);
    while (remaining > 0) {
      curr = nextBusinessDay(curr);
      const day = curr.getDay();
      if (day !== 0 && day !== 6) remaining -= 1;
    }
    curr.setHours(cutoffHour, 0, 0, 0);
    return curr;
  }

  const expected = (() => {
    if (order.method === 'pickup') {
      return { label: 'Expected Pick-up Time', value: `Today, 2:00 PM - 6:00 PM` };
    }
    const created = order.createdAt ? new Date(order.createdAt) : now;
    const eta = addBusinessDays(created, 3, 18);
    const etaText = eta.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    return { label: 'Expected Delivery Time', value: `${etaText} by 6:00 PM` };
  })();

  const headerHtml = `
    <div class="order-header">
      <span class="status-badge">${statusText}</span>
      <span class="order-id">Order ${order.id}</span>
    </div>
  `;

  const metaHtml = `
    <div class="order-meta">
      <div class="meta-item"><strong>Order Date:</strong> ${fmtDate(order.createdAt)}</div>
      <div class="meta-item"><strong>${expected.label}:</strong> ${expected.value}</div>
      <div class="meta-item"><strong>Shipping Details:</strong> ${order.shipping || '—'}</div>
      <div class="meta-item"><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</div>
    </div>
  `;

  const tHtml = (order.timeline || []).map(t => `
    <div class="timeline-item">
      <span class="timeline-dot" aria-hidden="true"></span>
      <div class="timeline-content">
        <div class="title">${t.title}</div>
        <div class="time">${fmtDate(t.time)}</div>
        <div class="note">${t.note || ''}</div>
        ${order.method === 'pickup' && t.key === 'ready' ? `
          <div class="qr-card">
            <div class="qr-title">Please show QR code at PAWFECT CARE Store</div>
            <div class="qr-canvas-wrap"><canvas id="orderQrCanvas" width="180" height="180" aria-label="Order QR"></canvas></div>
            <div class="qr-id">${order.id}</div>
            <div class="qr-meta">
              <div class="item"><span aria-hidden="true">🏬</span> Pawfect Care Store</div>
              <div class="item"><span aria-hidden="true">📍</span> 669 Do Muoi, Linh Xuan Ward, Ho Chi Minh City</div>
              <div class="item"><span aria-hidden="true">🕒</span> Open: 8:00 AM - 8:00 PM</div>
              <div class="item"><span aria-hidden="true">📞</span> +84 987654321</div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  mount.innerHTML = headerHtml + metaHtml + `<div class="timeline">${tHtml}</div>`;

  // Initialize QR code if applicable
  if (order.method === 'pickup') {
    const qrCanvas = document.getElementById('orderQrCanvas');
    if (qrCanvas && window.QRious) {
      const value = `PAWFECTPAY|order=${order.id}|amount=${Number(order.total||0).toFixed(2)}|method=${order.method}`;
      new QRious({ element: qrCanvas, value, size: 180 });
    }
  }
});
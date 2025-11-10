
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

// ===== Load data from sessionStorage or fallback =====
function getCampaignById(id) {
  const raw = sessionStorage.getItem("CAMPAIGNS_DATA");
  let list = [];
  try { list = raw ? JSON.parse(raw) : []; } catch(e){ list = []; }
  if (!Array.isArray(list)) list = [];
  return list.find(x => String(x.id) === String(id)) || null;
}

function getEventState(ev) {
  const now = new Date();

  // Ưu tiên cặp start/end; nếu thiếu end thì coi end = hết ngày start
  const start = ev.startISO ? new Date(ev.startISO) : (ev.dateISO ? new Date(ev.dateISO) : null);
  let end = null;
  if (ev.endISO) end = new Date(ev.endISO);
  else if (ev.dateISO) end = new Date(ev.dateISO);

  if (end) end.setHours(23,59,59,999);

  if (start && end) {
    if (now < start) return 'upcoming';
    if (now > end)   return 'past';
    return 'ongoing';
  }
  if (end) return (now > end) ? 'past' : 'upcoming';

  // Nếu thiếu ngày, fallback theo status text nếu có
  return ev.status || 'upcoming';
}

// ===== Inject into DOM =====
function populateWorkshopDetail() {
  const id = getQueryParam("id");
  const ev = getCampaignById(id);
  const notFound = !ev;

  // DOM refs (đổi theo markup của bạn)
  const media = document.querySelector(".ws-hero-media img");
  const title = document.querySelector(".ws-title");
  const excerpt = document.querySelector(".ws-excerpt");
  const metaDate = document.getElementById("ws-date");
  const metaHost = document.getElementById("ws-host");
  const metaVenue = document.getElementById("ws-venue");
  const tagsEl = document.getElementById("ws-tags");
  const statusBadge = document.getElementById("ws-status-badge");
  const bodyEl = document.getElementById("ws-body");
  const galleryGrid = document.querySelector(".ws-gallery-grid");
  const agendaList = document.querySelector(".ws-agenda");
  const registerBtn = document.getElementById("ws-register");
  const sumWhen = document.getElementById("sum-when");
  const sumWhere = document.getElementById("sum-where");
  const sumDuration = document.getElementById("sum-duration");

  if (notFound) {
    if (title) title.textContent = "Event not found";
    if (excerpt) excerpt.textContent = "Có thể sự kiện đã bị gỡ hoặc id không hợp lệ.";
    if (media) media.src = "../assets/images/campaigns/placeholder.jpg";
    if (registerBtn){ registerBtn.setAttribute("aria-disabled","true"); registerBtn.disabled = true; }
    return;
  }

  if (media) { media.src = ev.cover; media.alt = ev.title; }
  if (title) title.textContent = ev.title;
  if (excerpt) excerpt.textContent = ev.shortDesc || "";

  if (metaDate) {
    metaDate.textContent = ev.dateText || "";
    // gắn data-iso để script “past-check” của bạn ưu tiên parse chính xác
    if (ev.dateISO) metaDate.dataset.iso = ev.dateISO;
  }
  if (metaHost) metaHost.textContent = ev.author || "Pawfect Team";
  if (metaVenue) metaVenue.textContent = ev.location || "Pawfect Hub";

  // Tags
  if (tagsEl && Array.isArray(ev.tags)) {
    tagsEl.innerHTML = ev.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
  }

  // Status badge
  if (statusBadge) {
    const status = ev.status === "past" ? "Past Event" : "Upcoming";
    const statusClass = ev.status === "past" ? "past" : "upcoming";
    statusBadge.innerHTML = `<span class="badge ${statusClass}">${status}</span>`;
  }

  // Body overview
  if (bodyEl) {
    bodyEl.innerHTML = `
      <p>${ev.shortDesc || "No description available."}</p>
      <p>Join us for an engaging event designed to bring pet lovers together. Learn valuable tips, meet fellow enthusiasts, and enjoy activities tailored for your furry friends. Whether you're a new pet owner or a seasoned pro, this event offers something for everyone.</p>
      <p>What to expect: Interactive sessions, expert advice, and fun moments with pets. Materials and refreshments will be provided. Key takeaways include practical knowledge to enhance your pet care routine.</p>
    `;
  }

  if (galleryGrid && Array.isArray(ev.gallery)) {
    galleryGrid.innerHTML = ev.gallery.map(src => `<img src="${src}" alt="Event photo">`).join("");
  }

  if (agendaList && Array.isArray(ev.agenda)) {
    agendaList.innerHTML = ev.agenda.map(item => `<li>${item}</li>`).join("");
  }

  // Summary sidebar
  if (sumWhen) sumWhen.textContent = ev.dateText || "TBA";
  if (sumWhere) sumWhere.textContent = ev.location || "Pawfect Hub";
  if (sumDuration) sumDuration.textContent = ev.agenda ? `${ev.agenda.length} sessions` : "–";

  // Countdown and register button logic
    // Countdown & register theo state
  const countdownEl = document.getElementById("ws-countdown");
  const state = getEventState(ev); // 'upcoming' | 'ongoing' | 'past'

  // Cập nhật status-badge cho đúng 3 trạng thái
  if (statusBadge) {
    const statusMap = { upcoming: "Upcoming", ongoing: "Ongoing", past: "Past Event" };
    const clsMap    = { upcoming: "upcoming", ongoing: "ongoing", past: "past" };
    statusBadge.innerHTML = `<span class="badge ${clsMap[state]}">${statusMap[state]}</span>`;
  }

  if (state === "past" || ev.status === "finished") {
    if (registerBtn) {
      registerBtn.setAttribute("aria-disabled","true");
      registerBtn.disabled = true;
      registerBtn.dataset.status = "past";
      registerBtn.textContent = "Event Ended";
    }
    if (countdownEl) countdownEl.textContent = "";
  } else {
    if (registerBtn) {
      registerBtn.removeAttribute("aria-disabled");
      registerBtn.disabled = false;
      registerBtn.dataset.status = state; // upcoming | ongoing
      registerBtn.textContent = "Register";
    }

    if (countdownEl) {
      if (state === "ongoing") {
        countdownEl.textContent = "Happening now!";
      } else {
        const startForCountdown = ev.startISO || ev.dateISO;
        if (startForCountdown) startCountdown(startForCountdown, countdownEl);
      }
    }
  }
}

// ----- Registration modal & logic -----
function isPastISO(iso) {
  if (!iso) return false;
  const end = new Date(iso); end.setHours(23,59,59,999);
  return new Date() > end;
}

function ensureRegisterModal() {
  if (document.getElementById('ws-register-modal')) return;
  const html = `
  <div id="ws-register-modal" class="ws-modal" aria-hidden="true" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:9999;background:rgba(0,0,0,.5)">
    <div class="ws-modal-dialog" role="dialog" aria-modal="true" style="background:#fff;border-radius:12px;max-width:520px;width:92%;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.2)">
      <div class="ws-modal-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h3 style="margin:0;font-size:18px">Register for event</h3>
        <button type="button" class="ws-modal-close" aria-label="Close" style="border:none;background:transparent;font-size:20px">×</button>
      </div>
      <form id="ws-register-form" style="display:grid;gap:10px">
        <div>
          <label style="display:block;font-size:13px;margin-bottom:4px">Full name</label>
          <input name="name" type="text" placeholder="Your name" required style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:4px">Email</label>
          <input name="email" type="email" placeholder="you@example.com" required style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:4px">Phone</label>
          <input name="phone" type="tel" placeholder="090..." required pattern="[0-9 +()-]{8,}" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px" />
        </div>
        <div>
          <label style="display:block;font-size:13px;margin-bottom:4px">Participants</label>
          <input name="qty" type="number" min="1" max="10" value="1" required style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px" />
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px">
          <button type="button" class="ws-cancel" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer">Cancel</button>
          <button type="submit" class="ws-submit" style="padding:10px 14px;border:none;border-radius:8px;background:#ff3e81;color:#fff;font-weight:600;cursor:pointer">Register</button>
        </div>
      </form>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  const modal = document.getElementById('ws-register-modal');
  const closeBtn = modal.querySelector('.ws-modal-close');
  const cancelBtn = modal.querySelector('.ws-cancel');
  const onClose = () => { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); };
  closeBtn.addEventListener('click', onClose);
  cancelBtn.addEventListener('click', onClose);
  modal.addEventListener('click', (e) => { if (e.target === modal) onClose(); });
}

function openRegisterModal(ev) {
  ensureRegisterModal();
  const modal = document.getElementById('ws-register-modal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');

  const form = modal.querySelector('#ws-register-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const qty = Math.max(1, parseInt(fd.get('qty') || '1', 10));
    if (!name || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const key = 'workshop_registrations';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ eventId: ev.id, name, email, phone, qty, registeredAt: new Date().toISOString(), title: ev.title });
      localStorage.setItem(key, JSON.stringify(list));
      alert('Đăng ký thành công! Hẹn gặp bạn tại sự kiện.');
      // mark UI
      const btn = document.getElementById('ws-register');
      if (btn) { btn.textContent = 'Registered'; btn.disabled = true; btn.setAttribute('aria-disabled','true'); btn.dataset.status='registered'; }
    } catch (err) {
      console.error(err);
      alert('Không thể lưu đăng ký. Vui lòng thử lại.');
    }
    // close
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  };
}

function attachRegisterHandler() {
  const id = getQueryParam('id');
  const ev = getCampaignById(id);
  const registerBtn = document.getElementById('ws-register');
  if (!registerBtn) return;

  // if past -> keep disabled from populate; else enable and bind
  if (!ev || ev.status === 'past' || isPastISO(ev?.dateISO)) {
    registerBtn.disabled = true;
    registerBtn.setAttribute('aria-disabled','true');
    registerBtn.dataset.status = 'past';
    return;
  }
  registerBtn.removeAttribute('aria-disabled');
  registerBtn.disabled = false;
  registerBtn.dataset.status = 'upcoming';

  // if already registered in localStorage, mark and disable
  try {
    const reg = JSON.parse(localStorage.getItem('workshop_registrations') || '[]');
    const me = reg.find(r => String(r.eventId) === String(ev.id));
    if (me) {
      registerBtn.textContent = 'Registered';
      registerBtn.disabled = true;
      registerBtn.setAttribute('aria-disabled','true');
      registerBtn.dataset.status = 'registered';
      return;
    }
  } catch {}

  registerBtn.addEventListener('click', () => openRegisterModal(ev));
}

// ===== Countdown function =====
function startCountdown(targetISO, countdownEl) {
  const targetDate = new Date(targetISO).getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdownEl.textContent = "Event Started!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `
      <div class="countdown-timer">
        <span class="countdown-item">${days}<small>d</small></span>
        <span class="countdown-item">${hours}<small>h</small></span>
        <span class="countdown-item">${minutes}<small>m</small></span>
        <span class="countdown-item">${seconds}<small>s</small></span>
      </div>
    `;

    setTimeout(updateCountdown, 1000);
  };

  updateCountdown();
}

// Helper để community có thể set data rồi điều hướng sang detail
window.navigateToWorkshopDetail = function (campaignsList, id) {
  try { sessionStorage.setItem('CAMPAIGNS_DATA', JSON.stringify(campaignsList || [])); } catch {}
  const base = '/src/pages/workshop_detail.html';
  window.location.href = `${base}?id=${encodeURIComponent(id)}`;
};
// -------- FOLLOW-UP NOTIFY ME --------
function attachNotifyHandler() {
  const form = document.getElementById("ws-email-form");
  const input = document.getElementById("ws-email");
  const msg = document.getElementById("ws-email-msg");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = input.value.trim();

    if (!email || !email.includes("@")) {
      msg.textContent = "Please enter a valid email.";
      msg.style.color = "red";
      showToast("Invalid email!", "error");
      return;
    }

    try {
      const key = "notify_emails";
      const list = JSON.parse(localStorage.getItem(key) || "[]");

      const exists = list.find(x => x.email === email);
      if (exists) {
        msg.textContent = "Already subscribed.";
        msg.style.color = "orange";
        showToast("You're already subscribed!", "info");
        return;
      }

      list.push({
        email,
        subscribedAt: new Date().toISOString(),
      });

      localStorage.setItem(key, JSON.stringify(list));

      msg.textContent = "Saved!";
      msg.style.color = "green";
      showToast("✅ We'll notify you for future campaigns!", "success");
      input.value = "";
    } catch (err) {
      console.error(err);
      msg.textContent = "Error saving email.";
      msg.style.color = "red";
      showToast("Error saving email", "error");
    }
  });
}

// ===== Toast Notification =====
function showToast(message, type = "success") {
  // type: success | error | info

  // Tạo toast container nếu chưa có
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "24px";
    container.style.right = "24px";
    container.style.zIndex = "99999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "12px";
    document.body.appendChild(container);
  }

  // Tạo toast
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "12px";
  toast.style.font = "500 14px 'Lexend Deca'";
  toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
  toast.style.minWidth = "260px";
  toast.style.color = "#fff";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";
  toast.style.transition = "all .3s ease";

  if (type === "success") toast.style.background = "#6BCF7F";
  if (type === "error") toast.style.background = "#FF6B6B";
  if (type === "info") toast.style.background = "#88BAFF";

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Auto remove sau 3s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function(){
  populateWorkshopDetail();
  attachRegisterHandler();
  attachNotifyHandler(); 
});


document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  // Mark active nav
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if ((link.textContent || '').trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });

  // Read session from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('pc_user') || 'null');
  } catch (_) {
    user = null;
  }

  const banner = document.querySelector('.welcome-banner');
  const titleEl = document.querySelector('.welcome-title');
  const nameEl = document.getElementById('welcome-username');

  if (user && (user.firstName || user.lastName || user.email || user.name)) {
    const first = (user.firstName || '').trim();
    const last = (user.lastName || '').trim();
    const display = (first || last)
      ? [first, last].filter(Boolean).join(' ')
      : (user.name || user.email || 'Friend');

    if (nameEl) {
      nameEl.textContent = display;
    } else if (titleEl) {
      // Preserve paw icon if present
      const paw = titleEl.querySelector('.paw-icon');
      const pawHTML = paw ? paw.outerHTML : '';
      titleEl.innerHTML = `Welcome back, ${display}! ${pawHTML}`;
    }
  } else if (banner) {
    // Not logged in: show prompt and login button
    banner.innerHTML = `
      <div>
        <h1 class="welcome-title font-display">Welcome to Pawfect Care <span class="paw-icon">🐾</span></h1>
        <p class="font-body">You’re not logged in yet. Please log in or sign up to access your profile.</p>
        <div class="cta-actions" style="margin-top: 12px;">
          <a class="btn primary" href="../login-signup.html">Log In / Sign Up</a>
        </div>
      </div>
    `;
  }

  // ===== New: Toggle sections by activity flags =====
  const bookingSection = document.querySelector('.booking-history');
  const orderSection = document.querySelector('.order-history');
  const hasBooking = localStorage.getItem('pc_has_booking_activity') === 'true';
  const hasOrder = localStorage.getItem('pc_has_order_activity') === 'true';

  if (bookingSection) {
    bookingSection.style.display = hasBooking ? '' : 'none';
  }
  if (orderSection) {
    orderSection.style.display = hasOrder ? '' : 'none';
  }

  // ===== New: Review modal (popup) =====
  let reviewModalEl = null;
  function ensureReviewModal() {
    if (reviewModalEl) return reviewModalEl;
    reviewModalEl = document.createElement('div');
    reviewModalEl.className = 'review-modal-backdrop';
    reviewModalEl.innerHTML = `
      <div class="review-modal">
        <h3 class="modal-title">Write a Review</h3>
        <div class="stars-row" aria-label="Star rating">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>
        <textarea class="review-input" rows="4" placeholder="Any special care instructions, medical conditions, or behavioral notes..."></textarea>
        <p class="note">Lưu ý: sẽ không sửa được review comments này sau khi bấm nút Done.</p>
        <div class="modal-actions">
          <button class="btn ghost modal-cancel">Cancel</button>
          <button class="btn modal-done">Done</button>
        </div>
      </div>
    `;
    // Minimal styles injected for popup
    const style = document.createElement('style');
    style.textContent = `
      .review-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.25); display: none; align-items: center; justify-content: center; z-index: 9999; }
      .review-modal { background: #fff; border-radius: 12px; width: 480px; max-width: calc(100% - 32px); box-shadow: 0 12px 32px rgba(0,0,0,0.18); padding: 16px 20px; }
      .review-modal .modal-title { margin: 0 0 8px; color: #4b2f22; }
      .review-modal .stars-row { display: flex; gap: 6px; margin-bottom: 8px; }
      .review-modal .star { font-size: 20px; cursor: pointer; color: #ccc; }
      .review-modal .star.active { color: #f4b400; }
      .review-modal .review-input { width: 100%; border: 1px solid #e6ddd7; border-radius: 12px; padding: 10px 12px; font-size: 14px; outline: none; }
      .review-modal .review-input::placeholder { color: #9aa0a6; }
      .review-modal .note { font-size: 12px; color: #6b7280; margin: 8px 0 12px; }
      .review-modal .modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
      .review-modal .btn { background: #7a5b48; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
      .review-modal .btn.ghost { background: #f6f3f1; color: #4b2f22; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(reviewModalEl);
    return reviewModalEl;
  }

  function openReviewModal(targetCardEl, bookingId) {
    const modal = ensureReviewModal();
    modal.style.display = 'flex';

    // Reset inputs
    const stars = modal.querySelectorAll('.star');
    stars.forEach(s => s.classList.remove('active'));
    let rating = 0;
    const textarea = modal.querySelector('.review-input');
    textarea.value = '';

    stars.forEach(star => {
      star.onclick = () => {
        rating = Number(star.dataset.value);
        stars.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= rating));
      };
    });

    modal.querySelector('.modal-cancel').onclick = () => {
      modal.style.display = 'none';
    };

    modal.querySelector('.modal-done').onclick = () => {
      const text = (textarea.value || '').trim();
      if (!rating) {
        // highlight stars row subtly
        stars.forEach(s => s.classList.add('active')); // quick hint
        return;
      }
      if (!text) {
        textarea.focus();
        return;
      }

      // Persist only once
      const reviews = JSON.parse(localStorage.getItem('pc_reviews') || '{}');
      if (reviews[bookingId]) {
        modal.style.display = 'none';
        return;
      }
      reviews[bookingId] = { rating, text, ts: Date.now() };
      localStorage.setItem('pc_reviews', JSON.stringify(reviews));

      // Update card: replace prompt with display
      const prompt = targetCardEl.querySelector('.card-review-prompt');
      if (prompt) {
        const starsHTML = Array.from({ length: 5 }, (_, i) => {
          const filled = i < rating;
          return `<span${filled ? '' : ' class="star-muted"'}>⭐</span>`;
        }).join('');
        prompt.outerHTML = `
          <div class="card-review-display">
            <div class="stars">${starsHTML}</div>
            <p>${text}</p>
          </div>
        `;
      }

      modal.style.display = 'none';
    };
  }

  // ===== New: Apply existing reviews from localStorage on load =====
  function bookingIdForCard(cardEl) {
    const title = cardEl.querySelector('.card-title')?.textContent?.trim() || '';
    const meta = cardEl.querySelector('.card-meta')?.textContent?.trim() || '';
    return `${title}|${meta}`;
  }

  function applyExistingReviews() {
    const cards = document.querySelectorAll('.booking-history .history-card');
    const reviews = JSON.parse(localStorage.getItem('pc_reviews') || '{}');
    cards.forEach(card => {
      const id = bookingIdForCard(card);
      const data = reviews[id];
      if (!data) return;

      // If prompt exists, convert to display
      const prompt = card.querySelector('.card-review-prompt');
      if (prompt) {
        const starsHTML = Array.from({ length: 5 }, (_, i) => {
          const filled = i < (data.rating || 0);
          return `<span${filled ? '' : ' class="star-muted"'}>⭐</span>`;
        }).join('');
        prompt.outerHTML = `
          <div class="card-review-display">
            <div class="stars">${starsHTML}</div>
            <p>${data.text}</p>
          </div>
        `;
      }
    });
  }

  // ===== New: Bind Booking History actions =====
  function bindBookingHistoryActions() {
    if (!hasBooking) return;

    // Review Now buttons
    document.querySelectorAll('.booking-history .btn-review').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.history-card');
        if (!card) return;
        const id = bookingIdForCard(card);

        const reviews = JSON.parse(localStorage.getItem('pc_reviews') || '{}');
        if (reviews[id]) {
          // already reviewed once — do nothing
          return;
        }
        openReviewModal(card, id);
      });
    });

    // Book Again
    document.querySelectorAll('.booking-history .card-actions .btn.btn-secondary').forEach(btn => {
      const txt = (btn.textContent || '').toLowerCase();
      if (txt.includes('book again')) {
        btn.addEventListener('click', () => {
          window.location.href = '../services/services.html';
        });
      } else if (txt.includes('view details')) {
        btn.addEventListener('click', () => {
          window.location.href = 'profile_servicestatus.html';
        });
      }
    });
  }

  // ===== New: Bind Order History actions =====
  function bindOrderHistoryActions() {
    if (!hasOrder) return;

    document.querySelectorAll('.order-history .card-actions .btn.btn-secondary').forEach(btn => {
      const txt = (btn.textContent || '').toLowerCase();
      if (txt.includes('order again')) {
        btn.addEventListener('click', () => {
          window.location.href = '../shop.html';
        });
      } else if (txt.includes('view details')) {
        btn.addEventListener('click', () => {
          window.location.href = 'profile_orderstatus.html';
        });
      }
    });
  }

  applyExistingReviews();
  bindBookingHistoryActions();
  bindOrderHistoryActions();
});
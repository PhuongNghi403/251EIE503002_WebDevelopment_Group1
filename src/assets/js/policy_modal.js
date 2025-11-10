// Policy Modal: unified Terms of Policy + Privacy Policy
(function () {
  const STORAGE_KEY = 'pc_policy_accepted';
  let modalEl, agreeCheckbox, acceptBtn, closeBtn;
  let lastAttemptedButton = null;
  let backdropEl = null;
  // Chế độ mặc định là 'none' (không mờ)
  let backdropMode = 'none'; 

  function findPolicyScope() {
    // Ưu tiên vùng được gán data-policy-scope, fallback theo ngữ cảnh
    const explicit = document.querySelector('[data-policy-scope]');
    if (explicit) return explicit;
    const candidates = [
      '.booking-shell', '.booking-layout', '.checkout-layout',
      '.checkout-main', '.auth-panel', 'main .container', 'main'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return document.body;
  }

  function setPolicyContentForContext() {
    const ctx = (document.body.dataset.page || '').toLowerCase();

    const termsDefault = `
      <div class="pc-policy-section">
        <h4>Service Terms</h4>
        <p>By using Pawfect Care services, you agree to follow booking rules, payment instructions, and respectful conduct. Cancellations and rescheduling are subject to our policy below.</p>
      </div>
      <div class="pc-policy-section">
        <h4>Booking & Payment</h4>
        <ul>
          <li>Provide accurate contact and pet information.</li>
          <li>Confirm payment method and complete payment when required.</li>
          <li>Fees for add-ons and treats are shown before checkout.</li>
        </ul>
      </div>
      <div class="pc-policy-section">
        <h4>Cancellation & Refund</h4>
        <p>Cancellations made less than 48 hours before the appointment may be non-refundable. Refunds follow the terms shown at checkout.</p>
      </div>
      <div class="pc-policy-section">
        <h4>User Responsibilities</h4>
        <ul>
          <li>Arrive on time for appointments.</li>
          <li>Disclose any special notes or health conditions of your pet.</li>
          <li>Comply with facility safety and hygiene requirements.</li>
        </ul>
      </div>
    `;
    const privacyDefault = `
      <div class="pc-policy-section">
        <h4>Data We Collect</h4>
        <ul>
          <li>Contact info (name, email, phone), login details.</li>
          <li>Pet information and booking preferences.</li>
          <li>Purchase history and feedback (reviews).</li>
        </ul>
      </div>
      <div class="pc-policy-section">
        <h4>How We Use It</h4>
        <ul>
          <li>To provide services, process orders, and support.</li>
          <li>To personalize recommendations and improve the platform.</li>
          <li>To maintain security and prevent misuse.</li>
        </ul>
      </div>
      <div class="pc-policy-section">
        <h4>Sharing & Security</h4>
        <p>We do not sell personal data. Limited sharing may occur with payment, fulfillment, or analytics providers under protection agreements.</p>
      </div>
      <div class="pc-policy-section">
        <h4>Your Choices</h4>
        <ul>
          <li>Update your profile to correct information.</li>
          <li>Manage marketing preferences or opt out.</li>
          <li>Request data access or deletion as permitted by law.</li>
        </ul>
      </div>
    `;

    // Khác nhau theo ngữ cảnh
    let termsHtml = termsDefault;
    let privacyHtml = privacyDefault;

    if (ctx.includes('login-signup')) {
      termsHtml = `
        <div class="pc-policy-section">
          <h4>Account Terms</h4>
          <ul>
            <li>Provide accurate personal information for sign up.</li>
            <li>Keep your credentials secure; you are responsible for account activity.</li>
            <li>Social login providers are subject to their own terms.</li>
          </ul>
        </div>` + termsDefault;
      privacyHtml = `
        <div class="pc-policy-section">
          <h4>Sign Up Data</h4>
          <ul>
            <li>Email/phone for verification and notifications.</li>
            <li>Name for personalization and support.</li>
            <li>Optional avatar or social profile data.</li>
          </ul>
        </div>` + privacyDefault;
    } else if (ctx.includes('shop-checkout')) {
      termsHtml = `
        <div class="pc-policy-section">
          <h4>Shopping Terms</h4>
          <ul>
            <li>Prices, discounts, and shipping fees shown at checkout.</li>
            <li>Orders may be cancelled before fulfillment; shipped items follow carrier policies.</li>
            <li>Returns/refunds depend on product condition and timing.</li>
          </ul>
        </div>` + termsDefault;
      privacyHtml = `
        <div class="pc-policy-section">
          <h4>Checkout Data</h4>
          <ul>
            <li>Payment details (masked) for transaction processing.</li>
            <li>Shipping address and contact for delivery.</li>
            <li>Device and usage data for fraud prevention.</li>
          </ul>
        </div>` + privacyDefault;
    } // services (spa/homestay) dùng default + phần cancellation đã có

    const termsPanel = modalEl.querySelector('.pc-tab-panel[data-panel="terms"]');
    const privacyPanel = modalEl.querySelector('.pc-tab-panel[data-panel="privacy"]');
    termsPanel.innerHTML = termsHtml;
    privacyPanel.innerHTML = privacyHtml;
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .pc-policy-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 9999; }
      .pc-policy-modal-backdrop { position: fixed; background: rgba(0,0,0,0.28); z-index: 9998; pointer-events: auto; }
      .pc-policy-dialog { background: #fff; border-radius: 12px; width: 560px; max-width: calc(100% - 24px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); pointer-events: auto; }
      .pc-policy-header { display:flex; align-items:center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #eee; }
      .pc-policy-title { margin: 0; font-size: 18px; color: #4b2f22; }
      .pc-policy-close { background: transparent; border: none; font-size: 20px; line-height: 1; cursor: pointer; color: #6b7280; }
      .pc-policy-tabs { display:flex; gap:8px; padding: 8px 16px; border-bottom: 1px solid #eee; }
      .pc-tab-btn { padding: 6px 10px; border-radius: 8px; border: 1px solid #e6ddd7; background: #faf9f8; color: #4b2f22; cursor:pointer; font-size: 13px; }
      .pc-tab-btn.active { background: #f6f3f1; border-color: #d7cdc6; font-weight: 600; }
      .pc-policy-content { padding: 8px 16px 0; }
      .pc-tab-panel { max-height: 300px; overflow: auto; padding-right: 8px; }
      .pc-policy-section { margin: 0 0 12px; }
      .pc-policy-section h4 { margin: 0 0 6px; font-size: 14px; color: #4b2f22; }
      .pc-policy-section p, .pc-policy-section ul { font-size: 13px; color: #374151; line-height: 1.5; margin: 0 0 8px; }
      .pc-policy-agree { display:flex; align-items:center; gap:8px; padding: 10px 16px; border-top: 1px solid #eee; }
      .pc-policy-actions { display:flex; justify-content:flex-end; gap:8px; padding: 8px 16px 14px; }
      .pc-btn { border: none; border-radius: 8px; padding: 8px 12px; cursor:pointer; }
      .pc-btn.primary { background: #7a5b48; color: #fff; }
      .pc-btn.ghost { background: #f6f3f1; color: #4b2f22; }
      .pc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    `;
    document.head.appendChild(style);

    // Build modal
    modalEl = document.createElement('div');
    modalEl.className = 'pc-policy-modal';
    modalEl.innerHTML = `
      <div class="pc-policy-modal-backdrop" data-backdrop></div>
      <div class="pc-policy-dialog" role="dialog" aria-modal="true" aria-labelledby="pc-policy-title">
        <div class="pc-policy-header">
          <h3 id="pc-policy-title" class="pc-policy-title">Policies</h3>
          <button class="pc-policy-close" aria-label="Close" data-close>×</button>
        </div>
        <div class="pc-policy-tabs">
          <button class="pc-tab-btn active" data-tab="terms">Terms of Policy</button>
          <button class="pc-tab-btn" data-tab="privacy">Privacy Policy</button>
        </div>
        <div class="pc-policy-content">
          <div class="pc-tab-panel" data-panel="terms"></div>
          <div class="pc-tab-panel" data-panel="privacy" hidden></div>
        </div>
        <div class="pc-policy-agree">
          <input type="checkbox" id="pc-policy-agree" />
          <label for="pc-policy-agree">I have read and agree to both policies</label>
        </div>
        <div class="pc-policy-actions">
          <button class="pc-btn ghost" data-close>Close</button>
          <button class="pc-btn primary" data-accept disabled>Accept & Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    backdropEl = modalEl.querySelector('[data-backdrop]');
    agreeCheckbox = modalEl.querySelector('#pc-policy-agree');
    acceptBtn = modalEl.querySelector('[data-accept]');
    closeBtn = modalEl.querySelectorAll('[data-close]');

    // Tabs
    const tabBtns = modalEl.querySelectorAll('.pc-tab-btn');
    const panels = modalEl.querySelectorAll('.pc-tab-panel');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        panels.forEach(p => { p.hidden = p.dataset.panel !== tab; });
      });
    });

    agreeCheckbox.addEventListener('change', () => { acceptBtn.disabled = !agreeCheckbox.checked; });
    closeBtn.forEach(btn => { btn.addEventListener('click', () => close()); });
    backdropEl.addEventListener('click', () => close());
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, ts: Date.now() }));
      syncPageAgreementCheckboxes();
      document.dispatchEvent(new CustomEvent('policyAccepted'));
      close();
      if (lastAttemptedButton) {
        const target = lastAttemptedButton; lastAttemptedButton = null; target.click();
      }
    });

    return modalEl;
  }

  function open() {
    ensureModal();

    // Render nội dung theo ngữ cảnh trang mỗi lần mở
    setPolicyContentForContext();

    // Extend Policy Modal: flexible tabs/content per page
    (function () {
      if (!window.policyModal) return;
    
      // Allow configuring policies per page: [{ id, label, content }]
      window.policyModal.setPolicies = function (policies) {
        try {
          // Expect exactly 2 tabs for current UI
          const tabs = Array.isArray(policies) ? policies.slice(0, 2) : [];
          if (tabs.length === 0) return;
    
          // Update internal state if exists
          if (!window.policyModal._state) window.policyModal._state = {};
          window.policyModal._state.tabs = tabs;
    
          // If modal already mounted, re-render tab labels + content
          const modal = document.querySelector('.policy-modal');
          if (modal) {
            const tabButtons = modal.querySelectorAll('.policy-tabs .policy-tab');
            const panes = modal.querySelectorAll('.policy-pane');
            tabs.forEach((t, i) => {
              const btn = tabButtons[i];
              const pane = panes[i];
              if (btn) btn.textContent = t.label || t.id || `Tab ${i + 1}`;
              if (pane) pane.innerHTML = t.content || '';
            });
          }
        } catch (e) {
          console.warn('PolicyModal.setPolicies error:', e);
        }
      };
    
      // Optional: set which checkbox to tick after acceptance on current page
      window.policyModal.setAgreeSelector = function (selector) {
        if (!selector) return;
        if (!window.policyModal._state) window.policyModal._state = {};
        window.policyModal._state.agreeSelector = selector;
      };
    
      // Hook into existing accept logic to tick correct checkbox when provided
      const originalOnAccept = window.policyModal.onAccept;
      window.policyModal.onAccept = function () {
        try {
          const sel = window.policyModal._state && window.policyModal._state.agreeSelector;
          if (sel) {
            const agree = document.querySelector(sel);
            if (agree && agree.type === 'checkbox') {
              agree.checked = true;
              agree.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        } catch (e) {
          console.warn('PolicyModal.onAccept hook error:', e);
        }
        // Continue original behavior (localStorage, unblocking, etc.)
        if (typeof originalOnAccept === 'function') originalOnAccept();
      };
    })();

    // *** LOGIC MỚI: Chọn kiểu backdrop ***
    if (backdropMode === 'none') {
        backdropEl.style.display = 'none';
    } else if (backdropMode === 'full') {
        backdropEl.style.display = 'block';
        Object.assign(backdropEl.style, {
            top: '0px',
            left: '0px',
            width: '100vw',
            height: '100vh',
            borderRadius: '0'
        });
    } else { // 'scope'
        const scope = findPolicyScope();
        const rect = scope.getBoundingClientRect();
        backdropEl.style.display = 'block';
        Object.assign(backdropEl.style, {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            borderRadius: window.getComputedStyle(scope).borderRadius || '0'
        });
    }
    // *** KẾT THÚC LOGIC MỚI ***

    modalEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Default tab
    const defaultTab = modalEl.querySelector('.pc-tab-btn[data-tab="terms"]');
    defaultTab && defaultTab.click();
  }

  function close() {
    if (!modalEl) return;
    modalEl.style.display = 'none';
    document.body.style.overflow = '';
    agreeCheckbox.checked = false;
    acceptBtn.disabled = true;
  }

  function isAccepted() {
    try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return !!data.accepted; }
    catch { return false; }
  }

  async function ensureAccepted(triggerBtn = null) {
    if (isAccepted()) return true;
    lastAttemptedButton = triggerBtn || null;
    open();
    return false;
  }

  function syncPageAgreementCheckboxes() {
    const suAgree = document.getElementById('su-agree');
    if (suAgree) { suAgree.checked = true; suAgree.dispatchEvent(new Event('change', { bubbles: true })); }
    document.querySelectorAll('.terms-agreement input[type="checkbox"], .terms input[type="checkbox"]').forEach(cb => {
      cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function attachAnchorOpeners() {
    const anchors = Array.from(document.querySelectorAll('a')).filter(a => {
      const t = (a.textContent || '').toLowerCase();
      return t.includes('terms') || t.includes('privacy') || t.includes('policy') || t.includes('conditions') || t.includes('cancellation');
    });
    anchors.forEach(a => {
      if (a.dataset.policyBound === 'true') return;
      a.dataset.policyBound = 'true';
      a.addEventListener('click', (e) => { e.preventDefault(); open(); });
    });
  }

  function gatePrimaryActions() {
    const candidates = Array.from(document.querySelectorAll('button, a.btn'));
    candidates.forEach(btn => {
      const label = (btn.textContent || '').trim().toLowerCase();
      const isPayNow = label.includes('pay now') || label.includes('pay');
      const isCheckoutPay = btn.classList.contains('pay') || isPayNow;
      if (!isCheckoutPay) return;
      if (btn.dataset.policyGateBound === 'true') return;
      btn.dataset.policyGateBound = 'true';
      btn.addEventListener('click', async (e) => {
        if (isAccepted()) return;
        e.preventDefault(); e.stopPropagation();
        await ensureAccepted(btn);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureModal();
    attachAnchorOpeners();
    gatePrimaryActions();
  });

  window.policyModal = {
    open, close, ensureAccepted, isAccepted,
    setContent(termsHtml, privacyHtml) {
      ensureModal();
      const t = modalEl.querySelector('.pc-tab-panel[data-panel="terms"]');
      const p = modalEl.querySelector('.pc-tab-panel[data-panel="privacy"]');
      if (termsHtml) t.innerHTML = termsHtml;
      if (privacyHtml) p.innerHTML = privacyHtml;
    }
  };
})();
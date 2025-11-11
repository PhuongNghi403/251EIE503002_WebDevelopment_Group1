// ---------------------------
// CUSTOMERS DATABASE 🐾
// ---------------------------
// This file centralizes customer signup/login data for managerial review.
// It stores non-sensitive profile fields and authentication activity logs.
// Passwords are NEVER stored in plaintext.

(function(){
  // In-memory datasets (synced with localStorage)
  window.CUSTOMERS = Array.isArray(window.CUSTOMERS) ? window.CUSTOMERS : [];
  window.AUTH_LOGS = Array.isArray(window.AUTH_LOGS) ? window.AUTH_LOGS : [];

  const LS_CUSTOMERS_KEY = 'pc_customers';
  const LS_AUTH_LOGS_KEY = 'pc_auth_logs';

  function safestr(v) {
    return (typeof v === 'string') ? v.trim() : '';
  }

  function normalizePhone(phone) {
    const s = safestr(phone);
    return s.replace(/\s+/g, '');
  }

  function normalizeEmail(email) {
    return safestr(email).toLowerCase();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  // Load from localStorage (if present)
  try {
    const rawCustomers = localStorage.getItem(LS_CUSTOMERS_KEY);
    const rawLogs = localStorage.getItem(LS_AUTH_LOGS_KEY);
    if (rawCustomers) {
      const parsed = JSON.parse(rawCustomers);
      if (Array.isArray(parsed)) window.CUSTOMERS = parsed;
    }
    if (rawLogs) {
      const parsed = JSON.parse(rawLogs);
      if (Array.isArray(parsed)) window.AUTH_LOGS = parsed;
    }
  } catch (_) {}

  function persistCustomers() {
    try { localStorage.setItem(LS_CUSTOMERS_KEY, JSON.stringify(window.CUSTOMERS)); } catch (_) {}
  }
  function persistAuthLogs() {
    try { localStorage.setItem(LS_AUTH_LOGS_KEY, JSON.stringify(window.AUTH_LOGS)); } catch (_) {}
  }

  // ---------------------------
  // CUSTOMER HELPERS
  // ---------------------------
  window.findCustomerByEmail = function(email) {
    const e = normalizeEmail(email);
    return window.CUSTOMERS.find(c => normalizeEmail(c.email) === e) || null;
  };

  window.findCustomerByPhone = function(phone) {
    const p = normalizePhone(phone);
    return window.CUSTOMERS.find(c => normalizePhone(c.phone) === p) || null;
  };

  // Create or update customer record from signup form payload
  // payload: { firstName, lastName, email, phone, password }
  window.upsertCustomer = function(payload) {
    const firstName = safestr(payload?.firstName);
    const lastName = safestr(payload?.lastName);
    const email = normalizeEmail(payload?.email);
    const phone = normalizePhone(payload?.phone);
    const password = safestr(payload?.password);

    // Never store plaintext password; keep minimal metadata for audit
    const passwordMeta = {
      passwordMasked: true,
      passwordLength: password.length,
    };

    let existing = (email && window.findCustomerByEmail(email)) || (phone && window.findCustomerByPhone(phone));
    if (existing) {
      existing.firstName = firstName || existing.firstName || '';
      existing.lastName = lastName || existing.lastName || '';
      existing.email = email || existing.email || '';
      existing.phone = phone || existing.phone || '';
      existing.passwordMeta = passwordMeta;
      existing.lastUpdatedAt = nowIso();
    } else {
      const record = {
        id: `cust_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
        firstName,
        lastName,
        email,
        phone,
        passwordMeta,
        registeredAt: nowIso(),
        lastUpdatedAt: nowIso(),
        // You can extend with address, preferences, etc.
      };
      window.CUSTOMERS.push(record);
      existing = record;
    }
    persistCustomers();
    return existing;
  };

  // ---------------------------
  // AUTH ACTIVITY LOGS
  // ---------------------------
  // Log sign-in attempts or sign-up completions for managerial auditing
  // event: { phone, email, method: 'password'|'google'|'facebook'|'apple', success: boolean, note?: string }
  window.logAuthEvent = function(event) {
    const entry = {
      phone: normalizePhone(event?.phone),
      email: normalizeEmail(event?.email),
      method: safestr(event?.method) || 'password',
      success: !!event?.success,
      note: safestr(event?.note),
      createdAt: nowIso(),
    };
    window.AUTH_LOGS.push(entry);
    persistAuthLogs();
    return entry;
  };

  // ---------------------------
  // EXPORT HELPERS
  // ---------------------------
  window.exportCustomersJSON = function() {
    try { return JSON.stringify(window.CUSTOMERS, null, 2); } catch (_) { return '[]'; }
  };
  window.exportAuthLogsJSON = function() {
    try { return JSON.stringify(window.AUTH_LOGS, null, 2); } catch (_) { return '[]'; }
  };
})();
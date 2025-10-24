(function () {
  // DOM helpers
  window.$ = (s, r = document) => r.querySelector(s);
  window.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  window.setText = (el, t) => { if (el) el.textContent = t || ""; };

  // Validators
  window.isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");
  window.isPhone = (v) => {
    const result = /^\+?\d[\d\s-]{7,}$/.test(v || "");
    console.log('isPhone validation:', v, '->', result);
    return result;
  };
  window.isPassword = (v) => {
    const result = (v || "").length >= 8;
    console.log('isPassword validation:', v, 'length:', (v || "").length, '->', result);
    return result;
  };

  // Local storage helpers
  window.getUsers = () => JSON.parse(localStorage.getItem("pc_users") || "[]");
  window.setUsers = (list) => localStorage.setItem("pc_users", JSON.stringify(list));
  window.setSession = (user) => localStorage.setItem("pc_user", JSON.stringify(user));

  // Activity logging
  window.logUserActivity = (email, activity) => {
    const users = window.getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return;
    users[idx].activities = Array.isArray(users[idx].activities) ? users[idx].activities : [];
    users[idx].activities.push({
      type: activity.type || "event",
      timestamp: new Date().toISOString(),
      detail: activity.detail || ""
    });
    window.setUsers(users);
  };
  
})();
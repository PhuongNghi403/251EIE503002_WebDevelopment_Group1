(function () {
  function initAuthPage() {
    if (document.body.dataset.page !== "login-signup") return;

    const tabs = $$(".segmented-item");
    const formSignIn = $("#form-signin");
    const formSignUp = $("#form-signup");
    const siPhone = $("#si-phone");
    const siPass = $("#si-pass");
    const siSubmit = $("#si-submit");
    const suLast = $("#su-last");
    const suFirst = $("#su-first");
    const suEmail = $("#su-email");
    const suPhone = $("#su-phone");
    const suPass = $("#su-pass");
    const suConfirm = $("#su-confirm");
    const suAgree = $("#su-agree");
    const suSubmit = $("#su-submit");

    // Tabs
    tabs.forEach(btn => btn.addEventListener("click", () => {
      tabs.forEach(b => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
      const mode = btn.dataset.tab;
      formSignIn.style.display = mode === "signin" ? "" : "none";
      formSignUp.style.display = mode === "signup" ? "" : "none";
    }));

    // Inline validation helpers
    const showError = (id, msg) => setText(document.getElementById(id), msg);
    const validateSignIn = () => {
      let ok = true;
      if (!isPhone(siPhone.value)) { ok = false; showError("si-phone-error", "Invalid phone number."); } else showError("si-phone-error", "");
      if (!isPassword(siPass.value)) { ok = false; showError("si-pass-error", "Password must be at least 8 characters."); } else showError("si-pass-error", "");
      siSubmit.disabled = !ok;
      return ok;
    };
    const validateSignUp = () => {
      let ok = true;
      if (!suLast.value.trim()) { ok = false; showError("su-last-error", "Please enter your last name."); } else showError("su-last-error", "");
      if (!suFirst.value.trim()) { ok = false; showError("su-first-error", "Please enter your first name."); } else showError("su-first-error", "");
      if (!isEmail(suEmail.value)) { ok = false; showError("su-email-error", "Invalid email address."); } else showError("su-email-error", "");
      if (!isPhone(suPhone.value)) { ok = false; showError("su-phone-error", "Invalid phone number."); } else showError("su-phone-error", "");
      if (!isPassword(suPass.value)) { ok = false; showError("su-pass-error", "At least 8 characters."); } else showError("su-pass-error", "");
      if (suConfirm.value !== suPass.value) { ok = false; showError("su-confirm-error", "Passwords do not match."); } else showError("su-confirm-error", "");
      if (!suAgree.checked) { ok = false; showError("su-email-error", "Please agree to our terms."); }
      suSubmit.disabled = !ok;
      return ok;
    };

    // Attach inline validation
    [siPhone, siPass].forEach(el => el.addEventListener("input", validateSignIn));
    [suLast, suFirst, suEmail, suPhone, suPass, suConfirm, suAgree].forEach(el => el.addEventListener("input", validateSignUp));

    // Sign In
    formSignIn.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateSignIn()) return;
      siSubmit.classList.add("loading");
      setTimeout(() => {
        const users = getUsers();
        const found = users.find(u => (u.phone === siPhone.value) && u.password === siPass.value);
        siSubmit.classList.remove("loading");
        if (!found) { showError("si-pass-error", "Incorrect phone or password."); return; }
        setSession(found);
        window.location.href = "../index.html";
      }, 600);
    });

    // Sign Up
    formSignUp.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateSignUp()) return;
      suSubmit.classList.add("loading");
      setTimeout(() => {
        const users = getUsers();
        if (users.some(u => u.email === suEmail.value)) {
          suSubmit.classList.remove("loading");
          showError("su-email-error", "This email is already in use.");
          return;
        }
        const newUser = {
          firstName: suFirst.value.trim(),
          lastName: suLast.value.trim(),
          email: suEmail.value.trim(),
          phone: suPhone.value.trim(),
          password: suPass.value
        };
        users.push(newUser);
        setUsers(users);
        setSession(newUser);
        suSubmit.classList.remove("loading");
        window.location.href = "../index.html";
      }, 800);
    });

    // Social buttons (demo)
    document.querySelectorAll(".social-btn").forEach(b => {
      b.addEventListener("click", () => alert("Social login is a demo placeholder."));
    });

    // Initial state
    validateSignIn();
    validateSignUp();
  }

  document.addEventListener("DOMContentLoaded", initAuthPage);
})();
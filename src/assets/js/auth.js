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
    const updateAuthHeader = (mode) => {
      const title = document.querySelector('.auth-title');
      const subtitle = document.querySelector('.auth-subtitle');
      
      if (mode === 'signin') {
        title.textContent = 'Welcome Back!';
        subtitle.textContent = 'Sign in to check on your furry friends';
      } else {
        title.textContent = 'Join Us Today';
        subtitle.textContent = 'Create an account to get started';
      }
    };

    tabs.forEach(btn => btn.addEventListener("click", () => {
      tabs.forEach(b => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
      const mode = btn.dataset.tab;
      formSignIn.style.display = mode === "signin" ? "" : "none";
      formSignUp.style.display = mode === "signup" ? "" : "none";
      updateAuthHeader(mode);
    }));

    // Toast notification helper
    const showToast = (message, type = 'error') => {
      // Remove existing toast if any
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }

      // Create new toast
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      // Show toast with animation
      setTimeout(() => toast.classList.add('show'), 10);

      // Hide and remove after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    };

    // Form validation helper
    const showError = (inputEl, errorId, msg) => {
      const inputWrapper = inputEl.closest('.input');
      if (inputWrapper) {
        if (msg) {
          inputWrapper.classList.add('has-error');
          showToast(msg);
        } else {
          inputWrapper.classList.remove('has-error');
        }
      }
    };

    const validateSignIn = (showErrors = false) => {
      let ok = true;
      
      if (!isPhone(siPhone.value)) {
        ok = false;
        if (showErrors) showError(siPhone, "si-phone-error", "Invalid phone number.");
      } else {
        showError(siPhone, "si-phone-error", "");
      }

      if (!isPassword(siPass.value)) {
        ok = false;
        if (showErrors) showError(siPass, "si-pass-error", "Password must be at least 8 characters.");
      } else {
        showError(siPass, "si-pass-error", "");
      }

      siSubmit.disabled = !ok;
      return ok;
    };

    const validateSignUp = (showErrors = false) => {
      let ok = true;

      if (!suLast.value.trim()) {
        ok = false;
        if (showErrors) showError(suLast, "su-last-error", "Please enter your last name.");
      } else {
        showError(suLast, "su-last-error", "");
      }

      if (!suFirst.value.trim()) {
        ok = false;
        if (showErrors) showError(suFirst, "su-first-error", "Please enter your first name.");
      } else {
        showError(suFirst, "su-first-error", "");
      }

      if (!isEmail(suEmail.value)) {
        ok = false;
        if (showErrors) showError(suEmail, "su-email-error", "Invalid email address.");
      } else {
        showError(suEmail, "su-email-error", "");
      }

      if (!isPhone(suPhone.value)) {
        ok = false;
        if (showErrors) showError(suPhone, "su-phone-error", "Invalid phone number.");
      } else {
        showError(suPhone, "su-phone-error", "");
      }

      if (!isPassword(suPass.value)) {
        ok = false;
        if (showErrors) showError(suPass, "su-pass-error", "At least 8 characters.");
      } else {
        showError(suPass, "su-pass-error", "");
      }

      if (suConfirm.value !== suPass.value) {
        ok = false;
        if (showErrors) showError(suConfirm, "su-confirm-error", "Passwords do not match.");
      } else {
        showError(suConfirm, "su-confirm-error", "");
      }

      if (!validateTerms(showErrors)) {
        ok = false;
      }

      suSubmit.disabled = !ok;
      return ok;
    };

    // Field validation function
    const validateField = (input, errorId, validationFn, errorMsg) => {
      const errorEl = document.getElementById(errorId);
      const inputWrapper = input.closest('.input');
      
      if (input.value.trim() === '') {
        setText(errorEl, 'This field is required.');
        inputWrapper.classList.add('has-error');
        return false;
      } else if (!validationFn(input.value)) {
        setText(errorEl, errorMsg);
        inputWrapper.classList.add('has-error');
        return false;
      } else {
        setText(errorEl, '');
        inputWrapper.classList.remove('has-error');
        return true;
      }
    };

    // Attach blur validation
    siPhone.addEventListener('blur', () => validateField(siPhone, 'si-phone-error', isPhone, 'Invalid phone number.'));
    siPass.addEventListener('blur', () => validateField(siPass, 'si-pass-error', isPassword, 'Password must be at least 8 characters.'));
    suLast.addEventListener('blur', () => validateField(suLast, 'su-last-error', val => val.trim() !== '', 'Please enter your last name.'));
    suFirst.addEventListener('blur', () => validateField(suFirst, 'su-first-error', val => val.trim() !== '', 'Please enter your first name.'));
    suEmail.addEventListener('blur', () => validateField(suEmail, 'su-email-error', isEmail, 'Invalid email address.'));
    suPhone.addEventListener('blur', () => validateField(suPhone, 'su-phone-error', isPhone, 'Invalid phone number.'));
    suPass.addEventListener('blur', () => validateField(suPass, 'su-pass-error', isPassword, 'At least 8 characters.'));

    // Special handling for confirm password
    suConfirm.addEventListener('blur', () => {
      const errorEl = document.getElementById('su-confirm-error');
      const inputWrapper = suConfirm.closest('.input');
      
      if (suConfirm.value.trim() === '') {
        setText(errorEl, 'Please confirm your password.');
        inputWrapper.classList.add('has-error');
      } else if (suConfirm.value !== suPass.value) {
        setText(errorEl, 'Passwords do not match.');
        inputWrapper.classList.add('has-error');
      } else {
        setText(errorEl, '');
        inputWrapper.classList.remove('has-error');
      }
    });

    // Clear errors on input
    const inputs = [siPhone, siPass, suLast, suFirst, suEmail, suPhone, suPass, suConfirm];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const inputWrapper = input.closest('.input');
        if (inputWrapper && inputWrapper.classList.contains('has-error')) {
          const errorEl = inputWrapper.querySelector('.error');
          setText(errorEl, '');
          inputWrapper.classList.remove('has-error');
        }
      });
    });

    // Terms checkbox validation
    const validateTerms = (showError = false) => {
      if (!suAgree.checked) {
        if (showError) {
          showToast('Please agree to our Terms of Service & Privacy Policy to continue');
          suAgree.focus();
        }
        return false;
      }
      return true;
    };

    suAgree.addEventListener('change', () => {
      validateTerms(true);
      validateSignUp();
    });

    // Sign In
    formSignIn.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateSignIn(true)) return;
      siSubmit.classList.add("loading");
      
      const users = getUsers();
      const found = users.find(u => (u.phone === siPhone.value) && u.password === siPass.value);
      
      if (!found) { 
        siSubmit.classList.remove("loading");
        showError("si-pass-error", "Incorrect phone or password."); 
        return; 
      }
      
      logUserActivity(found.id, "signin", "User signed in successfully");
      setSession(found);
      siSubmit.classList.remove("loading");
      window.location.href = "../index.html";
    });

    // Sign Up
    formSignUp.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateSignUp(true)) return;
      suSubmit.classList.add("loading");
      
      const users = getUsers();
      if (users.some(u => u.email === suEmail.value)) {
        suSubmit.classList.remove("loading");
        showError("su-email-error", "This email is already in use.");
        return;
      }
      
      const newUser = {
        id: Date.now(),
        firstName: suFirst.value.trim(),
        lastName: suLast.value.trim(),
        email: suEmail.value.trim(),
        phone: suPhone.value.trim(),
        password: suPass.value,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      setUsers(users);
      logUserActivity(newUser.id, "signup", "User created via form");
      setSession(newUser);
      suSubmit.classList.remove("loading");
      window.location.href = "../index.html";
    });

    // Social buttons (demo)
    document.querySelectorAll(".social-btn").forEach(b => {
      b.addEventListener("click", () => alert("Social login is a demo placeholder."));
    });

    // Initial state
    validateSignIn();
    validateSignUp();
  }

  // Password visibility toggle
  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const inputBox = toggle.closest('.input-box');
        const input = inputBox.querySelector('input[type="password"], input[type="text"]');
        
        if (input.type === 'password') {
          // Chuyển sang hiển thị password
          input.type = 'text';
          toggle.classList.add('show');
        } else {
          // Ẩn password
          input.type = 'password';
          toggle.classList.remove('show');
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAuthPage();
    initPasswordToggles();
  });
})();
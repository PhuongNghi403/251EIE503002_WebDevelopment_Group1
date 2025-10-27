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
    siPhone.addEventListener('input', () => validateSignIn());
    siPass.addEventListener('input', () => validateSignIn());

    suLast.addEventListener('input', () => validateSignUp());
    suFirst.addEventListener('input', () => validateSignUp());
    suEmail.addEventListener('input', () => validateSignUp());
    suPhone.addEventListener('input', () => validateSignUp());
    suPass.addEventListener('input', () => validateSignUp());
    suConfirm.addEventListener('input', () => validateSignUp());
    suAgree.addEventListener('change', () => validateSignUp());

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
      updateAuthHeader(mode); // Nếu có hàm này
      // Thêm class cho .segmented để kích hoạt animation
      const segmented = document.querySelector('.segmented');
      segmented.className = 'segmented ' + mode; // Thêm 'signin' hoặc 'signup'
      if (mode === 'signin') validateSignIn(); else validateSignUp();
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
      
      // Add different styles for different types
      if (type === 'info') {
        toast.style.backgroundColor = '#2196F3';
        toast.style.color = 'white';
      } else if (type === 'success') {
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
      }
      
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
    // Toast notification giữ nguyên...

// Form validation helper (nhận element + id, hoặc chỉ id)
const showError = (target, errorIdOrMsg, maybeMsg) => {
  let inputEl, errorId, msg;

  if (typeof target === 'string') {
    // Gọi kiểu: showError('si-pass-error', 'message')
    errorId = target;
    msg = errorIdOrMsg;
  } else {
    // Gọi kiểu: showError(inputEl, 'si-pass-error', 'message')
    inputEl = target;
    errorId = errorIdOrMsg;
    msg = maybeMsg;
  }

  const errorEl = document.getElementById(errorId);
  // set text lỗi nếu có chỗ để hiện
  if (errorEl) errorEl.textContent = msg || '';

  // tìm wrapper .input để gắn class has-error
    const wrap =
      (inputEl && inputEl.closest && inputEl.closest('.input')) ||
      (errorEl && errorEl.closest && errorEl.closest('.input')) ||
      null;

    if (wrap) {
      if (msg) wrap.classList.add('has-error');
      else wrap.classList.remove('has-error');
    }

    if (msg) showToast(msg); // toast nhẹ cho người dùng
  };


    const validateSignIn = (showErrors = false) => {
      let ok = true;
      
      console.log('Validating Sign In form...');
      console.log('Phone value:', siPhone.value, 'isPhone:', isPhone(siPhone.value));
      console.log('Password value:', siPass.value, 'isPassword:', isPassword(siPass.value));
      
      if (!isPhone(siPhone.value)) {
        ok = false;
        console.log('Phone validation failed');
        if (showErrors) showError(siPhone, "si-phone-error", "Invalid phone number.");
      } else {
        showError(siPhone, "si-phone-error", "");
      }

      if (!isPassword(siPass.value)) {
        ok = false;
        console.log('Password validation failed');
        if (showErrors) showError(siPass, "si-pass-error", "Password must be at least 8 characters.");
      } else {
        showError(siPass, "si-pass-error", "");
      }

      console.log('Sign In validation result:', ok);
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
      console.log('Sign In form submitted');
      console.log('Phone:', siPhone.value);
      console.log('Password:', siPass.value);
      console.log('Submit button disabled:', siSubmit.disabled);
      
      const validationResult = validateSignIn(true);
      console.log('Validation result:', validationResult);
      
      if (!validationResult) {
        console.log('Validation failed, stopping submission');
        return;
      }
      
      siSubmit.classList.add("loading");
      
      const users = getUsers();
      console.log('All users:', users);
      
      const found = users.find(u => (u.phone === siPhone.value) && u.password === siPass.value);
      console.log('Found user:', found);
      
      if (!found) { 
        siSubmit.classList.remove("loading");
        console.log('User not found, showing error');
        showError("si-pass-error", "Incorrect phone or password."); 
        return; 
      }
      
      console.log('Sign in successful, redirecting...');
      logUserActivity(found.email, { type: "signin", detail: "User signed in successfully" });
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
      logUserActivity(newUser.email, { type: "signup", detail: "User created via form" });
      setSession(newUser);
      
      // Store user credentials for auto-fill on sign in
      localStorage.setItem("pc_last_signup", JSON.stringify({
        phone: newUser.phone,
        email: newUser.email,
        timestamp: Date.now()
      }));
      
      suSubmit.classList.remove("loading");
      window.location.href = "../index.html";
    });

    // Social login handlers
    const handleGoogleLogin = async () => {
      console.log('Google login initiated');
      try {
        showToast('Signing in with Google...', 'info');
        const result = await window.handleSocialLogin('google');
        
        if (result.success) {
          // Save user to localStorage
          const users = getUsers();
          const existingUser = users.find(u => u.email === result.user.email);
          
          if (!existingUser) {
            // Create new user from social login
            const newUser = {
              id: result.user.id,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              email: result.user.email,
              phone: result.user.phone || '',
              password: '', // No password for social login
              avatar: result.user.avatar,
              provider: result.user.provider,
              createdAt: new Date().toISOString()
            };
            users.push(newUser);
            setUsers(users);
          }
          
          // Set session
          setSession(result.user);
          logUserActivity(result.user.email, { type: "signin", detail: "User signed in with Google" });
          
          showToast('Google login successful!', 'success');
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (error.message.includes('not loaded') || error.message.includes('API error')) {
          showToast('Google login is not available. Using demo mode.', 'info');
        } else {
          showToast('Google login failed. Please try again.', 'error');
        }
      }
    };

    const handleFacebookLogin = async () => {
      console.log('Facebook login initiated');
      try {
        showToast('Signing in with Facebook...', 'info');
        const result = await window.handleSocialLogin('facebook');
        
        if (result.success) {
          // Save user to localStorage
          const users = getUsers();
          const existingUser = users.find(u => u.email === result.user.email);
          
          if (!existingUser) {
            // Create new user from social login
            const newUser = {
              id: result.user.id,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              email: result.user.email,
              phone: result.user.phone || '',
              password: '', // No password for social login
              avatar: result.user.avatar,
              provider: result.user.provider,
              createdAt: new Date().toISOString()
            };
            users.push(newUser);
            setUsers(users);
          }
          
          // Set session
          setSession(result.user);
          logUserActivity(result.user.email, { type: "signin", detail: "User signed in with Facebook" });
          
          showToast('Facebook login successful!', 'success');
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        }
      } catch (error) {
        console.error('Facebook login error:', error);
        if (error.message.includes('not loaded') || error.message.includes('not ready') || error.message.includes('HTTPS')) {
          showToast('Facebook login requires HTTPS or is not available. Using demo mode.', 'info');
        } else {
          showToast('Facebook login failed. Please try again.', 'error');
        }
      }
    };

    const handleAppleLogin = async () => {
      console.log('Apple login initiated');
      try {
        showToast('Signing in with Apple...', 'info');
        const result = await window.handleSocialLogin('apple');
        
        if (result.success) {
          // Save user to localStorage
          const users = getUsers();
          const existingUser = users.find(u => u.email === result.user.email);
          
          if (!existingUser) {
            // Create new user from social login
            const newUser = {
              id: result.user.id,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              email: result.user.email,
              phone: result.user.phone || '',
              password: '', // No password for social login
              avatar: result.user.avatar,
              provider: result.user.provider,
              createdAt: new Date().toISOString()
            };
            users.push(newUser);
            setUsers(users);
          }
          
          // Set session
          setSession(result.user);
          logUserActivity(result.user.email, { type: "signin", detail: "User signed in with Apple" });
          
          showToast('Apple login successful!', 'success');
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        }
      } catch (error) {
        console.error('Apple login error:', error);
        if (error.message.includes('not available') || error.message.includes('not loaded')) {
          showToast('Apple login is not available. Using demo mode.', 'info');
        } else {
          showToast('Apple login failed. Please try again.', 'error');
        }
      }
    };

    // Attach social login handlers
    document.querySelectorAll(".social-btn").forEach(btn => {
      const btnText = btn.textContent.trim();
      if (btnText.includes('Google')) {
        btn.addEventListener("click", handleGoogleLogin);
      } else if (btnText.includes('Facebook')) {
        btn.addEventListener("click", handleFacebookLogin);
      } else if (btnText.includes('Apple')) {
        btn.addEventListener("click", handleAppleLogin);
      }
    });

    // Reset form state when returning from bfcache
    const resetFormState = () => {
      console.log('Resetting form state from bfcache...');
      
      // Reset button states
      if (siSubmit) {
        siSubmit.classList.remove("loading");
        siSubmit.disabled = true; // Will be enabled by validation
      }
      
      if (suSubmit) {
        suSubmit.classList.remove("loading");
        suSubmit.disabled = true; // Will be enabled by validation
      }
      
      // Clear all error states
      document.querySelectorAll('.input.has-error').forEach(input => {
        input.classList.remove('has-error');
      });
      
      // Clear all error messages
      document.querySelectorAll('.error').forEach(error => {
        error.textContent = '';
      });
      
      // Remove any existing toasts
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      // DON'T clear form data - preserve user input
      // Only reset checkboxes
      const siRemember = $("#si-remember");
      const suAgree = $("#su-agree");
      if (siRemember) siRemember.checked = false;
      if (suAgree) suAgree.checked = false;
      
      // Re-run validation to sync state with current form data
      setTimeout(() => {
        validateSignIn();
        validateSignUp();
      }, 100); // Small delay to ensure DOM is ready
    };

    // Auto-fill sign in form with last signup data
    const autoFillSignIn = () => {
      try {
        const lastSignup = localStorage.getItem("pc_last_signup");
        if (lastSignup) {
          const data = JSON.parse(lastSignup);
          // Only auto-fill if signup was recent (within 24 hours)
          if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
            if (siPhone && data.phone) {
              siPhone.value = data.phone;
            }
            // Trigger validation after auto-fill
            setTimeout(() => {
              validateSignIn();
            }, 100);
          }
        }
      } catch (e) {
        console.log('No previous signup data found');
      }
    };

    // Make reset function globally accessible
    resetAuthFormState = resetFormState;

    // Initial state
    validateSignIn();
    validateSignUp();
    
    // Auto-fill sign in form if returning from signup
    autoFillSignIn();
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

  // Global reference to reset function
  let resetAuthFormState = null;

  document.addEventListener("DOMContentLoaded", () => {
    initAuthPage();
    initPasswordToggles();
  });

  // Handle page restoration from bfcache and other navigation events
  window.addEventListener('pageshow', (event) => {
    console.log('Page show event:', event.persisted ? 'from cache' : 'fresh load');
    if (event.persisted && resetAuthFormState) {
      // Page was restored from bfcache - only reset UI state, not form data
      resetAuthFormState();
    }
  });

  // Remove visibility change handler as it was too aggressive
})();
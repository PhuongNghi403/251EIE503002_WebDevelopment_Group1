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
});
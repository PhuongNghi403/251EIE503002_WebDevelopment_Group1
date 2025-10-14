(function () {
  // Đánh dấu nav active theo data-page
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page || "";
    $$(".nav .nav-link").forEach((a) => a.classList.remove("active"));
    // Map đơn giản tên page -> text của link
    const map = { home: "Home", services: "Services", shop: "Shop", community: "Community", profile: "Profile" };
    const target = map[page] || "Home";
    const link = Array.from($$(".nav .nav-link")).find(a => (a.textContent || "").trim() === target);
    if (link) link.classList.add("active");
  });

  // Kích hoạt animation sau khi toàn bộ trang (ảnh) đã tải xong
  window.addEventListener("load", () => {
    const parents = document.querySelector('.hero-photo-wrap .hero-badge.badge-parents');
    const rating  = document.querySelector('.hero-photo-wrap .hero-badge.badge-rating');
    if (!parents || !rating) return;

    const rand = (min, max) => Math.random() * (max - min) + min;

    parents.style.setProperty('--dx', `${rand(12, 20)}px`);
    parents.style.setProperty('--dy', `${rand(-10, -4)}px`);
    parents.style.animationName = 'bobParents';
    parents.style.animationDuration = `${rand(5.5, 8.5)}s`;
    parents.style.animationDelay = `${rand(0, 2)}s`;
    parents.style.animationTimingFunction = 'ease-in-out';
    parents.style.animationIterationCount = 'infinite';
    parents.style.animationDirection = 'alternate';
    parents.classList.add('animate-parents');

    rating.style.setProperty('--dx', `${rand(-20, -12)}px`);
    rating.style.setProperty('--dy', `${rand(4, 10)}px`);
    rating.style.animationName = 'bobRating';
    rating.style.animationDuration = `${rand(5.5, 8.5)}s`;
    rating.style.animationDelay = `${rand(0.2, 1.5)}s`;
    rating.style.animationTimingFunction = 'ease-in-out';
    rating.style.animationIterationCount = 'infinite';
    rating.style.animationDirection = 'alternate';
    rating.classList.add('animate-rating');
  });
})();
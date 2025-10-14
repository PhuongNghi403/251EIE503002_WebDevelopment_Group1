document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === page) {
      link.classList.add('active');
    }
  });
});

// Toggle package details (expand/collapse)
function toggleDetails(button) {
  const pkgCard = button.closest('.pkg-card');
  const detailsSection = pkgCard.querySelector('.pkg-details-toggled');
  
  if (detailsSection.classList.contains('is-active')) {
    detailsSection.classList.remove('is-active');
    button.innerHTML = 'View Details <span class="arrow">↓</span>';
  } else {
    detailsSection.classList.add('is-active');
    button.innerHTML = 'Hide Details <span class="arrow">↑</span>';
  }
}

// Switch between tabs
function switchTab(button, tabId) {
  // Remove active class from all tab buttons and panels
  const tabContainer = button.closest('.pkg-tabs');
  tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  tabContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  // Add active class to clicked button and corresponding panel
  button.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Toggle accordion sections
function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const chevron = button.querySelector('.chevron');
  
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    chevron.textContent = '▼';
    chevron.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('expanded');
    chevron.textContent = '▲';
    chevron.style.transform = 'rotate(180deg)';
  }
}
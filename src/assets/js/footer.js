// Đồng bộ footer theo mẫu từ index.html, tự động chuẩn hóa đường dẫn theo độ sâu URL
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer.site-footer');
  if (!footer) return;

  // Tính độ sâu tương đối sau "/src/"
  const path = location.pathname;
  const idx = path.indexOf('/src/');
  const rel = idx >= 0 ? path.slice(idx + 5) : path; // sau "src/"
  const segments = rel.split('/'); // vd: ["index.html"] hoặc ["pages","services","spastep2.html"]
  const depth = segments.length - 1;

  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const assetPrefix = `${prefix}assets`;
  const pagesPrefix = `${prefix}pages`;

  footer.innerHTML = `
    <div class="container footer-columns">
      <div class="footer-col">
        <div class="footer-brand">
          <img class="brand-foot-img" src="${assetPrefix}/icons/logopawfooter.svg" alt="Paw" />
          <span class="brand-text bagel-fat-one-regular" style="color: #ffffff;">Pawfect Care</span>
        </div>
        <p>Your trusted partner in pet care since 2020.</p>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">Services</h4>
        <ul class="footer-links">
          <li><a href="${pagesPrefix}/services/homestayboarding-service.html">Pet Boarding</a></li>
          <li><a href="${pagesPrefix}/services/groomingspa-service.html">Pet Spa</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">Company</h4>
        <ul class="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="${pagesPrefix}/community.html">Blog</a></li>
          <li><a href="#" data-footer-contact>Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">Follow Us</h4>
        <div class="socials">
          <a href="https://www.facebook.com/" aria-label="Facebook"><img src="${assetPrefix}/icons/HomestayDetail/LogoSocialMediaFooter.svg" alt="Facebook" /></a>
          <a href="https://www.instagram.com/" aria-label="Instagram"></a>
          <a href="https://x.com/" aria-label="Twitter"></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container" align="center" style="color: #000000;">
        © 2025 Pawfect Care. All rights reserved.
      </div>
    </div>
  `;

  // Gắn sự kiện cho Contact/Contact Us để mở popup chatbox
  try {
    const contactLinks = Array.from(footer.querySelectorAll('a')).filter(a => {
      const t = (a.textContent || '').trim().toLowerCase();
      return t.includes('contact');
    });

    contactLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        // Nếu widget chatbox đã có mặt, mở popup
        if (window.aiChatbot && typeof window.aiChatbot.openChat === 'function') {
          window.aiChatbot.openChat();
          return;
        }
        // Fallback: chuyển sang trang chatbox demo nếu widget không sẵn có trên trang hiện tại
        window.location.href = `${pagesPrefix}/chatbox.html`;
      });
    });
  } catch (err) {
    // Nếu có lỗi không mong muốn, fallback sang trang chatbox
    window.location.href = `${pagesPrefix}/chatbox.html`;
  }
});
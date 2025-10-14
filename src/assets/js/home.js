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
})();
<script>

function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

// ===== Fallback data (nếu user truy cập trực tiếp detail không qua community) =====
const FALLBACK_CAMPAIGNS = [
  {
    id: 111,
    title: "Paw Nutrition Workshop: Smart Feeding 101",
    shortDesc: "Hướng dẫn khẩu phần, đọc nhãn, và thử món mới cho chó mèo.",
    dateISO: "2025-03-14T09:00:00+07:00",
    dateText: "14/03/2025 • 09:00",
    location: "Meomeo Hub, Thảo Điền",
    cover: "../assets/images/campaigns/nutrition-101.jpg",
    tags: ["Workshop", "Feeding", "Dogs", "Cats"],
    price: "Free • RSVP",
    status: "upcoming",
    agenda: [
      "09:00 - 09:15: Check-in & Ice-breaker",
      "09:15 - 10:00: Đọc nhãn dinh dưỡng & khẩu phần",
      "10:00 - 10:30: Dùng thử các món",
      "10:30 - 11:00: Q&A với chuyên gia"
    ],
    gallery: [
      "../assets/images/campaigns/g1.jpg",
      "../assets/images/campaigns/g2.jpg",
      "../assets/images/campaigns/g3.jpg",
      "../assets/images/campaigns/g4.jpg",
      "../assets/images/campaigns/g5.jpg",
      "../assets/images/campaigns/g6.jpg"
    ]
  },
  {
    id: 112,
    title: "Adoption Day x Local Shelter",
    shortDesc: "Gặp gỡ các bé cần mái ấm, tư vấn chăm sóc và đăng ký nhận nuôi.",
    dateISO: "2025-01-20T10:00:00+07:00",
    dateText: "20/01/2025 • 10:00",
    location: "Meomeo Plaza, Q.1",
    cover: "../assets/images/campaigns/adoption-day.jpg",
    tags: ["Adoption", "Community"],
    price: "Free",
    status: "past",
    agenda: [
      "10:00 - 10:15: Chào mừng",
      "10:15 - 11:00: Gặp gỡ từng bé",
      "11:00 - 11:30: Tư vấn chăm sóc ban đầu",
      "11:30 - 12:00: Đăng ký nhận nuôi"
    ],
    gallery: [
      "../assets/images/campaigns/a1.jpg",
      "../assets/images/campaigns/a2.jpg",
      "../assets/images/campaigns/a3.jpg"
    ]
  },
  {
    id: 113,
    title: "Pet Skin & Coat Clinic Pop-up",
    shortDesc: "Chuyên gia da liễu thú cưng tư vấn và soi da/ lông miễn phí.",
    dateISO: "2025-04-05T13:30:00+07:00",
    dateText: "05/04/2025 • 13:30",
    location: "Meomeo Store, Q.7",
    cover: "../assets/images/campaigns/skin-coat.jpg",
    tags: ["Clinic", "Skincare"],
    price: "Ticket 50k",
    status: "upcoming",
    agenda: [
      "13:30 - 13:45: Check-in",
      "13:45 - 14:30: Soi da & lông (slot 1)",
      "14:30 - 15:15: Soi da & lông (slot 2)",
      "15:15 - 16:00: Q&A & hướng dẫn chăm sóc"
    ],
    gallery: [
      "../assets/images/campaigns/s1.jpg",
      "../assets/images/campaigns/s2.jpg",
      "../assets/images/campaigns/s3.jpg",
      "../assets/images/campaigns/s4.jpg"
    ]
  }
];

// ===== Load data from sessionStorage or fallback =====
function getCampaignById(id) {
  const raw = sessionStorage.getItem("CAMPAIGNS_DATA");
  let list = [];
  try { list = raw ? JSON.parse(raw) : []; } catch(e){ list = []; }
  if (!Array.isArray(list) || list.length === 0) list = FALLBACK_CAMPAIGNS;
  return list.find(x => String(x.id) === String(id));
}

// ===== Inject into DOM =====
function populateWorkshopDetail() {
  const id = getQueryParam("id");
  const ev = getCampaignById(id);
  const notFound = !ev;

  // DOM refs (đổi theo markup của bạn)
  const media = document.querySelector(".ws-hero-media img");
  const title = document.querySelector(".ws-title");
  const excerpt = document.querySelector(".ws-excerpt");
  const metaDate = document.querySelector('.ws-meta .meta-item[data-field="date"] .meta-value');
  const metaLoc  = document.querySelector('.ws-meta .meta-item[data-field="location"] .meta-value');
  const priceEl  = document.querySelector('.ws-summary .ws-price');
  const galleryGrid = document.querySelector(".ws-gallery-grid");
  const agendaList = document.querySelector(".ws-agenda");
  const registerBtn = document.getElementById("ws-register");

  if (notFound) {
    if (title) title.textContent = "Event not found";
    if (excerpt) excerpt.textContent = "Có thể sự kiện đã bị gỡ hoặc id không hợp lệ.";
    if (media) media.src = "../assets/images/campaigns/placeholder.jpg";
    if (registerBtn){ registerBtn.setAttribute("aria-disabled","true"); registerBtn.disabled = true; }
    return;
  }

  if (media) { media.src = ev.cover; media.alt = ev.title; }
  if (title) title.textContent = ev.title;
  if (excerpt) excerpt.textContent = ev.shortDesc || "";

  if (metaDate) {
    metaDate.textContent = ev.dateText || "";
    // gắn data-iso để script “past-check” của bạn ưu tiên parse chính xác
    if (ev.dateISO) metaDate.dataset.iso = ev.dateISO;
  }
  if (metaLoc) metaLoc.textContent = ev.location || "";

  if (priceEl) priceEl.textContent = ev.price || "";

  if (galleryGrid && Array.isArray(ev.gallery)) {
    galleryGrid.innerHTML = ev.gallery.map(src => `<img src="${src}" alt="Event photo">`).join("");
  }

  if (agendaList && Array.isArray(ev.agenda)) {
    agendaList.innerHTML = ev.agenda.map(item => `<li>${item}</li>`).join("");
  }

  // nếu past → disable nút ngay (CSS overlay “Event ended” đã có)
  const isPast = (iso) => {
    if (!iso) return false;
    const end = new Date(iso); end.setHours(23,59,59,999);
    return new Date() > end;
  };
  if (registerBtn) {
    if (ev.status === "past" || isPast(ev.dateISO)) {
      registerBtn.setAttribute("aria-disabled","true");
      registerBtn.disabled = true;
      registerBtn.dataset.status = "past";
    } else {
      registerBtn.removeAttribute("aria-disabled");
      registerBtn.disabled = false;
      registerBtn.dataset.status = "upcoming";
    }
  }
}

document.addEventListener("DOMContentLoaded", populateWorkshopDetail);
</script>

/* ===========================
 *  Pawfect Community – Listing
 *  Filters + Search + Load More + Collapse
 *  (giữ nguyên core code, chỉ bổ sung collapse + cải tiến nút)
 * =========================== */

(function () {
  'use strict';

  /** ===================== DỮ LIỆU MẪU ===================== **/
  // Posts có type: undefined (user/staff) hoặc 'campaign'
  const blogPosts = [
  {
    id: 101,
    title: "10 Easy Puppy Training Tips to Build Good Habits in a Week",
    excerpt: "Start early and train smart! Discover 10 simple methods to help your little pup learn commands, stay calm, and have fun doing it.",
    category: "Training",
    author: "Mary Chen",
    date: "2 days ago",
    likes: 78,
    comments: 22,
    views: 560,
    image: "url('https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 102,
    title: "Homemade Sweet Potato Dog Treats Recipe",
    excerpt: "Soft, tasty, and budget-friendly — these sweet potato treats are easy to make in just 20 minutes and perfect for sensitive tummies.",
    category: "Health",
    author: "Lan Tran",
    date: "3 days ago",
    likes: 52,
    comments: 17,
    views: 480,
    image: "url('https://images.unsplash.com/photo-1626337110633-95bbf1c3f5f7?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 103,
    title: "5 Signs Your Pet Is Stressed (and How to Help Them Relax)",
    excerpt: "Pets feel emotions just like humans. Learn the 5 most common signs of stress and how to bring your furry friend back to a happy mood.",
    category: "Health",
    author: "Dr. James Miller",
    date: "4 days ago",
    likes: 91,
    comments: 28,
    views: 630,
    image: "url('https://images.unsplash.com/photo-1575202330052-3b2d74b56e83?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 104,
    title: "Beginner’s Guide to Trimming Your Dog’s Nails Safely",
    excerpt: "Trimming keeps paws healthy and prevents injuries. Here’s a step-by-step guide from our grooming expert at Pawfect Care.",
    category: "Stories ",
    author: "Mark Evans",
    date: "5 days ago",
    likes: 66,
    comments: 19,
    views: 520,
    image: "url('https://images.unsplash.com/photo-1601758123927-197cf4a43c33?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 105,
    title: "Do Cats Really Need Baths? The Answer Might Surprise You",
    excerpt: "Cats are known for grooming themselves — but when is it actually time for a bath? Find out the safe products and timing for your feline.",
    category: "Tips",
    author: "Anna Pham",
    date: "1 week ago",
    likes: 104,
    comments: 37,
    views: 910,
    image: "url('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 106,
    title: "DIY Catnip Toys: Fun Crafts Using Fabric Scraps",
    excerpt: "With just a few scraps of fabric and a pinch of creativity, you can make irresistible catnip toys that’ll keep your kitty entertained all day!",
    category: "Tips",
    author: "Hoa Dang",
    date: "1 week ago",
    likes: 38,
    comments: 11,
    views: 320,
    image: "url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 107,
    title: "Top 5 Vet-Approved Cat Foods for Sensitive Tummies",
    excerpt: "Sensitive cats need gentle, nutrient-rich food. Here are five high-quality kibbles tested and approved by the Pawfect Care team.",
    category: "Reviews",
    author: "Pawfect Staff",
    date: "8 days ago",
    likes: 74,
    comments: 18,
    views: 540,
    image: "url('https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 108,
    title: "Decoding Your Pet’s Sounds: What Their Meows and Woofs Mean",
    excerpt: "Meow, growl, chirp — what are they really saying? Learn how to interpret your pet’s emotions and needs through their sounds.",
    category: "Tips",
    author: "Binh Vo",
    date: "9 days ago",
    likes: 57,
    comments: 14,
    views: 470,
    image: "url('https://images.unsplash.com/photo-1593134257782-e89567b7718e?q=80&w=1200&auto=format&fit=crop')"
  },
  {
    id: 109,
    title: "Workshop: Summer Skin & Coat Care for Dogs",
    excerpt: "Join our free workshop at the Pawfect Center to learn proper coat care and prevent shedding and skin irritation during hot months.",
    category: "Stories ",
    author: "Pawfect Academy",
    date: "May 18",
    likes: 132,
    comments: 30,
    views: 1020,
    banner: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: 110,
    title: "Adopt Don’t Shop — Month of Love for Pets",
    excerpt: "This month, Pawfect Care promotes adoption with free grooming for adopted pets. Every rescued friend deserves a second chance.",
    category: "Rescue",
    author: "Pawfect Team",
    date: "Mar 10–20",
    likes: 210,
    comments: 47,
    views: 1800,
    banner: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop"
  },
{
  id: 111,
  type: 'campaign',
  title: "Adopt Don’t Shop — Pawfect Love Month",
  excerpt: "Join us this February for a heartwarming pet adoption event! Meet adorable dogs & cats waiting for their forever home.",
  shortDesc: "Join us this February for a heartwarming pet adoption event! Meet adorable dogs & cats waiting for their forever home.",
  category: "Campaign",
  author: "Pawfect Team",
  date: "Feb 10–25",
  dateText: "10/02/2025 • 09:00",
  dateISO: "2025-02-10T00:00:00+07:00",
  location: "Meomeo Hub, Thảo Điền",
  cover: "https://images.unsplash.com/photo-1601758124510-52d5b81d6821?q=80&w=1600&auto=format&fit=crop",
  banner: "https://images.unsplash.com/photo-1601758124510-52d5b81d6821?q=80&w=1600&auto=format&fit=crop",
  tags: ["Campaign", "Adoption"],
  price: "Free • RSVP",
  status: "upcoming",
  agenda: [
    "10:00 - 10:15: Chào mừng",
    "10:15 - 11:00: Gặp gỡ từng bé",
    "11:00 - 11:30: Tư vấn chăm sóc",
    "11:30 - 12:00: Đăng ký nhận nuôi"
  ],
  gallery: [
    "../assets/images/campaigns/a1.jpg",
    "../assets/images/campaigns/a2.jpg",
    "../assets/images/campaigns/a3.jpg"
  ]
},
{
  id: 112,
  type: 'campaign',
  title: "Summer Pet Fair 2025",
  excerpt: "A fun-filled festival with workshops, free grooming booths, and pet nutrition consultations.",
  shortDesc: "A fun-filled festival with workshops, free grooming booths, and pet nutrition consultations.",
  category: "Event",
  author: "Pawfect Care",
  date: "Jun 15–17",
  dateText: "15/06/2025 • 10:00",
  dateISO: "2025-06-15T00:00:00+07:00",
  location: "Meomeo Plaza, Q.1",
  cover: "https://images.unsplash.com/photo-1583511655903-5fee6a20fbd4?q=80&w=1600&auto=format&fit=crop",
  banner: "https://images.unsplash.com/photo-1583511655903-5fee6a20fbd4?q=80&w=1600&auto=format&fit=crop",
  tags: ["Event", "Festival"],
  price: "Free",
  status: "upcoming",
  agenda: [
    "10:00 - 10:15: Check-in & Ice-breaker",
    "10:15 - 11:00: Workshops",
    "11:00 - 11:30: Grooming booths",
    "11:30 - 12:00: Nutrition consultations"
  ],
  gallery: [
    "../assets/images/campaigns/s1.jpg",
    "../assets/images/campaigns/s2.jpg",
    "../assets/images/campaigns/s3.jpg",
    "../assets/images/campaigns/s4.jpg"
  ]
},
{
  id: 113,
  type: 'campaign',
  title: "Pawfect Rescue Week",
  excerpt: "Support local shelters and help rehome rescued animals. Every purchase donates to partner shelters.",
  shortDesc: "Support local shelters and help rehome rescued animals. Every purchase donates to partner shelters.",
  category: "Community",
  author: "Pawfect Rescue",
  date: "Jul 3–10",
  dateText: "03/07/2025 • 09:00",
  dateISO: "2025-07-03T00:00:00+07:00",
  location: "Meomeo Store, Q.7",
  cover: "https://images.unsplash.com/photo-1612832021027-95362d11d0c1?q=80&w=1600&auto=format&fit=crop",
  banner: "https://images.unsplash.com/photo-1612832021027-95362d11d0c1?q=80&w=1600&auto=format&fit=crop",
  tags: ["Community", "Rescue"],
  price: "Free",
  status: "upcoming",
  agenda: [
    "09:00 - 09:30: Opening",
    "09:30 - 10:30: Shelter tours",
    "10:30 - 11:30: Adoption counseling",
    "11:30 - 12:00: Closing"
  ],
  gallery: [
    "../assets/images/campaigns/r1.jpg",
    "../assets/images/campaigns/r2.jpg",
    "../assets/images/campaigns/r3.jpg"
  ]
}
];
window.blogPosts = blogPosts;

  const categoryLabels = {
    All: "All",
    Tips: "Pet Care Tips",
    Health: "Health & Nutrition",
    Training: "Training & Behavior",
    Stories: "Stories & Community",
    Rescue: "Adoption & Rescue",
    Reviews: "Products & Reviews"
  };
  
  // ===== STATE =====
  const PAGE_SIZE = 6;
  let currentFilter = 'all';
  let currentSearch = '';
  let displayedPosts = PAGE_SIZE;
  // (tuỳ chọn) sort: 'newest' | 'views' | 'likes' | 'comments'
  let currentSort = 'newest';

  /** ===================== INIT TRANG ===================== **/
  function initCommunity() {
    if (document.body.dataset.page !== 'community') return;

    // Active nav
    document.querySelectorAll('.nav .nav-link').forEach(link => {
      if (link.textContent.trim().toLowerCase() === 'community') {
        link.classList.add('active');
      }
    });

    // Toolbar: search + category + sort (nếu có)
    setupSearchBox();
    setupCategoryButtons();
    setupSorter();

    // Blog/Campaign/Modal
    setupBlogTabsFilter();
    setupCampaignTabsFilter();
    setupLoadControls();       
    setupCreatePost();
    setupContestForm(); // Add contest form handling
    setupBlogCardClick();

    // Staff strip (center on scroll/click)
    setupStaffToggle();
    bindStaffStripCentering();

    // Render
    renderCarousel();
    renderPosts();
    renderLatestStories();

    // Scroll to blog
    const browseBtn = document.getElementById('browse-tips-btn');
    if (browseBtn) {
      browseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const blogSection = document.querySelector('.community-blog');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /** ===================== TOOLBAR (SEARCH + CATEGORY + SORT) ===================== **/
  function setupSearchBox() {
    const input = document.getElementById('search-input');
    if (!input) return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    if (query) {
      input.value = query;
      currentSearch = query.toLowerCase();
    }

    input.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      displayedPosts = PAGE_SIZE;
      renderPosts();
    });
  }

  function setupCategoryButtons() {
    const btns = document.querySelectorAll('.category-filter .category-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        currentFilter = btn.dataset.category || 'all';
        displayedPosts = PAGE_SIZE;
        renderPosts();
      });
    });
  }

  function setupSorter() {
    const sel = document.getElementById('sort-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      currentSort = sel.value;
      displayedPosts = PAGE_SIZE;
      renderPosts();
    });
  }

  /** ===================== LATEST STORIES (HORIZONTAL) ===================== **/
  function renderLatestStories() {
    const storiesContainer = document.getElementById('latest-stories');
    if (!storiesContainer) return;
    const latestPosts = blogPosts.slice(0, 4);
    storiesContainer.innerHTML = latestPosts.map(post => createStoryCard(post)).join('');
  }

  function createStoryCard(post) {
    const categoryLabel = categoryLabels[post.category] || post.category || 'Story';
    return `
      <article class="story-card">
        <div class="story-image" style="background: ${post.image}; background-size: cover; background-position: center;"></div>
        <div class="story-content">
          <span class="story-category">${categoryLabel}</span>
          <h3 class="story-title">${post.title}</h3>
          <p class="story-excerpt">${post.excerpt}</p>
        </div>
      </article>
    `;
  }

  /** ===================== BLOG FILTER TABS (tuỳ tồn tại) ===================== **/
  function setupBlogTabsFilter() {
    const tabs = document.querySelectorAll('.blog-tabs .tab');
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.category || 'all';
        displayedPosts = PAGE_SIZE;
        renderPosts();
      });
    });
  }

  function setupCampaignTabsFilter() {
    const tabs = document.querySelectorAll('.campaign-tabs .tab');
    const strip = document.getElementById('campaigns-strip');
    if (!tabs.length || !strip) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const kind = tab.dataset.camp; // all | campaign | event | workshop
        const items = blogPosts.filter(
          p => p.type === 'campaign' && (kind === 'all' ? true : p.category === kind)
        );
        strip.innerHTML = items.map(createCampaignStripItem).join('');
      });
    });
  }

  /** ===================== BLOG RENDER ===================== **/
  function getFilteredPosts() {
    // bỏ campaign
    let filtered = blogPosts.filter(p => p.type !== 'campaign');

    // filter theo category
    if (currentFilter && currentFilter !== 'all' && currentFilter !== 'campaign') {
      filtered = filtered.filter(post => post.category === currentFilter);
    }

    // search theo title/excerpt/author
    if (currentSearch) {
      const q = currentSearch;
      filtered = filtered.filter(post =>
        (post.title || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.author || '').toLowerCase().includes(q)
      );
    }

    // sort tuỳ chọn
    if (currentSort === 'views') filtered = filtered.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (currentSort === 'likes') filtered = filtered.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0));
    else if (currentSort === 'comments') filtered = filtered.slice().sort((a, b) => (b.comments || 0) - (a.comments || 0));
    // 'newest' -> giữ nguyên thứ tự mẫu

    return filtered;
  }

  function createPostCard(post) {
    const categoryLabel = categoryLabels[post.category] || post.category || 'Post';
    const authorInitial = (post.author || 'U').charAt(0);
    return `
      <article class="blog-card" data-id="${post.id}">
        <div class="blog-card-image" style="background: ${post.image}; background-size: cover; background-position: center;"></div>
        <div class="blog-card-content">
          <span class="blog-card-category">${categoryLabel}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-footer">
            <div class="blog-card-author">
              <div class="author-avatar">${authorInitial}</div>
              <span class="author-name">${post.author}</span>
            </div>
            <span class="blog-card-date">${post.date}</span>
          </div>
          <div class="blog-card-stats">
            <div class="blog-stat"><img src="../assets/icons/Login/star_icon.svg" alt="Views" /><span>${post.views}</span></div>
            <div class="blog-stat"><img src="../assets/icons/Login/Group useramount_icon.svg" alt="Likes" /><span>${post.likes}</span></div>
            <div class="blog-stat"><img src="../assets/icons/HomestayDetail/profile_icon.svg" alt="Comments" /><span>${post.comments}</span></div>
          </div>
        </div>
      </article>
    `;
  }

  function renderPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    if (currentFilter === 'campaign') {
      const campaigns = blogPosts.filter(p => p.type === 'campaign');
      grid.innerHTML = campaigns.map(createCampaignCard).join('');
      updateLoadButtons(0); // ẩn controls khi là campaign
      attachCardNavigation();
      return;
    }

    const filteredPosts = getFilteredPosts();
    const postsToDisplay = filteredPosts.slice(0, displayedPosts);

    grid.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');

    // Thông báo rỗng
    if (postsToDisplay.length === 0) {
      grid.innerHTML = `
        <div class="no-posts" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 18px; color: var(--text-3)">Không tìm thấy bài viết nào</p>
        </div>
      `;
    }

    updateLoadButtons(filteredPosts.length);
    attachCardNavigation();
  }

  function attachCardNavigation() {
    document.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (!id) return;
        window.location.href = `blog-detail.html?id=${id}`;
      });
    });
  }

  /** ===================== LOAD MORE + COLLAPSE ===================== **/
  function setupLoadControls() {
    const btnMore = document.getElementById('load-more');
    const btnCol  = document.getElementById('collapse');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        const total = getFilteredPosts().length;
        displayedPosts = Math.min(displayedPosts + PAGE_SIZE, total);
        renderPosts();
        updateLoadButtons(total);
      });
    }
    if (btnCol) {
      btnCol.addEventListener('click', () => {
        displayedPosts = PAGE_SIZE;
        renderPosts();
        updateLoadButtons(getFilteredPosts().length);
        // scroll về đầu grid cho gọn
        const grid = document.getElementById('blog-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function updateLoadButtons(totalCount) {
    const btnMore = document.getElementById('load-more');
    const btnCol  = document.getElementById('collapse');
    if (!btnMore || !btnCol) return;

    // Hiển thị "Xem thêm" nếu còn bài
    const hasMore = displayedPosts < totalCount;
    btnMore.style.display = hasMore ? 'inline-flex' : 'none';

    // Hiển thị "Thu gọn" nếu đã mở rộng hơn 1 trang
    const canCollapse = displayedPosts > PAGE_SIZE;
    btnCol.style.display = canCollapse ? 'inline-flex' : 'none';
  }

  /** ===================== CAMPAIGN CAROUSEL ===================== **/
  let currentSlide = 0;

  function renderCarousel() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!slidesContainer || !dotsContainer) return;

    const campaigns = blogPosts.filter(p => p.type === 'campaign');

    slidesContainer.innerHTML = campaigns.map((item, idx) => createCarouselSlide(item, idx)).join('');
    dotsContainer.innerHTML = campaigns.map((_, idx) =>
      `<button class="carousel-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" aria-label="Go to slide ${idx + 1}"></button>`
    ).join('');

    setupCarouselNav(campaigns.length);
    updateCarouselPosition();
     // Thêm sự kiện cho nút Learn more
  const learnBtns = document.querySelectorAll('.btn-learn-more');
  learnBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const campaigns = blogPosts.filter(p => p.type === 'campaign');
      const campaign = campaigns[index];
      if (!campaign) return;

      // Lưu dữ liệu vào sessionStorage để trang detail đọc
      sessionStorage.setItem("CAMPAIGNS_DATA", JSON.stringify(campaigns));

      // Chuyển sang trang chi tiết
      window.location.href = `workshop_detail.html?id=${campaign.id}`;
    });
  });
  }


  function createCarouselSlide(item, idx) {
    const dateStr = item.date || '';
    const dateParts = dateStr.match(/([A-Za-z]+)\s+([\d–\-]+)/);
    let dayStr = '01', monStr = 'JAN';
    if (dateParts) {
      monStr = dateParts[1].toUpperCase().substring(0, 3);
      dayStr = dateParts[2].padStart(2, '0');
    }
    const categoryLabel = item.category === 'campaign' ? 'Campaign' : item.category === 'event' ? 'Event' : 'Workshop';

    return `
      <div class="carousel-slide" data-slide="${idx}">
        <div class="slide-image-wrapper">
          <img src="${item.banner || ''}" alt="${item.title}" class="slide-image" />
          <div class="slide-date-badge">
            <div class="badge-day">${dayStr}</div>
            <div class="badge-mon">${monStr}</div>
          </div>
        </div>
        <div class="slide-content">
          <span class="slide-category">${categoryLabel}</span>
          <h3 class="slide-title">${item.title}</h3>
          <p class="slide-description">${item.excerpt || ''}</p>
          <button class="btn btn-learn-more">Learn more →</button>
        </div>
      </div>
    `;
  }

  function setupCarouselNav(totalSlides) {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (prevBtn) prevBtn.onclick = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarouselPosition(); updateDots();
    };
    if (nextBtn) nextBtn.onclick = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarouselPosition(); updateDots();
    };

    dots.forEach(dot => {
      dot.onclick = () => {
        currentSlide = parseInt(dot.dataset.slide, 10);
        updateCarouselPosition(); updateDots();
      };
    });
  }

  function updateCarouselPosition() {
    const slidesContainer = document.getElementById('carousel-slides');
    if (!slidesContainer) return;
    const offset = -currentSlide * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
  }

  function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
  }
  

  /** ===================== BLOG DETAIL (giữ để tương thích) ===================== **/
  function setupBlogCardClick() {
    const modal = document.getElementById('blog-detail-modal');
    const closeBtn = document.getElementById('close-blog-detail');
    const backdrop = modal ? modal.querySelector('.modal-backdrop') : null;
    if (!modal) return;

    const closeBlogDetail = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    closeBtn && closeBtn.addEventListener('click', closeBlogDetail);
    backdrop && backdrop.addEventListener('click', closeBlogDetail);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeBlogDetail();
    });

    document.addEventListener('click', (e) => {
      const card = e.target.closest('.blog-card');
      if (!card) return;

      const id = card.getAttribute('data-id');
      if (!id) return;

      // Điều hướng tới trang chi tiết (mock)
      window.location.href = `blog-detail.html?id=${id}`;
    });
  }

  function renderBlogDetail(post) {
    const contentDiv = document.getElementById('blog-detail-content');
    if (!contentDiv) return;

    const categoryLabel = categoryLabels[post.category] || post.category;
    const authorInitial = post.author.charAt(0);

    const fullContent = `
      ${post.excerpt}

      Đây là nội dung chi tiết của bài viết. Trong thực tế, nội dung đầy đủ sẽ được tải từ server hoặc cơ sở dữ liệu.

      Bài viết này cung cấp những thông tin hữu ích và thực tiễn giúp bạn chăm sóc thú cưng tốt hơn.
    `;

    contentDiv.innerHTML = `
      <article class="blog-detail-article">
        <div class="blog-detail-header">
          <h1 class="blog-detail-title" id="blog-detail-title">${post.title}</h1>
          <div class="blog-detail-meta">
            <div class="blog-detail-author">
              <div class="author-avatar">${authorInitial}</div>
              <div class="author-info">
                <p class="author-name">${post.author}</p>
                <p class="author-date">${post.date}</p>
              </div>
            </div>
            <span class="blog-detail-category">${categoryLabel}</span>
          </div>
        </div>

        <div class="blog-detail-image" style="background: ${post.image}; background-size: cover; background-position: center;"></div>

        <div class="blog-detail-body">
          <p class="blog-detail-excerpt">${post.excerpt}</p>

          <div class="blog-detail-content-text">
            ${fullContent.split('\\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
          </div>

          <div class="blog-detail-stats">
            <div class="stat-item"><span class="stat-label">Lượt xem</span><span class="stat-value">${post.views}</span></div>
            <div class="stat-item"><span class="stat-label">Lượt thích</span><span class="stat-value">${post.likes}</span></div>
            <div class="stat-item"><span class="stat-label">Bình luận</span><span class="stat-value">${post.comments}</span></div>
          </div>

          <div class="blog-detail-actions">
            <button class="btn btn-like">❤️ Thích (${post.likes})</button>
            <button class="btn btn-comment">💬 Bình luận (${post.comments})</button>
            <button class="btn btn-share">🔗 Chia sẻ</button>
          </div>
        </div>
      </article>
    `;
  }

  /** ===================== CAMPAIGN STRIP (PILLS) ===================== **/
  function createCampaignStripItem(item) {
    const dateStr = item.date || '';
    const dateParts = dateStr.match(/([A-Za-z]+)\\s+([\\d–\\-]+)/);
    let dayStr = '01', monStr = 'JAN';
    if (dateParts) {
      monStr = dateParts[1].toUpperCase().substring(0, 3);
      dayStr = dateParts[2].padStart(2, '0');
    }

    const chipClass = item.category === 'campaign' ? 'campaign' : item.category === 'event' ? 'event' : 'workshop';
    const chipLabel = item.category === 'campaign' ? 'Campaign' : item.category === 'event' ? 'Event' : 'Workshop';

    return `
      <article class="campaign-pill" title="${item.title}">
        <div class="date-badge">
          <div class="day">${dayStr}</div>
          <div class="mon">${monStr}</div>
        </div>
        <div class="campaign-body">
          <h3 class="campaign-title">${item.title}</h3>
          <p class="campaign-excerpt">${item.excerpt || ''}</p>
          <div class="campaign-tags">
            <span class="chip ${chipClass}">${chipLabel}</span>
          </div>
        </div>
        <div class="campaign-cta">
          <button class="btn btn-ghost">RSVP →</button>
        </div>
      </article>
    `;
  }

  function createCampaignCard(item) {
    return `
      <article class="blog-card">
        <div class="blog-card-image" style="background-image:url('${item.banner || ''}'); background-size: cover; background-position: center;"></div>
        <div class="blog-card-content">
          <span class="blog-card-category">Campaign</span>
          <h3 class="blog-card-title">${item.title}</h3>
          <p class="blog-card-excerpt">${item.excerpt || ''}</p>
          <div class="blog-card-footer">
            <div class="blog-card-author">
              <div class="author-avatar">P</div>
              <span class="author-name">${item.author || 'Pawfect'}</span>
            </div>
            <span class="blog-card-date">${item.date || ''}</span>
          </div>
        </div>
      </article>
    `;
  }

  /** ===================== STAFF STRIP (CLICK-TO-CENTER) ===================== **/
  function setupStaffToggle() {
    const cards = document.querySelectorAll('.staff-card[data-staff]');
    const grid = document.querySelector('.staff-grid');
    if (!cards.length || !grid) return;

    const closeOthers = (except) => {
      cards.forEach(c => {
        if (c !== except) {
          c.classList.remove('open');
          const btn = c.querySelector('.staff-hover');
          const details = c.querySelector('.staff-details');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (details) details.hidden = true;
        }
      });
    };

    cards.forEach((card) => {
  // Không còn dùng button/details để toggle gì hết
  const btn = card.querySelector('.staff-hover');
  const details = card.querySelector('.staff-details');

  // Ẩn/khóa mọi thứ liên quan “mở chi tiết / hover”
  if (btn) {
    btn.setAttribute('aria-hidden', 'true');
    btn.setAttribute('tabindex', '-1');
    // optional: chặn tương tác + ẩn mờ
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0';
  }
  if (details) {
    details.hidden = true;
  }

  // Click vào card -> luôn center card này, KHÔNG toggle gì hết
  card.addEventListener('click', () => {
    scrollCardToCenter(grid, card);
  });

  // Hỗ trợ bàn phím
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollCardToCenter(grid, card);
    }
  });
});

  }

  function bindStaffStripCentering() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.staff-card'));
    if (!cards.length) return;

    const doSetCenter = () => setCenterByScroll(grid, cards);
    doSetCenter();
    grid.addEventListener('scroll', () => requestAnimationFrame(doSetCenter));
    window.addEventListener('resize', doSetCenter);

    cards.forEach(card => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.addEventListener('click', () => scrollCardToCenter(grid, card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollCardToCenter(grid, card);
        }
      });
    });
  }

  function setCenterByScroll(grid, cards) {
    const mid = grid.scrollLeft + grid.clientWidth / 2;
    let best = null, bestDist = Infinity;
    cards.forEach(c => {
      const cx = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cx - mid);
      if (d < bestDist) { bestDist = d; best = c; }
    });
    cards.forEach(c => c.classList.remove('is-center', 'side'));
    cards.forEach(c => c.classList.add('side'));
    best && best.classList.add('is-center');
  }

  function scrollCardToCenter(grid, card) {
    const target = card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const clamped = Math.max(0, Math.min(target, maxScroll));
    grid.scrollTo({ left: clamped, behavior: 'smooth' });

    const cards = grid.querySelectorAll('.staff-card');
    cards.forEach(c => c.classList.remove('is-center', 'side'));
    cards.forEach(c => c.classList.add('side'));
    card.classList.add('is-center');
  }

  /** ===================== CREATE POST (MODAL) ===================== **/
  function setupCreatePost() {
    const modal = document.getElementById('create-post-modal');
    const form = document.getElementById('post-form');
    const closeBtn = document.getElementById('close-post-modal');
    const createBtns = document.querySelectorAll('#create-post-btn');

    const openCreateModal = () => {
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeCreateModal = () => {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (form) form.reset();
    };

    const startPostingBtn = document.querySelector('.hero-actions .c-btn--solid');
    if (startPostingBtn) {
      startPostingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCreateModal(); // <- dùng hàm chuẩn
    });
    }
    



    createBtns.forEach(btn => btn.addEventListener('click', openCreateModal));
    closeBtn && closeBtn.addEventListener('click', closeCreateModal);
    modal && modal.addEventListener('click', (e) => {
      if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
        closeCreateModal();
      }
    });

    form && form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('post-title').value.trim();
      const category = document.getElementById('post-category').value;
      const excerpt = document.getElementById('post-excerpt').value.trim();
      if (!title || !excerpt) return;

      const newPost = {
        id: Date.now(),
        title,
        excerpt,
        category,
        author: 'Bạn',
        date: 'Vừa xong',
        likes: 0,
        comments: 0,
        views: 0,
        image: "url('../assets/images/HomestayDetail/StandingCatHome.png')"
      };

      blogPosts.unshift(newPost);
      displayedPosts = Math.max(PAGE_SIZE, displayedPosts);
      renderPosts();
      closeCreateModal();
    });
  }

  /** ===================== CONTEST FORM HANDLING ===================== **/
  
  function setupContestForm() {
    const contestForm = document.getElementById('contest-form');
    const contestModal = document.getElementById('contest-modal');
    const contestSuccessModal = document.getElementById('contest-success-modal');
    const closeContestModal = document.getElementById('close-contest-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const contestMediaInput = document.getElementById('contest-media');
    const contestPreview = document.getElementById('contest-preview');

    // Close contest modal
    if (closeContestModal) {
      closeContestModal.addEventListener('click', () => {
        if (contestModal) contestModal.setAttribute('aria-hidden', 'true');
      });
    }

    // Close success modal
    if (closeSuccessModal) {
      closeSuccessModal.addEventListener('click', () => {
        if (contestSuccessModal) contestSuccessModal.setAttribute('aria-hidden', 'true');
      });
    }

    // Contest media preview
    if (contestMediaInput && contestPreview) {
      contestMediaInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
            if (mediaType === 'image') {
              contestPreview.innerHTML = `<img src="${e.target.result}" alt="Contest preview" style="max-width: 100%; max-height: 200px;" />`;
            } else {
              contestPreview.innerHTML = `<video controls style="max-width: 100%; max-height: 200px;"><source src="${e.target.result}" type="${file.type}"></video>`;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Contest form submission
    if (contestForm) {
      contestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contest-name').value.trim();
        const email = document.getElementById('contest-email').value.trim();
        const description = document.getElementById('contest-description').value.trim();
        const mediaFile = contestMediaInput.files[0];

        if (!name || !email || !description || !mediaFile) {
          alert('Please fill in all fields and upload a photo/video.');
          return;
        }

        // Read media file
        const reader = new FileReader();
        reader.onload = (e) => {
          const contestEntry = {
            id: Date.now(),
            name: name,
            email: email,
            description: description,
            media: e.target.result,
            mediaType: mediaFile.type,
            timestamp: new Date().toISOString()
          };

          // Save to localStorage
          let contestEntries = JSON.parse(localStorage.getItem('contestEntries') || '[]');
          contestEntries.push(contestEntry);
          localStorage.setItem('contestEntries', JSON.stringify(contestEntries));

          // Close contest modal and show success modal
          if (contestModal) contestModal.setAttribute('aria-hidden', 'true');
          if (contestSuccessModal) contestSuccessModal.removeAttribute('aria-hidden');

          // Reset form
          contestForm.reset();
          if (contestPreview) contestPreview.innerHTML = '';
        };
        reader.readAsDataURL(mediaFile);
      });
    }
  }
  document.addEventListener('DOMContentLoaded', initCommunity);

})();

/** ===================== REVEAL ON SCROLL (INTRO MOMENTS) ===================== **/
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.intro-moments.reveal-on-scroll');
  const items = document.querySelectorAll('.intro-moments .reveal-item');
  if (!section || !items.length) return;

  const obsSection = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('is-visible');
        obsSection.unobserve(section);
      }
    });
  }, { threshold: 0.15 });
  obsSection.observe(section);

  const obsItems = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obsItems.unobserve(e.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  items.forEach(i => obsItems.observe(i));
});

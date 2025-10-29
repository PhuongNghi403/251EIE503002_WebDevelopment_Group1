(function () {
  'use strict';

  /** ===================== DỮ LIỆU MẪU ===================== **/
  // Posts có type: undefined (user/staff) hoặc 'campaign'
  const blogPosts = [
    {
      id: 1,
      title: "5 Tips Huấn Luyện Chó Cơ Bản Cho Người Mới Bắt Đầu",
      excerpt: "Huấn luyện chó không khó như bạn nghĩ. Hãy cùng khám phá 5 mẹo đơn giản giúp chó cưng của bạn biết nghe lời và ngoan ngoãn hơn...",
      category: "training",
      author: "Minh Nguyen",
      date: "2 ngày trước",
      likes: 45,
      comments: 12,
      views: 230,
      image: "url('../assets/images/HomestayDetail/StandingWhiteDog.svg')"
    },
    {
      id: 2,
      title: "Chế Độ Dinh Dưỡng Hoàn Hảo Cho Mèo Theo Từng Độ Tuổi",
      excerpt: "Mèo ở mỗi giai đoạn phát triển cần chế độ dinh dưỡng khác nhau. Tìm hiểu cách chọn thức ăn phù hợp cho mèo con, mèo trưởng thành và mèo già...",
      category: "food",
      author: "Lan Tran",
      date: "5 ngày trước",
      likes: 67,
      comments: 20,
      views: 450,
      image: "url('../assets/images/HomestayDetail/StandingCatHome.png')"
    },
    {
      id: 3,
      title: "Dấu Hiệu Thú Cưng Cần Đi Khám Bác Sĩ Thú Y",
      excerpt: "Nhận biết sớm các dấu hiệu bất thường ở thú cưng giúp điều trị kịp thời. Bài viết này liệt kê những triệu chứng cần chú ý...",
      category: "health",
      author: "Dr. Long",
      date: "1 tuần trước",
      likes: 89,
      comments: 34,
      views: 620,
      image: "url('../assets/images/HomestayDetail/BlueCat.png')"
    },
    {
      id: 4,
      title: "Cách Tắm Cho Chó Đúng Cách - Giữ Lông Mượt Mà",
      excerpt: "Tắm cho chó không chỉ về việc làm sạch mà còn là khoảng thời gian gắn kết. Học cách tắm đúng kỹ thuật để chó cảm thấy thoải mái...",
      category: "grooming",
      author: "Hoa Le",
      date: "1 tuần trước",
      likes: 52,
      comments: 18,
      views: 380,
      image: "url('../assets/images/HomestayDetail/CuttingFur.png')"
    },
    {
      id: 5,
      title: "10 Điều Người Nuôi Mèo Mới Cần Biết",
      excerpt: "Nuôi mèo lần đầu? Đừng lo lắng! Bài viết này sẽ hướng dẫn bạn những điều cơ bản nhất để chào đón thành viên mới vào gia đình...",
      category: "tips",
      author: "Anna Pham",
      date: "2 tuần trước",
      likes: 102,
      comments: 45,
      views: 850,
      image: "url('../assets/images/HomestayDetail/WomanHoldCat.png')"
    },
    {
      id: 6,
      title: "Chăm Sóc Răng Miệng Cho Thú Cưng: Hướng Dẫn Chi Tiết",
      excerpt: "Sức khỏe răng miệng ảnh hưởng lớn đến sức khỏe tổng thể. Tìm hiểu cách đánh răng, lựa chọn bàn chải và thức ăn phù hợp...",
      category: "health",
      author: "Dr. Mai",
      date: "2 tuần trước",
      likes: 76,
      comments: 28,
      views: 540,
      image: "url('../assets/images/HomestayDetail/CutNailCat.png')"
    },
    {
      id: 7,
      title: "Tạo Không Gian Vui Chơi An Toàn Cho Chó Trong Nhà",
      excerpt: "Chó cần vận động và vui chơi để phát triển khỏe mạnh. Thiết kế khu vực vui chơi an toàn, thú vị ngay trong nhà bạn...",
      category: "tips",
      author: "Binh Vo",
      date: "3 tuần trước",
      likes: 41,
      comments: 15,
      views: 290,
      image: "url('../assets/images/HomestayDetail/DogToysRawhide.svg')"
    },
    {
      id: 8,
      title: "Làm Sao Để Chó Không Sợ Cắt Móng? 7 Mẹo Hiệu Quả",
      excerpt: "Cắt móng cho chó luôn là thử thách với nhiều người. Áp dụng 7 mẹo này để quá trình trở nên nhẹ nhàng và không căng thẳng...",
      category: "grooming",
      author: "Thuy Nguyen",
      date: "3 tuần trước",
      likes: 58,
      comments: 22,
      views: 410,
      image: "url('../assets/images/HomestayDetail/ShowerDog.png')"
    },
    // From Community & Staff Pick samples
    {
      id: 9,
      title: "Tự Làm Đồ Chơi Cho Mèo Từ Vải Vụn",
      excerpt: "Mình vừa tái chế vải vụn thành đồ chơi catnip cho mèo, rẻ mà vẫn bền...",
      category: "from-community",
      author: "Hoa Dang",
      date: "4 ngày trước",
      likes: 23,
      comments: 6,
      views: 180,
      image: "url('../assets/images/HomestayDetail/GreenDog.png')"
    },
    {
      id: 10,
      title: "Staff Pick: Top 5 Dòng Thức Ăn Hạt Cho Mèo Nhạy Cảm",
      excerpt: "Tổng hợp các dòng hạt được team thử nghiệm, phù hợp mèo nhạy cảm tiêu hóa...",
      category: "staff-pick",
      author: "Pawfect Staff",
      date: "1 ngày trước",
      likes: 64,
      comments: 12,
      views: 510,
      image: "url('../assets/images/HomestayDetail/Food1.png')"
    },
    {
      id: 11,
      title: "Chia Sẻ: Lịch Grooming Mùa Hè Cho Chó Akita",
      excerpt: "Kinh nghiệm cá nhân giữ lông mượt và mát cho Akita vào mùa nóng...",
      category: "from-community",
      author: "Quang Tran",
      date: "6 ngày trước",
      likes: 17,
      comments: 5,
      views: 150,
      image: "url('../assets/images/HomestayDetail/CuttingFur.png')"
    },
    {
      id: 12,
      title: "Staff Pick: 3 Mẹo Giảm Stress Khi Tắm Cho Mèo",
      excerpt: "Team gợi ý 3 mẹo nhỏ giúp mèo ít căng thẳng khi tắm lần đầu...",
      category: "staff-pick",
      author: "Pawfect Staff",
      date: "Hôm qua",
      likes: 71,
      comments: 19,
      views: 620,
      image: "url('../assets/images/HomestayDetail/ShowerDog.png')"
    },
    // Campaign samples
    {
      id: 101,
      type: 'campaign',
      title: "Adopt Don't Shop — Tháng Yêu Thương Thú Cưng",
      excerpt: "Tham gia chiến dịch nhận nuôi thú cưng cùng Pawfect. Ưu đãi tiêm phòng, tắm/grooming cho thú đã nhận nuôi.",
      category: 'campaign',
      author: 'Pawfect Team',
      date: 'Mar 10–20',
      likes: 320,
      comments: 58,
      views: 2100,
      banner: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 102,
      type: 'campaign',
      title: 'PawRun 5K — Chạy Bộ Cùng Boss',
      excerpt: 'Sự kiện chạy bộ gây quỹ với phần thưởng cho các cặp chủ–pet nhanh nhất.',
      category: 'event',
      author: 'Pawfect Team',
      date: 'Apr 6',
      likes: 145,
      comments: 22,
      views: 980,
      banner: 'https://images.unsplash.com/photo-1558944351-c6ae87f1d417?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 103,
      type: 'campaign',
      title: 'Workshop: Chăm Sóc Da & Lông Cho Chó Mùa Hè',
      excerpt: 'Buổi hướng dẫn thực hành cùng chuyên gia grooming của Pawfect.',
      category: 'workshop',
      author: 'Pawfect Academy',
      date: 'May 18',
      likes: 52,
      comments: 8,
      views: 340,
      banner: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 104,
      type: 'campaign',
      title: 'Charity Bake Sale for Stray Cats',
      excerpt: 'Gây quỹ thức ăn cho mèo hoang với gian hàng bánh homemade.',
      category: 'event',
      author: 'Pawfect Community',
      date: 'Jun 2',
      likes: 80,
      comments: 14,
      views: 430,
      banner: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const categoryLabels = {
    all: "Tất cả",
    tips: "Tips & Tricks",
    health: "Sức khỏe",
    grooming: "Chăm sóc",
    training: "Huấn luyện",
    food: "Thức ăn",
    campaign: "Campaign",
    "from-community": "From community",
    "staff-pick": "Staff Pick"
  };

  let currentFilter = 'all';
  let currentSearch = '';
  let displayedPosts = 6;
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

    // Toolbar: search + category buttons (+ sort nếu có)
    setupSearchBox();
    setupCategoryButtons();
    setupSorter(); // nếu không có #sort-select thì tự bỏ qua

    // Blog/Campaign/Modal
    setupBlogTabsFilter();      // nếu bạn có .blog-tabs (giữ tương thích)
    setupCampaignTabsFilter();  // nếu bạn có .campaign-tabs (giữ tương thích)
    setupLoadMore();
    setupCreatePost();
    setupBlogCardClick();

    // Staff strip
    setupStaffToggle();         // giữ nguyên API cũ + gọi center
    bindStaffStripCentering();  // đảm bảo center khi scroll/resize

    // Render
    renderCarousel();
    renderPosts();
    renderLatestStories();
  }

  /** ===================== TOOLBAR (SEARCH + CATEGORY + SORT) ===================== **/
  function setupSearchBox() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      displayedPosts = 6;
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
        displayedPosts = 6;
        renderPosts();
      });
    });
  }

  function setupSorter() {
    // tuỳ chọn: nếu bạn có <select id="sort-select"> trong toolbar
    const sel = document.getElementById('sort-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      currentSort = sel.value;
      displayedPosts = 6;
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

  /** ===================== BLOG FILTERS (tabs cũ nếu có) ===================== **/
  function setupBlogTabsFilter() {
    const tabs = document.querySelectorAll('.blog-tabs .tab');
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.category || 'all';
        displayedPosts = 6;
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

  /** ===================== BLOG RENDER & LOAD MORE ===================== **/
  function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    loadMoreBtn.addEventListener('click', () => {
      displayedPosts += 6;
      renderPosts();
    });
  }

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

    // sort tuỳ chọn (nếu có sorter)
    if (currentSort === 'views') filtered = filtered.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (currentSort === 'likes') filtered = filtered.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0));
    else if (currentSort === 'comments') filtered = filtered.slice().sort((a, b) => (b.comments || 0) - (a.comments || 0));
    // 'newest' -> giữ nguyên thứ tự mẫu

    return filtered;
  }

  function renderPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    if (currentFilter === 'campaign') {
      const campaigns = blogPosts.filter(p => p.type === 'campaign');
      grid.innerHTML = campaigns.map(createCampaignCard).join('');
      const loadMoreBtn = document.getElementById('load-more');
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    const filteredPosts = getFilteredPosts();
    const postsToDisplay = filteredPosts.slice(0, displayedPosts);

    grid.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');

    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = displayedPosts >= filteredPosts.length ? 'none' : 'block';
    }

    if (postsToDisplay.length === 0) {
      grid.innerHTML = `
        <div class="no-posts" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 18px; color: var(--text-3)">Không tìm thấy bài viết nào</p>
        </div>
      `;
    }
  }

  function createPostCard(post) {
    const categoryLabel = categoryLabels[post.category] || post.category || 'Post';
    const authorInitial = (post.author || 'U').charAt(0);
    return `
      <article class="blog-card">
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

  /** ===================== BLOG DETAIL ===================== **/
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

      const grid = document.getElementById('blog-grid');
      const cards = Array.from(grid.querySelectorAll('.blog-card'));
      const cardIndex = cards.indexOf(card);

      let posts = blogPosts.filter(p => p.type !== 'campaign');
      if (currentFilter !== 'all' && currentFilter !== 'campaign') {
        posts = posts.filter(p => p.category === currentFilter);
      }
      // apply same search & sort to map index đúng
      if (currentSearch) {
        const q = currentSearch;
        posts = posts.filter(p =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.author || '').toLowerCase().includes(q)
        );
      }
      if (currentSort === 'views') posts = posts.slice().sort((a,b)=> (b.views||0)-(a.views||0));
      else if (currentSort === 'likes') posts = posts.slice().sort((a,b)=> (b.likes||0)-(a.likes||0));
      else if (currentSort === 'comments') posts = posts.slice().sort((a,b)=> (b.comments||0)-(a.comments||0));

      const post = posts[cardIndex];
      if (!post) return;

      // Điều hướng tới trang chi tiết (mock)
      window.location.href = `blog-detail.html?id=${post.id}`;
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
            ${fullContent.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
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
    const dateParts = dateStr.match(/([A-Za-z]+)\s+([\d–\-]+)/);
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
  // Giữ API cũ + thêm center khi click
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
      const btn = card.querySelector('.staff-hover');
      const details = card.querySelector('.staff-details');

      const toggle = () => {
        if (btn && details) {
          const willOpen = !card.classList.contains('open');
          closeOthers(willOpen ? card : null);
          card.classList.toggle('open');
          details.hidden = !willOpen;
          btn.setAttribute('aria-expanded', String(willOpen));
        }
        // luôn center
        scrollCardToCenter(grid, card);
      };

      card.addEventListener('click', toggle);

      // keyboard
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // Bind tracking center theo scroll/resize + click để center tuyệt đối
  function bindStaffStripCentering() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.staff-card'));
    if (!cards.length) return;

    const doSetCenter = () => setCenterByScroll(grid, cards);
    doSetCenter();
    grid.addEventListener('scroll', () => requestAnimationFrame(doSetCenter));
    window.addEventListener('resize', doSetCenter);

    // đảm bảo click/keyboard → center (backup cho setupStaffToggle)
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

  // Helper: set .is-center cho card có tâm gần giữa viewport nhất
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

  // Helper: cuộn để card đứng giữa tuyệt đối (clamp biên)
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
      displayedPosts = Math.max(6, displayedPosts);
      renderPosts();
      closeCreateModal();
    });
  }

  /** ===================== DOM READY ===================== **/
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

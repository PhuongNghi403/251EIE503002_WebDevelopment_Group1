(function() {
  'use strict';

  // Mock blog posts data
  // Posts can be type: 'user' or 'campaign'
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

  // Category labels
  const categoryLabels = {
    all: "Tất cả",
    tips: "Tips & Tricks",
    health: "Sức khỏe",
    grooming: "Chăm sóc",
    training: "Huấn luyện",
    food: "Thức ăn",
    campaign: "Campaign"
  };

  let currentFilter = 'all';
  let currentSearch = '';
  let displayedPosts = 6;

  // Initialize
  function initCommunity() {
    if (document.body.dataset.page !== 'community') return;

    // Set active nav link
    document.querySelectorAll('.nav .nav-link').forEach((link) => {
      if (link.textContent.trim().toLowerCase() === 'community') {
        link.classList.add('active');
      }
    });

    // Setup event listeners
    setupSearch();
    setupBlogTabsFilter();
    setupCampaignTabsFilter();
    setupLoadMore();
    setupCreatePost();
    setupStaffToggle();
    setupBlogCardClick();

    // Render initial posts
    renderCarousel();
    renderPosts();
    renderLatestStories();

    // After initial render, compute center item in viewport
    highlightCenterStaff();
    const grid = document.querySelector('.staff-grid');
    if (grid) {
      grid.addEventListener('scroll', throttle(highlightCenterStaff, 80));
      window.addEventListener('resize', highlightCenterStaff);
    }
  }

  // Render latest stories
  function renderLatestStories() {
    const storiesContainer = document.getElementById('latest-stories');
    if (!storiesContainer) return;

    const latestPosts = blogPosts.slice(0, 4); // Show first 4 posts
    
    storiesContainer.innerHTML = latestPosts.map(post => createStoryCard(post)).join('');
  }

  // Create story card HTML (horizontal)
  function createStoryCard(post) {
    const categoryLabel = categoryLabels[post.category] || post.category;

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

  // Setup search functionality
  function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase();
      displayedPosts = 6; // Reset to initial
      renderPosts();
    });
  }

  // Setup category filter
  // New Blog Tabs filter
  function setupBlogTabsFilter() {
    const tabs = document.querySelectorAll('.blog-tabs .tab');
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.category;
        displayedPosts = 6;
        renderPosts();
      });
    });
  }

  // Campaign tabs filter (strip)
  function setupCampaignTabsFilter() {
    const tabs = document.querySelectorAll('.campaign-tabs .tab');
    const strip = document.getElementById('campaigns-strip');
    if (!tabs.length || !strip) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const kind = tab.dataset.camp; // all | campaign | event | workshop
        const items = blogPosts.filter(p => p.type === 'campaign' && (kind === 'all' ? true : p.category === kind));
        strip.innerHTML = items.map(createCampaignStripItem).join('');
      });
    });
  }

  // Setup load more button
  function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
      displayedPosts += 6;
      renderPosts();
    });
  }

  // Setup create post button
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

    // Open on any "create" button click
    createBtns.forEach(btn => btn.addEventListener('click', openCreateModal));

    // Close actions
    closeBtn && closeBtn.addEventListener('click', closeCreateModal);
    modal && modal.addEventListener('click', (e) => {
      if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
        closeCreateModal();
      }
    });

    // Submit form to create a new post (mock local add)
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
      displayedPosts = Math.max(6, displayedPosts); // keep at least one page
      renderPosts();
      closeCreateModal();
    });
  }

  // Filter posts based on current filter and search
  function getFilteredPosts() {
    // Separate user posts vs campaign
    let filtered = blogPosts.filter(p => p.type !== 'campaign');

    // Category filter for user posts
    if (currentFilter !== 'all' && currentFilter !== 'campaign') {
      filtered = filtered.filter(post => post.category === currentFilter);
    }

    // Search filter
    if (currentSearch) {
      filtered = filtered.filter(post =>
        (post.title || '').toLowerCase().includes(currentSearch) ||
        (post.excerpt || '').toLowerCase().includes(currentSearch) ||
        (post.author || '').toLowerCase().includes(currentSearch)
      );
    }

    return filtered;
  }

  // Render blog posts
  function renderPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    if (currentFilter === 'campaign') {
      // Render campaigns as cards in the grid
      const campaigns = blogPosts.filter(p => p.type === 'campaign');
      grid.innerHTML = campaigns.map(createCampaignCard).join('');
      const loadMoreBtn = document.getElementById('load-more');
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    const filteredPosts = getFilteredPosts();
    const postsToDisplay = filteredPosts.slice(0, displayedPosts);

    grid.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');

    // Toggle load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = displayedPosts >= filteredPosts.length ? 'none' : 'block';
    }

    // Show message if no posts found
    if (postsToDisplay.length === 0) {
      grid.innerHTML = `
        <div class="no-posts" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: luck-out">
          <p style="font-size: 18px; color: var(--text-3)">Không tìm thấy bài viết nào</p>
        </div>
      `;
    }
  }

  // Carousel for campaigns & events
  let currentSlide = 0;
  
  function renderCarousel() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!slidesContainer || !dotsContainer) return;

    const campaigns = blogPosts.filter(p => p.type === 'campaign');
    
    // Render slides
    slidesContainer.innerHTML = campaigns.map((item, idx) => createCarouselSlide(item, idx)).join('');
    
    // Render dots
    dotsContainer.innerHTML = campaigns.map((_, idx) => 
      `<button class="carousel-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" aria-label="Go to slide ${idx + 1}"></button>`
    ).join('');

    // Setup navigation
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

    if (prevBtn) {
      prevBtn.onclick = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarouselPosition();
        updateDots();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarouselPosition();
        updateDots();
      };
    }

    dots.forEach(dot => {
      dot.onclick = () => {
        currentSlide = parseInt(dot.dataset.slide);
        updateCarouselPosition();
        updateDots();
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
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  // Blog detail modal
  function setupBlogCardClick() {
    const modal = document.getElementById('blog-detail-modal');
    const closeBtn = document.getElementById('close-blog-detail');
    const backdrop = modal ? modal.querySelector('.modal-backdrop') : null;

    if (!modal) return;

    // Close modal
    const closeBlogDetail = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeBtn && closeBtn.addEventListener('click', closeBlogDetail);
    backdrop && backdrop.addEventListener('click', closeBlogDetail);

    // Keyboard close (Escape)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeBlogDetail();
      }
    });

    // Click on blog cards to navigate to detail page
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.blog-card');
      if (!card) return;

      // Find the post data
      const grid = document.getElementById('blog-grid');
      const cards = Array.from(grid.querySelectorAll('.blog-card'));
      const cardIndex = cards.indexOf(card);

      // Get filtered posts
      let posts = blogPosts.filter(p => p.type !== 'campaign');
      if (currentFilter !== 'all' && currentFilter !== 'campaign') {
        posts = posts.filter(p => p.category === currentFilter);
      }

      const post = posts[cardIndex];
      if (!post) return;

      // Navigate to blog detail page
      window.location.href = `blog-detail.html?id=${post.id}`;
    });
  }

  function renderBlogDetail(post) {
    const contentDiv = document.getElementById('blog-detail-content');
    if (!contentDiv) return;

    const categoryLabel = categoryLabels[post.category] || post.category;
    const authorInitial = post.author.charAt(0);

    // Generate full content (mock - in real app, fetch from server)
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
            <div class="stat-item">
              <span class="stat-label">Lượt xem</span>
              <span class="stat-value">${post.views}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Lượt thích</span>
              <span class="stat-value">${post.likes}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Bình luận</span>
              <span class="stat-value">${post.comments}</span>
            </div>
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

  function createCampaignStripItem(item) {
    // Parse date: "Apr 6" -> "06 APR", "Mar 10–20" -> "10–20 MAR"
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

  // Create post card HTML
  function createPostCard(post) {
    const categoryLabel = categoryLabels[post.category] || post.category;
    const authorInitial = post.author.charAt(0);

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
            <div class="blog-stat">
              <img src="../assets/icons/Login/star_icon.svg" alt="Views" />
              <span>${post.views}</span>
            </div>
            <div class="blog-stat">
              <img src="../assets/icons/Login/Group useramount_icon.svg" alt="Likes" />
              <span>${post.likes}</span>
            </div>
            <div class="blog-stat">
              <img src="../assets/icons/HomestayDetail/profile_icon.svg" alt="Comments" />
              <span>${post.comments}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Toggle staff details
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

    cards.forEach((card, index) => {
      const btn = card.querySelector('.staff-hover');
      const details = card.querySelector('.staff-details');
      if (!btn || !details) return;

      const toggle = () => {
        const willOpen = !card.classList.contains('open');
        closeOthers(willOpen ? card : null);
        card.classList.toggle('open');
        details.hidden = !willOpen;
        btn.setAttribute('aria-expanded', String(willOpen));
      };

      btn.addEventListener('click', toggle);
      
      // Click/hover: if not center, scroll it to center; if center, perform flip
      const onInteract = () => {
        const grid = document.querySelector('.staff-grid');
        if (!grid) return;
        if (!card.classList.contains('is-center')) {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          // re-apply class to trigger flip CSS
          card.classList.remove('is-center');
          requestAnimationFrame(() => card.classList.add('is-center'));
        }
      };
      card.addEventListener('mouseenter', onInteract);
      card.addEventListener('click', onInteract);
    });
  }

  function throttle(fn, wait) {
    let t = 0;
    return function() {
      const now = Date.now();
      if (now - t > wait) {
        t = now;
        fn();
      }
    };
  }

  function highlightCenterStaff() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.staff-card'));
    if (!cards.length) return;

    const rect = grid.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestCard = null;
    let bestDist = Infinity;

    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(centerX - cardCenter);
      if (dist < bestDist) { bestDist = dist; bestCard = card; }
    });

    cards.forEach(c => {
      c.classList.remove('is-center', 'side');
      if (bestCard) {
        const idx = cards.indexOf(bestCard);
        const cidx = cards.indexOf(c);
        if (c === bestCard) c.classList.add('is-center');
        else if (cidx === idx - 1 || cidx === idx + 1) c.classList.add('side');
      }
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initCommunity);

})();



(function() {
  'use strict';

  // Mock blog posts data
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
    }
  ];

  // Category labels
  const categoryLabels = {
    all: "Tất cả",
    tips: "Tips & Tricks",
    health: "Sức khỏe",
    grooming: "Chăm sóc",
    training: "Huấn luyện",
    food: "Thức ăn"
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
    setupCategoryFilter();
    setupLoadMore();
    setupCreatePost();

    // Render initial posts
    renderPosts();
    renderLatestStories();
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
  function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter
        currentFilter = btn.dataset.category;
        displayedPosts = 6; // Reset to initial
        renderPosts();
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
    let filtered = blogPosts;

    // Apply category filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(post => post.category === currentFilter);
    }

    // Apply search filter
    if (currentSearch) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(currentSearch) ||
        post.excerpt.toLowerCase().includes(currentSearch) ||
        post.author.toLowerCase().includes(currentSearch)
      );
    }

    return filtered;
  }

  // Render blog posts
  function renderPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

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

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initCommunity);

})();
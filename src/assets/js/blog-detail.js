(function() {
  'use strict';

  // Get blog post ID from URL
  function getBlogIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  // Mock blog posts data (same as community.js)
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
      image: "url('../assets/images/HomestayDetail/StandingWhiteDog.svg')",
      content: `
        <p>Huấn luyện chó là một quá trình quan trọng giúp chó cưng của bạn trở nên ngoan ngoãn, an toàn và hạnh phúc. Dưới đây là 5 mẹo cơ bản mà bất kỳ người nuôi chó mới nào cũng nên biết.</p>

        <h2>1. Bắt đầu từ sớm</h2>
        <p>Càng sớm bạn bắt đầu huấn luyện chó, càng dễ dàng để hình thành những thói quen tốt. Chó con thường dễ học hơn chó trưởng thành, vì vậy hãy bắt đầu ngay khi chó của bạn còn nhỏ.</p>

        <h2>2. Sử dụng phương pháp tích cực</h2>
        <p>Phương pháp tích cực, như thưởng khi chó làm đúng, hiệu quả hơn nhiều so với phạt. Hãy chuẩn bị những phần thưởng nhỏ (bánh thưởng, lời khen) để tạo động lực cho chó.</p>

        <h2>3. Kiên nhẫn và nhất quán</h2>
        <p>Huấn luyện chó đòi hỏi kiên nhẫn và sự nhất quán. Hãy lặp lại các lệnh cơ bản hàng ngày và đảm bảo tất cả các thành viên trong gia đình sử dụng cùng một phương pháp.</p>

        <h2>4. Giữ các buổi huấn luyện ngắn</h2>
        <p>Chó có thời gian tập trung hạn chế, vì vậy hãy giữ các buổi huấn luyện khoảng 5-10 phút. Nhiều buổi ngắn hiệu quả hơn một buổi dài.</p>

        <h2>5. Tìm kiếm sự giúp đỡ chuyên nghiệp</h2>
        <p>Nếu bạn gặp khó khăn, đừng ngần ngại tìm kiếm sự giúp đỡ từ một huấn luyện viên chó chuyên nghiệp. Họ có thể cung cấp hướng dẫn cá nhân h��a cho chó của bạn.</p>

        <p>Nhớ rằng, mỗi chó là duy nhất và có thể cần thời gian khác nhau để học. Hãy kiên nhẫn, tích cực và yêu thương chó cưng của bạn trong quá trình huấn luyện.</p>
      `
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
      image: "url('../assets/images/HomestayDetail/StandingCatHome.png')",
      content: `
        <p>Dinh dưỡng là yếu tố quan trọng nhất để giữ cho mèo của bạn khỏe mạnh và hạnh phúc. Tuy nhiên, nhu cầu dinh dưỡng của mèo thay đổi theo độ tuổi.</p>

        <h2>Mèo con (0-1 tuổi)</h2>
        <p>Mèo con cần nhiều protein và calo để hỗ trợ sự phát triển nhanh chóng. Hãy chọn thức ăn được ghi nhãn "cho mèo con" và cho ăn 3-4 lần mỗi ngày.</p>

        <h2>Mèo trưởng thành (1-7 tuổi)</h2>
        <p>Mèo trưởng thành cần một ch��� độ cân bằng với protein, chất béo và các chất dinh dưỡng thiết yếu khác. Cho ăn 1-2 lần mỗi ngày là đủ.</p>

        <h2>Mèo già (7+ tuổi)</h2>
        <p>Mèo già có nhu cầu calo thấp hơn nhưng cần nhiều protein để duy trì khối lượng cơ. Hãy chọn thức ăn được ghi nhãn "cho mèo già" và theo dõi cân nặng của chúng.</p>

        <p>Luôn tham khảo ý kiến bác sĩ thú y để chọn thức ăn tốt nhất cho mèo của bạn.</p>
      `
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
      image: "url('../assets/images/HomestayDetail/BlueCat.png')",
      content: `
        <p>Sức khỏe của thú cưng là ưu tiên hàng đầu của mỗi chủ nhân. Dưới đây là những dấu hiệu cảnh báo mà bạn nên chú ý.</p>

        <h2>Thay đổi trong ăn uống</h2>
        <p>Nếu thú cưng của bạn đột ngột ăn ít hơn hoặc uống nhiều nước hơn bình thường, đó có thể là dấu hiệu của bệnh tật.</p>

        <h2>Thay đổi trong hành vi</h2>
        <p>Sự thay đổi đột ngột trong hành vi, như trở nên lười biếng hoặc hung hăng, cũng cần được chú ý.</p>

        <h2>Vấn đề về da và lông</h2>
        <p>Rụng lông quá mức, ngứa, hoặc các vết loét trên da có thể chỉ ra các vấn đề sức khỏe.</p>

        <h2>Vấn đề tiêu hóa</h2>
        <p>Tiêu chảy, táo bón, hoặc nôn liên tục là những dấu hiệu cần được kiểm tra bởi bác sĩ thú y.</p>

        <p>Nếu bạn nhận thấy bất kỳ dấu hiệu nào trong số này, hãy liên hệ với bác sĩ thú y của bạn ngay lập tức.</p>
      `
    }
  ];

  const categoryLabels = {
    training: "Huấn luyện",
    food: "Thức ăn",
    health: "Sức khỏe",
    grooming: "Chăm sóc",
    tips: "Tips & Tricks"
  };

  function initBlogDetail() {
    const blogId = parseInt(getBlogIdFromUrl());
    if (!blogId) {
      window.location.href = 'community.html';
      return;
    }

    const post = blogPosts.find(p => p.id === blogId);
    if (!post) {
      window.location.href = 'community.html';
      return;
    }

    renderBlogDetail(post);
    renderRelatedPosts(post);
    renderTags(post);
  }

  function renderBlogDetail(post) {
    const authorInitial = post.author.charAt(0);
    const categoryLabel = categoryLabels[post.category] || post.category;

    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = post.title;

    // Update hero image
    const heroEl = document.getElementById('blog-hero');
    if (post.image) {
      heroEl.style.backgroundImage = post.image;
    }

    // Update title
    document.getElementById('blog-title').textContent = post.title;

    // Update author info
    document.getElementById('blog-author-avatar').textContent = authorInitial;
    document.getElementById('blog-author-name').textContent = post.author;
    document.getElementById('blog-author-date').textContent = post.date;

    // Update category
    document.getElementById('blog-category').textContent = categoryLabel;

    // Update content
    document.getElementById('blog-content').innerHTML = post.content || post.excerpt;

    // Update stats
    document.getElementById('blog-views').textContent = post.views;
    document.getElementById('blog-likes').textContent = post.likes;
    document.getElementById('blog-comments').textContent = post.comments;

    // Update page title
    document.title = `${post.title} — Pawfect Care`;
  }

  function renderRelatedPosts(currentPost) {
    const relatedPostsEl = document.getElementById('related-posts');
    const related = blogPosts
      .filter(p => p.id !== currentPost.id && p.category === currentPost.category)
      .slice(0, 3);

    relatedPostsEl.innerHTML = related.map(post => `
      <div class="related-post-item" onclick="window.location.href='blog-detail.html?id=${post.id}'">
        <h4 class="related-post-title">${post.title}</h4>
        <p class="related-post-date">${post.date}</p>
      </div>
    `).join('');
  }

  function renderTags(post) {
    const tagsEl = document.getElementById('sidebar-tags');
    const tags = [
      post.category,
      'Pawfect Care',
      'Pet Care',
      'Community'
    ];

    tagsEl.innerHTML = tags.map(tag => `
      <span class="tag">${tag}</span>
    `).join('');
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initBlogDetail);

})();

(function () {
  'use strict';

  /** ===== DỮ LIỆU GIẢ LẬP ===== */
  const POST_DETAIL = {
    id: 1,
    title: "5 Tips Huấn Luyện Chó Cơ Bản Cho Người Mới Bắt Đầu",
    excerpt: "Huấn luyện chó không khó như bạn nghĩ. Hãy cùng khám phá 5 mẹo đơn giản giúp chó cưng của bạn biết nghe lời và ngoan ngoãn hơn...",
    content: `
      <h2>Giới thiệu</h2>
      <p>Huấn luyện chó là một phần quan trọng trong việc nuôi dưỡng thú cưng. Dưới đây là 5 tips cơ bản cho người mới bắt đầu:</p>
      <ol>
        <li><strong>Sử dụng phần thưởng tích cực:</strong> Thưởng cho chó khi chúng làm đúng để khuyến khích hành vi tốt.</li>
        <li><strong>Luyện tập ngắn gọn:</strong> Giữ phiên luyện tập dưới 10 phút để chó không mệt mỏi.</li>
        <li><strong>Sử dụng lệnh rõ ràng:</strong> Dùng từ đơn giản như "Ngồi" hoặc "Nằm" và lặp lại nhất quán.</li>
        <li><strong>Kiên nhẫn và kiên trì:</strong> Đừng nản lòng nếu chó không học ngay lập tức.</li>
        <li><strong>Tìm sự giúp đỡ chuyên nghiệp:</strong> Nếu cần, tham khảo huấn luyện viên chuyên nghiệp.</li>
      </ol>
      <p>Hãy áp dụng những tips này và bạn sẽ thấy sự tiến bộ rõ rệt!</p>
    `,
    category: "training",
    author: "Minh Nguyen",
    date: "2 ngày trước",
    likes: 45,
    comments: 12,
    views: 230,
    image: "../assets/images/HomestayDetail/StandingWhiteDog.svg",
    tags: ["huấn luyện chó", "thú cưng", "tips"],
    related: [
      { title: "Cách chọn thức ăn cho chó", id: 2 },
      { title: "Dấu hiệu chó bị bệnh", id: 3 }
    ],
    topPosts: [
      { title: "Ancena mattis tortor ac sapien congue molestie.", idx: 1 },
      { title: "Vestibulum ante ipsum primis in faucibus orci.", idx: 2 },
      { title: "Sapien atám odio posuere vitae bibendum vitae.", idx: 3 },
      { title: "Etiam eu odio in sapien posuere vitae bibendum.", idx: 4 },
      { title: "Morbi eget leo a tellus gravida sagittis nec.", idx: 5 }
    ]
  };

  let COMMENTS = [
    { id: 1, author: "User1", avatar: "U1", text: "Bài viết rất hữu ích! Cảm ơn bạn.", date: "1 ngày trước" },
    { id: 2, author: "User2", avatar: "U2", text: "Tôi đã thử tip 1 và chó nhà mình tiến bộ nhanh chóng.", date: "2 ngày trước" },
    { id: 3, author: "User3", avatar: "U3", text: "Có thể chia sẻ thêm về lệnh 'Ngồi' không?", date: "3 ngày trước" }
  ];

  /** ===== HÀM HỖ TRỢ ===== */
  function saveToStorage(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function getFromStorage(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }

  function showToast(message) {
    const toast = document.getElementById('pc-toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function renderPostDetail() {
    const post = POST_DETAIL;
    document.getElementById('pc-bc-title').textContent = post.title; // Breadcrumb
    document.getElementById('pc-hero-media').style.backgroundImage = `url(${post.image})`;
    document.getElementById('pc-chip').textContent = post.category;
    document.getElementById('pc-title').textContent = post.title;
    document.getElementById('pc-author-avatar').textContent = post.author.charAt(0).toUpperCase();
    document.getElementById('pc-author').textContent = post.author;
    document.getElementById('pc-date').textContent = post.date;
    document.getElementById('pc-views').textContent = post.views;
    document.getElementById('pc-likes').textContent = post.likes;
    document.getElementById('pc-comments').textContent = post.comments;
    document.getElementById('pc-excerpt').textContent = post.excerpt;
    document.getElementById('pc-body').innerHTML = post.content;

    // Tags
    const tagsEl = document.getElementById('pc-tags');
    tagsEl.innerHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    // Related
    const relatedEl = document.getElementById('pc-related');
    relatedEl.innerHTML = post.related.map(rel => `<div class="rel__item">${rel.title}</div>`).join('');

    // Top posts (sidebar)
    const topEl = document.getElementById('pc-top');
    topEl.innerHTML = post.topPosts.map(tp => `<li><span class="idx">${tp.idx}</span><span>${tp.title}</span></li>`).join('');
  }

  function renderComments() {
    const clist = document.getElementById('pc-clist');
    clist.innerHTML = COMMENTS.map(comment => `
      <li class="citem">
        <div class="avatar">${comment.avatar}</div>
        <div>
          <div class="cmeta">
            <strong class="cauthor">${comment.author}</strong>
            <span>${comment.date}</span>
          </div>
          <div class="ctext">${comment.text}</div>
        </div>
      </li>
    `).join('');
    document.getElementById('pc-comments').textContent = COMMENTS.length;
  }

  function bindLikeButton() {
    const likeBtn = document.getElementById('pc-like');
    const likesEl = document.getElementById('pc-likes');
    const postId = POST_DETAIL.id;
    let likedPosts = getFromStorage('liked_posts');
    const isLiked = likedPosts.includes(postId);
    if (isLiked) {
      likeBtn.classList.add('is-liked');
      likeBtn.setAttribute('aria-pressed', 'true');
      likesEl.textContent = POST_DETAIL.likes + 1;
    }

    likeBtn.addEventListener('click', () => {
      const currentlyLiked = likeBtn.classList.contains('is-liked');
      if (currentlyLiked) {
        likedPosts = likedPosts.filter(id => id !== postId);
        likeBtn.classList.remove('is-liked');
        likeBtn.setAttribute('aria-pressed', 'false');
        likesEl.textContent = POST_DETAIL.likes;
        showToast('Đã bỏ thích bài viết.');
      } else {
        likedPosts.push(postId);
        likeBtn.classList.add('is-liked');
        likeBtn.setAttribute('aria-pressed', 'true');
        likesEl.textContent = POST_DETAIL.likes + 1;
        showToast('Đã thích bài viết!');
      }
      saveToStorage('liked_posts', likedPosts);
    });
  }

  function bindCommentForm() {
    const input = document.getElementById('pc-cinput');
    const submitBtn = document.getElementById('pc-csubmit');
    const cancelBtn = document.getElementById('pc-ccancel');

    submitBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (text) {
        const newComment = {
          id: Date.now(),
          author: 'Bạn',
          avatar: 'B',
          text,
          date: 'Vừa xong'
        };
        COMMENTS.push(newComment);
        input.value = '';
        renderComments();
        showToast('Bình luận đã được đăng!');
      } else {
        showToast('Vui lòng nhập bình luận.');
      }
    });

    cancelBtn.addEventListener('click', () => {
      input.value = '';
    });
  }

  function bindOtherActions() {
    // Jump to comment
    document.getElementById('pc-jump-comment').addEventListener('click', () => {
      document.querySelector('.bd-comments').scrollIntoView({ behavior: 'smooth' });
    });

    // Share
    document.getElementById('pc-share').addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Đã sao chép liên kết!');
      }).catch(() => {
        showToast('Không thể sao chép liên kết.');
      });
    });
  }

  /** ===== KHỞI TẠO ===== */
  document.addEventListener('DOMContentLoaded', () => {
    renderPostDetail();
    renderComments();
    bindLikeButton();
    bindCommentForm();
    bindOtherActions();
  });

})();

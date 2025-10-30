// blog-detail.js — Pawfect Blog Detail 
(function () {
  'use strict';

  /** ========= DATA ========= **/
 // Lấy từ community.js
const POSTS = (() => {
  const src = (window.blogPosts || []).map(p => {
    let img = p.image || p.banner || "";
    if (typeof img === "string" && /^url\(/.test(img)) {
      img = img.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    }
    return {
      id: Number(p.id),
      title: p.title || "Blog Title",
      excerpt: p.excerpt || "",
      category: (p.category || "blog").toLowerCase(),
      author: p.author || "Pawfect Team",
      date: p.date || "",
      likes: Number(p.likes || 0),
      comments: Number(p.comments || 0),
      views: Number(p.views || 0),
      image: img
    };
  });
  return src.length ? src : [{
    id: 999,
    title: "Welcome to Pawfect Care Blog",
    excerpt: "Tips, grooming, training, and more — made for loving pet parents.",
    category: "Tips",
    author: "Pawfect Team",
    date: "today",
    likes: 0, comments: 0, views: 1,
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop"
  }];
})();

  const CATEGORY_LABEL = {
    All: "All",
    Tips: "Pet Care Tips",
    Health: "Health & Nutrition",
    Training: "Training & Behavior",
    Stories: "Stories & Community",
    Rescue: "Adoption & Rescue",
    Reviews: "Products & Reviews",

  };
  
  /** ========= UTILS ========= **/
  const qs = (s, r=document)=>r.querySelector(s);
  const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const getParam = (k)=> new URLSearchParams(location.search).get(k);
  const esc = (s)=> (s||"").replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const keyLikes    = id => `pc_like_${id}`;
  const keyLiked    = id => `pc_liked_${id}`;
  const keyComments = id => `pc_comments_${id}`;
  const keyViews    = id => `pc_views_${id}`;
  const fmt = n => (n||0).toLocaleString('vi-VN');

  function copyToClipboard(text){
    if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return Promise.resolve();
  }

  function normalizeImage(src){
    if(/^url\(/.test(src||'')) return src.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    return src;
  }

  /** ========= BODY MẪU ========= **/
  function buildBody(post) {
  const tipsByCat = {
    Training: [
      "Start with simple commands and reward immediately when your pet gets it right.",
      "Keep training sessions short (5–10 minutes) to avoid boredom.",
      "Stay consistent — everyone in the house should use the same rules and cues.",
      "Combine playtime with training to build trust and confidence.",
      "End each session on a positive note to keep your pup motivated."
    ],
    Health: [
      "Transition to new food gradually over 7 days to protect digestion.",
      "Check ingredient labels — clear protein sources are always better.",
      "Add omega-3 rich treats for coat and skin health.",
      "Keep clean water available at all times.",
      "Avoid feeding human snacks that contain salt or sugar."
    ],
    Tips: [
      "Watch for changes in appetite, energy, or bathroom habits — early signs of stress or illness.",
      "Schedule vet check-ups every 6–12 months for routine care.",
      "Brush teeth regularly to prevent dental issues.",
      "Keep your vaccination and parasite prevention schedule updated.",
      "Create a calm, quiet space for recovery if your pet feels unwell."
    ],
    Stories: [
      "Trim nails safely — avoid cutting too close to the quick.",
      "Brush before bathing to detangle and reduce shedding.",
      "Use lukewarm water and gentle, pet-safe shampoo.",
      "Reward with a treat after grooming to make it a positive experience.",
      "Schedule professional grooming every 4–6 weeks for long-haired breeds."
    ],
    Rescue: [
      "Respect your pet’s body language — they tell you what feels safe.",
      "Give them personal space and gentle touch when introducing new experiences.",
      "Create a steady routine for meals, play, and bedtime.",
      "Rotate toys regularly to keep things exciting.",
      "Bond with your pet through shared quiet time — not just playtime."
    ],
    
    Reviews: [
      "Join Pawfect Care’s monthly campaign to promote adoption and responsible pet care.",
      "Enjoy free grooming for adopted pets this month.",
      "Every adoption helps give a second chance to a rescued friend.",
      "Follow our social channels for more heartwarming stories."
    ]
  }[post.category] || [
    "Be kind and patient — progress takes time.",
    "Celebrate small wins with extra cuddles and treats.",
    "Reach out to Pawfect Staff or your vet for personalized advice."
  ];

  return `
    <p>${post.excerpt}</p>
    <h2>Key Takeaways</h2>
    <ul>${tipsByCat.map(t => `<li>${t}</li>`).join('')}</ul>
    <p>Share your own experience in the comments below — the Pawfect community loves hearing from fellow pet lovers 🐾</p>
  `;
}


  function seedComments(post){
    const base = [
      {name:"Mai", text:"Wow! Amazing! Significant! Magneficent! World Class", time:"Just now"},
      {name:"Nghi", text:"Can you share more informations? My Zalo 0987654321", time:"1 hour ago"},
    ];
    if(post.category==='Training') base.push({name:"Phuc", text:"Bonus Tips: Use Clicker really boost up the process .", time:"Yesterday"});
    if(post.category==='Health') base.push({name:"Ha", text:"Cut off nail could help release stress for your pet.", time:"2 days ago"});
    return base;
  }

  function renderComment(c){
    return `
      <li class="citem">
        <div class="avatar">${esc(c.name?.charAt(0) || 'U')}</div>
        <div>
          <div class="cmeta"><strong>${esc(c.name||'User')}</strong><span>•</span><span>${esc(c.time||'Just now')}</span></div>
          <div class="ctext">${esc(c.text||'')}</div>
        </div>
      </li>
    `;
  }

  function renderRelated(current){
    const related = POSTS.filter(p=>p.id!==current.id && p.category===current.category).slice(0,4);
    return related.map(p=>`
      <div class="rel__item" data-id="${p.id}" role="button" tabindex="0">
        <div style="font-weight:700;margin-bottom:4px">${esc(p.title)}</div>
        <div style="font-size:13px;color:#6b5a4a">${esc(p.excerpt)}</div>
      </div>
    `).join('');
  }

  /** ========= MAIN RENDER ========= **/
  function render(post){
    // elements (khớp blog-detail.html)
    const hero     = qs('#pc-hero-media');
    const chip     = qs('#pc-chip');
    const title    = qs('#pc-title');
    const author   = qs('#pc-author');
    const authorAv = qs('#pc-author-avatar');
    const dateEl   = qs('#pc-date');
    const excerpt  = qs('#pc-excerpt');
    const body     = qs('#pc-body');
    const bcTitle  = qs('#pc-bc-title');

    const viewsEl  = qs('#pc-views');
    const likesEl  = qs('#pc-likes');
    const cmtsEl   = qs('#pc-comments');

    const likeBtn  = qs('#pc-like');
    const shareBtn = qs('#pc-share');
    const jumpBtn  = qs('#pc-jump-comment');
    const tagsWrap = qs('#pc-tags');
    const relWrap  = qs('#pc-related');

    const cForm    = qs('#pc-cform');
    const cInput   = qs('#pc-cinput');
    const cSubmit  = qs('#pc-csubmit');
    const cCancel  = qs('#pc-ccancel');
    const cList    = qs('#pc-clist');

    const toast    = qs('#pc-toast');

    // normalize image & stats from localStorage
    const imgSrc = normalizeImage(post.image);
    const catLabel = CATEGORY_LABEL[post.category] || post.category || 'Blog';

    let views = Number(localStorage.getItem(keyViews(post.id)) || post.views || 0) + 1;
    localStorage.setItem(keyViews(post.id), String(views));

    let baseLikes = Number(localStorage.getItem(keyLikes(post.id)) || post.likes || 0);
    let isLiked   = localStorage.getItem(keyLiked(post.id)) === '1';
    let likeCount = baseLikes + (isLiked ? 1 : 0);

    let savedComments = JSON.parse(localStorage.getItem(keyComments(post.id)) || 'null');
    if(!savedComments){
      savedComments = seedComments(post);
      localStorage.setItem(keyComments(post.id), JSON.stringify(savedComments));
    }

    // inject to DOM
    if(hero) hero.style.backgroundImage = `url("${imgSrc}")`;
    if(chip) chip.textContent = catLabel;
    if(title) title.textContent = post.title || 'Blog detail';
    if(author) author.textContent = post.author || 'Pawfect';
    if(authorAv) authorAv.textContent = (post.author||'U').charAt(0).toUpperCase();
    if(dateEl) dateEl.textContent = post.date || '';
    if(excerpt) excerpt.textContent = post.excerpt || '';
    if(body) body.innerHTML = buildBody(post);
    if(bcTitle) bcTitle.textContent = post.title || 'Blog Detail';

    if(viewsEl) viewsEl.textContent = fmt(views);
    if(likesEl) likesEl.textContent = fmt(likeCount);
    if(cmtsEl) cmtsEl.textContent = fmt(savedComments.length);
    if(tagsWrap){
      tagsWrap.innerHTML = `
        <span class="tag">#${(post.category||'blog').replace(/\s+/g,'-')}</span>
        <span class="tag">#pawfect</span>
        <span class="tag">#petcare</span>
      `;
    }
    if(relWrap) {
      relWrap.innerHTML = renderRelated(post);
      relWrap.addEventListener('click', (e)=>{
        const item = e.target.closest('.rel__item');
        if(!item) return;
        const id = item.getAttribute('data-id');
        if(id) location.href = `blog-detail.html?id=${id}`;
      });
      relWrap.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' || e.key===' ') {
          const item = e.target.closest('.rel__item');
          if(!item) return;
          const id = item.getAttribute('data-id');
          if(id) location.href = `blog-detail.html?id=${id}`;
        }
      });
    }

    // render comments
    if(cList){
      cList.innerHTML = savedComments.map(renderComment).join('');
    }

    // like
    if(likeBtn){
      likeBtn.classList.toggle('is-liked', isLiked);
      likeBtn.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
      likeBtn.addEventListener('click', () => {
        isLiked = !isLiked;
        likeBtn.classList.toggle('is-liked', isLiked);
        likeBtn.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
        likeCount = Number(localStorage.getItem(keyLikes(post.id)) || baseLikes);
        if(isLiked) likeCount += 1;
        else if(likeCount > 0) likeCount -= 1;
        localStorage.setItem(keyLiked(post.id), isLiked ? '1' : '0');
        localStorage.setItem(keyLikes(post.id), String(likeCount));
        if(likesEl) likesEl.textContent = fmt(likeCount);
      });
    }

    // share
    if(shareBtn){
      shareBtn.addEventListener('click', async () => {
        try {
          await copyToClipboard(location.href);
          if(toast){
            toast.textContent = 'Copied link to clipboard.';
            toast.classList.add('show');
            setTimeout(()=>toast.classList.remove('show'), 1200);
          } else {
            alert('Copied link to clipboard');
          }
        } catch (e) {
          alert('Copy failed. ');
        }
      });
    }

    // jump to comment
    if(jumpBtn && cForm){
      jumpBtn.addEventListener('click', () => {
        cForm.scrollIntoView({behavior:'smooth', block:'start'});
        cInput?.focus();
      });
    }

    // comment submit/cancel
    if(cForm){
      const submit = () => {
        const text = (cInput?.value || '').trim();
        if(!text) return;

        const name = 'You';
        const now = new Date();
        const time = now.toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'});

        const item = { name, text, time };
        const arr = JSON.parse(localStorage.getItem(keyComments(post.id)) || '[]');
        arr.unshift(item);
        localStorage.setItem(keyComments(post.id), JSON.stringify(arr));

        if(cList) cList.insertAdjacentHTML('afterbegin', renderComment(item));
        if(cmtsEl) cmtsEl.textContent = fmt(arr.length);
        if(cInput) cInput.value = '';
      };

      cForm.addEventListener('submit', (e)=>{ e.preventDefault(); submit(); });
      cSubmit?.addEventListener('click', submit);
      cCancel?.addEventListener('click', ()=> { if(cInput) cInput.value=''; });
    }
  }

  /** ========= INIT ========= **/
  document.addEventListener('DOMContentLoaded', () => {
    const id = Number(getParam('id'));
    const post = POSTS.find(p=>p.id===id) || POSTS[0];
    if(!post){ console.warn('Post not found'); return; }

    if(post.image && !/^https?:\/\//.test(post.image)){
    
    }

    render(post);
  });
})();

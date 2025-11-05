/* ===================== CONFIG GEMINI ===================== */
const GEMINI_API_KEY = "AIzaSyAQmyYAwwOQJLLTovTiOSh1y6Y8I0qoayQ";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/* ===================== LOCAL CART STORAGE ===================== */
function saveLastCart(cart) {
  if (Array.isArray(cart) && cart.length > 0)
    localStorage.setItem("pawfect:lastCart", JSON.stringify(cart));
}
function getLastCart() {
  try {
    return JSON.parse(localStorage.getItem("pawfect:lastCart") || "[]");
  } catch { return []; }
}

/* ===================== NORMALIZE PRODUCTS ===================== */
function normalizeProducts(raw = []) {
  return raw.map(p => ({
    id: p.id,
    slug: p.slug,
    type: (p.type || "").toLowerCase(),
    animal: (p.animal || p.pet || "").toLowerCase(),
    category: (p.category || "").toLowerCase(),
    brand: p.brand || "",
    name: p.name || "",
    price: Number(p.price) || 0,
    image: p.image || p.banner || p.thumbnail || "",
  }));
}

/* ===================== GEMINI PROMPT ===================== */
function buildPrompt(userText, products, cart) {
  const sample = products.slice(0, 20);
  return `
Bạn là trợ lý bán hàng cho cửa hàng thú cưng Pawfect. 
Hãy hiểu tiếng Việt, nhận biết:
- Loài vật: chó/mèo/thỏ
- Loại hàng: đồ chơi, thức ăn, phụ kiện
- Khoảng giá, thương hiệu, danh mục
Sau đó lọc danh sách sản phẩm và trả JSON theo mẫu:

{
  "intent": {
    "animal": "dog|cat|rabbit|unknown",
    "type": "toy|food|treat|accessory|unknown",
    "minPrice": number|null,
    "maxPrice": number|null,
    "brand": string|null,
    "category": string|null,
    "reason": string
  }
}

Người dùng: """${userText}"""
Cart hiện tại: ${JSON.stringify(cart)}
Sản phẩm mẫu: ${JSON.stringify(sample)}
`;
}

async function callGemini(userText, products, cart) {
  const req = {
    contents: [{ role: "user", parts: [{ text: buildPrompt(userText, products, cart) }] }]
  };
  const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

/* ===================== FILTER & RENDER ===================== */
function filterProducts(products, intent) {
  let list = [...products];
  if (intent.animal && intent.animal !== "unknown")
    list = list.filter(p => p.animal.includes(intent.animal));
  if (intent.type && intent.type !== "unknown")
    list = list.filter(p => p.type.includes(intent.type));
  if (intent.category)
    list = list.filter(p => p.category.includes(intent.category));
  if (intent.brand)
    list = list.filter(p => p.brand.toLowerCase().includes(intent.brand.toLowerCase()));
  if (intent.minPrice) list = list.filter(p => p.price >= intent.minPrice);
  if (intent.maxPrice) list = list.filter(p => p.price <= intent.maxPrice);
  if (!list.length) list = products.slice(0, 6);
  return list.slice(0, 6);
}

/* ===================== ADD TO CART MOCK ===================== */
window.addToCart = function(slug) {
  const product = (window.PRODUCTS_DATA || []).find(p => p.slug === slug);
  if (!product) return alert("Không tìm thấy sản phẩm!");
  const cart = getLastCart();
  cart.push({ ...product, qty: 1 });
  saveLastCart(cart);
  alert(`🛒 Đã thêm ${product.name} vào giỏ hàng!`);
};

/* ===================== CHAT UI ===================== */
document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS = normalizeProducts(window.PRODUCTS_DATA || []);
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  function appendMsg(text, type='bot') {
    const el = document.createElement('div');
    el.className = type === 'bot' ? 'bot-msg' : 'user-msg';
    el.textContent = text;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderCards(list) {
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bot-msg';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="${p.image}" style="width:46px;height:46px;border-radius:8px;object-fit:cover;border:1px solid #E8E3DD;">
          <div style="flex:1;">
            <div><strong>${p.name}</strong></div>
            <div style="font-size:12px;opacity:0.8">${p.brand || ''} ${p.category ? '• '+p.category : ''}</div>
            <div style="margin-top:2px;font-weight:500;">$${p.price.toFixed(2)}</div>
          </div>
          <button class="add-btn" data-slug="${p.slug}" style="background:#4d2b12;color:#fff;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;">+</button>
        </div>
      `;
      chatBody.appendChild(card);
    });

    chatBody.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const slug = e.target.dataset.slug;
        window.addToCart(slug);
      });
    });

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function handleUserQuery(text) {
    appendMsg(text, 'user');
    const thinking = document.createElement('div');
    thinking.className = 'bot-msg';
    thinking.textContent = 'Đang suy nghĩ... 🤔';
    chatBody.appendChild(thinking);
    chatBody.scrollTop = chatBody.scrollHeight;

    const cart = getLastCart();
    try {
      const ai = await callGemini(text, PRODUCTS, cart);
      thinking.remove();
      appendMsg(ai.intent?.reason || "Mình nghĩ bạn sẽ thích những món này nè:");
      const list = filterProducts(PRODUCTS, ai.intent || {});
      renderCards(list);
    } catch (err) {
      thinking.remove();
      appendMsg("Mạng hơi chậm, tui gửi tạm vài món nổi bật nha 💛");
      renderCards(PRODUCTS.slice(0, 4));
      console.error(err);
    }
  }

  chatSend.addEventListener('click', () => {
    const v = chatInput.value.trim();
    if (v) { handleUserQuery(v); chatInput.value = ''; }
  });
  chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const v = chatInput.value.trim();
      if (v) { handleUserQuery(v); chatInput.value = ''; }
    }
  });

  document.querySelectorAll('.suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      handleUserQuery(`Gợi ý sản phẩm cho ${type}`);
    });
  });
});

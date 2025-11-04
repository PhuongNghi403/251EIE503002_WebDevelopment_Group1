// assets/data/products.js
// Full schema + reviews giả lập + ảnh nhiều tấm cho gallery
window.PRODUCTS_DATA = [
  {
    id: '1',
    slug: 'squeaky-sports-ball-set',
    type: 'toy',
    category: 'Dog Toy',
    brand: 'Pawfect',
<<<<<<< HEAD
    name: "SQUEAKY SPORTS BALL SET",
    subtitle: "Textured squeaky balls inspired by classic sports.",
    description:
      'A textured squeaky ball set inspired by classic basketball and football shapes. Made from durable, non-toxic rubber with raised massage nubs that are gentle on gums,these toys keep dogs engaged through fetch, chase, and solo chew time. The grippy surface is easy to hold with wet paws and stands up to daily play, indoors or out.',
    benefits: [
      'Durable, non-toxic rubber built for daily play',
      'Raised nubs help reduce plaque while massaging gums',
      'Easy-clean surface; wipe down after outdoor sessions'
    ],
    images: [
      '../assets/images/Shop/baseball.svg',
      '../assets/images/Shop/baseball.svg',
      '../assets/images/Shop/baseball.svg'
    ],
    thumbnail: '../assets/images/Shop/baseball.svg',
    price: { current: 300.00, original: 306.00, currency: 'USD' },
    rating: {
      avg: 4.0,
      count: 529,
      breakdown: { 5: 220, 4: 190, 3: 72, 2: 30, 1: 17 }
    },
    soldCount: 529,
    nutrition: {}, // toy: không dùng -> sẽ tự ẩn
    specs: { material: 'TPR', size: 'M', lifeStage: 'Adult' },
    options: [
      { name: 'Color', key: 'color', values: ['Orange', 'Brown'] }
    ],
    defaultSelection: { color: 'Orange' },
    stock: { qty: 120, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.25, dimensionsCm: [10, 10, 10] },
    tags: ['toy', 'squeaky', 'training'],
    relatedIds: ['3', '10', '11'],
    createdAt: '2025-08-01T00:00:00Z',
    reviews: [
      { id:'r1', author:'Dianne Russell', avatar:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=faces&fit=crop&w=300&h=300', rating:4, title:'Dogs love it', text:'Âm squeak vui tai, nảy tốt.', createdAt:'2025-08-20' },
      { id:'r2', author:'Jane Cooper', avatar:'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?crop=faces&fit=crop&w=300&h=300', rating:5, title:'Bền', text:'Cắn nhiều vẫn ổn.', createdAt:'2025-09-02' }
    ]
=======
    image_url: '../assets/images/Shop/baseball.svg',
    description: 'A textured squeaky ball set inspired by classic basketball and football shapes. Made from durable, non-toxic rubber with raised massage nubs that are gentle on gums,these toys keep dogs engaged through fetch, chase, and solo chew time. The grippy surface is easy to hold with wet paws and stands up to daily play, indoors or out.',
    benefits: ['Durable, non-toxic rubber built for daily play', 
      'Raised nubs help reduce plaque while massaging gums', 
      'Easy-clean surface; wipe down after outdoor sessions'],
    nutrition: {}
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
  },
  {
    id: '2',
    slug: 'bone-shaped-pet-toys-set-of-4',
    type: 'toy',
    category: 'Dog Toy',
    brand: 'Pawfect',
<<<<<<< HEAD
    name: "BONE-SHAPED PET TOYS (SET OF 4)",
    subtitle: "Colorful flexible TPR bones for fetch & training.",
    description:
      'A colorful set of bone-shaped toys crafted from flexible TPR that is gentle on teeth yet tough enough for repeated chewing. Their lightweight build and lively bounce make them perfect for fetch and training games. Subtle textures keep interest high and help support oral hygiene during casual chew sessions.',
=======
    image_url: '../assets/images/Shop/bone-4.svg',
    description: `A colorful set of bone-shaped toys crafted from flexible TPR that is gentle on teeth yet tough enough for repeated chewing. Their lightweight build and lively bounce make them perfect for fetch and training games. Subtle textures keep interest high and help support oral hygiene during casual chew sessions.`,
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
    benefits: ['Squeaky fun', 'Great for fetch'],
    images: ['../assets/images/Shop/bone-4.svg','../assets/images/Shop/bone-4.svg'],
    thumbnail: '../assets/images/Shop/bone-4.svg',
    price: { current: 700.00, original: 770.00, currency: 'USD' },
    rating: { avg: 4.5, count: 902, breakdown: { 5: 650, 4: 180, 3: 45, 2: 17, 1: 10 } },
    soldCount: 902,
    nutrition: {},
    specs: { material: 'TPR', size: 'Mixed', lifeStage: 'All' },
    options: [ { name: 'Pack', key: 'pack', values: ['Set of 4'] } ],
    defaultSelection: { pack: 'Set of 4' },
    stock: { qty: 80, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.45, dimensionsCm: [25, 18, 8] },
    tags: ['toy', 'bone', 'bundle'],
    relatedIds: ['1', '10', '11'],
    createdAt: '2025-08-05T00:00:00Z',
    reviews: [
      { id:'r1', author:'Darlene Robertson', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=300&h=300', rating:5, title:'Cực đáng tiền', text:'4 cái thay phiên ném chơi đã đời.', createdAt:'2025-08-22' }
    ]
  },
  {
    id: '3',
    slug: 'high-grip-training-ball',
    type: 'toy',
    category: 'Dog Toy',
    brand: 'Pawfect',
<<<<<<< HEAD
    name: 'HIGH-GRIP TRAINING BALL',
    subtitle: "Lightweight, high-bounce training ball.",
    description:
      'A lightweight, high-grip training ball designed for everyday fetch. The smooth outer shell resists dirt, while the responsive core delivers a satisfying bounce that encourages exercise and healthy play routines. Sized for easy carrying without straining the jaw.',
    benefits: ['High grip', 'Easy clean'],
    images: ['../assets/images/Shop/ball-fordog.svg','../assets/images/Shop/ball-fordog.svg'],
    thumbnail: '../assets/images/Shop/ball-fordog.svg',
    price: { current: 300.00, original: 303.22, currency: 'USD' },
    rating: { avg: 3.0, count: 12, breakdown: { 5: 2, 4: 3, 3: 4, 2: 2, 1: 1 } },
    soldCount: 12,
    nutrition: {},
    specs: { material: 'Rubber', size: 'S/M', lifeStage: 'All' },
    options: [{ name: 'Size', key: 'size', values: ['S', 'M'] }],
    defaultSelection: { size: 'M' },
    stock: { qty: 42, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.2, dimensionsCm: [9, 9, 9] },
    tags: ['toy', 'ball'],
    relatedIds: ['1', '10'],
    createdAt: '2025-08-12T00:00:00Z',
    reviews: []
=======
    image_url: '../assets/images/Shop/ball-fordog.svg',
    description: `A lightweight, high-grip training ball designed for everyday fetch. The smooth outer shell resists dirt, while the responsive core delivers a satisfying bounce that encourages exercise and healthy play routines. Sized for easy carrying without straining the jaw.`,
    benefits: ['High protein'],
    nutrition: {}
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
  },
  {
    id: '4',
    slug: 'kit-cat-fillet-o-lakes',
    type: 'food',
    category: 'Cat Food',
    brand: 'Kit Cat',
    name: 'KIT CAT FILLET O LAKES',
    subtitle: "Complete dry food with chicken & veggie bites.",
    description:
      'Packed with tender chicken breast pieces blended with crunchy biscuit bites and natural vegetables, this complete recipe turns every scoop into a tasty surprise. The formula is enriched with Omega-3 &amp; Omega-6 fatty acids, taurine, and prebiotic vitamins to nourish skin and coat, digestion, and overall vitality. Made without pork or lard and crafted for a balanced daily diet, it supports your cat\'s heart, eyes, and immune system while keeping mealtime delicious and satisfying.',
    benefits: ['Vitamins & minerals'],
    images: ['../assets/images/Shop/kitcat.svg','../assets/images/Shop/kitcat.svg'],
    thumbnail: '../assets/images/Shop/kitcat.svg',
    price: { current: 100.00, original: 200.00, currency: 'USD' },
    rating: { avg: 5.0, count: 233, breakdown: { 5: 210, 4: 15, 3: 5, 2: 2, 1: 1 } },
    soldCount: '1000+',
    nutrition: { protein: '35%', fat: '12%', fiber: '3%', ash: '8%', moisture: '10%' },
    specs: { form: 'Dry', lifeStage: 'Adult', flavor: 'Chicken' },
    options: [ { name: 'Weight', key: 'weight', values: ['500g', '1kg', '5kg'] } ],
    defaultSelection: { weight: '1kg' },
    stock: { qty: 220, status: 'in_stock', backorder: false },
    shipping: { weightKg: 1.0, dimensionsCm: [22, 30, 12] },
    tags: ['cat', 'dry-food', 'chicken'],
    relatedIds: ['5', '6', '7', '8'],
    createdAt: '2025-07-29T00:00:00Z',
    reviews: [
      { id:'r1', author:'Dianne Russell', avatar:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=faces&fit=crop&w=300&h=300', rating:5, title:'Mèo mê', text:'Lông bóng, phân đẹp.', createdAt:'2025-08-01' }
    ]
  },
  {
    id: '5',
    slug: 'encore-complete-cat-food',
    type: 'food',
    category: 'Cat Food',
    brand: 'Encore',
<<<<<<< HEAD
    name: 'ENCORE COMPLETE - CAT FOOD',
    subtitle: "High-quality protein with crunchy accents.",
    description:
      'A complete and balanced meal made with real chicken breast, crunchy kibble accents, and garden vegetables. Each serving provides high-quality protein for strong, lean muscles and is fortified with Omega-3 &amp; Omega-6, taurine, and essential vitamins.',
=======
    image_url: '../assets/images/Shop/encore.svg',
    description: `A complete and balanced meal made with real chicken breast, crunchy kibble accents, and garden vegetables. Each serving provides high-quality protein for strong, lean muscles and is fortified with Omega-3 &amp; Omega-6, taurine, and essential vitamins. Free from pork and lard, the recipe is designed to support everyday wellness—from skin and coat to digestion and immune defense—while delivering a flavor cats love.`,
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
    benefits: ['Glossy coat and skin comfort'],
    images: ['../assets/images/Shop/encore.svg','../assets/images/Shop/encore.svg'],
    thumbnail: '../assets/images/Shop/encore.svg',
    price: { current: 400.00, original: 450.54, currency: 'USD' },
    rating: { avg: 4.0, count: 329, breakdown: { 5: 160, 4: 100, 3: 45, 2: 15, 1: 9 } },
    soldCount: 329,
    nutrition: { protein: '29%', fat: '11%', fiber: '9%', ash: '10%', moisture: '20%' },
    specs: { form: 'Dry', lifeStage: 'Adult', flavor: 'Chicken' },
    options: [{ name: 'Weight', key: 'weight', values: ['1kg', '5kg'] }],
    defaultSelection: { weight: '1kg' },
    stock: { qty: 95, status: 'in_stock', backorder: false },
    shipping: { weightKg: 1.0, dimensionsCm: [22, 30, 12] },
    tags: ['cat', 'dry-food'],
    relatedIds: ['4', '6', '8'],
    createdAt: '2025-07-20T00:00:00Z',
    reviews: []
  },
  {
    id: '6',
    slug: 'wellness-signature-selects-chicken-entree',
    type: 'food',
    category: 'Cat Food',
    brand: 'Wellness',
    name: 'WELLNESS SIGNATURE SELECTS (CHICKEN ENTRÉE)',
    subtitle: "Premium protein-rich wet entrée.",
    description:
      'A premium, protein-rich entrée crafted with real chicken and carefully selected nutrients to support daily vitality. Gentle on sensitive stomachs and free from pork or lard.',
    benefits: ['Vitamin E and minerals aid natural defenses'],
    images: ['../assets/images/Shop/wellness.svg','../assets/images/Shop/wellness.svg'],
    thumbnail: '../assets/images/Shop/wellness.svg',
    price: { current: 200.00, original: 293.01, currency: 'USD' },
    rating: { avg: 3.0, count: 12, breakdown: { 5: 2, 4: 4, 3: 3, 2: 2, 1: 1 } },
    soldCount: 12,
    nutrition: { protein: '38%', fat: '14%', fiber: '3%', ash: '9%', moisture: '10%' },
    specs: { form: 'Wet', lifeStage: 'Adult', flavor: 'Chicken' },
    options: [{ name: 'Pack', key: 'pack', values: ['1 can', '6 cans'] }],
    defaultSelection: { pack: '6 cans' },
    stock: { qty: 60, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.45, dimensionsCm: [16, 16, 12] },
    tags: ['cat', 'wet-food'],
    relatedIds: ['4', '5', '7'],
    createdAt: '2025-07-18T00:00:00Z',
    reviews: []
  },
  {
    id: '7',
    slug: 'friskies-with-chicken-canned',
    type: 'food',
    category: 'Cat Food',
    brand: 'Friskies',
<<<<<<< HEAD
    name: 'FRISKIES WITH CHICKEN (CANNED)',
    subtitle: "Tender chicken in savory gravy.",
    description:
      'Tender chicken in a savory gravy that keeps cats coming back to the bowl. Complete and balanced entrée with essential vitamins, taurine, and omegas.',
=======
    image_url: '../assets/images/Shop/friski.svg',
    description: `Tender chicken in a savory gravy that keeps cats coming back to the bowl. This complete and balanced entrée delivers high-quality protein for lean muscles and includes essential vitamins, taurine, and omegas to support heart, vision, skin, and coat. The juicy texture adds extra hydration while the irresistible aroma turns mealtime into a treat. Made without pork or lard for everyday feeding.`,
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
    benefits: ['Taurine helps maintain heart and eye function'],
    images: ['../assets/images/Shop/friski.svg','../assets/images/Shop/friski.svg'],
    thumbnail: '../assets/images/Shop/friski.svg',
    price: { current: 400.00, original: 450.54, currency: 'USD' },
    rating: { avg: 5.0, count: 410, breakdown: { 5: 360, 4: 35, 3: 10, 2: 3, 1: 2 } },
    soldCount: '1000+',
    nutrition: { protein: '38%', fat: '14%', fiber: '3%', ash: '9%', moisture: '10%' },
    specs: { form: 'Wet', lifeStage: 'Adult', flavor: 'Chicken' },
    options: [{ name: 'Pack', key: 'pack', values: ['1 can', '12 cans'] }],
    defaultSelection: { pack: '12 cans' },
    stock: { qty: 140, status: 'in_stock', backorder: false },
    shipping: { weightKg: 1.8, dimensionsCm: [30, 22, 12] },
    tags: ['cat', 'wet-food'],
    relatedIds: ['6', '8', '5'],
    createdAt: '2025-07-10T00:00:00Z',
    reviews: []
  },
  {
    id: '8',
    slug: 'cherie-the-finest-shredded-chicken-in-gravy',
    type: 'food',
    category: 'Cat Food',
    brand: 'Cherie',
    name: 'CHERIE “THE FINEST” (SHREDDED CHICKEN IN GRAVY)',
    subtitle: "Gourmet shredded chicken in silky gravy.",
    description:
      'A gourmet shredded-chicken entrée in silky gravy. Gentle on sensitive stomachs and free from pork or lard.',
    benefits: ['Omega fatty acids nourish skin and promote a glossy coat'],
    images: ['../assets/images/Shop/therie.svg','../assets/images/Shop/therie.svg'],
    thumbnail: '../assets/images/Shop/therie.svg',
    price: { current: 550.00, original: 603.13, currency: 'USD' },
    rating: { avg: 4.0, count: 329, breakdown: { 5: 170, 4: 100, 3: 40, 2: 12, 1: 7 } },
    soldCount: 329,
    nutrition: { protein: '38%', fat: '14%', fiber: '3%', ash: '9%', moisture: '10%' },
    specs: { form: 'Wet', lifeStage: 'Adult', flavor: 'Chicken' },
    options: [{ name: 'Pack', key: 'pack', values: ['1 can', '6 cans'] }],
    defaultSelection: { pack: '6 cans' },
    stock: { qty: 88, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.6, dimensionsCm: [20, 20, 12] },
    tags: ['cat', 'wet-food'],
    relatedIds: ['6', '7', '5'],
    createdAt: '2025-07-14T00:00:00Z',
    reviews: []
  },
  {
    id: '9',
    slug: 'pedigree-vital-protection-adult-dog',
    type: 'food',
    category: 'Dog Food',
    brand: 'Pedigree',
    name: 'PEDIGREE VITAL PROTECTION (ADULT DOG)',
    subtitle: "Complete dry food for adult dogs.",
    description:
      'Complete dry food for adult dogs featuring a crunchy kibble texture and a balanced blend of protein, whole-grain carbohydrates, and essential vitamins and minerals.',
    benefits: ['Crunchy kibble helps keep teeth clean'],
    images: ['../assets/images/Shop/pedigree.svg','../assets/images/Shop/pedigree.svg'],
    thumbnail: '../assets/images/Shop/pedigree.svg',
    price: { current: 200.00, original: 275.43, currency: 'USD' },
    rating: { avg: 3.0, count: 12, breakdown: { 5: 2, 4: 4, 3: 3, 2: 2, 1: 1 } },
    soldCount: 12,
    nutrition: { protein: '24%', fat: '10%', fiber: '4%', ash: '8%', moisture: '10%' },
    specs: { form: 'Dry', lifeStage: 'Adult', flavor: 'Chicken & Veggies' },
    options: [{ name: 'Weight', key: 'weight', values: ['1.5kg', '7kg'] }],
    defaultSelection: { weight: '1.5kg' },
    stock: { qty: 130, status: 'in_stock', backorder: false },
    shipping: { weightKg: 1.5, dimensionsCm: [28, 36, 12] },
    tags: ['dog', 'dry-food'],
    relatedIds: ['1', '10', '11'],
    createdAt: '2025-07-05T00:00:00Z',
    reviews: []
  },
  {
    id: '10',
    slug: 'stuffed-animals-rope-play-set',
    type: 'toy',
    category: 'Dog Toy',
    brand: 'PetStay',
<<<<<<< HEAD
    name: 'STUFFED ANIMALS & ROPE PLAY SET',
    subtitle: "Plush squeakers + tough rope bundle.",
    description:
      'A multi-toy bundle that mixes plush squeakers with a tough rope for tug, fetch, and independent play.',
=======
    image_url: '../assets/images/Shop/stuffed-animal.svg',
    description: `A multi-toy bundle that mixes plush squeakers with a tough rope for tug, fetch, and independent play. The varied shapes, sounds, and textures keep dogs mentally stimulated while the rope fibers can help with light flossing as they chew. Ideal for indoor sessions and basic training games.`,
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
    benefits: ['Rope fibers aid light dental flossing'],
    images: ['../assets/images/Shop/stuffed-animal.svg','../assets/images/Shop/stuffed-animal.svg'],
    thumbnail: '../assets/images/Shop/stuffed-animal.svg',
    price: { current: 700.00, original: 788.00, currency: 'USD' },
    rating: { avg: 4.0, count: 329, breakdown: { 5: 150, 4: 120, 3: 45, 2: 10, 1: 4 } },
    soldCount: 329,
    nutrition: {},
    specs: { material: 'Plush + Rope', size: 'Mixed', lifeStage: 'All' },
    options: [{ name: 'Bundle', key: 'bundle', values: ['Standard'] }],
    defaultSelection: { bundle: 'Standard' },
    stock: { qty: 66, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.8, dimensionsCm: [32, 24, 10] },
    tags: ['toy', 'bundle'],
    relatedIds: ['1', '2', '11'],
    createdAt: '2025-07-01T00:00:00Z',
    reviews: []
  },
  {
    id: '11',
    slug: 'rawhide-bone-chew',
    type: 'toy',
    category: 'Dog Toy',
    brand: 'PetStay',
<<<<<<< HEAD
    name: 'RAWHIDE BONE CHEW',
    subtitle: "Long-lasting rawhide chew.",
    description:
      'A long-lasting rawhide chew shaped like a classic bone to satisfy a dog\'s natural urge to chew.',
=======
    image_url: '../assets/images/Shop/bone.svg',
    description: `A long-lasting rawhide chew shaped like a classic bone to satisfy a dog's natural urge to chew. Helps alleviate boredom and promotes healthy chewing habits. Always supervise your pet while chewing and provide fresh water; this is a chew, not a complete meal.`,
>>>>>>> 915002d45c78c55fe6bc87e27e97df499edb7614
    benefits: ['Encourages healthy chewing away from household items'],
    images: ['../assets/images/Shop/bone.svg','../assets/images/Shop/bone.svg'],
    thumbnail: '../assets/images/Shop/bone.svg',
    price: { current: 190.00, original: 200.00, currency: 'USD' },
    rating: { avg: 3.0, count: 12, breakdown: { 5: 2, 4: 4, 3: 3, 2: 2, 1: 1 } },
    soldCount: 12,
    nutrition: {},
    specs: { material: 'Rawhide', size: 'L', lifeStage: 'Adult' },
    options: [{ name: 'Size', key: 'size', values: ['M', 'L'] }],
    defaultSelection: { size: 'L' },
    stock: { qty: 72, status: 'in_stock', backorder: false },
    shipping: { weightKg: 0.35, dimensionsCm: [22, 8, 3] },
    tags: ['toy', 'chew'],
    relatedIds: ['1', '2', '10'],
    createdAt: '2025-07-03T00:00:00Z',
    reviews: []
  }
];

// tiện tra cứu nhanh
window.PRODUCTS_BY_SLUG = Object.fromEntries(
  (window.PRODUCTS_DATA || []).map(p => [p.slug, p])
);
window.PRODUCTS_BY_ID = Object.fromEntries(
  (window.PRODUCTS_DATA || []).map(p => [p.id, p])
);

// Static product catalog. Edit/add items as needed.
// Ensure this script is loaded BEFORE shop.js and product_detail.js.

window.PRODUCTS_DATA = [
  {
    id: '1',
    name: "SQUEAKY SPORTS BALL SET(BASKETBALL & FOOTBALL)",
    discounted_price: 300.00,
    original_price: 306.00,
    rating: 4.0,
    sold_count: 529,
    category: 'Dog Toy',
    brand: 'Pawfect',
    image_url: '../assets/images/Shop/Basketball.svg',
    description: 'A textured squeaky ball set inspired by classic basketball and football shapes. Made from durable, non-toxic rubber with raised massage nubs that are gentle on gums,these toys keep dogs engaged through fetch, chase, and solo chew time. The grippy surface is easy to hold with wet paws and stands up to daily play, indoors or out.',
    benefits: ['Durable, non-toxic rubber built for daily play', 
      'Raised nubs help reduce plaque while massaging gums', 
      'Easy-clean surface; wipe down after outdoor sessions'],
    nutrition: {}
  },
  {
    id: '2',
    name: "BONE-SHAPED PET TOYS (SET OF 4)",
    discounted_price: 700.00,
    original_price: 770.00,
    rating: 4.5,
    sold_count: 902,
    category: 'Dog Toy',
    brand: 'Pawfect',
    image_url: '../assets/images/Shop/BoneShapedPetToys.svg',
    description: 'A colorful set of bone-shaped toys crafted from flexible TPR that is'/
      'gentle on teeth yet tough enough for repeated chewing. Their lightweight'/
      'build and lively bounce make them perfect for fetch and training games.'/
      'Subtle textures keep interest high and help support oral hygiene during casual chew sessions.',
    benefits: ['Squeaky fun', 'Great for fetch'],
    nutrition: {}
  },
  {
    id: '3',
    name: 'KIT CAT FILLET',
    discounted_price: 1.99,
    original_price: 2.49,
    rating: 4.4,
    sold_count: 210,
    category: 'Cat Food',
    brand: 'Kit Cat',
    image_url: '../assets/images/Shop/FilletOLakes.svg',
    description: 'Tasty cat fillet treats with balanced nutrition.',
    benefits: ['High protein'],
    nutrition: { calories: '180 kcal', protein: '12g' }
  },
  {
    id: '4',
    name: 'ENCORE COMPLETE',
    discounted_price: 3.49,
    original_price: 3.99,
    rating: 4.1,
    sold_count: 75,
    category: 'Cat Food',
    brand: 'Encore',
    image_url: '../assets/images/Shop/EncoreCatFood.svg',
    description: 'Complete cat food with essential vitamins and minerals.',
    benefits: ['Vitamins & minerals'],
    nutrition: { calories: '220 kcal', protein: '10g' }
  }
];
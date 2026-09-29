import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Second Skin Foundation',
    category: 'Face',
    price: 28.0,
    shade: '9 shades',
    shadesList: [
      '01 Warm Ivory',
      '02 Neutral Beige',
      '03 Golden Sand',
      '04 Warm Honey',
      '05 Caramel Glow',
      '06 Rich Amber',
      '07 Deep Chestnut',
      '08 Warm Espresso',
      '09 Cocoa Luxe'
    ],
    shadeImages: {
      '01 Warm Ivory': '/products/shades/foundation-01.png',
      '02 Neutral Beige': '/products/shades/foundation-02.png',
      '03 Golden Sand': '/products/shades/foundation-03.png',
      '04 Warm Honey': '/products/shades/foundation-04.png',
      '05 Caramel Glow': '/products/shades/foundation-05.png',
      '06 Rich Amber': '/products/shades/foundation-06.png',
      '07 Deep Chestnut': '/products/shades/foundation-07.png',
      '08 Warm Espresso': '/products/shades/foundation-08.png',
      '09 Cocoa Luxe': '/products/shades/foundation-09.png',
    },
    image: '/products/second-skin-foundation.png',
    badge: 'Bestseller',
    rating: 4.9,
    reviewsCount: 342,
    description: 'A breathable, medium-to-full buildable foundation that seamlessly melts into skin for an imperceptible, radiant finish. Infused with skin-loving actives that hydrate while evening skin tone without settling into fine lines.',
    benefits: [
      'Undetectable, skin-like radiant velvet finish',
      '16-hour transfer-resistant wear',
      'Hyaluronic acid and plant squalane for lasting hydration',
      'Formulated without pore-clogging mineral oils'
    ],
    ingredients: [
      'Water (Aqua)',
      'Dimethicone',
      'Squalane',
      'Hyaluronic Acid',
      'Glycerin',
      'Niacinamide',
      'Tocopherol (Vitamin E)',
      'Iron Oxides'
    ],
    howToUse: 'Dispense 1-2 pumps onto the back of your hand. Dot onto forehead, cheeks, and chin. Blend outward using the Flawless Finish Brush or damp sponge for an airbrushed finish.',
    volumeOrWeight: '30ml / 1.0 fl. oz.',
    undertoneRecommendation: ['Warm', 'Neutral', 'Cool', 'Olive']
  },
  {
    id: 2,
    name: 'Cloud Blush',
    category: 'Face',
    price: 18.0,
    shade: 'Weightless Peach Coral',
    shadesList: ['Weightless Peach Coral', 'Rose Muse', 'Peachy Sunset', 'Berry Bloom'],
    image: '/products/cloud-blush.jpg',
    badge: 'Bestseller',
    rating: 4.8,
    reviewsCount: 189,
    description: 'An air-whipped, weightless peach coral powder blush with multi-tonal cloud embossing that diffuses across cheeks for a soft-focus, lit-from-within radiance all day long.',
    benefits: [
      'Weightless, air-whipped powder formula with velvety glide',
      'Buildable intensity from soft peach coral glow to vibrant flush',
      'Enriched with sweet almond oil and skin-conditioning rosehip extract',
      'Non-comedogenic, seamless blend that never cakes'
    ],
    ingredients: [
      'Mica',
      'Sweet Almond Oil',
      'Rosehip Seed Oil',
      'Caprylic/Capric Triglyceride',
      'Shea Butter',
      'Silica',
      'Iron Oxides',
      'Titanium Dioxide'
    ],
    howToUse: 'Sweep a dense cheek brush across the multi-tonal cloud pan. Tap gently onto the apples of cheeks and buff upward toward the temples for an instant lifted contour.',
    volumeOrWeight: '3g / 0.1 oz.',
    undertoneRecommendation: ['All Undertones', 'Warm', 'Neutral']
  },
  {
    id: 3,
    name: 'Brighten Concealer',
    category: 'Face',
    price: 20.0,
    shade: '3 shade set',
    shadesList: [
      'Light - Radiant Illuminator',
      'Medium - Warm Perfecter',
      'Deep - Rich Color Corrector'
    ],
    image: '/products/brighten-concealer.jpg',
    badge: 'Shade Set',
    rating: 4.9,
    reviewsCount: 178,
    description: 'A color-correcting and brightening liquid concealer trio formulated with ultra-pigmented, blendable micro-pigments that awaken undereyes and sculpt with radiant satin coverage.',
    benefits: [
      'Tri-shade system: illuminate, correct, and contour in one set',
      'Crease-proof satin formula that moves seamlessly with skin',
      'Infused with caffeine extract to visibly diminish undereye puffiness',
      'Cushioned precision doe-foot wand for targeted application'
    ],
    ingredients: [
      'Water (Aqua)',
      'Caffeine Extract',
      'Glycerin',
      'Titanium Dioxide',
      'Centella Asiatica',
      'Vitamin E',
      'Niacinamide',
      'Iron Oxides'
    ],
    howToUse: 'Dot Light Illuminator at inner corners and high points, Medium Perfecter over spots, and Deep Corrector under cheekbones. Blend with fingertips or brush for a sculpted finish.',
    volumeOrWeight: '3 x 5ml / 0.17 oz.',
    undertoneRecommendation: ['Cool', 'Neutral', 'Warm', 'Deep']
  },
  {
    id: 4,
    name: 'Sculpt & Glow Duo',
    category: 'Face',
    price: 24.0,
    shade: '3 flexible shades',
    shadesList: ['Light/Medium Bronze', 'Medium/Tan Amber', 'Rich/Deep Bronze'],
    image: '/products/sculpt-glow-duo.jpg',
    badge: 'New',
    rating: 4.9,
    reviewsCount: 94,
    description: 'A paired compact featuring a velvety matte contour powder and a micro-fine champagne highlighter. Designed to sculpt cheekbones and impart a luminous golden veil without chalkiness.',
    benefits: [
      'Tailored tone balance that never turns orange or muddy',
      'Ultra-micronized pearl finish reflects light smoothly',
      'Mirror compact perfect for touch-ups on the go'
    ],
    ingredients: [
      'Talc-Free Mica',
      'Zinc Stearate',
      'Jojoba Seed Oil',
      'Vitamin E',
      'Iron Oxides'
    ],
    howToUse: 'Sweep contour shade into cheek hollows and jawline with an angled brush. Dust the highlighter over cheekbones, cupid bow, and bridge of the nose.',
    volumeOrWeight: '12g / 0.42 oz.',
    undertoneRecommendation: ['Golden', 'Warm', 'Neutral']
  },
  {
    id: 5,
    name: 'Velvet Eyeshadow Palette',
    category: 'Eyes',
    price: 34.0,
    shade: '12 Shades',
    shadesList: ['12 Rich Warm & Sunset Earth Tones'],
    image: '/products/velvet-eyeshadow-palette.jpg',
    badge: 'Limited',
    rating: 5.0,
    reviewsCount: 215,
    description: 'Twelve buttery, intensely pigmented eyeshadows ranging from soft cashmere mattes to molten foil metallics. Formulated to provide maximum color payoff with zero fallout.',
    benefits: [
      'High-impact pigment in a single smooth swipe',
      'Seamless blendability between warm neutrals, bronzes, and rich berries',
      'Crease-resistant formula lasting up to 12 hours'
    ],
    ingredients: [
      'Mica',
      'Silica',
      'Caprylic Triglyceride',
      'Boron Nitride',
      'Synthetic Fluorphlogopite',
      'Tocopheryl Acetate'
    ],
    howToUse: 'Apply lighter shades all over lid as a base, define crease with medium shades, and pack metallic shimmer onto the center of the lid with finger or flat brush.',
    volumeOrWeight: '18g / 0.63 oz.',
    undertoneRecommendation: ['Universal']
  },
  {
    id: 6,
    name: 'Precision Liquid Liner',
    category: 'Eyes',
    price: 15.0,
    shade: 'Midnight Black',
    shadesList: ['Midnight Black', 'Deep Espresso'],
    image: '/products/precision-liquid-liner.jpg',
    badge: null,
    rating: 4.8,
    reviewsCount: 178,
    description: 'A Japanese-inspired fine calligraphy brush tip liner that glides effortlessly for razor-sharp wings. Deep carbon-black ink dries down to a waterproof, smudge-proof matte finish.',
    benefits: [
      '0.1mm micro-flexible tip for ultimate control',
      '24-hour waterproof and humidity-proof wear',
      'Fast-drying ink prevents lid transfer'
    ],
    ingredients: [
      'Water',
      'Acrylates Copolymer',
      'Carbon Black (CI 77266)',
      'Propylene Glycol',
      'Phenoxyethanol'
    ],
    howToUse: 'Shake well before use. Rest hand against cheek and draw along the upper lash line starting from inner corner, flicking upward toward end of eyebrow.',
    volumeOrWeight: '1.2ml / 0.04 fl. oz.',
    undertoneRecommendation: ['Universal']
  },
  {
    id: 7,
    name: 'Lift & Length Mascara',
    category: 'Eyes',
    price: 17.0,
    shade: 'Soft Black',
    shadesList: ['Soft Black', 'Pitch Black'],
    image: '/products/lift-length-mascara.jpg',
    badge: null,
    rating: 4.8,
    reviewsCount: 224,
    description: 'A gravity-defying mascara equipped with an hourglass curved brush that catches, lifts, and separates every single lash from root to tip. Nourished with conditioning castor oil.',
    benefits: [
      'Extreme length and dramatic lift without clumps or flaking',
      'Enriched with castor oil and provitamin B5 to strengthen lashes',
      'Tubing technology easily removes with warm water'
    ],
    ingredients: [
      'Water',
      'Carnauba Wax',
      'Castor Seed Oil',
      'Provitamin B5 (Panthenol)',
      'Black Iron Oxide'
    ],
    howToUse: 'Wiggle wand at the lash base, then comb smoothly through to the tips. Add a second coat before drying for amplified volume.',
    volumeOrWeight: '10ml / 0.34 fl. oz.',
    undertoneRecommendation: ['Universal']
  },
  {
    id: 8,
    name: 'Sculpting Brow Pencil',
    category: 'Brows',
    price: 14.0,
    shade: 'Light Medium Dark',
    shadesList: ['Soft Blonde', 'Medium Taupe', 'Rich Brown', 'Deep Ebony'],
    image: '/products/sculpting-brow-pencil.jpg',
    badge: null,
    rating: 4.6,
    reviewsCount: 142,
    description: 'An ultra-fine dual-ended brow pencil that creates realistic hair-like strokes with natural definition. Features a spoolie brush on the opposite end to diffuse color softly.',
    benefits: [
      'Micro-tip (1.5mm) mimics individual brow hairs with precision',
      'Waterproof, long-wearing wax formula that does not smudge',
      'Natural matte finish that matches authentic brow hair tones'
    ],
    ingredients: [
      'Hydrogenated Soybean Oil',
      'Carnauba Wax',
      'Zinc Stearate',
      'Iron Oxides'
    ],
    howToUse: 'Twist up 1mm of pencil. Fill in sparse areas with upward, feathery strokes. Comb through with the spoolie to soften and blend.',
    volumeOrWeight: '0.08g / 0.003 oz.',
    undertoneRecommendation: ['All Tones']
  },
  {
    id: 9,
    name: 'Feather Hold Brow Gel',
    category: 'Brows',
    price: 16.0,
    shade: 'Clear',
    shadesList: ['Crystal Clear'],
    image: '/products/feather-hold-brow-gel.jpg',
    badge: 'Viral',
    rating: 4.9,
    reviewsCount: 310,
    description: 'A laminated brow effect in a bottle. This non-flaking clear gel sculpts, lifts, and locks brow hairs in place for a modern feathered look that stays put from morning to night.',
    benefits: [
      'All-day lamination hold with zero white crust or stiffness',
      'Micro-comb applicator coats each hair evenly',
      'Infused with biotin and peptides to support healthy brow density'
    ],
    ingredients: [
      'Water',
      'PVP Polymer',
      'Biotin',
      'Peptide Complex',
      'Panthenol',
      'Glycerin'
    ],
    howToUse: 'Brush through clean brows in an upward direction to laminate hairs flat against skin. Allow 30 seconds to set.',
    volumeOrWeight: '5ml / 0.17 fl. oz.',
    undertoneRecommendation: ['Universal']
  },
  {
    id: 10,
    name: 'Satin Kiss Lipstick',
    category: 'Lips',
    price: 19.0,
    shade: 'Velvet Rose Peach Bliss Berry Mauve',
    shadesList: ['Velvet Rose', 'Peach Bliss', 'Berry Mauve', 'Warm Truffle', 'Ruby Seduction'],
    image: '/products/satin-kiss-lipstick.jpg',
    badge: null,
    rating: 4.9,
    reviewsCount: 268,
    description: 'A luxurious satin lipstick delivering rich, saturated color with a plush, hydrating feel. Glides on like silk with botanical oils that condition lips and prevent cracking.',
    benefits: [
      'Rich one-swipe color payoff with comfortable satin sheen',
      'Packed with organic mango butter and argan oil',
      'Cushiony feel that never feathers into lip lines'
    ],
    ingredients: [
      'Ricinus Communis (Castor) Seed Oil',
      'Mango Seed Butter',
      'Argania Spinosa (Argan) Oil',
      'Candelilla Wax',
      'Vitamin E',
      'Red 7 Lake, Iron Oxides'
    ],
    howToUse: 'Apply directly from the bullet starting at center of the lips moving outward, or blot with a tissue for a soft-focus Parisian blotted tint.',
    volumeOrWeight: '3.8g / 0.13 oz.',
    undertoneRecommendation: ['Warm', 'Cool', 'Neutral']
  },
  {
    id: 11,
    name: 'Glass Lip Oil',
    category: 'Lips',
    price: 17.0,
    shade: 'Nude Pinkish',
    shadesList: ['Nude Pinkish', 'Golden Honey', 'Cherry Glaze', 'Clear Crystal'],
    image: '/products/glass-lip-oil.jpg',
    badge: null,
    rating: 5.0,
    reviewsCount: 388,
    description: 'A non-sticky, nutrient-dense hybrid lip oil that cushions lips in high-shine glassy radiance while delivering deep moisture. Leaves lips visibly plumped, soft, and juicy.',
    benefits: [
      'Glass-like reflective shine without any tackiness or hair-sticking',
      'Jojoba oil, raspberry seed oil, and vitamin E repair chapped lips',
      'Custom plush oversized cloud wand applicator'
    ],
    ingredients: [
      'Polybutene',
      'Jojoba Seed Oil',
      'Raspberry Seed Oil',
      'Triethylhexanoin',
      'Tocopheryl Acetate',
      'Vanilla Fruit Extract'
    ],
    howToUse: 'Glide generously over bare lips for an effortless dewy sheen, or layer over Satin Kiss Lipstick for high-octane mirror dimension.',
    volumeOrWeight: '7ml / 0.24 fl. oz.',
    undertoneRecommendation: ['Universal']
  },
  {
    id: 12,
    name: 'Flawless Finish Brush',
    category: 'Tools',
    price: 22.0,
    shade: 'Vegan fibres',
    shadesList: ['Ultra-dense angled kabuki'],
    image: '/products/flawless-finish-brush.jpg',
    badge: null,
    rating: 4.9,
    reviewsCount: 167,
    description: 'A custom-angled, densely packed foundation and contour brush crafted with silky vegan micro-fibres. Effortlessly blends cream and liquid formulas without streaking or absorbing excess product.',
    benefits: [
      '100% cruelty-free ultra-soft synthetic vegan bristles',
      'Angled ergonomic dome hugs the natural contours of the face',
      'Weighted luxury matte handle provides optimal blending control'
    ],
    ingredients: [
      'Duo-Tone Synthetic Micro-Filament Bristles',
      'Recycled Aluminum Ferrule',
      'FSC Certified Wooden Handle'
    ],
    howToUse: 'Use circular buffing motions to work foundation or cream contour seamlessly into the skin for a streak-free, airbrushed finish.',
    volumeOrWeight: '1 Professional Brush',
    undertoneRecommendation: ['Universal']
  }
];

export const CATEGORIES = ['ALL', 'FACE', 'EYES', 'BROWS', 'LIPS', 'TOOLS'] as const;

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Amara O.',
    location: 'London, UK',
    verified: true,
    rating: 5,
    title: 'The Second Skin Foundation changed my routine completely!',
    content: 'Finding a foundation that matches my deep warm undertone without looking ashy or heavy used to be a struggle. Bekky’s Touch got the formula spot on. It literally feels like nothing on my skin and lasts through my 10-hour hospital shifts.',
    productName: 'Second Skin Foundation',
    shade: '08 Warm Espresso',
    date: '2 days ago'
  },
  {
    id: 'rev-2',
    author: 'Chloe M.',
    location: 'Manchester, UK',
    verified: true,
    rating: 5,
    title: 'Glass Lip Oil is holy grail tier',
    content: 'Not sticky at all, smells like pure vanilla luxury, and gives that plush, juicy, glassy bounce. I carry this in every single bag now. 10/10 recommend!',
    productName: 'Glass Lip Oil',
    shade: 'Nude Pinkish',
    date: '1 week ago'
  },
  {
    id: 'rev-3',
    author: 'Zainab K.',
    location: 'Birmingham, UK',
    verified: true,
    rating: 5,
    title: 'Feather Hold Brow Gel beats high-end brands',
    content: 'I had my brows laminated professionally and this gel keeps that exact salon look every single day. No white residue, no stiffness. It holds all day even at the gym.',
    productName: 'Feather Hold Brow Gel',
    shade: 'Crystal Clear',
    date: '2 weeks ago'
  },
  {
    id: 'rev-4',
    author: 'Eleanor P.',
    location: 'Bristol, UK',
    verified: true,
    rating: 5,
    title: 'Cloud Blush in Rose Muse gives the healthiest glow',
    content: 'Melts right into the skin with just my fingertips. It gives that gorgeous, youthful flush that looks like you just came back from a brisk walk in the Cotswolds.',
    productName: 'Cloud Blush',
    shade: 'Rose Muse',
    date: '3 weeks ago'
  }
];

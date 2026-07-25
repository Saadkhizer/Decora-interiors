// ============================================================================
//  DEMO DATA — bundled catalogue used when the site runs WITHOUT a backend
//  (e.g. a static Netlify deploy). Mirrors the server seed. Replace with the
//  client's real catalogue, or connect a live backend (set VITE_API_URL).
// ============================================================================
const img = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const categoryDefs = [
  { name: 'Wallpaper', slug: 'wallpaper', tagline: 'Statement walls, instantly', description: 'Imported and local wallpapers — textured, floral, geometric and 3D designs to transform any room.', image: img('1615529182904-14819c35db37') },
  { name: 'Window Blinds', slug: 'window-blinds', tagline: 'Light, your way', description: 'Roller, zebra, wooden, roman and vertical blinds. Custom-made and professionally fitted.', image: img('1513161455079-7dc1de15ef3e') },
  { name: 'Wooden Flooring', slug: 'wooden-flooring', tagline: 'Warmth underfoot', description: 'Engineered and laminate wood floors with realistic grain, scratch resistance and easy upkeep.', image: img('1584285405429-136bf988919c') },
  { name: 'Vinyl Flooring', slug: 'vinyl-flooring', tagline: 'Tough, quiet, beautiful', description: 'Waterproof SPC and luxury vinyl planks — perfect for kitchens, offices and high-traffic spaces.', image: img('1600566752355-35792bedcfea') },
  { name: 'Glass Paper', slug: 'glass-paper', tagline: 'Privacy with style', description: 'Frosted and decorative glass films for windows, partitions and doors — privacy without losing light.', image: img('1567225557594-88d73e55f2cb') },
  { name: 'Artificial Grass', slug: 'artificial-grass', tagline: 'Evergreen, effortless', description: 'Soft, UV-stable artificial turf for lawns, balconies, rooftops and play areas. Zero maintenance.', image: img('1564540586988-aa4e53c3d799') },
  { name: 'Folding Doors', slug: 'folding-doors', tagline: 'Open up your space', description: 'Space-saving folding and sliding partition doors in aluminium, PVC and glass finishes.', image: img('1558211583-d26f610c1eb1') },
  { name: 'Wall Panels', slug: 'wall-panels', tagline: 'Texture & depth', description: 'WPC, fluted and 3D wall panels for feature walls, TV lounges and reception areas.', image: img('1505693416388-ac5ce068fe85') },
];

const productData = {
  wallpaper: {
    images: ['1615529182904-14819c35db37', '1604147706283-d7119b5b822c', '1597072689227-8882273e8f6a'],
    items: [
      ['Damask Luxe Textured Wallpaper', 4200, 3650, 'roll', 'Soft damask pattern with subtle sheen. Each roll covers ~5 sq m.', { Coverage: '5 sq m/roll', Material: 'Non-woven', Washable: 'Yes' }, 1, 1],
      ['Nordic Floral Wallpaper', 3800, null, 'roll', 'Hand-drawn botanical print on a warm cream base.', { Coverage: '5 sq m/roll', Material: 'Vinyl', Washable: 'Yes' }, 1, 0],
      ['3D Geometric Hexagon Wallpaper', 5200, 4600, 'roll', 'Depth-effect hexagons in taupe and gold.', { Coverage: '5 sq m/roll', Material: 'Embossed vinyl', Washable: 'Yes' }, 0, 1],
      ['Plain Linen Texture Wallpaper', 2900, null, 'roll', 'Understated linen weave — a designer favourite.', { Coverage: '5 sq m/roll', Material: 'Non-woven', Washable: 'Wipe clean' }, 0, 0],
    ],
  },
  'window-blinds': {
    images: ['1513161455079-7dc1de15ef3e', '1567225557594-88d73e55f2cb', '1616594039964-ae9021a400a0'],
    items: [
      ['Zebra Day & Night Blinds', 1650, 1450, 'sq ft', 'Dual-layer fabric for adjustable light and privacy.', { Type: 'Zebra', Operation: 'Chain', Custom: 'Made to measure' }, 1, 1],
      ['Premium Roller Blinds', 1200, null, 'sq ft', 'Smooth blackout roller blinds in 20+ colours.', { Type: 'Roller', Blackout: 'Available', Custom: 'Made to measure' }, 1, 0],
      ['Natural Wooden Venetian Blinds', 2400, 2100, 'sq ft', 'Real-wood slats with a warm matte finish.', { Type: 'Venetian', Material: 'Basswood', Custom: 'Made to measure' }, 0, 0],
      ['Vertical Office Blinds', 950, null, 'sq ft', 'Practical vertical blinds for large windows and offices.', { Type: 'Vertical', Operation: 'Wand', Custom: 'Made to measure' }, 0, 0],
    ],
  },
  'wooden-flooring': {
    images: ['1584285405429-136bf988919c', '1581858726788-75bc0f6a952d', '1543248939-4296e1fea89b'],
    items: [
      ['Engineered Oak Flooring', 520, 470, 'sq ft', 'Real oak veneer over a stable engineered core.', { Thickness: '12mm', Finish: 'Matte lacquer', Warranty: '15 yrs' }, 1, 1],
      ['Classic Laminate Walnut', 240, null, 'sq ft', 'Warm walnut tone with AC4 wear resistance.', { Thickness: '8mm', Class: 'AC4', Warranty: '10 yrs' }, 1, 0],
      ['Herringbone Parquet Flooring', 680, 599, 'sq ft', 'Timeless herringbone lay-up for elegant rooms.', { Thickness: '12mm', Finish: 'Brushed', Warranty: '15 yrs' }, 0, 1],
      ['Grey Wash Laminate', 230, null, 'sq ft', 'Cool grey-washed planks for modern interiors.', { Thickness: '8mm', Class: 'AC4', Warranty: '10 yrs' }, 0, 0],
    ],
  },
  'vinyl-flooring': {
    images: ['1600566752355-35792bedcfea', '1600210492493-0946911123ea', '1615875605825-5eb9bb5d52ac'],
    items: [
      ['SPC Waterproof Vinyl Plank', 320, 285, 'sq ft', '100% waterproof rigid core — ideal for kitchens.', { Core: 'SPC', Waterproof: 'Yes', Wear: '0.5mm' }, 1, 1],
      ['Luxury Vinyl Tile (Stone Look)', 280, null, 'sq ft', 'Realistic stone texture with a quiet underfoot feel.', { Core: 'LVT', Install: 'Click-lock', Wear: '0.3mm' }, 1, 0],
      ['Commercial Vinyl Roll', 180, 160, 'sq ft', 'Heavy-duty sheet vinyl for offices and clinics.', { Type: 'Sheet', Width: '2m', Wear: 'Commercial' }, 0, 0],
      ['Self-Adhesive Vinyl Plank', 140, null, 'sq ft', 'Budget-friendly peel-and-stick planks.', { Install: 'Peel & stick', Thickness: '2mm', Wear: '0.2mm' }, 0, 1],
    ],
  },
  'glass-paper': {
    images: ['1567225557594-88d73e55f2cb', '1604014237800-1c9102c219da', '1556228578-8c89e6adf883'],
    items: [
      ['Frosted Privacy Glass Film', 180, 150, 'sq ft', 'Etched-glass look that blurs view but keeps light.', { Finish: 'Frosted', Adhesive: 'Static cling', UV: 'Blocks 96%' }, 1, 0],
      ['Decorative Floral Glass Paper', 220, null, 'sq ft', 'Patterned film for doors, partitions and screens.', { Finish: 'Patterned', Adhesive: 'Self-adhesive', UV: 'Blocks 90%' }, 1, 1],
      ['One-Way Mirror Film', 320, 290, 'sq ft', 'Daytime privacy with a reflective exterior.', { Finish: 'Reflective', Adhesive: 'Self-adhesive', UV: 'Blocks 99%' }, 0, 0],
      ['Stained Glass Effect Film', 260, null, 'sq ft', 'Colourful stained-glass styling for feature panes.', { Finish: 'Coloured', Adhesive: 'Static cling', UV: 'Blocks 85%' }, 0, 0],
    ],
  },
  'artificial-grass': {
    images: ['1564540586988-aa4e53c3d799', '1558904541-efa843a96f01', '1416879595882-3373a0480b5b'],
    items: [
      ['Premium Lush 40mm Turf', 260, 230, 'sq ft', 'Dense 40mm pile with a natural two-tone green.', { Pile: '40mm', UV: 'Stable', Drainage: 'Yes' }, 1, 1],
      ['Landscape 30mm Grass', 200, null, 'sq ft', 'All-purpose turf for lawns and gardens.', { Pile: '30mm', UV: 'Stable', Drainage: 'Yes' }, 1, 0],
      ['Sports & Play Turf', 240, 210, 'sq ft', 'Hard-wearing turf for play areas and gyms.', { Pile: '25mm', UV: 'Stable', Backing: 'Reinforced' }, 0, 0],
      ['Balcony Grass Tiles', 170, null, 'piece', 'Interlocking 30×30cm tiles — DIY friendly.', { Size: '30×30cm', Pile: '20mm', Install: 'Click' }, 0, 1],
    ],
  },
  'folding-doors': {
    images: ['1558211583-d26f610c1eb1', '1600585154340-be6161a56a0c', '1600607687939-ce8a6c25118c'],
    items: [
      ['Aluminium Bi-Fold Door', 18500, 16900, 'piece', 'Slim aluminium frame with tempered glass panels.', { Frame: 'Aluminium', Glass: 'Tempered', Panels: 'Custom' }, 1, 1],
      ['PVC Folding Partition Door', 9500, null, 'piece', 'Lightweight folding door for compact spaces.', { Frame: 'PVC', Finish: 'Wood-look', Panels: 'Custom' }, 1, 0],
      ['Glass Sliding Partition', 22000, 19900, 'piece', 'Frameless glass partition with soft-close track.', { Frame: 'Frameless', Glass: '10mm', Track: 'Soft-close' }, 0, 0],
      ['Accordion Room Divider', 7800, null, 'piece', 'Flexible accordion divider for offices and homes.', { Frame: 'PVC', Finish: 'Matte', Panels: 'Custom' }, 0, 0],
    ],
  },
  // 'wall-panels' products are the client's real WPC / Solid panels — added below.
};

export const categories = categoryDefs.map((c, i) => ({
  id: i + 1,
  ...c,
  sort_order: i,
  product_count: productData[c.slug]?.items.length || 0,
}));

export const products = [];
let pid = 1;
categories.forEach((c) => {
  const data = productData[c.slug];
  if (!data) return;
  data.items.forEach(([name, price, sale, unit, shortDesc, specs, featured, isNew], idx) => {
    const images = [
      img(data.images[idx % data.images.length]),
      img(data.images[(idx + 1) % data.images.length]),
    ];
    products.push({
      id: pid++,
      name,
      slug: slugify(name),
      category_id: c.id,
      category_name: c.name,
      category_slug: c.slug,
      price,
      sale_price: sale,
      unit,
      short_desc: shortDesc,
      description: `${shortDesc} ${c.description} Our team provides free measurement and professional installation across the city. Contact us for bulk and project pricing.`,
      images,
      specs,
      rating: +(4.5 + (idx % 3) * 0.15).toFixed(1),
      review_count: 24 + idx * 13,
      in_stock: true,
      featured: !!featured,
      is_new: !!isNew,
      sku: `${c.slug.slice(0, 3).toUpperCase()}-${1000 + idx}`,
    });
  });
});

// --- Real WPC / Solid wall panels (client's actual catalogue) --------------
// Photos cropped from the client's product cards → client/public/products/wall-panels/
const wpcCat = categories.find((c) => c.slug === 'wall-panels');
const panelImg = (code) => `/products/wall-panels/${code}.jpg`;
// [code, finish, line('wpc'|'solid'), price, salePrice|null, featured, isNew]
const wallPanels = [
  ['7715', 'Golden Teak', 'wpc', 2800, 2500, 1, 1],
  ['7703', 'Classic Walnut', 'wpc', 2800, null, 1, 0],
  ['7727', 'Espresso Walnut', 'wpc', 2800, 2550, 1, 0],
  ['7713', 'Charcoal Herringbone', 'wpc', 2900, null, 0, 1],
  ['7729', 'Honey Oak', 'wpc', 2800, null, 0, 0],
  ['7728', 'Natural Oak', 'wpc', 2800, null, 0, 0],
  ['7702', 'Grey Linen', 'wpc', 2800, 2600, 0, 0],
  ['7725', 'Rosewood', 'wpc', 2900, null, 0, 1],
  ['7719', 'White Marble', 'wpc', 3000, null, 0, 0],
  ['130-57', 'Mahogany', 'solid', 1950, 1750, 1, 0],
  ['130-241', 'Cherry Wood', 'solid', 1950, null, 0, 0],
  ['130-1852', 'Natural Teak', 'solid', 1950, null, 0, 0],
  ['130-1825', 'Whitewashed Oak', 'solid', 1950, null, 0, 1],
  ['130-224', 'Light Grey', 'solid', 1850, null, 0, 0],
  ['130-228', 'Charcoal Grey', 'solid', 1850, null, 0, 0],
];
wallPanels.forEach(([code, finish, line, price, sale, featured, isNew], i) => {
  const isWpc = line === 'wpc';
  const typeName = isWpc ? 'WPC Wall Panel' : 'Solid Wall Panel';
  const dims = isWpc
    ? { Width: '6.75 in', Length: '114 in', Thickness: '19mm' }
    : { Width: '4.5 in', Length: '114 in', Thickness: '12mm' };
  products.push({
    id: pid++,
    name: `${typeName} ${code} — ${finish}`,
    slug: slugify(`${typeName} ${code} ${finish}`),
    category_id: wpcCat.id,
    category_name: wpcCat.name,
    category_slug: wpcCat.slug,
    price,
    sale_price: sale,
    unit: 'panel',
    short_desc: `${finish} fluted ${typeName.toLowerCase()} (code ${code}). ${dims.Width} × ${dims.Length}, ${dims.Thickness} — water-resistant, termite-proof, easy to install.`,
    description: `${finish} ${typeName.toLowerCase()} — design code ${code}. Premium fluted panel measuring ${dims.Width} wide × ${dims.Length} long at ${dims.Thickness} thickness. Perfect for feature walls, TV lounges, reception areas and ceilings. Water-resistant, termite-proof, fire-retardant and fade-resistant. Free measurement and professional installation across Islamabad & Rawalpindi. Pic colour may vary slightly from the original.`,
    images: [panelImg(code)],
    specs: { Code: code, Material: isWpc ? 'WPC' : 'Solid WPC', Finish: finish, ...dims },
    rating: +(4.6 + (i % 3) * 0.1).toFixed(1),
    review_count: 12 + i * 5,
    in_stock: true,
    featured: !!featured,
    is_new: !!isNew,
    sku: `WPC-${code}`,
  });
});
if (wpcCat) wpcCat.product_count = wallPanels.length;

// Per-product images — verified photos bundled in public/products/<category>/<slug>.jpg
const productImageCat = {
  'damask-luxe-textured-wallpaper': 'wallpaper',
  'nordic-floral-wallpaper': 'wallpaper',
  '3d-geometric-hexagon-wallpaper': 'wallpaper',
  'plain-linen-texture-wallpaper': 'wallpaper',
  'zebra-day-night-blinds': 'window-blinds',
  'premium-roller-blinds': 'window-blinds',
  'natural-wooden-venetian-blinds': 'window-blinds',
  'vertical-office-blinds': 'window-blinds',
  'engineered-oak-flooring': 'wooden-flooring',
  'classic-laminate-walnut': 'wooden-flooring',
  'herringbone-parquet-flooring': 'wooden-flooring',
  'grey-wash-laminate': 'wooden-flooring',
  'spc-waterproof-vinyl-plank': 'vinyl-flooring',
  'luxury-vinyl-tile-stone-look': 'vinyl-flooring',
  'commercial-vinyl-roll': 'vinyl-flooring',
  'self-adhesive-vinyl-plank': 'vinyl-flooring',
  'frosted-privacy-glass-film': 'glass-paper',
  'decorative-floral-glass-paper': 'glass-paper',
  'one-way-mirror-film': 'glass-paper',
  'stained-glass-effect-film': 'glass-paper',
  'premium-lush-40mm-turf': 'artificial-grass',
  'landscape-30mm-grass': 'artificial-grass',
  'sports-play-turf': 'artificial-grass',
  'balcony-grass-tiles': 'artificial-grass',
  'aluminium-bi-fold-door': 'folding-doors',
  'pvc-folding-partition-door': 'folding-doors',
  'glass-sliding-partition': 'folding-doors',
  'accordion-room-divider': 'folding-doors',
};
products.forEach((p) => {
  const cat = productImageCat[p.slug];
  if (cat) p.images = [`/products/${cat}/${p.slug}.jpg`];
});

export const posts = [
  { title: '5 Wallpaper Trends Transforming Pakistani Homes', tag: 'Wallpaper', cover: img('1615529182904-14819c35db37', 1200) },
  { title: 'Wooden vs Vinyl Flooring: Which Is Right for You?', tag: 'Flooring', cover: img('1584285405429-136bf988919c', 1200) },
  { title: 'How to Choose the Perfect Window Blinds', tag: 'Blinds', cover: img('1513161455079-7dc1de15ef3e', 1200) },
].map((p, i) => ({
  id: i + 1,
  slug: slugify(p.title),
  excerpt: 'Practical tips from our team to help you choose and care for your finishes.',
  body: `Practical tips from our team to help you choose and care for your finishes.\n\nAt Sami Jee Decor we help you pick the right materials and finish them to perfection. Our team offers free measurement and professional installation across Islamabad and Rawalpindi.\n\nContact us today for a free consultation and a no-obligation quote tailored to your space.`,
  author: 'Sami Jee Decor',
  published: 1,
  created_at: new Date(Date.now() - i * 86400000 * 4).toISOString(),
  ...p,
}));

export const gallery = [
  ['Modern living room feature wall', 'Wallpaper', '1618221195710-dd6b41faaea6'],
  ['Engineered oak flooring', 'Flooring', '1581858726788-75bc0f6a952d'],
  ['Zebra blinds installation', 'Blinds', '1513161455079-7dc1de15ef3e'],
  ['Rooftop artificial grass', 'Artificial Grass', '1564540586988-aa4e53c3d799'],
  ['Fluted wall panelling', 'Wall Panels', '1505693416388-ac5ce068fe85'],
  ['Luxury vinyl flooring', 'Flooring', '1600566752355-35792bedcfea'],
  ['Bedroom accent wallpaper', 'Wallpaper', '1586023492125-27b2c045efd7'],
  ['Glass partition film', 'Glass Paper', '1567225557594-88d73e55f2cb'],
].map(([title, category, id], i) => ({ id: i + 1, title, category, image: img(id, 900), sort_order: i }));

export const seedInquiries = [
  { id: 1, name: 'Ahmed Raza', email: 'ahmed@example.com', phone: '+92 300 1112233', subject: 'Wallpaper for living room', message: 'I need wallpaper for a 14x16 ft living room. Please share a quote with installation.', type: 'quote', status: 'new', created_at: new Date().toISOString() },
  { id: 2, name: 'Sana Malik', email: 'sana@example.com', phone: '+92 321 4445566', subject: 'Blinds measurement', message: 'Can you visit DHA Phase 5 for window blinds measurement this week?', type: 'contact', status: 'read', created_at: new Date().toISOString() },
];

// Built-in demo customer + admin (for the standalone demo logins).
export const demoCustomer = { id: 1, name: 'Ali Customer', email: 'customer@example.com', phone: '+92 300 7654321', address: '', city: 'Islamabad', password: 'customer123' };
export const demoAdmin = { id: 1, name: 'Store Admin', email: 'admin@samijeedecor.com', role: 'admin', password: 'admin123' };

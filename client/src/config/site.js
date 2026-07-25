// ============================================================================
//  SITE CONFIG  — Edit this one file to rebrand the whole website.
//  Change the business name, phone, WhatsApp, email, address, socials & hours.
// ============================================================================
export const site = {
  name: 'Sami Jee Decor',
  short: 'Sami Jee',
  mark: 'SJ', // logo monogram
  subtitle: 'Decor Studio',
  tagline: 'Surfaces & spaces, beautifully finished',
  description:
    'Premium wallpaper, window blinds, wooden & vinyl flooring, glass paper, artificial grass and folding doors — with free measurement and expert installation.',

  // Contact details — confirm/replace with your client's verified details.
  phone: '+92 321 9501811',
  phoneHref: 'tel:+923219501811',
  phone2: '+92 300 9501811',
  whatsapp: '923219501811', // digits only, with country code
  email: 'samijeedecor@gmail.com',
  address: 'Islamabad, Pakistan',
  mapEmbed: 'https://www.google.com/maps?q=Islamabad,Pakistan&output=embed',
  hours: 'Mon – Sat, 10:00 AM – 8:00 PM',

  socials: {
    facebook: 'https://www.facebook.com/crystal.interiors.54/',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
  },

  // Stores / showrooms shown on the Contact page.
  branches: [
    { city: 'Islamabad', address: 'Islamabad (full address to be confirmed)', phone: '+92 321 9501811' },
    { city: 'Rawalpindi', address: 'Rawalpindi (branch — optional)', phone: '+92 300 9501811' },
  ],

  freeShippingThreshold: 20000, // PKR — keep in sync with server/src/routes/orders.js
  currency: 'Rs',
};

export const whatsappLink = (text = "Hi! I'm interested in your products.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

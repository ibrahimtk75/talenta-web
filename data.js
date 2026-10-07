/* ============================================================
   THALAL MADINAH — SITE SETTINGS (edit this file only)
   Edit only this file: WhatsApp number, prices, videos, links.
   ============================================================ */

window.SITE = {
  brand: "Thalal Madinah",
  tagline: "Servants of Madinah",
  taglineEn: "Premium Madinah dates & pilgrim stays — order directly on WhatsApp.",

  // ⚠️ Replace with the real WhatsApp number: country code + number, no "+", spaces or dashes.
  // Example (Saudi): 9665XXXXXXXX
  // Until it is set, the WhatsApp buttons let the customer choose the chat themselves.
  whatsapp: "",

  currency: "SAR ", // Saudi Riyal

  // Social media links. Leave "" to hide an icon.
  social: {
    facebook: "https://www.facebook.com/",   // ← Thalal Akbar Madinah Dates page URL
    instagram: "",
    youtube: "",
    tiktok: "",
    whatsappChannel: ""
  },

  /* ---------- HERO VIDEO SLIDER ----------
     video: MP4 file in videos/ (H.264, landscape 1280x720, 5–10 sec, under ~2 MB, no sound needed).
     webm: optional WebM copy of the same clip (extra browser support).
     poster: a still image shown while the video loads.
     Wrap a word in *stars* to highlight it in gold.
     The 3 clips included are animated placeholders — replace with your own footage
     (date farms, packing, hotel rooms, Masjid Nabawi). */
  heroSlides: [
    { video: "videos/hero-sunset.mp4", webm: "videos/hero-sunset.webm", poster: "images/hero-sunset.jpg", eyebrow: "Servants of Madinah",
      title: "Fresh from *Madinah*, delivered with care.", text: "Premium Madinah dates & pilgrim stays — order directly on WhatsApp.",
      cta: { label: "Shop Dates", href: "#dates" } },
    { video: "videos/hero-grove.mp4", webm: "videos/hero-grove.webm", poster: "images/hero-grove.jpg", eyebrow: "Straight from the farms",
      title: "Ajwa, Sukari & *Safawi* — picked fresh.", text: "Hand-selected from the date farms of Madinah and packed with care.",
      cta: { label: "See all dates", href: "#dates" } },
    { video: "videos/hero-night.mp4", webm: "videos/hero-night.webm", poster: "images/hero-night.jpg", eyebrow: "Accommodation",
      title: "Your home near *Masjid Nabawi*.", text: "Hotels, Umrah stays, airport pickup and Ziyarat tours for families and groups.",
      cta: { label: "Book a stay", href: "#stays" } }
  ],

  stats: [
    { value: "52K+", label: "Facebook family" },
    { value: "15+", label: "Date varieties" },
    { value: "24/7", label: "WhatsApp support" }
  ],

  /* ---------- DATES CATALOG ----------
     image: put photos in thalal-madinah/images/ (e.g. images/ajwa.jpg).
     If the image is missing, a styled placeholder is shown instead.
     prices: SAMPLE values in SAR — update before going live. */
  products: [
    { id: "ajwa",    name: "Ajwa Al-Madinah", tag: "Bestseller", desc: "The Prophet's ﷺ beloved date. Soft, dark and rich — from the farms of Madinah.", image: "images/ajwa.jpg",    hue: 18,  options: [{ w: "500g", p: 45 }, { w: "1kg", p: 85 }] },
    { id: "sukari",  name: "Sukari (Qassim)", tag: "Sweetest",   desc: "Golden, caramel-like and melt-in-the-mouth. A family favourite.",              image: "images/sukari.jpg",  hue: 38,  options: [{ w: "500g", p: 20 }, { w: "1kg", p: 35 }] },
    { id: "safawi",  name: "Safawi",          tag: "Daily",      desc: "Long, dark and chewy with a mild sweetness. Perfect for everyday iftar.",     image: "images/safawi.jpg",  hue: 12,  options: [{ w: "500g", p: 25 }, { w: "1kg", p: 45 }] },
    { id: "mabroom", name: "Mabroom",         tag: "Premium",    desc: "Slender, firm and less sweet — prized by date connoisseurs.",                image: "images/mabroom.jpg", hue: 24,  options: [{ w: "500g", p: 30 }, { w: "1kg", p: 55 }] },
    { id: "medjool", name: "Medjool Jumbo",   tag: "Jumbo",      desc: "Large, juicy and luxurious. Ideal for gifting.",                              image: "images/medjool.jpg", hue: 30,  options: [{ w: "500g", p: 35 }, { w: "1kg", p: 65 }] },
    { id: "khudri",  name: "Khudri",          tag: "Value",      desc: "Soft brown dates with a light taste. Great value for bulk orders.",            image: "images/khudri.jpg",  hue: 28,  options: [{ w: "1kg", p: 20 }, { w: "3kg", p: 55 }] },
    { id: "anbara",  name: "Anbara (Amber)",  tag: "Rare",       desc: "Big, soft and rare Madinah variety with a delicate flavour.",                 image: "images/anbara.jpg",  hue: 20,  options: [{ w: "500g", p: 45 }, { w: "1kg", p: 85 }] },
    { id: "giftbox", name: "Madinah Gift Box", tag: "Gift", desc: "Assorted Ajwa, Sukari & Safawi in a premium box. Perfect for Umrah gifts.", image: "images/giftbox.jpg", hue: 42,  options: [{ w: "Small", p: 60 }, { w: "Large", p: 110 }] }
  ],

  /* ---------- ACCOMMODATION & SERVICES ---------- */
  services: [
    { id: "hotel",   icon: "hotel",   title: "Hotels near Masjid Nabawi", desc: "Walking-distance stays for families and groups. Budget to premium." },
    { id: "umrah",   icon: "kaaba",   title: "Umrah pilgrim stays",       desc: "Comfortable rooms with caring support throughout your stay." },
    { id: "airport", icon: "plane",   title: "Airport pickup & transport", desc: "Madinah airport pickup, Makkah–Madinah transfers, train-station drops." },
    { id: "ziyarat", icon: "map",     title: "Ziyarat tours",             desc: "Guided visits to Quba, Uhud, Qiblatain and historic sites of Madinah." }
  ],

  /* ---------- VIDEOS / REELS ----------
     Supported types:
       { type: "mp4",       src: "videos/reel1.mp4", poster: "images/reel1.jpg", title: "..." }
       { type: "youtube",   src: "https://youtube.com/shorts/VIDEO_ID", title: "..." }
       { type: "facebook",  src: "https://www.facebook.com/reel/REEL_ID", title: "..." }
       { type: "instagram", src: "https://www.instagram.com/reel/REEL_ID/", title: "..." }
     Add the newest video at the TOP of the list. */
  videos: [
    { type: "facebook",  src: "",                          title: "Fresh Ajwa harvest — Madinah farms" },
    { type: "youtube",   src: "",                          title: "How we pack your dates" },
    { type: "mp4",       src: "",                          title: "Rooms near Masjid Nabawi" },
    { type: "instagram", src: "",                          title: "Customer reviews" }
  ],

  // Real customer reviews. The Reviews section stays hidden while this list is empty. Example:
  // { name: "Ahmed, Riyadh", text: "Fresh Ajwa, fast delivery. Ordering on WhatsApp was easy." },
  testimonials: [
  ]
};

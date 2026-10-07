/* ============================================================
   THALAL MADINAH — SITE SETTINGS (edit this file only)
   ഈ ഫയൽ മാത്രം edit ചെയ്താൽ മതി: number, prices, videos, links.
   ============================================================ */

window.SITE = {
  brand: "Thalal Madinah",
  tagline: "മദീനയിലെ സേവകർ",
  taglineEn: "Servants of Madinah — Premium Dates & Pilgrim Stays",

  // ⚠️ Replace with the real WhatsApp number: country code + number, no "+", spaces or dashes.
  // Example (Saudi): 9665XXXXXXXX   Example (India): 91XXXXXXXXXX
  whatsapp: "966500000000",

  currency: "₹", // change to "SAR " or "AED " if needed

  // Social media links. Leave "" to hide an icon.
  social: {
    facebook: "https://www.facebook.com/",   // ← Thalal Akbar Madinah Dates page URL
    instagram: "",
    youtube: "",
    tiktok: "",
    whatsappChannel: ""
  },

  stats: [
    { value: "52K+", label: "Facebook family" },
    { value: "15+", label: "Date varieties" },
    { value: "24/7", label: "WhatsApp support" }
  ],

  /* ---------- DATES CATALOG ----------
     image: put photos in thalal-madinah/images/ (e.g. images/ajwa.jpg).
     If the image is missing, a styled placeholder is shown instead.
     prices: SAMPLE values — update before going live. */
  products: [
    { id: "ajwa",    name: "Ajwa Al-Madinah", ml: "അജ്‌വ",   tag: "Bestseller", desc: "The Prophet's ﷺ beloved date. Soft, dark and rich — from the farms of Madinah.", image: "images/ajwa.jpg",    hue: 18,  options: [{ w: "500g", p: 1200 }, { w: "1kg", p: 2200 }] },
    { id: "sukari",  name: "Sukari (Qassim)", ml: "സുക്കരി", tag: "Sweetest",   desc: "Golden, caramel-like and melt-in-the-mouth. A family favourite.",              image: "images/sukari.jpg",  hue: 38,  options: [{ w: "500g", p: 550 },  { w: "1kg", p: 950 }] },
    { id: "safawi",  name: "Safawi",          ml: "സഫാവി",   tag: "Daily",      desc: "Long, dark and chewy with a mild sweetness. Perfect for everyday iftar.",     image: "images/safawi.jpg",  hue: 12,  options: [{ w: "500g", p: 600 },  { w: "1kg", p: 1050 }] },
    { id: "mabroom", name: "Mabroom",         ml: "മബ്റൂം",  tag: "Premium",    desc: "Slender, firm and less sweet — prized by date connoisseurs.",                image: "images/mabroom.jpg", hue: 24,  options: [{ w: "500g", p: 750 },  { w: "1kg", p: 1350 }] },
    { id: "medjool", name: "Medjool Jumbo",   ml: "മെജ്ദൂൾ", tag: "Jumbo",      desc: "Large, juicy and luxurious. Ideal for gifting.",                              image: "images/medjool.jpg", hue: 30,  options: [{ w: "500g", p: 900 },  { w: "1kg", p: 1650 }] },
    { id: "khudri",  name: "Khudri",          ml: "ഖുദ്‌രി", tag: "Value",      desc: "Soft brown dates with a light taste. Great value for bulk orders.",            image: "images/khudri.jpg",  hue: 28,  options: [{ w: "1kg", p: 650 },   { w: "3kg", p: 1800 }] },
    { id: "anbara",  name: "Anbara (Amber)",  ml: "അംബർ",    tag: "Rare",       desc: "Big, soft and rare Madinah variety with a delicate flavour.",                 image: "images/anbara.jpg",  hue: 20,  options: [{ w: "500g", p: 1100 }, { w: "1kg", p: 2000 }] },
    { id: "giftbox", name: "Madinah Gift Box", ml: "ഗിഫ്റ്റ് ബോക്സ്", tag: "Gift", desc: "Assorted Ajwa, Sukari & Safawi in a premium box. Perfect for Umrah gifts.", image: "images/giftbox.jpg", hue: 42,  options: [{ w: "Small", p: 1500 }, { w: "Large", p: 2800 }] }
  ],

  /* ---------- ACCOMMODATION & SERVICES ---------- */
  services: [
    { id: "hotel",   icon: "hotel",   title: "Hotels near Masjid Nabawi", desc: "Walking-distance stays for families and groups. Budget to premium." },
    { id: "umrah",   icon: "kaaba",   title: "Umrah pilgrim stays",       desc: "Comfortable rooms with Malayalam-speaking support throughout your stay." },
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

  testimonials: [
    { name: "Shameer, Malappuram", text: "Ajwa was super fresh and reached in 4 days. Ordering on WhatsApp was very easy." },
    { name: "Fathima, Kozhikode",  text: "They arranged our hotel near Haram and airport pickup for our Umrah family. Very caring service." },
    { name: "Rashid, Dubai",       text: "Bought gift boxes for the whole family. Premium packing, good price." }
  ]
};

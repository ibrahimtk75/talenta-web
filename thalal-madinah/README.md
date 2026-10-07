# Thalal Madinah — Website (മദീനയിലെ സേവകർ)

A fast, mobile-first website for **Thalal Akbar Madinah Dates**: a dates catalog, accommodation services and reels. Every order and enquiry goes **straight to WhatsApp** as a pre-filled message.

It's a plain static site (HTML, CSS and JS), with no server, database or monthly platform fee.

## Features
- **Order on WhatsApp** on every product: product name, size, quantity, price and total go into a pre-filled message
- **Cart → one WhatsApp order**: the customer adds several items plus name and address, and it all goes in one message
- **Accommodation & services**: hotels near Masjid Nabawi, Umrah stays, airport pickup, Ziyarat, plus a stay-enquiry form that also goes to WhatsApp
- **Reels / videos**: a swipeable vertical reel strip for Facebook reels, YouTube Shorts, Instagram reels and your own MP4s. Players load only when tapped, so the page stays fast on mobile data
- **Social links**: Facebook, Instagram, YouTube, TikTok and WhatsApp Channel
- 2026-style design: glass effects, bento layout, mobile bottom nav, floating WhatsApp button, dark mode, Malayalam + English

## ✏️ Edit `data.js` only (ഈ ഒരു ഫയൽ മാത്രം മാറ്റിയാൽ മതി)
| What | Where in `data.js` |
|---|---|
| WhatsApp number | `whatsapp: "9665XXXXXXXX"`: country code + number, no `+` or spaces |
| Currency | `currency: "₹"` (or `"SAR "`) |
| Facebook / Instagram links | `social: { ... }` |
| Products, prices, sizes | `products: [ ... ]`. **The prices are samples. Update them before going live** |
| Hotel / services | `services: [ ... ]` |
| Videos / reels | `videos: [ ... ]`: put the newest at the top |
| Reviews | `testimonials: [ ... ]` |

### Product photos
Save the photos as `images/ajwa.jpg`, `images/sukari.jpg`, and so on (square, about 800×800, under 150 KB). Until a photo is added, the card shows a styled placeholder.

### Adding a new video (വീഡിയോ ചേർക്കാൻ)
1. Post the reel on Facebook, YouTube or Instagram as usual.
2. Copy the link and add it at the top of `videos` in `data.js`:
   ```js
   { type: "facebook", src: "https://www.facebook.com/reel/123456", title: "New Ajwa stock" },
   { type: "youtube",  src: "https://youtube.com/shorts/abcdEFGhijk", title: "Packing video" },
   { type: "mp4",      src: "videos/hotel.mp4", poster: "images/hotel.jpg", title: "Our rooms" },
   ```
3. Save and re-deploy. Done ✅

> When you need a "login & upload from phone" admin panel, the same `videos` list can come from a free backend such as Supabase or Firebase. The site layout doesn't change.

## 🚀 Going live
1. **Hosting (free):** drag the `thalal-madinah` folder into [Netlify Drop](https://app.netlify.com/drop), or import it on Vercel or Cloudflare Pages.
2. **Domain:** buy `thalalmadinah.com` (or similar) and connect it in the hosting dashboard.
3. Share the link in the Facebook page bio, the WhatsApp Business catalog link and Instagram.

Local preview: `cd thalal-madinah && python3 -m http.server` → open http://localhost:8000

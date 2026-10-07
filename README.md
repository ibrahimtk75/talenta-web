# Thalal Madinah — Website

A fast, mobile-first website for **Thalal Akbar Madinah Dates**: a dates catalog, accommodation services and reels. Every order and enquiry goes **straight to WhatsApp** as a pre-filled message.

It's a plain static site (HTML, CSS and JS), with no server, database or monthly platform fee.

## Features
- **Full-screen hero video slider**: 3 autoplaying background videos with changing headline, progress bars, swipe on phones and arrows on desktop. Videos load only when needed, pause when off-screen, and fall back to still posters on data-saver or reduced-motion
- **Order on WhatsApp** on every product: product name, size, quantity, price and total go into a pre-filled message
- **Cart → one WhatsApp order**: the customer adds several items plus name and address, and it all goes in one message
- **Accommodation & services**: hotels near Masjid Nabawi, Umrah stays, airport pickup, Ziyarat, plus a stay-enquiry form that also goes to WhatsApp
- **Reels / videos**: a swipeable vertical reel strip for Facebook reels, YouTube Shorts, Instagram reels and your own MP4s. Players load only when tapped, so the page stays fast on mobile data
- **Social links**: Facebook, Instagram, YouTube, TikTok and WhatsApp Channel
- 2026-style design: glass effects, bento layout, mobile bottom nav, floating WhatsApp button, dark mode

## ✏️ Edit `data.js` only
| What | Where in `data.js` |
|---|---|
| WhatsApp number | `whatsapp: "9665XXXXXXXX"`: country code + number, no `+` or spaces. **Empty for now**: buttons open WhatsApp and the customer picks the chat |
| Hero video slider | `heroSlides: [ ... ]` |
| Currency | `currency: "SAR "` (Saudi Riyal) |
| Facebook / Instagram links | `social: { ... }` |
| Products, prices, sizes | `products: [ ... ]`. **The SAR prices are samples. Update them before going live** |
| Hotel / services | `services: [ ... ]` |
| Videos / reels | `videos: [ ... ]`: put the newest at the top |
| Reviews | `testimonials: [ ... ]`: the section stays hidden while empty |

### Product photos
Save the photos as `images/ajwa.jpg`, `images/sukari.jpg`, and so on (square, about 800×800, under 150 KB). Until a photo is added, the card shows a styled placeholder.

### Replacing the hero slider videos
The 3 clips in `videos/hero-*.mp4` are animated placeholders. Replace them with your own footage (date farm, packing, hotel, Masjid Nabawi):
- Landscape, 5–10 seconds, no sound needed, ideally under 2 MB
- Keep the same file names, or change the paths in `heroSlides`
- Also replace the matching still image `images/hero-*.jpg` (used while the video loads)
- Compress with: `ffmpeg -i input.mp4 -t 8 -vf scale=1280:-2 -c:v libx264 -crf 28 -an -movflags +faststart videos/hero-sunset.mp4`
- If you replace an MP4, delete or replace its `.webm` twin too (or remove the `webm:` line), so browsers don't play the old clip

### Adding a new video to the Reels section
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
**GitHub Pages (current):** the site is served from the `gh-pages` branch at
https://ibrahimtk75.github.io/talenta-web/. To update it after editing files in this folder:
```bash
git subtree split --prefix thalal-madinah -b gh-pages-new
git push -f origin gh-pages-new:gh-pages && git branch -D gh-pages-new
```
To use your own domain, add a `CNAME` file containing `thalalmadinah.com` in this folder, and point the domain's DNS to GitHub Pages (Settings → Pages → Custom domain).

**Other free hosts:**
1. **Hosting:** drag the `thalal-madinah` folder into [Netlify Drop](https://app.netlify.com/drop), or import it on Vercel or Cloudflare Pages.
2. **Domain:** buy `thalalmadinah.com` (or similar) and connect it in the hosting dashboard.
3. Share the link in the Facebook page bio, the WhatsApp Business catalog link and Instagram.

Local preview: `cd thalal-madinah && python3 -m http.server` → open http://localhost:8000

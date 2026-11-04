# Product Lens — ഏത് product-ന്റെയും ഫോട്ടോ എടുത്താൽ full details

Mobile app (installable PWA). It works on Android and iPhone.
Take a photo of any product or its packing (front, back label, barcode; up to 4 photos) and the AI shows you:

- Product name, brand, category, manufacturer, made-in country
- **Packing details**: pack type, material (PET/glass/carton…), whether it's recyclable, size, symbols
- Net quantity, MRP, barcode, mfg/expiry date, batch (when they're visible on the pack)
- Ingredients / materials, nutrition, how to use, storage, warnings, certifications, tips
- All text it read from the pack
- Results in **English / മലയാളം / हिन्दी / العربية**
- Scan history saved on the phone, plus a share button

It uses Claude vision (`claude-opus-5-5`) with structured JSON output. The API key stays on the server and never reaches the phone.

## Run locally

```bash
cd product-scanner
cp .env.example .env        # put your ANTHROPIC_API_KEY in .env
npm install
npm run dev                 # web on :5173, API on :8787
```
Open `http://<your-PC-IP>:5173` on your phone (same Wi-Fi).
Note: phone camera capture needs **HTTPS** outside localhost, so deploy it to test the camera on a phone.

## Deploy

**Option A: any Node host (Render / Railway / VPS)**
```bash
npm install && npm run build
ANTHROPIC_API_KEY=sk-ant-... npm start     # serves the app + /api/analyze on $PORT
```

**Option B: Vercel.** Create a new Vercel project with *Root Directory* = `product-scanner`.
Then add the env var `ANTHROPIC_API_KEY`. `api/analyze.mjs` becomes the serverless function.

## Install on phone
Open the deployed URL. Then:
- **Android (Chrome):** ⋮ → *Add to Home screen*
- **iPhone (Safari):** Share → *Add to Home Screen*

It then opens full-screen like a normal app.

## Play Store / App Store (later)
You can wrap the same app with [Capacitor](https://capacitorjs.com):
```bash
npm i @capacitor/core @capacitor/cli @capacitor/android && npx cap init && npx cap add android
```
Point the fetch URL in `src/App.tsx` at your deployed server (`https://your-domain/api/analyze`).

## Files
| Path | What |
|---|---|
| `src/App.tsx` | Camera/gallery, language, scan, history |
| `src/ProductCard.tsx` | Result screen |
| `src/image.ts` | Resizes photos on the phone before upload (faster, cheaper) |
| `server/analyze.mjs` | Claude prompt + JSON schema (edit here to add fields) |
| `server/index.mjs` | Node server (API + static files) |
| `api/analyze.mjs` | Vercel function |

Cost: roughly one Claude Opus call per scan with up to 4 compressed images. Watch usage in the Anthropic Console.

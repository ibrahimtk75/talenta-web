# Hard & Soft — Storefront (Homepage + Flagship Product Page)

Static HTML + Tailwind CSS + one vanilla-JS file. There is no framework and no build step to run the site.

```
hard-and-soft/
├── index.html            Homepage: hero, collection grid, flagship spotlight, savoir-faire, Art of Gifting, trust bar
├── product.html          Product page template (defaults to the flagship Wallet 6cc)
│                         product.html?sku=wallet-8cc | card-holder-6cc | money-clip-6cc  [&color=cognac]
├── COPY.md               Product descriptions, gifting copy, photography & logo prompts
├── assets/
│   ├── app.js            Catalogue, AED/USD toggle, bag drawer, personalisation, gallery, placeholder imagery
│   ├── tailwind.css      Compiled Tailwind (committed, so the site works offline/without a CDN)
│   ├── styles.css        Small hand-written extras (accordion, animations)
│   └── logo-monogram.svg H & S monogram
└── tailwind.config.cjs   Brand tokens (ink, ivory, bone, gold, stone, charcoal; Cormorant Garamond + Jost)
```

## Preview locally
```bash
cd hard-and-soft && python3 -m http.server 8000   # open http://localhost:8000
```

## After editing markup/classes, rebuild CSS
```bash
npx tailwindcss@3.4.16 -c tailwind.config.cjs -i assets/tailwind.src.css -o assets/tailwind.css --minify
```

## Things to replace before launch
- **Photography:** set `PRODUCTS[sku].photos = { obsidian: ['img/…1.jpg', …], … }` in `assets/app.js`. Until then, colour-accurate vector placeholders render.
- **Concierge contact:** `concierge@hardandsoft.com` is a placeholder (search the HTML/JS).
- **Checkout:** "Proceed to Secure Checkout" shows a notice. Wire it to Shopify / Stripe / your PSP.
- **Prices for 8cc, Card Holder and Money Clip** are proposals; the 6cc price is as briefed.

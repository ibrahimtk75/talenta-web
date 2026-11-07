/* ==========================================================================
   Hard & Soft — Maison of Exotic Leather
   Shared storefront logic: catalogue, currency, bag, product renderer,
   and vector placeholder imagery (swap for studio photography via `photos`).
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Safe storage (private mode / blocked storage tolerant) ---------- */
  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------- Colourways ---------- */
  const COLORS = {
    obsidian: { name: 'Obsidian Black', hex: '#1A1918', lining: '#0F0F0E' },
    cognac:   { name: 'Cognac Tan',     hex: '#8E522A', lining: '#5E3218' },
    espresso: { name: 'Espresso Ebony', hex: '#3A241A', lining: '#24160F' },
    navy:     { name: 'Midnight Navy',  hex: '#1D2940', lining: '#121A2A' },
    khaki:    { name: 'Sahara Khaki',   hex: '#B49D78', lining: '#7D6A4C' }
  };

  /* ---------- Catalogue ----------
     `photos` — when you have real studio photography, list the files per colour,
     e.g. photos: { obsidian: ['img/6cc-black-1.jpg', ...] }. Empty = vector placeholders. */
  const PRODUCTS = {
    'wallet-6cc': {
      ref: 'HS-OS-W6',
      name: 'Wallet 6cc',
      title: 'Wallet 6cc in Pure Full-Quill Ostrich Leather',
      subtitle: 'The signature bifold, cut from the crown of South African full-quill ostrich.',
      shape: 'bifold',
      price: { AED: 2450, USD: 680 },
      colors: ['obsidian', 'cognac', 'espresso', 'navy', 'khaki'],
      flagship: true,
      views: [
        { v: 'front', alt: 'Exterior at a 45-degree studio angle, showing the natural quill pattern and metallic emblem' },
        { v: 'open',  alt: 'Open interior with six credit card slots and two banknote compartments' },
        { v: 'macro', alt: 'Extreme macro close-up of ostrich quill follicles and hand saddle-stitching' },
        { v: 'hand',  alt: 'Wallet held in hand for scale' },
        { v: 'box',   alt: 'Presented inside the signature rigid gift box' }
      ],
      description: [
        'There are objects you carry, and objects that carry something of you. The Wallet 6cc belongs to the second kind.',
        'Each piece is cut from the crown of a single South African full-quill ostrich hide — the most coveted area of the skin, where the raised follicles gather into their densest, most dramatic pattern. No two crowns are alike, so no two wallets are alike: yours is, quite literally, one of one.',
        'Inside, a buttery full-grain calfskin lining frames six credit card slots, two full-length banknote compartments and two discreet slip pockets for receipts and cards you reach for less often. Edges are hand-painted and burnished in successive layers, and every seam is saddle-stitched by hand — a technique slower than any machine, and far more enduring.',
        'A quiet, hand-centred metallic emblem rests in the lower corner: a signature, never a shout.'
      ],
      specs: [
        ['Dimensions', '115 mm × 8 mm × 90 mm (W × D × H)'],
        ['Weight', '85 g'],
        ['Card slots', '6 credit card slots'],
        ['Banknotes', '2 full-length banknote compartments'],
        ['Additional', '2 slip pockets'],
        ['Exterior', '100% full-quill ostrich leather, South Africa'],
        ['Interior', 'Smooth full-grain calfskin lining'],
        ['Hardware', 'Hand-centred metallic emblem'],
        ['Reference', 'HS-OS-W6']
      ]
    },
    'wallet-8cc': {
      ref: 'HS-OS-W8',
      name: 'Wallet 8cc',
      title: 'Wallet 8cc in Pure Full-Quill Ostrich Leather',
      subtitle: 'Expanded capacity crafted in South African full-quill ostrich leather.',
      shape: 'bifold',
      price: { AED: 2850, USD: 775 },
      colors: ['obsidian', 'cognac', 'espresso'],
      views: [
        { v: 'front', alt: 'Exterior of the Wallet 8cc showing the crown quill pattern' },
        { v: 'open',  alt: 'Open interior with eight card slots and two banknote compartments' },
        { v: 'macro', alt: 'Macro detail of quill follicles and hand-stitching' },
        { v: 'box',   alt: 'Presented inside the signature rigid gift box' }
      ],
      description: [
        'Designed for the modern connoisseur who refuses to choose between capacity and a clean silhouette.',
        'The Wallet 8cc is cut from 100% genuine full-quill ostrich leather, positioned so the distinctive crown quill pattern sweeps across the exterior. Open it and the mood softens: a buttery full-grain calfskin interior, smooth to the touch and calm to the eye.',
        'Eight dedicated credit card slots, two generous compartments sized for international banknotes and two discreet slip pockets for receipts keep a well-travelled life in perfect order. Finished with our signature hand-centred metallic emblem.'
      ],
      specs: [
        ['Dimensions', '115 mm × 10 mm × 95 mm (W × D × H)'],
        ['Card slots', '8 credit card slots'],
        ['Banknotes', '2 compartments for international banknotes'],
        ['Additional', '2 slip pockets'],
        ['Exterior', '100% full-quill ostrich leather'],
        ['Interior', 'Smooth calfskin lining'],
        ['Reference', 'HS-OS-W8']
      ]
    },
    'card-holder-6cc': {
      ref: 'HS-OS-C6',
      name: 'Slim Card Holder 6cc',
      title: 'Slim Card Holder 6cc in Ostrich Leather',
      subtitle: 'Ultra-slim pocket silhouette with iconic exotic texture.',
      shape: 'card',
      price: { AED: 1450, USD: 395 },
      colors: ['obsidian', 'navy', 'khaki'],
      views: [
        { v: 'front', alt: 'Slim Card Holder 6cc showing the ostrich quill pattern' },
        { v: 'macro', alt: 'Macro detail of quill follicles' },
        { v: 'hand',  alt: 'Card holder held in hand for scale' },
        { v: 'box',   alt: 'Presented inside the signature rigid gift box' }
      ],
      description: [
        'A refined companion, tailored to disappear into the breast pocket of a suit jacket — and to be noticed the moment it reappears.',
        'The Slim Card Holder 6cc celebrates the natural suppleness and quiet resilience of pure ostrich leather. Its profile is minimal; its organisation is not: six credit card slots and a central top-opening pocket for folded banknotes or business cards.',
        'Because every hide carries its own constellation of follicles, every card holder is one of a kind.'
      ],
      specs: [
        ['Dimensions', '100 mm × 5 mm × 80 mm (W × D × H)'],
        ['Card slots', '6 credit card slots'],
        ['Central pocket', 'Top-opening pocket for folded notes or business cards'],
        ['Exterior', '100% full-quill ostrich leather'],
        ['Interior', 'Smooth calfskin & jacquard lining'],
        ['Reference', 'HS-OS-C6']
      ]
    },
    'money-clip-6cc': {
      ref: 'HS-OS-M6',
      name: 'Money Clip Wallet 6cc',
      title: 'Money Clip Wallet 6cc in Ostrich Leather',
      subtitle: 'Contemporary functionality meets heritage exotic craftsmanship.',
      shape: 'clip',
      price: { AED: 1950, USD: 530 },
      colors: ['obsidian', 'cognac'],
      views: [
        { v: 'front', alt: 'Money Clip Wallet 6cc exterior' },
        { v: 'open',  alt: 'Open interior with six angled card slots and palladium-finish money clip' },
        { v: 'macro', alt: 'Macro detail of quill follicles and stitching' },
        { v: 'box',   alt: 'Presented inside the signature rigid gift box' }
      ],
      description: [
        'Sleek architecture, effortless access. The Money Clip Wallet 6cc is engineered for those who carry only what matters.',
        'The exterior is wrapped in supple, abrasion-resistant full-quill ostrich leather. Inside, six angled card slots present your cards at a glance, while a polished palladium-finish spring clip holds banknotes firmly — and releases them with a single, satisfying motion.'
      ],
      specs: [
        ['Dimensions', '110 mm × 8 mm × 85 mm (W × D × H)'],
        ['Card slots', '6 angled card slots'],
        ['Banknotes', 'Palladium-finish spring money clip'],
        ['Exterior', '100% full-quill ostrich leather'],
        ['Hardware', 'Palladium-finish brass clip'],
        ['Reference', 'HS-OS-M6']
      ]
    }
  };

  /* ---------- Currency ---------- */
  let currency = store.get('hs_currency', 'AED');
  const fmt = (p) => currency === 'AED'
    ? 'AED ' + p.AED.toLocaleString('en-US')
    : '$' + p.USD.toLocaleString('en-US');
  const fmtAmount = (n, cur) => cur === 'AED' ? 'AED ' + n.toLocaleString('en-US') : '$' + n.toLocaleString('en-US');

  /* ---------- Colour helpers ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
    else { r *= 1 + amt; g *= 1 + amt; b *= 1 + amt; }
    return '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  }
  function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  /* ---------- Vector product imagery (studio placeholders) ---------- */
  let uid = 0;
  function quills(id, x, y, w, h, hex, opts) {
    const o = Object.assign({ size: 9, density: 1, seed: 7 }, opts || {});
    const r = rng(o.seed);
    const cx = x + w / 2, cy = y + h * 0.48;
    const step = o.size * 2.6 / o.density;
    let dots = '';
    for (let yy = y + step / 2; yy < y + h; yy += step * 0.86) {
      const off = (Math.round((yy - y) / step) % 2) * step / 2;
      for (let xx = x + off; xx < x + w; xx += step) {
        // crown: densest and largest at centre, fading to the edges
        const d = Math.hypot((xx - cx) / (w * 0.55), (yy - cy) / (h * 0.6));
        if (d > 1.08 || r() > 1.15 - d * 0.7) continue;
        const rad = o.size * (1.05 - d * 0.45) * (0.75 + r() * 0.5);
        const jx = xx + (r() - 0.5) * step * 0.5, jy = yy + (r() - 0.5) * step * 0.5;
        dots += `<circle cx="${jx.toFixed(1)}" cy="${jy.toFixed(1)}" r="${rad.toFixed(1)}" fill="url(#q${id})"/>`;
      }
    }
    return `<radialGradient id="q${id}" cx=".35" cy=".3" r=".75">
      <stop offset="0" stop-color="${shade(hex, 0.32)}"/><stop offset=".45" stop-color="${shade(hex, 0.08)}"/>
      <stop offset=".85" stop-color="${shade(hex, -0.28)}"/><stop offset="1" stop-color="${shade(hex, -0.45)}"/></radialGradient>
      <g data-dots>${dots}</g>`;
  }

  function emblem(x, y, s, foil) {
    const c = foil === 'palladium' ? '#D9DCDF' : '#C9A869';
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-22" y="-12" width="44" height="24" rx="2" fill="${shade(c, -0.25)}"/>
      <rect x="-20.5" y="-10.5" width="41" height="21" rx="1.5" fill="${c}"/>
      <text x="0" y="5" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="14" fill="${shade(c, -0.55)}" font-style="italic">H&amp;S</text></g>`;
  }

  function initialsText(x, y, size, initials, foil) {
    if (!initials) return '';
    const fill = foil === 'palladium' ? '#DDE0E3' : foil === 'blind' ? 'rgba(0,0,0,.35)' : '#D2B06E';
    return `<text x="${x}" y="${y}" font-family="Cormorant Garamond, Georgia, serif" font-size="${size}" letter-spacing="${size * 0.3}" fill="${fill}" style="paint-order:stroke" stroke="rgba(0,0,0,.25)" stroke-width="${foil === 'blind' ? 0 : 0.6}">${initials.replace(/[<>&]/g, '')}</text>`;
  }

  function leatherBody(id, x, y, w, h, rx, hex, qopts) {
    return `
      <clipPath id="c${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
      <linearGradient id="l${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${hex}"/>
      <g clip-path="url(#c${id})">${quills(id, x, y, w, h, hex, qopts)}</g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#l${id})"/>
      <rect x="${x + 11}" y="${y + 11}" width="${w - 22}" height="${h - 22}" rx="${Math.max(rx - 8, 3)}" fill="none"
        stroke="${shade(hex, 0.4)}" stroke-opacity=".55" stroke-width="2" stroke-dasharray="7 5"/>
      <rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="none" stroke="${shade(hex, -0.5)}" stroke-width="3"/>`;
  }

  function art(view, colorKey, shape, extra) {
    const c = COLORS[colorKey] || COLORS.obsidian;
    const hex = c.hex, id = 'hs' + (++uid);
    const e = extra || {};
    const bg = e.bg || '#FFFFFF';
    const W = shape === 'card' ? 360 : 430, H = shape === 'card' ? 290 : 340;
    let body = '';

    if (view === 'front') {
      const x = 400 - W / 2, y = 500 - H / 2;
      body = `
        <ellipse cx="410" cy="${y + H + 60}" rx="${W * 0.62}" ry="26" fill="#000" opacity=".12" filter="url(#b${id})"/>
        <g transform="translate(0 0) rotate(-8 400 500) skewX(-6)">
          <path d="M${x + W} ${y + 10} l14 10 v${H - 10} l-14 ${0}z" fill="${shade(hex, -0.45)}"/>
          <rect x="${x + 4}" y="${y + H - 4}" width="${W - 4}" height="12" rx="4" fill="${shade(hex, -0.5)}"/>
          ${leatherBody(id, x, y, W, H, 16, hex, { size: shape === 'card' ? 8 : 9.5, seed: 11 })}
          ${shape === 'card' ? `<path d="M${x + W * 0.32} ${y + 2} q${W * 0.18} 34 ${W * 0.36} 0" fill="none" stroke="${shade(hex, -0.5)}" stroke-width="3"/>` : ''}
          ${shape !== 'card' ? `<rect x="${x - 2}" y="${y}" width="10" height="${H}" rx="4" fill="${shade(hex, -0.35)}" opacity=".8"/>` : ''}
          ${emblem(x + W - 52, y + H - 36, 1, e.foil)}
          ${initialsText(x + 30, y + H - 28, 22, e.initials, e.foil)}
        </g>`;
    } else if (view === 'open') {
      const pw = 300, ph = 260, y = 370, lining = c.lining;
      const slots = (sx, n, angled) => {
        let s = '';
        for (let i = 0; i < n; i++) {
          const yy = y + 70 + i * 42;
          s += angled
            ? `<path d="M${sx + 26} ${yy + 24} L${sx + pw - 26} ${yy} v34 H${sx + 26}z" fill="${shade(lining, 0.08 + i * 0.03)}" stroke="${shade(lining, -0.4)}"/>`
            : `<path d="M${sx + 24} ${yy} h${pw - 48} v40 h-${pw - 48}z" fill="${shade(lining, 0.06 + i * 0.035)}" stroke="${shade(lining, -0.45)}"/>
               <path d="M${sx + 24} ${yy} q${(pw - 48) / 2} 16 ${pw - 48} 0" fill="none" stroke="${shade(lining, -0.5)}" stroke-width="1.5"/>
               <line x1="${sx + 30}" y1="${yy + 6}" x2="${sx + pw - 30}" y2="${yy + 6}" stroke="${shade(lining, 0.35)}" stroke-opacity=".5" stroke-dasharray="4 4"/>`;
        }
        return s;
      };
      const panel = (sx) => `
        <rect x="${sx}" y="${y}" width="${pw}" height="${ph}" rx="12" fill="${lining}"/>
        <rect x="${sx}" y="${y}" width="${pw}" height="${ph}" rx="12" fill="url(#l${id})"/>
        <rect x="${sx + 9}" y="${y + 9}" width="${pw - 18}" height="${ph - 18}" rx="7" fill="none" stroke="${shade(lining, 0.4)}" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const clip = shape === 'clip'
        ? `<rect x="430" y="${y + 70}" width="230" height="56" rx="10" fill="url(#m${id})" stroke="#8C9096"/>
           <rect x="440" y="${y + 80}" width="210" height="8" rx="4" fill="#fff" opacity=".6"/>
           <rect x="440" y="${y + 140}" width="210" height="90" rx="4" fill="#CFC3A8" opacity=".9"/>
           <rect x="450" y="${y + 150}" width="190" height="70" rx="3" fill="none" stroke="#9B8C6B" stroke-dasharray="3 3"/>`
        : slots(410, 3, false);
      body = `
        <linearGradient id="l${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
        <linearGradient id="m${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F3F5"/><stop offset=".5" stop-color="#B9BDC3"/><stop offset="1" stop-color="#E4E6E9"/></linearGradient>
        <ellipse cx="400" cy="${y + ph + 50}" rx="330" ry="22" fill="#000" opacity=".12" filter="url(#b${id})"/>
        <g transform="rotate(-3 400 500)">
          <rect x="88" y="${y - 6}" width="624" height="${ph + 12}" rx="16" fill="${hex}"/>
          ${panel(94)}${panel(406)}
          <rect x="396" y="${y}" width="8" height="${ph}" fill="${shade(lining, -0.5)}"/>
          ${slots(94, 3, shape === 'clip')}
          ${clip}
          <path d="M${94 + 20} ${y + 30} h${pw - 40}" stroke="${shade(lining, -0.55)}" stroke-width="3"/>
          <path d="M${406 + 20} ${y + 30} h${pw - 40}" stroke="${shade(lining, -0.55)}" stroke-width="3"/>
          <text x="250" y="${y + ph - 24}" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="9" letter-spacing="3" fill="${shade(lining, 0.45)}">HARD &amp; SOFT · MADE BY HAND</text>
        </g>`;
    } else if (view === 'macro') {
      body = `
        <rect width="800" height="1000" fill="${hex}"/>
        <g>${quills(id, -60, -60, 920, 960, hex, { size: 46, density: 1.1, seed: 23 })}</g>
        <rect width="800" height="1000" fill="url(#l${id})"/>
        <linearGradient id="l${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
        <rect x="0" y="830" width="800" height="170" fill="${shade(hex, -0.35)}"/>
        <rect x="0" y="826" width="800" height="8" fill="${shade(hex, -0.6)}"/>
        ${Array.from({ length: 17 }, (_, i) => `<rect x="${i * 50 - 6}" y="886" width="34" height="11" rx="5.5" transform="rotate(-24 ${i * 50 + 11} 891)" fill="${shade(hex, 0.55)}" stroke="${shade(hex, -0.2)}"/>`).join('')}
        <rect x="0" y="986" width="800" height="14" fill="${shade(hex, -0.7)}"/>`;
    } else if (view === 'hand') {
      const skin = '#C99B7A', skinD = '#A97A5B';
      const x = 400 - W * 0.42, y = 380, w = W * 0.84, h = H * 0.84;
      body = `
        <path d="M120 1000 C150 860 200 760 300 700 L560 640 C620 630 660 660 640 700 L520 760 C600 780 640 840 600 1000 Z" fill="${skin}"/>
        <path d="M300 700 L560 640" stroke="${skinD}" stroke-width="2" opacity=".5"/>
        <g transform="rotate(-10 400 520)">
          <ellipse cx="400" cy="${y + h + 26}" rx="${w * 0.55}" ry="16" fill="#000" opacity=".15" filter="url(#b${id})"/>
          ${leatherBody(id, x, y, w, h, 14, hex, { size: 8, seed: 5 })}
          ${emblem(x + w - 46, y + h - 32, 0.85, e.foil)}
        </g>
        <path d="M230 760 C250 640 300 560 360 540 C390 532 410 552 400 580 L360 680 C340 730 300 770 260 790 Z" fill="${skin}"/>
        <path d="M360 540 C380 536 396 548 394 566" stroke="#E6C7AF" stroke-width="6" fill="none" stroke-linecap="round"/>
        ${[0, 1, 2, 3].map((i) => `<path d="M${560 + i * 6} ${470 + i * 70} c60 0 80 30 70 52 c-8 18 -40 20 -70 18 z" fill="${skin}" stroke="${skinD}" stroke-width="1.5"/>`).join('')}`;
      // fingers wrap from behind on the right edge
    } else if (view === 'box') {
      const bw = 560, bh = 420, bx = 120, by = 420;
      const w = W * 0.78, h = H * 0.78, wx = 400 - w / 2, wy = by + 90;
      body = `
        <ellipse cx="400" cy="${by + bh + 40}" rx="330" ry="26" fill="#000" opacity=".18" filter="url(#b${id})"/>
        <g transform="rotate(-6 400 300)">
          <rect x="${bx + 10}" y="120" width="${bw - 20}" height="250" rx="6" fill="#141413"/>
          <rect x="${bx + 24}" y="134" width="${bw - 48}" height="222" rx="3" fill="none" stroke="#2A2927"/>
          <text x="400" y="248" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="40" letter-spacing="10" fill="#C9A869">HARD &amp; SOFT</text>
          <text x="400" y="282" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="10" letter-spacing="6" fill="#8E7A55">MAISON · EXOTIC LEATHER</text>
        </g>
        <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" fill="#141413"/>
        <rect x="${bx + 18}" y="${by + 18}" width="${bw - 36}" height="${bh - 36}" rx="4" fill="#EDE6DA"/>
        <path d="M${bx + 18} ${by + 18} l60 70 l60 -60 l70 80 l60 -70 l70 74 l60 -64 l60 70 l42 -100z" fill="#F6F1E8" opacity=".9"/>
        ${leatherBody(id, wx, wy, w, h, 12, hex, { size: 7.5, seed: 31 })}
        ${emblem(wx + w - 42, wy + h - 30, 0.8, e.foil)}
        ${initialsText(wx + 24, wy + h - 22, 18, e.initials, e.foil)}
        <rect x="${bx + bw - 190}" y="${by + bh - 120}" width="150" height="96" rx="2" fill="#FBF8F2" transform="rotate(6 ${bx + bw - 115} ${by + bh - 72})"/>
        <text x="${bx + bw - 172}" y="${by + bh - 78}" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="16" fill="#4A4036" transform="rotate(6 ${bx + bw - 115} ${by + bh - 72})">For you, always —</text>
        <rect x="${bx}" y="${by + bh - 14}" width="${bw}" height="14" fill="#0B0B0A"/>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" class="w-full h-full block" role="img">
      <defs><filter id="b${id}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="16"/></filter></defs>
      <rect width="800" height="1000" fill="${bg}"/>${body}</svg>`;
  }

  /* ---------- Bag ---------- */
  let bag = store.get('hs_bag', []);
  function saveBag() { store.set('hs_bag', bag); updateBagCount(); renderBag(); }
  function addToBag(item) {
    const key = item.sku + '|' + item.color + '|' + (item.initials || '') + '|' + (item.foil || '');
    const found = bag.find((b) => b.key === key);
    if (found) found.qty += 1; else bag.push(Object.assign({ key, qty: 1 }, item));
    saveBag();
    openBag();
  }
  function updateBagCount() {
    const n = bag.reduce((s, b) => s + b.qty, 0);
    document.querySelectorAll('[data-bag-count]').forEach((el) => {
      el.textContent = n; el.classList.toggle('opacity-0', n === 0);
    });
  }

  function injectBag() {
    if (document.getElementById('bag')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="bag-backdrop" class="fixed inset-0 bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300 z-[60]"></div>
      <aside id="bag" aria-label="Shopping bag" aria-hidden="true"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-ivory z-[70] translate-x-full transition-transform duration-500 ease-out flex flex-col">
        <div class="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <p class="text-[11px] tracking-[0.3em] uppercase">Your Bag</p>
          <button data-close-bag class="p-2 -mr-2" aria-label="Close bag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 5l14 14M19 5L5 19"/></svg>
          </button>
        </div>
        <div id="bag-items" class="flex-1 overflow-y-auto px-6"></div>
        <div class="border-t border-ink/10 px-6 py-6 space-y-4">
          <div class="flex justify-between text-sm"><span>Subtotal</span><span id="bag-subtotal">—</span></div>
          <p class="text-xs text-stone">Complimentary personalisation, signature gift box and insured express delivery included.</p>
          <a href="#" data-checkout class="block text-center bg-ink text-ivory text-[11px] tracking-[0.28em] uppercase py-4 hover:bg-black transition">Proceed to Secure Checkout</a>
          <a href="mailto:concierge@hardandsoft.com" class="block text-center text-[11px] tracking-[0.2em] uppercase underline underline-offset-4">Or complete with a Concierge</a>
        </div>
      </aside>
      <div id="toast" role="status" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-ivory text-xs tracking-wide px-5 py-3 opacity-0 pointer-events-none transition-opacity z-[80]"></div>`;
    document.body.appendChild(wrap);
    document.getElementById('bag-backdrop').addEventListener('click', closeBag);
    wrap.querySelector('[data-close-bag]').addEventListener('click', closeBag);
    wrap.querySelector('[data-checkout]').addEventListener('click', (ev) => {
      ev.preventDefault();
      toast(bag.length ? 'Checkout is not connected yet. Please contact our Concierge to complete your order.' : 'Your bag is empty.');
    });
    document.getElementById('bag-items').addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-act]');
      if (!btn) return;
      const item = bag.find((b) => b.key === btn.dataset.key);
      if (!item) return;
      if (btn.dataset.act === 'inc') item.qty++;
      if (btn.dataset.act === 'dec') item.qty--;
      if (btn.dataset.act === 'rm' || item.qty < 1) bag = bag.filter((b) => b !== item);
      saveBag();
    });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeBag(); });
  }

  function renderBag() {
    const el = document.getElementById('bag-items');
    if (!el) return;
    if (!bag.length) {
      el.innerHTML = `<div class="py-16 text-center"><p class="font-display text-2xl">Your bag is empty</p>
        <p class="text-sm text-stone mt-2">Discover the full-quill ostrich collection.</p>
        <a href="index.html#collection" class="inline-block mt-6 text-[11px] tracking-[0.25em] uppercase underline underline-offset-4">Explore</a></div>`;
      document.getElementById('bag-subtotal').textContent = '—';
      return;
    }
    el.innerHTML = bag.map((b) => {
      const p = PRODUCTS[b.sku];
      const col = COLORS[b.color];
      return `<div class="flex gap-4 py-6 border-b border-ink/10">
        <div class="w-20 h-24 bg-white shrink-0 overflow-hidden">${art('front', b.color, p.shape, { initials: b.initials, foil: b.foil })}</div>
        <div class="flex-1 text-sm">
          <p class="font-display text-lg leading-tight">${p.name}</p>
          <p class="text-stone text-xs mt-1">${col.name}</p>
          ${b.initials ? `<p class="text-stone text-xs">Personalised: <span class="tracking-[0.2em]">${b.initials}</span> · ${b.foilName || ''}</p>` : ''}
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center border border-ink/20">
              <button data-act="dec" data-key="${b.key}" class="w-8 h-8" aria-label="Decrease quantity">−</button>
              <span class="w-6 text-center">${b.qty}</span>
              <button data-act="inc" data-key="${b.key}" class="w-8 h-8" aria-label="Increase quantity">+</button>
            </div>
            <span>${fmtAmount(p.price[currency] * b.qty, currency)}</span>
          </div>
          <button data-act="rm" data-key="${b.key}" class="text-[11px] underline underline-offset-4 text-stone mt-2">Remove</button>
        </div></div>`;
    }).join('');
    const total = bag.reduce((s, b) => s + PRODUCTS[b.sku].price[currency] * b.qty, 0);
    document.getElementById('bag-subtotal').textContent = fmtAmount(total, currency);
  }

  function openBag() {
    renderBag();
    document.getElementById('bag').classList.remove('translate-x-full');
    document.getElementById('bag').setAttribute('aria-hidden', 'false');
    document.getElementById('bag-backdrop').classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }
  function closeBag() {
    const b = document.getElementById('bag');
    if (!b) return;
    b.classList.add('translate-x-full');
    b.setAttribute('aria-hidden', 'true');
    document.getElementById('bag-backdrop').classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.remove('opacity-0');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('opacity-0'), 3200);
  }

  /* ---------- Currency toggles & prices ---------- */
  function renderPrices() {
    document.querySelectorAll('[data-price]').forEach((el) => {
      const p = PRODUCTS[el.dataset.price]; if (p) el.textContent = fmt(p.price);
    });
    document.querySelectorAll('[data-currency-btn]').forEach((b) => {
      const on = b.dataset.currencyBtn === currency;
      b.classList.toggle('text-ink', on); b.classList.toggle('text-stone', !on);
      b.setAttribute('aria-pressed', on);
    });
    renderBag();
  }
  function bindCurrency() {
    document.querySelectorAll('[data-currency-btn]').forEach((b) => b.addEventListener('click', () => {
      currency = b.dataset.currencyBtn; store.set('hs_currency', currency); renderPrices();
    }));
  }

  /* ---------- Header behaviour ---------- */
  function bindHeader() {
    document.querySelectorAll('[data-open-bag]').forEach((b) => b.addEventListener('click', openBag));
    const menuBtn = document.querySelector('[data-menu-btn]');
    const menu = document.getElementById('mobile-menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        menuBtn.setAttribute('aria-expanded', open);
      });
    }
    const header = document.querySelector('[data-header]');
    if (header) {
      const onScroll = () => header.classList.toggle('shadow-[0_1px_0_rgba(0,0,0,.08)]', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- Product cards (homepage & related) ---------- */
  function renderCards(container, skus) {
    container.innerHTML = skus.map((sku) => {
      const p = PRODUCTS[sku];
      const first = p.colors[0];
      return `<a href="product.html?sku=${sku}" class="group block" data-card="${sku}">
        <div class="relative aspect-[4/5] bg-white overflow-hidden">
          <div class="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]" data-card-art>${art('front', first, p.shape)}</div>
          ${p.flagship ? '<span class="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-ivory/90 px-2.5 py-1">Flagship</span>' : ''}
        </div>
        <div class="pt-5">
          <p class="font-display text-xl leading-snug">${p.name}</p>
          <p class="text-xs text-stone mt-1">Full-Quill Ostrich Leather</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm" data-price="${sku}">${fmt(p.price)}</span>
            <span class="flex gap-1.5">${p.colors.map((k) => `<span data-swatch-hover="${k}" title="${COLORS[k].name}" class="w-3 h-3 rounded-full ring-1 ring-black/10" style="background:${COLORS[k].hex}"></span>`).join('')}</span>
          </div>
        </div></a>`;
    }).join('');
    container.querySelectorAll('[data-card]').forEach((card) => {
      const p = PRODUCTS[card.dataset.card];
      const holder = card.querySelector('[data-card-art]');
      card.querySelectorAll('[data-swatch-hover]').forEach((s) => s.addEventListener('mouseenter', () => {
        holder.innerHTML = art('front', s.dataset.swatchHover, p.shape);
      }));
    });
  }

  /* ---------- Product page ---------- */
  function initProduct() {
    const root = document.querySelector('[data-product-page]');
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const sku = PRODUCTS[params.get('sku')] ? params.get('sku') : 'wallet-6cc';
    const p = PRODUCTS[sku];
    const state = {
      color: p.colors.includes(params.get('color')) ? params.get('color') : p.colors[0],
      initials: '', foil: 'gold', foilName: 'Gold Foil'
    };

    // text fields
    const set = (sel, val) => document.querySelectorAll(sel).forEach((el) => { el.textContent = val; });
    set('[data-p="title"]', p.title);
    set('[data-p="name"]', p.name);
    set('[data-p="subtitle"]', p.subtitle);
    set('[data-p="ref"]', 'Ref. ' + p.ref);
    document.querySelectorAll('[data-p="price"]').forEach((el) => { el.dataset.price = sku; });
    document.title = p.title + ' | Hard & Soft';
    const desc = document.querySelector('[data-p="description"]');
    if (desc) desc.innerHTML = p.description.map((t) => `<p>${t}</p>`).join('');
    const specs = document.querySelector('[data-p="specs"]');
    if (specs) specs.innerHTML = p.specs.map(([k, v]) => `<div class="grid grid-cols-[120px_1fr] gap-4 py-2.5 border-b border-ink/5 last:border-0"><dt class="text-stone">${k}</dt><dd>${v}</dd></div>`).join('');

    // swatches
    const sw = document.querySelector('[data-swatches]');
    sw.innerHTML = p.colors.map((k) => `<button type="button" data-color="${k}" aria-label="${COLORS[k].name}" title="${COLORS[k].name}"
      class="w-9 h-9 rounded-full ring-offset-[3px] ring-offset-ivory transition" style="background:${COLORS[k].hex}"></button>`).join('');
    sw.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-color]'); if (!b) return;
      state.color = b.dataset.color; paint();
      const u = new URL(location.href); u.searchParams.set('sku', sku); u.searchParams.set('color', state.color);
      history.replaceState(null, '', u);
    });

    // gallery
    const gal = document.querySelector('[data-gallery]');
    const dots = document.querySelector('[data-gallery-dots]');
    function paintGallery() {
      const photos = p.photos && p.photos[state.color];
      gal.innerHTML = p.views.map((v, i) => `<figure class="snap-center shrink-0 w-full md:w-auto aspect-[4/5] bg-white overflow-hidden ${v.v === 'macro' ? 'cursor-zoom-in' : ''}" data-view="${v.v}">
        ${photos && photos[i] ? `<img src="${photos[i]}" alt="${v.alt}" class="w-full h-full object-cover" loading="${i ? 'lazy' : 'eager'}">`
          : `<div class="w-full h-full" aria-label="${v.alt}">${art(v.v, state.color, p.shape, { initials: state.initials, foil: state.foil })}</div>`}
        <figcaption class="sr-only">${v.alt}</figcaption></figure>`).join('');
      dots.innerHTML = p.views.map((_, i) => `<span class="w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-ink' : 'bg-ink/25'}"></span>`).join('');
    }
    gal.addEventListener('scroll', () => {
      const i = Math.round(gal.scrollLeft / gal.clientWidth);
      [...dots.children].forEach((d, j) => { d.className = 'w-1.5 h-1.5 rounded-full ' + (i === j ? 'bg-ink' : 'bg-ink/25'); });
    }, { passive: true });

    function paint() {
      sw.querySelectorAll('[data-color]').forEach((b) => {
        const on = b.dataset.color === state.color;
        b.classList.toggle('ring-1', on); b.classList.toggle('ring-ink', on);
        b.setAttribute('aria-pressed', on);
      });
      set('[data-p="color"]', COLORS[state.color].name);
      paintGallery();
      const tag = document.querySelector('[data-personal-tag]');
      tag.classList.toggle('hidden', !state.initials);
      tag.querySelector('span').textContent = state.initials ? `${state.initials} · ${state.foilName}` : '';
      set('[data-personalise-label]', state.initials ? 'Edit Personalisation' : 'Personalise (Add Initials)');
    }

    // personalisation modal
    const modal = document.getElementById('personalise');
    const input = modal.querySelector('input[name="initials"]');
    const preview = modal.querySelector('[data-preview]');
    let draftFoil = state.foil, draftFoilName = state.foilName;
    const drawPreview = () => {
      preview.innerHTML = art('front', state.color, p.shape, { initials: input.value.toUpperCase(), foil: draftFoil, bg: '#F3EFE7' });
    };
    const openModal = () => {
      input.value = state.initials; draftFoil = state.foil; draftFoilName = state.foilName;
      modal.querySelectorAll('[name="foil"]').forEach((r) => { r.checked = r.value === draftFoil; });
      drawPreview(); modal.classList.remove('hidden'); modal.classList.add('flex'); input.focus();
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = ''; };
    document.querySelectorAll('[data-open-personalise]').forEach((b) => b.addEventListener('click', openModal));
    modal.querySelectorAll('[data-close-personalise]').forEach((b) => b.addEventListener('click', closeModal));
    modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^a-zA-Z.]/g, '').toUpperCase().slice(0, 4); drawPreview();
    });
    modal.querySelectorAll('[name="foil"]').forEach((r) => r.addEventListener('change', () => {
      draftFoil = r.value; draftFoilName = r.dataset.label; drawPreview();
    }));
    modal.querySelector('form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      state.initials = input.value.trim(); state.foil = draftFoil; state.foilName = draftFoilName;
      closeModal(); paint();
      toast(state.initials ? `Personalisation “${state.initials}” saved` : 'Personalisation removed');
    });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

    document.querySelector('[data-add-to-bag]').addEventListener('click', () => {
      addToBag({ sku, color: state.color, initials: state.initials, foil: state.initials ? state.foil : '', foilName: state.initials ? state.foilName : '' });
    });

    // related
    const rel = document.querySelector('[data-related]');
    if (rel) renderCards(rel, Object.keys(PRODUCTS).filter((k) => k !== sku));

    paint();
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    injectBag();
    bindHeader();
    bindCurrency();
    document.querySelectorAll('[data-art]').forEach((el) => {
      const [view, color, sku] = el.dataset.art.split(':');
      el.innerHTML = art(view, color, (PRODUCTS[sku] || PRODUCTS['wallet-6cc']).shape, { bg: el.dataset.bg || '#FFFFFF' });
    });
    const grid = document.querySelector('[data-collection]');
    if (grid) renderCards(grid, Object.keys(PRODUCTS));
    initProduct();
    updateBagCount();
    renderPrices();
  });

  window.HardSoft = { PRODUCTS, COLORS, art, addToBag, openBag };
})();

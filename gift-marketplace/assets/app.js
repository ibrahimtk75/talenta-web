/* Giftnest storefront — vanilla JS, no dependencies.
 *
 *  ┌ Hero ───────────── entry price pulled from config/catalogue
 *  ├ Impulse rail ───── price ≤ tiers.entryMax, most-loved first
 *  └ Infinite feed ──── price > entryMax, ascending, grouped into
 *                       "Thoughtful" (mid) → "Premium & bundles" tiers
 *
 * Data comes from the demo catalogue (assets/data.js) or, when
 * GN_CONFIG.storeApi is set, the WooCommerce Store API with vendor
 * details added by wordpress/giftnest-vendor-storeapi.php (Dokan / WCFM).
 */
(function () {
  'use strict';

  var CFG = window.GN_CONFIG || {};
  var TIERS = CFG.tiers || { entryMax: 499, midMax: 1999 };
  var PAGE = CFG.pageSize || 8;
  var LIVE = !!CFG.storeApi;
  var API = LIVE ? CFG.storeApi.replace(/\/$/, '') + '/wp-json/wc/store/v1' : '';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var money = new Intl.NumberFormat(CFG.locale || 'en-IN', {
    style: 'currency', currency: CFG.currency || 'INR', maximumFractionDigits: 0,
  });
  var fmt = function (n) { return money.format(n); };

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var TONES = {
    rose:  ['#E7B8AA', '#C99484', '#FFF4F0', '#FBF0EC'],
    sage:  ['#C9DCC4', '#9DB596', '#FFFFFF', '#F1F5EF'],
    beige: ['#E9DCCB', '#C9A48F', '#FFFFFF', '#F8F3EC'],
    blush: ['#F0C9C0', '#D9A79A', '#FFF7F4', '#FCF1EE'],
    sand:  ['#E6D2B5', '#C7A780', '#FFF9F0', '#F8F2E8'],
    mist:  ['#D3DCE3', '#A9B8C4', '#FFFFFF', '#F2F5F7'],
  };
  var TONE_KEYS = Object.keys(TONES);
  var toneVars = function (tone) {
    var t = TONES[tone] || TONES.beige;
    return '--c1:' + t[0] + ';--c2:' + t[1] + ';--c3:' + t[2] + ';--c4:' + t[3];
  };

  var tierOf = function (price) {
    return price <= TIERS.entryMax ? 'entry' : price <= TIERS.midMax ? 'mid' : 'premium';
  };

  /* ───────────────────────── Data sources ───────────────────────── */

  var registry = {}; // id → product, for cart + upsell lookups
  var remember = function (list) { list.forEach(function (p) { registry[p.id] = p; }); return list; };

  // Demo source: same contract as the live source.
  var demo = {
    list: function (o) {
      var q = (o.q || '').toLowerCase();
      var all = (window.GN_DATA ? window.GN_DATA.products : []).filter(function (p) {
        if (o.cat && o.cat !== 'all' && p.category !== o.cat) return false;
        if (q && (p.title + ' ' + p.vendor + ' ' + p.category).toLowerCase().indexOf(q) < 0) return false;
        if (o.min != null && p.price < o.min) return false;
        if (o.max != null && p.price > o.max) return false;
        return true;
      });
      all.sort(o.sort === 'popular'
        ? function (a, b) { return b.reviews - a.reviews; }
        : function (a, b) { return a.price - b.price; });
      var start = (o.page - 1) * o.per;
      var items = all.slice(start, start + o.per);
      return Promise.resolve({ items: remember(items), done: start + o.per >= all.length });
    },
  };

  // Live source: WooCommerce Store API (public, no auth, cache-friendly GETs).
  var decode = function (html) {
    var t = document.createElement('textarea');
    t.innerHTML = html || '';
    return t.value;
  };
  var normalise = function (p) {
    var unit = Math.pow(10, (p.prices && p.prices.currency_minor_unit) || 0);
    var price = Number(p.prices && p.prices.price) / unit || 0;
    var regular = Number(p.prices && p.prices.regular_price) / unit || 0;
    var v = (p.extensions && p.extensions.giftnest && p.extensions.giftnest.vendor) || {};
    var cat = (p.categories && p.categories[0] && p.categories[0].slug) || '';
    var img = p.images && p.images[0];
    var tags = (p.tags || []).map(function (t) { return t.slug; });
    return {
      id: p.id,
      title: decode(p.name),
      vendor: v.name || '',
      vendorRating: Number(v.rating) || 0,
      vendorUrl: v.url || '',
      price: price,
      compareAt: regular > price ? regular : 0,
      rating: Number(p.average_rating) || 0,
      reviews: p.review_count || 0,
      category: cat,
      art: 'box',
      tone: TONE_KEYS[p.id % TONE_KEYS.length],
      badge: p.on_sale ? 'Sale' : '',
      personalisable: tags.indexOf('personalised') > -1 || tags.indexOf('personalisable') > -1,
      bundle: tags.indexOf('bundle') > -1 || p.type === 'bundle' || p.type === 'grouped',
      image: img ? (img.thumbnail || img.src) : '',
      imageAlt: img ? img.alt : '',
      url: p.permalink,
    };
  };
  var live = {
    list: function (o) {
      var minor = Math.pow(10, 2); // Store API price filters use minor units
      var qs = new URLSearchParams({
        per_page: String(o.per),
        page: String(o.page),
        orderby: o.sort === 'popular' ? 'popularity' : 'price',
        order: o.sort === 'popular' ? 'desc' : 'asc',
        stock_status: 'instock',
      });
      if (o.cat && o.cat !== 'all') qs.set('category', o.cat);
      if (o.q) qs.set('search', o.q);
      if (o.min != null) qs.set('min_price', String(Math.round(o.min * minor)));
      if (o.max != null) qs.set('max_price', String(Math.round(o.max * minor)));
      return fetch(API + '/products?' + qs, { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          var pages = Number(r.headers.get('X-WP-TotalPages')) || 1;
          return r.json().then(function (rows) {
            return { items: remember(rows.map(normalise)), done: o.page >= pages || rows.length < o.per };
          });
        });
    },
  };

  var source = LIVE ? live : demo;

  /* ───────────────────────── Rendering ───────────────────────── */

  var artHTML = function (p, cls) {
    if (p.image) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || '') + '" loading="lazy" decoding="async" width="300" height="300"' + (cls ? ' class="' + cls + '"' : '') + '>';
    }
    return '<svg aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '><use href="#m-' + esc(p.art || 'box') + '"/></svg>';
  };

  var cardHTML = function (p) {
    var off = p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    var tags = '';
    if (p.personalisable) tags += '<span class="gn-tag gn-tag--rose">Personalise</span>';
    if (p.bundle) tags += '<span class="gn-tag">Bundle</span>';
    var vendor = p.vendor
      ? '<div class="gn-vendor dokan-store-name wcfmmp_sold_by_wrapper">' +
          '<a href="' + esc(p.vendorUrl || '#') + '">' + esc(p.vendor) + '</a>' +
          (p.vendorRating ? '<span class="gn-vendor__rate" aria-label="Vendor rated ' + p.vendorRating.toFixed(1) + ' out of 5"><svg aria-hidden="true"><use href="#i-star"/></svg>' + p.vendorRating.toFixed(1) + '</span>' : '') +
        '</div>'
      : '';
    return (
      '<li class="product type-product gn-card in post-' + p.id + '" data-id="' + p.id + '" style="' + toneVars(p.tone) + '">' +
        '<div class="gn-card__media">' +
          '<a class="woocommerce-LoopProduct-link" href="' + esc(p.url) + '" aria-label="' + esc(p.title) + '" style="position:absolute;inset:0">' + artHTML(p) + '</a>' +
          (p.badge ? '<span class="gn-card__badge">' + esc(p.badge) + '</span>' : '') +
          '<button class="gn-card__add button add_to_cart_button ajax_add_to_cart" data-product_id="' + p.id + '" aria-label="Add ' + esc(p.title) + ' to bag">' +
            '<svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="gn-card__body">' +
          vendor +
          '<a href="' + esc(p.url) + '"><h3 class="woocommerce-loop-product__title">' + esc(p.title) + '</h3></a>' +
          '<span class="price"><ins>' + fmt(p.price) + '</ins>' +
            (off ? '<del>' + fmt(p.compareAt) + '</del><span class="off">' + off + '% off</span>' : '') +
          '</span>' +
          (tags ? '<div class="gn-tags">' + tags + '</div>' : '') +
        '</div>' +
      '</li>'
    );
  };

  var skeletons = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<li aria-hidden="true"><div class="sk"></div><div class="sk-line"></div><div class="sk-line" style="width:40%"></div></li>';
    return s;
  };

  /* ───────────────────────── State ───────────────────────── */

  var state = { cat: 'all', q: '', railMax: 0 };

  /* Impulse rail */
  var railTrack = $('#railTrack');
  var railReq = 0;
  function loadRail() {
    var req = ++railReq;
    railTrack.innerHTML = skeletons(4);
    var max = state.railMax || TIERS.entryMax;
    source.list({ page: 1, per: 12, cat: state.cat, q: state.q, max: max, sort: 'popular' })
      .then(function (r) {
        if (req !== railReq) return;
        railTrack.innerHTML = r.items.length
          ? r.items.map(cardHTML).join('')
          : '<li class="empty" style="grid-column:1/-1">No little gifts here yet. Try another category.</li>';
        syncAdded();
      })
      .catch(function () { if (req === railReq) railTrack.innerHTML = '<li class="empty">Couldn’t load gifts. Pull to refresh.</li>'; });
  }

  /* Infinite upsell feed */
  var feedBody = $('#feedBody');
  var feedStatus = $('#feedStatus');
  var feed = { page: 1, done: false, busy: false, tier: null, grid: null, req: 0, count: 0 };

  var TIER_COPY = {
    entry:   { art: 'card',    tone: 'beige', h: 'Little treats', p: 'Easy, delightful add-ons.' },
    mid:     { art: 'flowers', tone: 'sage',  h: 'Thoughtful gifts', p: function () { return fmt(TIERS.entryMax + 1) + ' – ' + fmt(TIERS.midMax) + ' · kits, keepsakes & personalised picks'; } },
    premium: { art: 'hamper',  tone: 'rose',  h: 'Premium & bundles', p: function () { return 'From ' + fmt(TIERS.midMax + 1) + ' · hampers & bundles from top-rated vendors'; } },
  };

  function openTier(tier) {
    var c = TIER_COPY[tier];
    var sec = document.createElement('div');
    sec.className = 'tier tier--' + tier;
    sec.innerHTML =
      '<div class="tier__head" style="' + toneVars(c.tone) + '">' +
        '<span class="tier__dot"><svg aria-hidden="true"><use href="#m-' + c.art + '"/></svg></span>' +
        '<div><h3>' + c.h + '</h3><p>' + (typeof c.p === 'function' ? c.p() : c.p) + '</p></div>' +
      '</div>' +
      '<ul class="products grid columns-4"></ul>';
    feedBody.appendChild(sec);
    feed.tier = tier;
    feed.grid = $('ul', sec);
  }

  function resetFeed() {
    feed.req++;
    feed.page = 1; feed.done = false; feed.busy = false; feed.tier = null; feed.grid = null; feed.count = 0;
    feedBody.innerHTML = '';
    feedStatus.textContent = '';
    loadMore();
  }

  function loadMore() {
    if (feed.busy || feed.done) return;
    feed.busy = true;
    var req = feed.req;
    var skel = document.createElement('ul');
    skel.className = 'products grid';
    skel.innerHTML = skeletons(PAGE >= 4 ? 4 : PAGE);
    feedBody.appendChild(skel);

    source.list({ page: feed.page, per: PAGE, cat: state.cat, q: state.q, min: TIERS.entryMax + 0.01, sort: 'price' })
      .then(function (r) {
        skel.remove();
        if (req !== feed.req) return;
        r.items.forEach(function (p) {
          var t = tierOf(p.price);
          if (t !== feed.tier) openTier(t);
          feed.grid.insertAdjacentHTML('beforeend', cardHTML(p));
        });
        feed.count += r.items.length;
        feed.page++;
        feed.done = r.done;
        feed.busy = false;
        if (feed.done) {
          feedStatus.innerHTML = feed.count
            ? 'You’ve seen every gift here. <a href="#corporate"><u>Need 25+? Get bulk pricing</u></a>'
            : 'Nothing above ' + fmt(TIERS.entryMax) + ' matches yet.';
        }
        syncAdded();
        // If the page is still short (big screens), keep filling.
        requestAnimationFrame(checkSentinel);
      })
      .catch(function () {
        skel.remove();
        feed.busy = false;
        if (req === feed.req) feedStatus.innerHTML = 'Couldn’t load more gifts. <button class="pill" id="retry">Retry</button>';
      });
  }

  var sentinel = $('#sentinel');
  function checkSentinel() {
    if (sentinel.getBoundingClientRect().top < window.innerHeight + 800) loadMore();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) loadMore(); }, { rootMargin: '800px 0px' }).observe(sentinel);
  } else {
    window.addEventListener('scroll', checkSentinel, { passive: true });
  }

  /* ───────────────────────── Cart ───────────────────────── */

  var CART_KEY = 'gn_cart_v1';
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
  var saveCart = function () { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} };
  var snapshot = function (p) {
    return { id: p.id, title: p.title, price: p.price, vendor: p.vendor, art: p.art, tone: p.tone, image: p.image, url: p.url };
  };
  var line = function (id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i]; return null; };
  var subtotal = function () { return cart.reduce(function (s, l) { return s + l.p.price * l.qty; }, 0); };
  var count = function () { return cart.reduce(function (s, l) { return s + l.qty; }, 0); };

  // Mirror to the WooCommerce cart when live (same-origin deployment).
  var nonce = null;
  function wcAdd(id, qty) {
    if (!LIVE) return;
    var go = function () {
      return fetch(API + '/cart/add-item', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', Nonce: nonce || '' },
        body: JSON.stringify({ id: id, quantity: qty }),
      });
    };
    var ready = nonce ? Promise.resolve() : fetch(API + '/cart', { credentials: 'include' }).then(function (r) { nonce = r.headers.get('Nonce'); });
    ready.then(go).catch(function () {});
  }

  function add(id) {
    var p = registry[id];
    if (!p) return;
    var l = line(id);
    if (l) l.qty++; else cart.push({ id: id, qty: 1, p: snapshot(p) });
    saveCart();
    wcAdd(id, 1);
    renderCart();
    toast('Added: ' + p.title);
    var n = $('#cartCount');
    n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
  }

  function setQty(id, qty) {
    cart = cart.filter(function (l) { if (l.id === id) l.qty = qty; return l.qty > 0; });
    saveCart();
    renderCart();
  }

  function upsellPicks() {
    var inCart = {};
    cart.forEach(function (l) { inCart[l.id] = 1; });
    var pool = Object.keys(registry).map(function (k) { return registry[k]; }).filter(function (p) { return !inCart[p.id]; });
    var gap = (CFG.freeShippingAt || 0) - subtotal();
    var picks;
    if (gap > 0) {
      // Smallest gifts that unlock free delivery, then the closest-priced fillers.
      picks = pool.filter(function (p) { return p.price >= gap; }).sort(function (a, b) { return a.price - b.price; }).slice(0, 2)
        .concat(pool.filter(function (p) { return p.price < gap; }).sort(function (a, b) { return b.price - a.price; }).slice(0, 2));
    } else {
      // Over the threshold: nudge to a premium/bundle upgrade plus one impulse add-on.
      picks = pool.filter(function (p) { return p.bundle || tierOf(p.price) === 'premium'; }).sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); }).slice(0, 2)
        .concat(pool.filter(function (p) { return tierOf(p.price) === 'entry'; }).sort(function (a, b) { return (b.reviews || 0) - (a.reviews || 0); }).slice(0, 2));
    }
    return picks;
  }

  function thumb(p) {
    return '<span class="citem__img" style="' + toneVars(p.tone) + '">' + artHTML(p) + '</span>';
  }

  function renderCart() {
    var n = count();
    var cc = $('#cartCount');
    cc.hidden = !n;
    cc.textContent = n;
    var fab = $('#fab');
    fab.hidden = !n;
    $('#fabLabel').textContent = 'View bag · ' + fmt(subtotal());

    var list = $('#cartList');
    list.innerHTML = cart.length
      ? cart.map(function (l) {
          return '<li class="citem">' + thumb(l.p) +
            '<div><p class="citem__t">' + esc(l.p.title) + '</p>' +
              (l.p.vendor ? '<p class="citem__v">Sold by ' + esc(l.p.vendor) + '</p>' : '') +
              '<div class="qty"><button data-q="' + l.id + '" data-d="-1" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button data-q="' + l.id + '" data-d="1" aria-label="Increase quantity">+</button></div>' +
            '</div>' +
            '<p class="citem__p">' + fmt(l.p.price * l.qty) + '</p></li>';
        }).join('')
      : '<li class="cart__empty">Your bag is empty. Start with something small and sweet.</li>';

    var sub = subtotal();
    var free = CFG.freeShippingAt || 0;
    var gap = free - sub;
    $('#ship').hidden = !free || !cart.length;
    $('#shipMsg').innerHTML = gap > 0
      ? 'Add <b>' + fmt(gap) + '</b> more for <b>free delivery</b>'
      : '🎉 You’ve unlocked <b>free delivery</b>';
    $('#shipBar').style.width = Math.min(100, (sub / (free || 1)) * 100) + '%';
    $('#cartTotal').textContent = fmt(sub);

    var picks = cart.length ? upsellPicks() : [];
    $('#upsell').innerHTML = picks.length
      ? '<h3>' + (gap > 0 ? 'Complete the gift' : 'Make it extra special') + '</h3><div class="ups">' +
          picks.map(function (p) {
            return '<div class="ups__i">' + thumb(p) + '<div><p>' + esc(p.title) + '</p><b>' + fmt(p.price) + '</b></div>' +
              '<button data-add="' + p.id + '" aria-label="Add ' + esc(p.title) + '"><svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg></button></div>';
          }).join('') + '</div>'
      : '';
    syncAdded();
  }

  function syncAdded() {
    $$('.gn-card__add').forEach(function (b) {
      b.classList.toggle('is-added', !!line(Number(b.getAttribute('data-product_id'))));
    });
  }

  /* Drawer */
  var drawer = $('#cart');
  var scrim = $('#scrim');
  var lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    requestAnimationFrame(function () { scrim.classList.add('is-on'); drawer.classList.add('is-open'); });
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    drawer.focus();
  }
  function closeCart() {
    scrim.classList.remove('is-on');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    setTimeout(function () { scrim.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }

  /* Toast */
  var toastEl = $('#toast');
  var toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1800);
  }

  /* ───────────────────────── Events ───────────────────────── */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-product_id],[data-add],[data-q],#retry,.chip,.pill[data-max]');
    if (!t) return;
    if (t.hasAttribute('data-product_id')) { e.preventDefault(); add(Number(t.getAttribute('data-product_id'))); return; }
    if (t.hasAttribute('data-add')) { add(Number(t.getAttribute('data-add'))); return; }
    if (t.hasAttribute('data-q')) {
      var id = Number(t.getAttribute('data-q'));
      var l = line(id);
      if (l) setQty(id, l.qty + Number(t.getAttribute('data-d')));
      return;
    }
    if (t.id === 'retry') { feedStatus.textContent = ''; loadMore(); return; }
    if (t.classList.contains('chip')) {
      $$('.chip').forEach(function (c) { var on = c === t; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
      state.cat = t.getAttribute('data-cat');
      t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      refresh();
      return;
    }
    if (t.hasAttribute('data-max')) {
      $$('.pill[data-max]').forEach(function (c) { c.classList.toggle('is-on', c === t); });
      state.railMax = Number(t.getAttribute('data-max'));
      loadRail();
    }
  });

  function refresh() { loadRail(); resetFeed(); }

  var qT;
  $('#q').addEventListener('input', function (e) {
    clearTimeout(qT);
    qT = setTimeout(function () { state.q = e.target.value.trim(); refresh(); }, 250);
  });
  $('#searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.q = $('#q').value.trim();
    refresh();
    $('#impulse').scrollIntoView({ behavior: 'smooth' });
  });

  $('#cartOpen').addEventListener('click', openCart);
  $('#fab').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeCart(); });

  $('#checkout').addEventListener('click', function (e) {
    if (!cart.length) { e.preventDefault(); toast('Your bag is empty'); return; }
    if (LIVE) { this.href = CFG.storeApi.replace(/\/$/, '') + (CFG.checkoutUrl || '/checkout/'); return; }
    e.preventDefault();
    toast('Demo mode: connect WooCommerce to check out');
  });

  var hdr = $('.hdr');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; });
  }, { passive: true });

  /* ───────────────────────── Boot ───────────────────────── */

  (function initCopy() {
    var under = fmt(TIERS.entryMax);
    $('#heroUnder').textContent = under;
    $('#railUnder').textContent = under;
    $('#yr').textContent = new Date().getFullYear();
    $('#corpCta').href = 'mailto:' + (CFG.corporateEmail || '') + '?subject=' + encodeURIComponent('Bulk gifting enquiry');
    $('#vendorCta').href = CFG.vendorSignupUrl || '#';
    if (!LIVE && window.GN_DATA) {
      var min = Math.min.apply(null, window.GN_DATA.products.map(function (p) { return p.price; }));
      $('#heroFrom').textContent = fmt(min);
      $('#heroTag').textContent = fmt(min);
    } else {
      // Live: ask the store for its cheapest in-stock gift.
      source.list({ page: 1, per: 1, sort: 'price' }).then(function (r) {
        if (!r.items[0]) return;
        $('#heroFrom').textContent = fmt(r.items[0].price);
        $('#heroTag').textContent = fmt(r.items[0].price);
      }).catch(function () {});
    }
    // Price pills follow the configured currency.
    $$('.pill[data-max]').forEach(function (b) {
      var m = Number(b.getAttribute('data-max'));
      if (m) b.textContent = 'Under ' + fmt(m);
    });
  })();

  // Seed the registry with cart snapshots so upsell/qty work before products load.
  cart.forEach(function (l) { if (!registry[l.id]) registry[l.id] = l.p; });

  loadRail();
  resetFeed();
  renderCart();
})();

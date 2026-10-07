(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (sel) { return document.querySelector(sel); };
  var money = function (n) { return S.currency.trim() + "\u00a0" + Number(n).toLocaleString("en-US"); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  // With no number set, wa.me opens WhatsApp and lets the customer pick a chat,
  // so orders never go to a wrong number by accident.
  var waNumber = String(S.whatsapp || "").replace(/\D/g, "");
  if (!waNumber) console.warn("Thalal Madinah: set your WhatsApp number in data.js");
  var waLink = function (text) {
    return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : "");
  };
  var openWa = function (text) { window.open(waLink(text), "_blank", "noopener"); };

  /* ---------- Static bindings ---------- */
  /* ---------- Hero video slider ---------- */
  (function heroSlider() {
    var slides = S.heroSlides || [], hero = $("#hero");
    if (!slides.length) return;
    var DUR = 7000, cur = -1, timer = null, paused = false;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var hi = function (t) { return esc(t).replace(/\*(.+?)\*/g, "<em>$1</em>"); };

    $("#heroSlides").innerHTML = slides.map(function (s) {
      return '<div class="hero-slide" style="background-image:url(' + esc(s.poster || "") + ')">' +
        (s.video && !reduce && !saveData ? '<video muted loop playsinline preload="none" poster="' + esc(s.poster || "") + '">' +
          (s.webm ? '<source data-src="' + esc(s.webm) + '" type="video/webm">' : "") +
          '<source data-src="' + esc(s.video) + '" type="video/mp4"></video>' : "") + "</div>";
    }).join("");
    $("#heroDots").innerHTML = slides.map(function (s, i) {
      return '<button class="hero-dot" role="tab" aria-label="Slide ' + (i + 1) + '"><i></i></button>';
    }).join("");
    hero.style.setProperty("--dur", DUR + "ms");
    var els = hero.querySelectorAll(".hero-slide"), dots = hero.querySelectorAll(".hero-dot"), inner = hero.querySelector(".hero-inner");

    function load(v) { // sources are attached only when needed, so the page stays light
      if (v.dataset.loaded) return;
      v.querySelectorAll("source").forEach(function (s) { s.src = s.dataset.src; });
      v.dataset.loaded = 1; v.load();
    }
    function play(v) {
      if (!v) return;
      load(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {}); // autoplay may be blocked; poster stays visible
    }
    function go(n) {
      n = (n + slides.length) % slides.length;
      if (n === cur) return;
      var s = slides[n];
      els.forEach(function (el, i) {
        el.classList.toggle("active", i === n);
        var v = el.querySelector("video");
        if (v && i !== n) v.pause();
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("done", i < n); d.classList.remove("active"); d.setAttribute("aria-selected", i === n);
      });
      void dots[n].offsetWidth; dots[n].classList.add("active");
      var v = els[n].querySelector("video"); if (v) { if (v.dataset.loaded) v.currentTime = 0; play(v); }
      // preload the next clip in the background
      var nv = els[(n + 1) % slides.length].querySelector("video"); if (nv) { nv.preload = "auto"; load(nv); }
      $("#heroEyebrow").textContent = s.eyebrow || S.tagline;
      $("#heroTitle").innerHTML = hi(s.title || "");
      $("#heroText").textContent = s.text || "";
      var cta = $("#heroCta"); cta.textContent = (s.cta && s.cta.label) || "Shop Dates"; cta.href = (s.cta && s.cta.href) || "#dates";
      // second button points to whichever section the main button doesn't
      var toStays = cta.getAttribute("href") === "#stays", cta2 = $("#heroCta2");
      cta2.textContent = toStays ? "Shop Dates" : "Book a Stay"; cta2.href = toStays ? "#dates" : "#stays";
      inner.classList.remove("swap"); void inner.offsetWidth; inner.classList.add("swap");
      cur = n; schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (!paused && !reduce && slides.length > 1) timer = setTimeout(function () { go(cur + 1); }, DUR);
    }
    function setPaused(p) { paused = p; hero.classList.toggle("paused", p); if (p) clearTimeout(timer); else schedule(); }

    $("#heroNext").addEventListener("click", function () { go(cur + 1); });
    $("#heroPrev").addEventListener("click", function () { go(cur - 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    // swipe on touch screens
    var x0 = null;
    hero.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
    });
    // pause when hovered, off-screen or tab hidden (saves battery & data)
    hero.addEventListener("mouseenter", function () { setPaused(true); });
    hero.addEventListener("mouseleave", function () { setPaused(false); });
    document.addEventListener("visibilitychange", function () {
      var v = els[cur] && els[cur].querySelector("video");
      if (document.hidden) { setPaused(true); if (v) v.pause(); } else { setPaused(false); play(v); }
    });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
      var v = els[cur] && els[cur].querySelector("video");
      if (en[0].isIntersecting) play(v); else if (v) v.pause();
    }).observe(hero);
    go(0);
  })();

  document.querySelectorAll("[data-bind]").forEach(function (el) { el.textContent = S[el.dataset.bind] || ""; });
  $("#year").textContent = new Date().getFullYear();
  $("#stats").innerHTML = S.stats.map(function (s) {
    return "<li><b>" + esc(s.value) + "</b><span>" + esc(s.label) + "</span></li>";
  }).join("");
  var marqueeItems = S.products.map(function (p) { return "✦ " + p.name; }).concat(["✦ Hotels near Haram", "✦ Airport Pickup", "✦ Ziyarat Tours"]);
  $("#marquee").innerHTML = marqueeItems.concat(marqueeItems).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");

  var hello = "Assalamu Alaikum Thalal Madinah 👋\n";
  ["#fabWa", "#contactWa"].forEach(function (id) { $(id).href = waLink(hello + "I'd like to know more."); });
  $("#sendVideo").href = waLink(hello + "I'd like to share a video review of your dates/service. 📹");

  /* ---------- Social icons ---------- */
  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f9a825"/><stop offset=".5" stop-color="#e1306c"/><stop offset="1" stop-color="#833ab4"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="#fff"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000"/><path d="M10 9v6l5.2-3z" fill="#fff"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7Z"/></svg>',
    whatsappChannel: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1fa855"/><path d="M12 5.5a6.5 6.5 0 0 0-5.6 9.8L5.5 18.5l3.3-.9A6.5 6.5 0 1 0 12 5.5Z" fill="#fff"/></svg>'
  };
  var socialHtml = Object.keys(S.social).filter(function (k) { return S.social[k]; }).map(function (k) {
    return '<a href="' + esc(S.social[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ICONS[k] + "</a>";
  }).join("");
  $("#socialsTop").innerHTML = socialHtml;
  $("#socialsFooter").innerHTML = socialHtml;

  /* ---------- Cart (persisted per browser) ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("thalal-cart") || "[]"); } catch (e) { cart = []; }
  var saveCart = function () { try { localStorage.setItem("thalal-cart", JSON.stringify(cart)); } catch (e) {} };

  var toast = function (msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  };

  var addToCart = function (p, opt, qty) {
    var key = p.id + "|" + opt.w;
    var hit = cart.filter(function (i) { return i.key === key; })[0];
    if (hit) hit.qty += qty; else cart.push({ key: key, name: p.name, w: opt.w, price: opt.p, qty: qty });
    saveCart(); renderCart();
    ["#cartCount"].forEach(function (id) { var b = $(id); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); });
    toast("Added " + p.name + " (" + opt.w + ")");
  };

  var renderCart = function () {
    var count = cart.reduce(function (a, i) { return a + i.qty; }, 0);
    var total = cart.reduce(function (a, i) { return a + i.qty * i.price; }, 0);
    $("#cartCount").textContent = count;
    $("#cartCount2").textContent = count;
    $("#cartTotal").textContent = money(total);
    $("#cartItems").innerHTML = cart.length ? cart.map(function (i, idx) {
      return '<div class="line-item"><div><b>' + esc(i.name) + "</b><br><small>" + esc(i.w) + " · " + money(i.price) + "</small></div>" +
        '<div class="qty"><button data-dec="' + idx + '" aria-label="Decrease">−</button><span>' + i.qty + '</span><button data-inc="' + idx + '" aria-label="Increase">+</button></div>' +
        '<button class="rm" data-rm="' + idx + '">Remove</button><b>' + money(i.qty * i.price) + "</b></div>";
    }).join("") : '<p class="empty">Your cart is empty.<br>Add some Madinah dates 🌴</p>';
  };

  $("#cartItems").addEventListener("click", function (e) {
    var d = e.target.dataset;
    if (d.inc) cart[d.inc].qty++;
    else if (d.dec) { cart[d.dec].qty--; if (cart[d.dec].qty < 1) cart.splice(d.dec, 1); }
    else if (d.rm) cart.splice(d.rm, 1);
    else return;
    saveCart(); renderCart();
  });

  var drawer = $("#drawer"), scrim = $("#scrim");
  var openCart = function () { scrim.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
  var closeCart = function () { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true; };
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartOpen2").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  $("#checkout").addEventListener("click", function () {
    if (!cart.length) { toast("Cart is empty"); return; }
    var total = cart.reduce(function (a, i) { return a + i.qty * i.price; }, 0);
    var lines = cart.map(function (i, n) {
      return (n + 1) + ". " + i.name + " (" + i.w + ") × " + i.qty + " = " + money(i.qty * i.price);
    });
    var name = $("#custName").value.trim(), addr = $("#custAddr").value.trim();
    var msg = hello + "🛒 *New Order*\n\n" + lines.join("\n") + "\n\n*Total: " + money(total) + "*" +
      (name ? "\n\n👤 Name: " + name : "") + (addr ? "\n📍 Address: " + addr : "") +
      "\n\nPlease confirm availability & delivery charge. Jazakallah khair!";
    openWa(msg);
  });

  /* ---------- Products ---------- */
  var DATE_SVG = '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="15" ry="24" fill="#3b1d12"/><ellipse cx="27" cy="26" rx="5" ry="10" fill="#fff" opacity=".18"/><path d="M32 10c2-5 7-7 11-6-3 2-6 4-8 8" fill="#2f5d3a"/></svg>';
  var filter = "All";
  var tags = ["All"].concat(S.products.map(function (p) { return p.tag; }).filter(function (t, i, a) { return a.indexOf(t) === i; }));
  $("#filters").innerHTML = tags.map(function (t) {
    return '<button class="chip" role="tab" aria-selected="' + (t === filter) + '" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
  }).join("");
  $("#filters").addEventListener("click", function (e) {
    if (!e.target.dataset.tag) return;
    filter = e.target.dataset.tag;
    this.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-selected", c.dataset.tag === filter); });
    renderProducts();
  });

  var state = {}; // per-product selected option + qty
  var renderProducts = function () {
    var list = S.products.filter(function (p) { return filter === "All" || p.tag === filter; });
    $("#products").innerHTML = list.map(function (p) {
      var st = state[p.id] || (state[p.id] = { o: 0, q: 1 });
      var opt = p.options[st.o];
      return '<article class="card reveal" data-id="' + p.id + '">' +
        '<div class="card-media" style="--h:' + p.hue + '"><span class="tag">' + esc(p.tag) + '</span><div class="ph">' + DATE_SVG + "</div>" +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' dates" loading="lazy" onerror="this.remove()"></div>' +
        '<div class="card-body"><h3>' + esc(p.name) + "</h3><p>" + esc(p.desc) + "</p>" +
        '<div class="sizes">' + p.options.map(function (o, i) {
          return '<button class="size" data-act="size" data-i="' + i + '" aria-pressed="' + (i === st.o) + '">' + esc(o.w) + "</button>";
        }).join("") + "</div>" +
        '<div class="row"><span class="price">' + money(opt.p) + '</span><div class="qty"><button data-act="dec" aria-label="Decrease">−</button><span>' + st.q + '</span><button data-act="inc" aria-label="Increase">+</button></div></div>' +
        '<div class="card-actions"><button class="btn add-btn" data-act="add" >＋ Add to cart</button>' +
        '<button class="btn btn-wa" data-act="wa"><span class="wa-ico"></span>Order on WhatsApp</button></div></div></article>';
    }).join("");
    observeReveal();
  };

  $("#products").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-act]"); if (!btn) return;
    var id = btn.closest(".card").dataset.id;
    var p = S.products.filter(function (x) { return x.id === id; })[0];
    var st = state[id], act = btn.dataset.act;
    if (act === "size") st.o = +btn.dataset.i;
    else if (act === "inc") st.q = Math.min(99, st.q + 1);
    else if (act === "dec") st.q = Math.max(1, st.q - 1);
    else if (act === "add") { addToCart(p, p.options[st.o], st.q); return; }
    else if (act === "wa") {
      var o = p.options[st.o];
      openWa(hello + "🛒 *Order Request*\n\nProduct: " + p.name + "\nSize: " + o.w + "\nQuantity: " + st.q +
        "\nPrice: " + money(o.p) + " each\n*Total: " + money(o.p * st.q) + "*\n\nPlease confirm & share delivery details.");
      return;
    }
    renderProducts();
  });

  /* ---------- Services ---------- */
  var SVC_ICO = { hotel: "🏨", kaaba: "🕋", plane: "✈️", map: "🗺️" };
  $("#services").innerHTML = S.services.map(function (s) {
    return '<div class="svc reveal"><div class="ico">' + (SVC_ICO[s.icon] || "⭐") + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p>" +
      '<button class="link" data-svc="' + esc(s.title) + '"><span class="wa-ico"></span>Enquire on WhatsApp →</button></div>';
  }).join("");
  $("#services").addEventListener("click", function (e) {
    var b = e.target.closest("[data-svc]"); if (!b) return;
    openWa(hello + "I'm interested in: *" + b.dataset.svc + "*.\nPlease share details & rates.");
  });
  $("#serviceSelect").innerHTML = S.services.map(function (s) { return "<option>" + esc(s.title) + "</option>"; }).join("");
  $("#stayForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(this);
    var msg = hello + "🏨 *Stay / Service Enquiry*\n\nService: " + f.get("service") + "\nGuests: " + f.get("guests") +
      (f.get("from") ? "\nCheck-in: " + f.get("from") : "") + (f.get("to") ? "\nCheck-out: " + f.get("to") : "") +
      (f.get("name") ? "\nName: " + f.get("name") : "") + (f.get("notes") ? "\nNotes: " + f.get("notes") : "");
    openWa(msg);
  });

  /* ---------- Reels / Videos ---------- */
  var ytId = function (u) {
    var m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : null;
  };
  var videos = S.videos; // entries without src show a cover that opens the Facebook page
  var SRC_LABEL = { mp4: "Video", youtube: "YouTube", facebook: "Facebook Reel", instagram: "Instagram Reel" };
  $("#reelList").innerHTML = videos.map(function (v, i) {
    var bg = "";
    if (v.type === "youtube" && ytId(v.src)) bg = "background-image:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8)),url(https://i.ytimg.com/vi/" + ytId(v.src) + "/hqdefault.jpg)";
    if (v.type === "mp4" && v.poster) bg = "background-image:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.8)),url(" + esc(v.poster) + ")";
    return '<div class="reel" data-i="' + i + '"><button class="reel-cover" style="--h:' + (20 + i * 37) + ";" + bg + '" aria-label="Play ' + esc(v.title) + '">' +
      '<span class="play"></span><span class="src">' + (SRC_LABEL[v.type] || "Video") + "</span><b>" + esc(v.title) + "</b></button></div>";
  }).join("") || '<p class="muted">Videos coming soon — follow us on Facebook!</p>';

  // Load the real player only on tap (keeps the page fast on mobile data)
  $("#reelList").addEventListener("click", function (e) {
    var reel = e.target.closest(".reel"); if (!reel || !e.target.closest(".reel-cover")) return;
    var v = videos[+reel.dataset.i], html = "";
    if (!v.src) { window.open(S.social.facebook || waLink(hello), "_blank", "noopener"); return; }
    if (v.type === "mp4") html = '<video src="' + esc(v.src) + '" controls autoplay playsinline' + (v.poster ? ' poster="' + esc(v.poster) + '"' : "") + "></video>";
    else if (v.type === "youtube" && ytId(v.src)) html = '<iframe src="https://www.youtube.com/embed/' + ytId(v.src) + '?autoplay=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="' + esc(v.title) + '"></iframe>';
    else if (v.type === "facebook") html = '<iframe src="https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(v.src) + '&show_text=false&autoplay=true" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="' + esc(v.title) + '"></iframe>';
    else { window.open(v.src, "_blank", "noopener"); return; } // Instagram blocks inline autoplay embeds; open the reel
    reel.innerHTML = html;
  });

  /* ---------- Testimonials ---------- */
  if (S.testimonials.length) { $("#reviews").hidden = false; $("#navReviews").hidden = false; }
  $("#testimonials").innerHTML = S.testimonials.map(function (t) {
    return '<figure class="quote reveal"><div class="stars">★★★★★</div><p>“' + esc(t.text) + '”</p><cite>— ' + esc(t.name) + "</cite></figure>";
  }).join("");

  /* ---------- Scroll reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -40px 0px" }) : null;
  function observeReveal() {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
  }

  renderProducts();
  renderCart();
  observeReveal();
})();

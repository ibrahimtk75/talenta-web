/* Giftnest — demo catalogue.
 * Used when no WooCommerce Store API is configured (see config in index.html).
 * Shape mirrors what app.js normalises from WooCommerce + Dokan/WCFM, so swapping
 * to live data needs no UI changes.
 *
 * art:  sprite motif id (box | flowers | mug | candle | notebook | hamper | plant | card | bottle | choco)
 * tone: pastel palette key (rose | sage | beige | blush | sand | mist)
 */
window.GN_DATA = (function () {
  var vendors = {
    petal: { name: 'Petal & Post', rating: 4.9, url: '#store/petal-and-post' },
    kraft: { name: 'Kraft House', rating: 4.8, url: '#store/kraft-house' },
    wick: { name: 'Wick & Wild', rating: 4.7, url: '#store/wick-and-wild' },
    desk: { name: 'Deskful Co.', rating: 4.8, url: '#store/deskful' },
    cocoa: { name: 'Cocoa Lane', rating: 4.9, url: '#store/cocoa-lane' },
    green: { name: 'Little Green', rating: 4.6, url: '#store/little-green' },
  };

  // [id, title, vendor, price, compareAt, rating, reviews, category, art, tone, badge, flags]
  // flags: p = personalisable, b = bundle
  var rows = [
    // ── Entry tier: impulse gifts (< 500)
    [101, 'Mini Rose Bud Gift Card', 'petal', 199, 249, 4.8, 312, 'flowers', 'card', 'rose', 'Bestseller', ''],
    [102, 'Gift Welcome Flowers Kit — Pocket', 'petal', 299, 399, 4.9, 528, 'flowers', 'flowers', 'blush', 'Bestseller', ''],
    [103, 'Hand-poured Soy Tealight Trio', 'wick', 249, 0, 4.7, 186, 'self-care', 'candle', 'sand', '', ''],
    [104, 'Desk Succulent in Ceramic Pot', 'green', 349, 449, 4.6, 241, 'desk', 'plant', 'sage', 'New', ''],
    [105, 'Sea-salt Caramel Truffles (4 pc)', 'cocoa', 279, 0, 4.9, 402, 'treats', 'choco', 'beige', '', ''],
    [106, 'Name-stamped Pocket Notebook', 'desk', 329, 399, 4.8, 167, 'personalised', 'notebook', 'mist', '', 'p'],
    [107, 'Thank-you Mini Gift Box', 'kraft', 399, 499, 4.8, 289, 'corporate', 'box', 'rose', 'Under ₹400', ''],
    [108, 'Monogram Coffee Mug', 'kraft', 449, 549, 4.7, 354, 'personalised', 'mug', 'sage', '', 'p'],
    [109, 'Lavender Pillow Mist (30 ml)', 'wick', 379, 0, 4.6, 98, 'self-care', 'bottle', 'mist', '', ''],
    [110, 'Dried Flower Bud Vase', 'petal', 469, 0, 4.8, 133, 'flowers', 'flowers', 'sage', '', ''],

    // ── Mid tier: thoughtful gifts (500 – 1,999)
    [201, 'Gift Welcome Flowers Kit — Classic', 'petal', 899, 1099, 4.9, 611, 'flowers', 'flowers', 'rose', 'Most gifted', ''],
    [202, 'New Joiner Welcome Kit', 'desk', 1299, 1499, 4.8, 274, 'welcome-kits', 'box', 'sage', 'Corporate fav', 'p'],
    [203, 'Self-care Sunday Box', 'wick', 1149, 1399, 4.7, 208, 'self-care', 'candle', 'blush', '', 'b'],
    [204, 'Personalised Insulated Tumbler', 'kraft', 799, 999, 4.8, 390, 'personalised', 'bottle', 'sand', '', 'p'],
    [205, 'Artisan Chocolate Tasting Flight', 'cocoa', 949, 0, 4.9, 256, 'treats', 'choco', 'rose', '', ''],
    [206, 'Linen Journal + Brass Pen Set', 'desk', 1199, 1399, 4.7, 142, 'desk', 'notebook', 'beige', '', 'p'],
    [207, 'Mini Herb Garden Trio', 'green', 1049, 0, 4.6, 119, 'desk', 'plant', 'sage', 'Eco pick', ''],
    [208, 'Coffee Break Duo Hamper', 'kraft', 1499, 1799, 4.8, 187, 'treats', 'hamper', 'beige', '', 'b'],
    [209, 'Scented Candle & Matches Gift', 'wick', 699, 849, 4.8, 233, 'self-care', 'candle', 'rose', '', ''],
    [210, 'Name-engraved Desk Planter', 'green', 1349, 0, 4.7, 88, 'personalised', 'plant', 'mist', '', 'p'],
    [211, 'Work-anniversary Gift Box', 'desk', 1799, 1999, 4.8, 161, 'corporate', 'box', 'mist', '', 'p'],

    // ── Premium tier: premium variations & multi-vendor bundles (≥ 2,000)
    [301, 'Gift Welcome Flowers Kit — Grand', 'petal', 2499, 2999, 4.9, 342, 'flowers', 'flowers', 'blush', 'Premium', ''],
    [302, 'Executive Onboarding Kit (Bundle)', 'desk', 3499, 4299, 4.9, 129, 'welcome-kits', 'box', 'sand', 'Bundle · save 19%', 'pb'],
    [303, 'Signature Gourmet Hamper', 'cocoa', 3999, 4599, 4.9, 204, 'treats', 'hamper', 'rose', 'Premium', 'b'],
    [304, 'Spa Night Luxe Collection', 'wick', 2799, 3299, 4.8, 116, 'self-care', 'candle', 'mist', '', 'b'],
    [305, 'Green Office Starter Bundle', 'green', 2299, 2699, 4.7, 74, 'desk', 'plant', 'sage', 'Bundle', 'b'],
    [306, 'Personalised Leather Desk Set', 'desk', 4499, 0, 4.8, 58, 'personalised', 'notebook', 'sand', '', 'p'],
    [307, 'Flowers + Chocolate Celebration Box', 'petal', 3299, 3799, 4.9, 187, 'flowers', 'hamper', 'blush', 'Multi-vendor bundle', 'b'],
    [308, 'Team Welcome Kit · 10-pack', 'kraft', 7999, 9990, 4.8, 41, 'corporate', 'box', 'beige', 'Bulk · save 20%', 'pb'],
    [309, 'Coffee Connoisseur Hamper', 'kraft', 2899, 0, 4.8, 92, 'treats', 'mug', 'beige', '', 'b'],
    [310, 'Engraved Bottle & Journal Duo', 'desk', 2499, 2899, 4.7, 66, 'personalised', 'bottle', 'mist', '', 'pb'],
  ];

  var products = rows.map(function (r) {
    var v = vendors[r[2]];
    return {
      id: r[0],
      title: r[1],
      vendor: v.name,
      vendorRating: v.rating,
      vendorUrl: v.url,
      price: r[3],
      compareAt: r[4] || 0,
      rating: r[5],
      reviews: r[6],
      category: r[7],
      art: r[8],
      tone: r[9],
      badge: r[10],
      personalisable: r[11].indexOf('p') > -1,
      bundle: r[11].indexOf('b') > -1,
      image: '',
      url: '#product/' + r[0],
    };
  });

  return { products: products, vendors: vendors };
})();

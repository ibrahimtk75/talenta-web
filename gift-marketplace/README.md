# Giftnest: multi-vendor gift marketplace storefront

A fast, mobile-first storefront for light-weight gifts, welcome kits and personalised
corporate or casual gifts. It is built for impulse buying at the top of the page and
upselling as the shopper scrolls.

It is plain HTML, CSS and JavaScript, with no framework and no build step:

| File | Size (raw) | Purpose |
| --- | --- | --- |
| `index.html` | ~13 KB | Page shell, inline SVG sprite (product art, icons), config |
| `assets/styles.css` | ~16 KB | Design system, mobile-first layout |
| `assets/app.js` | ~22 KB | Data adapter, rail, infinite feed, cart |
| `assets/data.js` | ~6 KB | Demo catalogue (6 vendors, 31 gifts) |

Inter loads without blocking the first paint, so system fonts show until it arrives.
The demo uses vector product art and makes no image requests.

## Run it

```bash
cd gift-marketplace
python3 -m http.server 8080   # or: npx serve .
# open http://localhost:8080
```

Opening `index.html` straight from disk works too. It uses classic scripts, not ES modules.

## Page flow

1. **Hero.** Gifts "from ₹199" (the lowest catalogue price), a primary CTA to the
   under-₹499 row, and trust chips.
2. **Impulse rail.** Gifts priced at or below `tiers.entryMax`, most-reviewed first. It is a
   horizontal snap-scroll row on mobile, with quick filters (under ₹299 / ₹399).
3. **Infinite upsell feed.** Gifts priced above `entryMax`, cheapest first, loaded in pages
   with `IntersectionObserver`. When prices cross a tier boundary a styled tier header appears:
   **Thoughtful gifts** (mid tier), then **Premium & bundles** (larger 3-column cards on desktop).
4. **Bag drawer.** A free-delivery progress bar with smart upsells. Below the threshold it
   suggests the cheapest gifts that close the gap. Above it, it suggests premium and bundle
   upgrades plus an impulse add-on. The bag is saved in `localStorage`.
5. **Corporate band and vendor CTA.** A bulk-quote mailto and a vendor sign-up link.

Category chips and search filter both the rail and the feed.

## Configuration (`index.html` → `window.GN_CONFIG`)

| Key | Default | Notes |
| --- | --- | --- |
| `storeApi` | `''` | Empty means demo data. Set it to `https://your-shop.com` to use WooCommerce. |
| `currency` / `locale` | `INR` / `en-IN` | Any `Intl.NumberFormat` currency |
| `tiers.entryMax` / `tiers.midMax` | `499` / `1999` | Price boundaries for rail and tiers |
| `freeShippingAt` | `999` | Bag progress bar and upsell logic |
| `pageSize` | `8` | Products per infinite-scroll page |
| `checkoutUrl`, `vendorSignupUrl`, `corporateEmail` | | Links |

## Connecting WooCommerce + Dokan / WCFM

1. Install `wordpress/giftnest-vendor-storeapi.php` as a plugin, or drop it into `wp-content/mu-plugins/`.
   It adds `extensions.giftnest.vendor = { id, name, rating, url }` to every product in the
   public **WooCommerce Store API**. Dokan and WCFM Marketplace are detected automatically,
   and any other plugin falls back to the product author.
2. Set `storeApi` to your shop URL. The storefront then calls
   `/wp-json/wc/store/v1/products` with `orderby=price`, `min_price` / `max_price`,
   `category` (slug) and `search`, and pages through `X-WP-TotalPages`.
3. Host the storefront on the **same origin** as WordPress, either as a page template or at a sub-path.
   This lets "add to bag" also add the item to the real WooCommerce cart
   (`/wc/store/v1/cart/add-item` with the Store API `Nonce`), and lets Checkout hand off to
   `/checkout/`.
4. Optional: tag products `personalised` or `bundle` to show those labels on the cards.
   Category slugs should match the chips in `index.html`
   (`flowers`, `welcome-kits`, `corporate`, `personalised`, `self-care`, `treats`, `desk`).

### Theme compatibility

Product cards use WooCommerce's loop markup: `ul.products > li.product.type-product`,
`.woocommerce-LoopProduct-link`, `h3.woocommerce-loop-product__title`, `span.price` with
`ins`/`del`, and `.button.add_to_cart_button.ajax_add_to_cart[data-product_id]`.
The vendor line carries `dokan-store-name` and `wcfmmp_sold_by_wrapper`. You can port the
card CSS (`.gn-card*`) to a `woocommerce/content-product.php` override and the styling will carry over.

> The PHP plugin is a starting point. It uses public Dokan and WCFM helpers and checks
> `function_exists` before every call, but test it against your plugin versions before going live.

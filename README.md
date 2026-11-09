# Pullayya Gari Cement Kottu · Website

A static, bilingual (Telugu / English) catalog website for **పుల్లయ్య గారి సిమెంట్ కొట్టు**, a cement, waterproofing, adhesives and hardware shop in Gunupudi, Bhimavaram, Andhra Pradesh.

Live site (after GitHub Pages is on): https://chakravarthiperumalla.github.io/pullayagaricement-website/
Companion repository: `pullayagaricement-googlereview` (the Google review helper page).

## What the site does

- **Home:** logo, the four visiting-card taglines as hang-tags (Premium quality, High strength, Waterproof protection, Trusted service), an interactive 3D godown (drag to turn, tap a bag or item to open it), categories, the brand wall, a "which cement for which job" guide, the enquiry builder, review box and visit details.
- **Browse path:** category → brands in that category → every product of the brand → product page with a turntable 3D model, description, features, where to use it and key details.
- **Brands covered (from the visiting card):** UltraTech, Ambuja, KCP, Ramco, Nagarjuna, Birla White, Hard Worker, Fosroc, Astral Adhesives, Fevicol, Godrej. About 109 products.
- **Paints and Steel / TMT** have no brands on the card, so those two categories show an "Ask us" message with a WhatsApp button until the owner supplies brands.
- **Enquiry list:** customers add products, fill quantity and delivery place, and send one WhatsApp message. No prices are shown on purpose, since rates change daily.
- **Search** across all products, Telugu / English toggle (Telugu by default), JSON-LD `HardwareStore` markup, mobile action bar (Call, WhatsApp, Directions).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: header, footer, SEO and structured data |
| `assets/css/site.css` | All styles |
| `assets/js/catalog.js` | **The data**: categories, brands, products, applications, buying guide |
| `assets/js/app.js` | Router, pages, language toggle, enquiry builder |
| `assets/js/scene.js` | Built 3D bundle (Three.js). Generated, do not edit by hand |
| `src/scene.js` | Source of the 3D scenes |
| `assets/fonts/` | Archivo (Latin) and Anek Telugu, self-hosted variable fonts |
| `assets/img/logo.png` | Shop logo |
| `package.json` | Only used to rebuild `scene.js` |

Pages use hash routes (`#/c/cement`, `#/b/ultratech`, `#/p/ultratech-opc-53`, `#/all`, `#/quote`, `#/visit`), so it works on GitHub Pages and from a local file with no server config.

## Add or change a brand or product

Everything lives in `assets/js/catalog.js`.

1. New brand: add an entry to `BRANDS` (id, name, Telugu name, owner, website, English and Telugu intro).
2. New product: add a line near the bottom, `p(id, brandId, categoryId, name, shape, tint, teluguLine, description, features[], applications[], specs{})`.
3. `shape` picks the 3D model and drawn thumbnail: `bag, sack, pail, can, bottle, cartridge, padlock, mortise, block, roll, rebar`.
4. `applications` use keys from `APPS`, which holds each term in English and Telugu once.
5. To open Paints or Steel, add brands and products with `cat` set to `paint` or `steel`, then remove `ask: true` from that category.

No build is needed for data changes. Later, `catalog.js` can be replaced by a fetch from an API that returns the same shape.

## Rebuild the 3D bundle (only if you edit `src/scene.js`)

```
npm install
npm run build
```

## Deploy on GitHub Pages

Settings → Pages → Deploy from a branch → `main` / root. The 3D scenes fall back to drawn thumbnails if the browser has no WebGL.

## Shop details used

| Item | Value |
| --- | --- |
| Phone / WhatsApp | +91 81799 51999 (Perumalla Ramu, from the visiting card) |
| Address | 18-10-3, Simhadri Appanna Temple Street, Old VRL Transport Premises, Gunupudi, Bhimavaram |
| Hours (Google listing) | 7:30 AM – 7:30 PM |
| Coordinates | 16.5412239, 81.5264281 |
| Google Maps CID | `12673521240897900903` |
| Google Place ID | `ChIJYXtqRQDTNzoRZ1EW4Wtk4a8` |

## Before launch

- Ask the owner for paint and steel brands, and check the thinner entries (some Fosroc, Astral and Godrej items) and the Nagarjuna bag, which was read from a blurry card photo.
- The card says "Fevicol Cement Adhesives". Confirm which Pidilite products the shop stocks (Pidilite's tile adhesive line is sold as Roff).
- The card address (Simhadri Appanna Temple Street) and the Google listing (Gandhi Nagar) share door number 18-10-3. Confirm the PIN code.
- Product text is summarised from each manufacturer's site; brand names are used only to say what the shop sells. 3D models are drawn for this site and are not manufacturer pack designs.
- "Help me write it" needs GitHub Pages on for `pullayagaricement-googlereview`.

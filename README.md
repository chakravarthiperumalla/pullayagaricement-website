# Pullayya Gari Cement Kottu · Website

A one-page, mobile-first website for **పుల్లయ్య గారి సిమెంట్ కొట్టు** (Pullayya Gari Cement Kottu), a cement, paint and hardware shop in Gunupudi, Bhimavaram, Andhra Pradesh. Telugu and English, built as a single static file.

Live site (after GitHub Pages is on): https://chakravarthiperumalla.github.io/pullayagaricement-website/

Companion repository: the shop's Google review page, `pullayagaricement-googlereview`.

## What is on the page

- **Top bar and hero:** logo, "Call", "WhatsApp" and "Directions" buttons, and the tagline "Your trusted store for cement, paint and hardware".
- **Quick facts:** location, hours, what the shop sells, and how to ask for a price.
- **Products:** cement, paints, waterproofing and construction chemicals, adhesives and sealants, hardware.
- **Get a price on WhatsApp:** the customer ticks what they need, adds quantity and delivery location, and the message is ready to send to the shop's WhatsApp.
- **Reviews:** an invitation to be one of the first Google reviewers (the listing has no reviews yet), a review box that copies the text and opens the shop's Google review box, and a link to the review helper page.
- **Visit us:** address, phone, hours, Google Maps and directions links.
- **Mobile action bar:** Call, WhatsApp and Directions stay at the bottom of the screen on phones.
- **Search data:** schema.org `HardwareStore` markup with name, phone, address and coordinates.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole site: HTML, CSS and JavaScript in one file. The logo is embedded. |

No build step and no dependencies. Only the Google Fonts (Plus Jakarta Sans, Noto Sans Telugu) load from the internet.

## Deploy on GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. After a minute the site is live at the URL above. A custom domain can be added on the same page.

## Shop details used in the site

| Item | Value |
| --- | --- |
| Address | 18-10-3, Gandhi Nagar, Gunupudi, Bhimavaram, Andhra Pradesh 534201 |
| Phone / WhatsApp | +91 81799 51999 |
| Hours (per Google listing) | 7:30 AM – 7:30 PM, may differ on festival days |
| Coordinates | 16.5412239, 81.5264281 |
| Google Maps CID | `12673521240897900903` |
| Google Place ID | `ChIJYXtqRQDTNzoRZ1EW4Wtk4a8` |

## Editing

Open `index.html` and search for:

- `918179951999` and `8179951999` to change the phone or WhatsApp number.
- `placeid=` to change the Google review link.
- `16.5405094` to change the map coordinates.
- `Help me write it` to change where that button goes. It points to the companion review page at `https://chakravarthiperumalla.github.io/pullayagaricement-googlereview/`.
- `--orange` and `--char` at the top of the CSS for the brand colours (taken from the shop logo).

## Before launch

- Confirm that 81799 51999 is on WhatsApp. The current Google listing shows no phone number, so this number comes from the shop's earlier listing.
- The "Help me write it" button opens the companion review page, so it only works once GitHub Pages is on for `pullayagaricement-googlereview`.
- The logo was captured from the shop's Google Maps photos at 390 × 315 px. Replace the embedded image with the owner's original file for a sharper result.
- Stock and prices are not listed on purpose: they change often, so customers are asked to call or message for today's price.
- Check the opening hours with the owner. They come from the Google listing.
- Once the shop has real Google reviews, add the rating back to the quick facts and the reviews section.

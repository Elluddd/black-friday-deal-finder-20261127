[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# DealHound — Real Black Friday & Cyber Monday Deal Finder 2026

A static deal-finder site of **real Black Friday and Cyber Monday 2026 deals**,
found and price-checked by an agent on 27 Nov 2026. Every deal shows its store,
a link to it at that store, the sale price, the usual price, the time the price
was checked, and a verdict on whether the deal is really a deal.

- **22 verified deals** across 10 categories (TVs, Laptops, Audio, Smart Home,
  Gaming, Phones, Wearables, Storage, PC Parts, Kitchen) from 5 stores
  (Amazon, Best Buy, Walmart, Target, Newegg).
- **Search** by product, store or category.
- **Filters** by category, store and minimum discount (20% / 30% / 50%+).
- **Sort** by biggest discount, biggest saving, lowest or highest price.
- **Verdict signal** on every deal: `STEAL` (50%+ off), `REAL DEAL` (30–49%),
  `SOLID` (15–29%), `THIN` (under 15% — barely a deal).
- **Shareable filters** via the URL hash, e.g. `index.html#cat=Audio&minoff=50`.
- **No network requests**: the site runs from static files under `app/` and
  works on desktop and on a phone, even opened as a local file.

## How the deals were checked

Every price was read on 27 Nov 2026 (13:05 UTC) from a retailer announcement
or a deals source (Best Buy's Black Friday release, Amazon Black Friday Week,
Walmart / Target Black Friday sales, Newegg, and roundups by Tom's Guide,
9to5Toys, TradingView/Benzinga and others) and cross-checked in at least two
outlets where shown. Each deal card names its source. Store links go to the
store's own search page for the product. No price, product, store or link is
invented. Prices can change — the store link lets you confirm the live price
before buying.

DealHound is an independent finder and is not affiliated with any store named
here.

## Run it

```sh
node main.ts        # regenerates app/ (and out/) from deals.json — Node 22.18+
```

Then open `app/index.html` in a browser, or serve it:

```sh
python3 -m http.server --directory app
```

## Files

- `main.ts` — the generator (Node 22, no dependencies). Reads `deals.json`
  and writes the static site into `app/` and `out/`.
- `deals.json` — the verified deals (product, store, category, sale price,
  usual price, store link, source, check time).
- `app/` — the static site: `index.html`, `styles.css`, `app.js`
  (deals embedded, no fetch, no external requests), `deals.json`.
- `screenshots/` — real renders of the site: desktop, phone, and a filtered
  view (Audio, 50%+ off).

## License

MIT — see `LICENSE`.

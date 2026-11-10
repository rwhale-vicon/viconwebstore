# Vicon Store — custom Shopify storefront

A headless storefront for the Vicon online store. It is built with **Next.js 15**, gets its products and checkout from **Shopify**, and deploys to **Render**.

It runs in two modes:

| Mode | When | Catalogue | Checkout |
|---|---|---|---|
| **Demo** | No Shopify variables set | `data/products.json` and `data/licenses.json` | Simulated. A message explains what the live store would do. |
| **Live** | `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` set | Shopify Storefront API, refreshed every 5 minutes | Creates a Shopify cart and redirects to Shopify Checkout. Shopify handles tax, shipping and payment. |

## Pages

- `/` is the homepage. It has a hero, trust strip, shop by category, markers, suits, licences (annual/monthly toggle), how it works, about Vicon, custom systems, FAQs and get in touch.
- `/shop` lists all products. `/shop/[category]` shows one category, with search, sort and a category sidebar.
- `/products/[handle]` is the product page, for hardware and licences. It has the volume pricing table, a prompt showing how many more units reach the next discount, and a billing-term picker for licences.
- `/cart` is the cart. It shows tiered pricing, total savings and a progress bar towards the minimum order, and checkout stays disabled until the minimum is reached.
- `/how-it-works`, `/about` and `/contact` are the information pages.
- The top menu is the same on every page: Home · Shop By Category (dropdown) · About Vicon · How It Works · Get In Touch · Back to Vicon.com. There is also a USD/GBP switch and the cart.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy the preview to Render

1. Push this repo to GitHub.
2. In Render, go to **New → Blueprint** and select the repo. `render.yaml` sets up the service.
3. Leave the Shopify variables empty for a demo-mode preview.

The blueprint uses the *starter* plan. The free plan sleeps when idle and takes about 50 seconds to wake, which you don't want during a live demo.

## Where things live

| What | File |
|---|---|
| Brand colours and fonts | `app/globals.css` (`:root` tokens) |
| Volume tiers and minimum order | `data/pricing.json` |
| Hardware catalogue | `data/products.json`, generated from the price list spreadsheet |
| Licence products | `data/licenses.json` |
| Categories, menu order and blurbs | `lib/categories.ts` |
| FAQs, how-it-works steps and about stats | `lib/content.ts` |
| Shopify API calls | `lib/shopify.ts` |
| Server-side minimum order check and checkout | `app/api/checkout/route.ts` |
| Get-in-touch form endpoint | `app/api/contact/route.ts` |
| Placeholder product art | `components/Art.tsx` (replaced automatically when Shopify has product images) |

### Updating the product list

```bash
# Replace data/product-list-accessories.xlsx, then:
npm run products:import      # regenerates data/products.json
npm run shopify:csv          # writes shopify-products.csv + shopify-gbp-prices.csv
```

## Connecting Shopify

1. **Import products.** Run `npm run shopify:csv`, then import `shopify-products.csv` in **Shopify Admin → Products → Import**. The store currency should be USD.
2. **Collections.** Create one automated collection per category. Give each a handle that matches the category (`markers`, `suits-gloves`, `kits`, `bases-bands-joints`, `rigid-bodies-straps`, `active-vr-tracking`, `tape-adhesives`, `software-licences`), with the condition *product tag equals* that handle.
3. **GBP prices.** Add a United Kingdom market with fixed prices taken from `shopify-gbp-prices.csv`. The storefront asks Shopify for prices in both US and UK context.
4. **Headless channel.** Install the **Headless** sales channel and copy the public Storefront API token.
5. **Render settings.** Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` in Render, then redeploy.
6. **Volume pricing at checkout.** Install a volume or tiered discount app from the Shopify App Store. Set it up with the same tiers as `data/pricing.json`, so checkout matches the storefront.
7. **Minimum order at checkout.** Install a cart/checkout validation app with the same minimum. The storefront and `/api/checkout` already enforce it, and the app also covers anyone who goes straight to the checkout URL.
8. **Tax.** Turn on **Shopify Tax** and register the US states where Vicon has nexus. Give licences the digital-goods product category so each state taxes them correctly.

## Still to do (not in this preview)

- **Salesforce and NetSuite sync.** Orders and customers should sync from Shopify via a connector or webhook service. Salesforce is the system of record, and HubSpot is fed from it.
- **Licence delivery.** When an order is paid, a webhook should call Vicon's licensing system and email the licence keys.
- **Get in touch form.** Set `CONTACT_WEBHOOK_URL` to forward enquiries, for example to Salesforce Web-to-Lead.
- **Product photography.** Upload images to Shopify. They replace the placeholder illustrations automatically.

## Content to confirm before launch

- **Licence prices.** All prices in `data/licenses.json` are placeholders.
- **Pricing rules.** The volume tiers and minimum order in `data/pricing.json` are placeholders.
- **Spreadsheet rows.** 8 rows are flagged for review: a missing currency or a £0 price. They show a "Data to review" note in demo mode.
- **Store policies in the FAQ copy.** Dispatch time, shipping regions and payment options in `lib/content.ts`.
- **Brand.** The accent colours and fonts are placeholders until the brand guidelines are confirmed. Only the navy (`#0a1439`) comes from vicon.com. The logo is loaded from vicon.com; copy it into `/public/brand` for production.

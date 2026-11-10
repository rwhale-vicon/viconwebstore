// Builds shopify-products.csv from data/products.json + data/licenses.json for
// Shopify Admin > Products > Import. Store currency is assumed to be USD.
// GBP prices are imported separately as a fixed price list for the UK market (see README).
import fs from 'node:fs';

const hardware = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const licences = JSON.parse(fs.readFileSync('data/licenses.json', 'utf8'));

const cols = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Requires Shipping', 'Variant Taxable', 'Status'];
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [cols];
const gbp = [['Handle', 'Variant SKU', 'Option1 Value', 'GBP Price']];

for (const p of hardware) {
  rows.push([p.handle, p.title, `<p>${p.description}</p>`, 'Vicon', p.productType || 'Accessory', `${p.category}, hardware`, 'TRUE',
    'Title', 'Default Title', p.sku, 0, 'deny', 'manual', p.price.USD ?? '', 'TRUE', 'TRUE', p.price.USD ? 'active' : 'draft']);
  gbp.push([p.handle, p.sku, 'Default Title', p.price.GBP ?? '']);
}
for (const p of licences) {
  p.variants.forEach((v, i) => {
    const first = i === 0;
    rows.push([p.handle, first ? p.title : '', first ? `<p>${p.description}</p><ul>${(p.features || []).map((f) => `<li>${f}</li>`).join('')}</ul>` : '',
      first ? 'Vicon' : '', first ? 'Software Licence' : '', first ? `${p.category}, licence, digital` : '', first ? 'TRUE' : '',
      first ? 'Billing term' : '', v.label, `${p.sku}-${v.id.toUpperCase()}`, 0, 'continue', 'manual', v.price.USD,
      'FALSE', 'TRUE', first ? 'active' : '']);
    gbp.push([p.handle, `${p.sku}-${v.id.toUpperCase()}`, v.label, v.price.GBP]);
  });
}
fs.writeFileSync('shopify-products.csv', rows.map((r) => r.map(esc).join(',')).join('\n'));
fs.writeFileSync('shopify-gbp-prices.csv', gbp.map((r) => r.map(esc).join(',')).join('\n'));
console.log(`Wrote shopify-products.csv (${rows.length - 1} rows) and shopify-gbp-prices.csv`);

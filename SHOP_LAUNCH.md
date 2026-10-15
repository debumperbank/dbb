# Webshop launch status

The webshop is paused in src/lib/shop-status.ts (SHOP_OPEN=false). Deploy to enforce this on the public site. BUMPR is a public brand page; /webshop, /bumpr/mandje and /bumpr/afrekenen show a preparation page. The checkout API refuses all new payment requests before accessing the database or Mollie. Existing order status, webhooks, admin and fulfilment remain active. Previously issued Mollie payment links are not canceled by this change; review open payments in Mollie before launch/stock decisions.

Before reopening:
- Apply migration 010_product_brands.sql to store brands on catalogue records. It preserves the existing catalogue table, IDs and RLS. Existing records default to BUMPR; new supplier records must specify their actual brand and use a unique slug.
- Replace concept images/specifications with approved actual product data, confirm stock and mark unavailable items accordingly. Do not rely on old is_available=true records.
- Confirm supplier agreements, label/SDS/PCN requirements, prices, shipping and product safety information.
- Review brand-neutral checkout/email/invoice wording and add /webshop to the sitemap when ready. No supplier brand partnership is currently advertised.
- Reopen deliberately by changing SHOP_OPEN and deploying after a complete checkout test.

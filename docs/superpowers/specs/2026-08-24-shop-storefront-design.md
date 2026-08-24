# Shop Storefront & Checkout — Design

Date: 2026-08-24
Status: approved
Follows: [shop products admin CMS](2026-08-24-shop-products-design.md)

## Goal

Sell shop products from the public site: a `/magazin` listing, a product page
that shows colour and weight variants properly, and single-product Stripe
checkout — no cart, one product per order.

## Delivery: pickup only

Courier is not operating yet. Checkout supports **`summit_pickup` only**: no
shipping address, no delivery fee. The `courier` enum value stays in the model
and in the admin UI, but on the public page a product that offers it renders the
option as *indisponibil momentan* and it cannot be selected for payment. When
courier is switched on later, only the storefront gate and a fee decision are
needed — no schema change.

## Data model

### table `shop_orders`

`payments` cannot be reused: its `course_id` is NOT NULL and its semantics are
enrollment-bound.

| column | type | notes |
|--------|------|-------|
| `id` | uuid pk | |
| `product_id` | uuid references `shop_products` on delete set null | the order outlives the product |
| `variant_id` | uuid references `shop_product_variants` on delete set null | null when the product has no variants |
| `product_name` | text not null | snapshot at order time |
| `variant_label` | text | snapshot, e.g. "Negru · 10 kg" |
| `unit_price` | numeric(10,2) not null | snapshot |
| `quantity` | integer not null default 1 | always 1 for now; present so a cart does not need a migration |
| `amount` | numeric(10,2) not null | what Stripe charged |
| `currency` | `currency_code` not null default 'RON' | |
| `delivery_option` | `shop_delivery_option` not null | |
| `customer_name` / `customer_email` / `customer_phone` | text | from Stripe `customer_details` |
| `status` | `payment_status` not null default 'pending' | reuses the existing enum |
| `stripe_session_id` | text unique | idempotency key for the webhook |
| `stripe_payment_intent_id`, `stripe_payment_method_type` | text | |
| `invoice_status` | `invoice_status` not null default 'pending' | |
| `invoice_series`, `invoice_number`, `invoice_url`, `invoice_error` | text | mirrors `payments` |
| `invoice_issued_at`, `completed_at` | timestamptz | |
| `metadata` | jsonb not null default '{}' | |
| `created_at`, `updated_at` | timestamptz | `updated_at` via `set_updated_at()` |

**Snapshots are deliberate.** Editing a product must never rewrite the history
of what somebody bought, and the invoice has to keep matching the order.

RLS: `admin all` via `public.is_admin()` only. No anon policy — orders are
written by the service-role client, exactly like public enrollment inserts.

## Public queries

New server-only `lib/supabase/queries/shop.ts` (`queries/public.ts` is already
358 lines and course-shaped):

- `getShopProducts()` → published products with cover image, colour swatches and
  price range
- `getShopProductBySlug(slug)` → product, gallery, colours (hex + photo) and the
  weights grouped under each colour

Both read only `status = 'published'`; the anon SELECT policies already exist.

`priceRange(product)` returns `{ min, max }` across variants, falling back to the
product price, so the listing can say "de la X lei".

## Pages

### `/magazin`

Card grid in the existing `CourseCard` idiom: cover photo, name, price (or "de
la X lei"), colour dots, delivery badges. Empty state when nothing is published.

### `/magazin/[slug]`

Two columns, matching `/curs/[id]`:

- **Left** — gallery: large image plus thumbnails. Choosing a colour swaps the
  main image to that colour's photo.
- **Right** — name, price for the current selection, colour swatches (circle +
  name), weight pills (sold-out ones struck through and unselectable), stock
  line, delivery options, pay button.
- Description flows full-width underneath.

Selection state lives in a client component `ShopProductView`; the page itself
stays server-rendered.

**Selection rules.** A product with no variants is bought directly at its own
price and stock. With variants, nothing is payable until a variant resolves;
a colour whose every weight is out of stock is shown sold out. The price shown
is the variant's `price` when set, otherwise the product price.

### `/magazin/[slug]/success`

Confirmation reading the session id, same shape as the course success page.

Navbar gains "Magazin".

## Checkout

`startShopCheckout` (server action, `app/magazin/[slug]/_actions.ts`):

1. Re-reads product and variant server-side — price, stock and published status
   are never trusted from the form.
2. Rejects: unpublished product, unknown variant, zero stock, a delivery option
   the product does not offer, and anything other than `summit_pickup`.
3. Creates the Stripe session: one line item, quantity 1, `billing_address_collection: "required"`,
   `tax_id_collection`, `phone_number_collection`, T&C consent — the same
   settings the course checkout uses, so SmartBill gets a complete client record.
   No `shipping_address_collection`: pickup only.
4. Pre-writes the `shop_orders` row as `pending` with the snapshots, then
   redirects. Metadata carries `shop_order_id`.

## Webhook

`app/api/stripe/webhook/route.ts` branches on metadata: `course_id` keeps its
current path untouched; `shop_order_id` routes to `handlePaidShopOrder`, which:

1. Returns early if the order is already `completed` — Stripe replays routinely,
   and a second run would burn another permanent invoice number.
2. Marks the order paid with the Stripe ids and customer details.
3. **Decrements stock by one** on the variant, or on the product when there is
   no variant, floored at zero.
4. Issues the SmartBill invoice via a new `issueInvoiceForShopOrder`, reusing
   `buildInvoicePayload`; the line description is `product_name` plus the
   variant label. Failures land in `invoice_error` and never fail the webhook.

Expiry and refund events update `shop_orders.status` the same way they update
`payments`.

## Admin

`/admin/shop/orders`: list of orders — date, product + variant, customer, amount,
payment status, invoice number. Read-only for now; the invoice retry action that
`payments` has can follow later.

## Out of scope

Cart and multi-item orders, courier delivery and shipping fees, order status
workflow beyond payment (packed/handed over), refunds from the admin UI.

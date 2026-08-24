# Shop Products — Admin CMS Design

Date: 2026-08-24
Status: approved

## Goal

Let admins manage physical shop products (gym gear) from the admin CMS: name,
description, price in Lei, a photo gallery, color/weight variants, and which
delivery options the product supports.

Scope for this spec is **admin CMS only**. The public storefront, cart, Stripe
checkout, and orders are a separate, later spec. The schema here is written so
those can be added without reshaping it.

## Delivery options

A fixed Postgres enum with exactly two values:

| enum value      | Romanian label                  |
|-----------------|---------------------------------|
| `summit_pickup` | Ridicare la Sense4FIT Summit    |
| `courier`       | Curier rapid                    |

Adding a third option later means a migration plus a label-map entry. That was
chosen deliberately over a lookup table: the list is small and stable.

Labels live in one place, `lib/shop.ts`, and are imported by every renderer.

## Data model

One migration, `supabase/migrations/<ts>_add_shop_products.sql`.

### enum `shop_delivery_option`

`'summit_pickup' | 'courier'`

### table `shop_products`

| column             | type                        | notes |
|--------------------|-----------------------------|-------|
| `id`               | uuid pk default gen_random_uuid() | |
| `name`             | text not null               | |
| `slug`             | text not null unique        | reserved for the future `/magazin/[slug]` route |
| `description`      | text                        | |
| `price`            | numeric(10,2) not null      | |
| `currency`         | `currency_code` not null default `'RON'` | reuses the existing enum |
| `status`           | `course_status` not null default `'draft'` | reuses the existing enum; draft-first like courses |
| `delivery_options` | `shop_delivery_option[]` not null default `'{}'` | |
| `stock`            | integer                     | used only when the product has no variants |
| `sort_order`       | integer not null default 0  | manual ordering in the admin list and future shop |
| `created_at`       | timestamptz not null default now() | |
| `updated_at`       | timestamptz not null default now() | |

### table `shop_product_images`

| column       | type | notes |
|--------------|------|-------|
| `id`         | uuid pk | |
| `product_id` | uuid not null references `shop_products` on delete cascade | |
| `path`       | text not null | object path inside the `shop-product-images` bucket |
| `alt`        | text | |
| `sort_order` | integer not null default 0 | lowest `sort_order` is the cover image |
| `created_at` | timestamptz not null default now() | |

### table `shop_product_variants`

| column       | type | notes |
|--------------|------|-------|
| `id`         | uuid pk | |
| `product_id` | uuid not null references `shop_products` on delete cascade | |
| `color`      | text | nullable |
| `weight_kg`  | numeric(6,2) | nullable |
| `price`      | numeric(10,2) | nullable; null means "inherit the product price" |
| `stock`      | integer not null default 0 | |
| `sort_order` | integer not null default 0 | |
| `created_at` | timestamptz not null default now() | |

`unique (product_id, color, weight_kg)`. Both attributes are nullable so a
product can vary by color only, by weight only, or by both.

**Stock rule:** if a product has at least one variant, stock is tracked per
variant and `shop_products.stock` is ignored (the admin form hides it). With no
variants, `shop_products.stock` is the single source of truth. This rule is
enforced in the UI, not by a DB constraint, so a product can gain variants
later without a data migration.

### RLS

Mirrors the rest of the schema:

- `admin all` policy on all three tables, gated by `public.is_admin()`.
- anon `SELECT` on `shop_products` where `status = 'published'`, and on
  images/variants whose parent product is published. Nothing consumes this
  yet; it is in place for the storefront.

### Indexes

- `shop_products (status)`
- `shop_product_images (product_id, sort_order)`
- `shop_product_variants (product_id, sort_order)`

## Storage

New public bucket `shop-product-images`: public read, admin-only
insert/update/delete via `public.is_admin()` — same policy shape as
`course-images`.

`lib/supabase/storage.ts` gains:

- `SHOP_BUCKET = "shop-product-images"`
- `uploadShopProductImage(file, productId)` → path `${productId}/${hash}.${ext}`
- the bucket unions on `publicUrl` and `deleteStorageObject` widen to include it

## Admin routes

All under `app/admin/shop/`, following the existing products/trainers layout.

| route | contents |
|-------|----------|
| `/admin/shop` | list: cover thumbnail, name, price, status, variant count, delivery badges; status filter; `RowDeleteButton` per row |
| `/admin/shop/new` | name, slug (auto-derived from name, editable), description, price, currency, status, delivery-option checkboxes → `createShopProduct` then redirect to the detail page |
| `/admin/shop/[id]` | master form: the same fields, plus `stock` when the product has no variants |
| `/admin/shop/[id]/images` | `ImageUploader` gallery — upload, reorder, delete; first image labelled as cover |
| `/admin/shop/[id]/variants` | inline editable rows: color, weight (kg), price override, stock; add and delete rows |

Detail sub-routes share a tab bar the same way `/admin/products/[id]` does.

The sidebar gains **Magazin** in the *Conținut* group.

## Server actions

Per-route `_actions.ts`, every action opening with `assertAdmin()` from
`lib/supabase/guards.ts`.

- `createShopProduct` — redirects to `/admin/shop/[id]` (creation flow, so a
  redirect is correct)
- `updateShopProduct`, `deleteShopProduct`
- `uploadShopImage`, `deleteShopImage`, `reorderShopImages`
- `upsertShopVariant`, `deleteShopVariant`

Per the established convention, delete actions never `redirect()` — they only
`revalidatePath()`, because `RowDeleteButton`'s try/catch would surface
`NEXT_REDIRECT` as a toast error.

Client components use `useTransition` plus a form action callback, never
`useActionState` + `useEffect`.

## Validation

- `name` required, `price` required and `>= 0`, `stock`/variant `stock` `>= 0`
- `slug` required, lowercase kebab, unique — a unique-violation is reported as
  a field error rather than a thrown 500
- at least one delivery option must be selected before a product can be set to
  `published`; drafts may have none
- deleting a product cascades its images and variants in the DB; the action
  also removes the product's storage objects

## Out of scope

Public `/magazin` listing and detail pages, cart, Stripe checkout, orders, and
per-order delivery choice and shipping fees. The delivery options recorded here
describe what a product *supports*; the buyer's actual choice belongs to the
order model in the checkout spec.

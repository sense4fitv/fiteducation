# Shop Products Admin CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give admins full CRUD over shop products — name, description, price in Lei, a photo gallery, color/weight variants, and supported delivery options.

**Architecture:** Three new tables (`shop_products`, `shop_product_images`, `shop_product_variants`) plus a `shop_delivery_option` enum and a `shop-product-images` storage bucket, applied via one Supabase migration. Admin UI lives at `app/admin/shop/` and mirrors the existing `app/admin/products/` structure exactly: server components fetching through `assertAdmin()`, per-route `_actions.ts` server actions, client components using `useTransition` + form-action callbacks.

**Tech Stack:** Next.js 16 App Router, Supabase (Postgres + Storage), TypeScript, Tailwind v3, shadcn/Base UI components, sonner toasts.

**Spec:** `docs/superpowers/specs/2026-08-24-shop-products-design.md`

## Global Constraints

- All user-facing copy in Romanian. Delivery labels exactly: `summit_pickup` → "Ridicare la Sense4FIT Summit", `courier` → "Curier rapid".
- Prices in Lei; render through `formatPrice(amount, currency)` from `lib/format.ts`.
- Every server action starts with `await assertAdmin()`.
- Delete actions never `redirect()` — only `revalidatePath()`. Create actions may redirect.
- Client components use `useTransition` + a form action callback, never `useActionState` + `useEffect`.
- Tailwind v3 syntax only — no `w-(--x)` / `data-active:` v4 forms.
- Verification per task: `npm run lint` and `npx tsc --noEmit`; unit tests via `npm test`.

---

### Task 1: Migration + storage bucket

**Files:**
- Create: `supabase/migrations/20260824120000_add_shop_products.sql`
- Modify: `lib/supabase/types.ts` (regenerated)

- [ ] **Step 1: Write the migration**

Enum, three tables, indexes, RLS policies (admin-all via `public.is_admin()`, anon SELECT on published), `updated_at` trigger if the project has one, bucket `shop-product-images` with public read + admin write policies — exactly as tabulated in the spec.

- [ ] **Step 2: Apply it** with `mcp__supabase__apply_migration`.

- [ ] **Step 3: Regenerate types** into `lib/supabase/types.ts` and confirm `shop_products`, `shop_product_images`, `shop_product_variants` and `Enums<"shop_delivery_option">` appear.

- [ ] **Step 4: Commit** `feat(db): shop products schema and images bucket`.

---

### Task 2: Shared shop helpers (unit-tested)

**Files:**
- Create: `lib/shop.ts`, `lib/shop.test.ts`

**Interfaces produces:**
- `DELIVERY_OPTIONS: readonly Enums<"shop_delivery_option">[]`
- `DELIVERY_LABEL: Record<Enums<"shop_delivery_option">, string>`
- `variantLabel(v: { color: string | null; weight_kg: number | null }): string` — `"Negru · 10 kg"`, `"Negru"`, `"10 kg"`, or `"Standard"` when both null.

- [ ] **Step 1: Write failing tests** in `lib/shop.test.ts` covering all four `variantLabel` branches and both delivery labels.
- [ ] **Step 2: Run `npm test`** — expect failure (module not found).
- [ ] **Step 3: Implement `lib/shop.ts`.**
- [ ] **Step 4: Run `npm test`** — expect pass.
- [ ] **Step 5: Commit** `feat(shop): delivery labels and variant label helper`.

---

### Task 3: Storage helper

**Files:**
- Modify: `lib/supabase/storage.ts`

- [ ] Add `SHOP_BUCKET = "shop-product-images"`, widen the bucket union type used by `publicUrl` / `deleteStorageObject`, and add `uploadShopProductImage(file, productId)` returning `{ path }` at `${productId}/${hash}.${ext}`.
- [ ] Run `npx tsc --noEmit`; commit `feat(shop): storage helper for product images`.

---

### Task 4: Server actions

**Files:**
- Create: `app/admin/shop/_actions.ts`

**Interfaces produces:** `ShopActionState = {ok:true} | {ok:false;error:string} | null`, and
`createShopProduct(prev, fd)`, `updateShopProduct(prev, fd)`, `deleteShopProduct(id)`,
`uploadShopImage(prev, fd)`, `deleteShopImage(imageId)`, `moveShopImage(imageId, direction)`,
`upsertShopVariant(prev, fd)`, `deleteShopVariant(variantId)`.

- [ ] Implement, mirroring `app/admin/products/_actions.ts` helpers (`cleanString`, `numberOr`).
- [ ] Validation per spec: name required; price ≥ 0; stock ≥ 0; slug required + slugified; publishing requires ≥ 1 delivery option; slug unique-violation (`23505`) returns "Slug-ul este deja folosit."
- [ ] `deleteShopProduct` removes storage objects for all of the product's images before deleting the row.
- [ ] Commit `feat(shop): admin server actions`.

---

### Task 5: List page + new-product page

**Files:**
- Create: `app/admin/shop/page.tsx`, `app/admin/shop/new/page.tsx`
- Create: `components/admin/shop/ShopProductsList.tsx`, `components/admin/shop/ShopFilters.tsx`, `components/admin/shop/NewShopProductForm.tsx`
- Modify: `components/admin/AdminSidebar.tsx`

- [ ] List: cover thumbnail, name+slug, price, status badge, variant count, delivery badges, `RowDeleteButton`; status filter; empty state "Niciun produs în magazin."
- [ ] New form: name, auto-slug, price, description, delivery checkboxes → `createShopProduct` → redirect to detail.
- [ ] Sidebar: add `{ href: "/admin/shop", label: "Magazin", icon: ShoppingBag }` to the *Conținut* group.
- [ ] Commit `feat(shop): admin list and create pages`.

---

### Task 6: Detail page + core form

**Files:**
- Create: `app/admin/shop/[id]/page.tsx`, `components/admin/shop/ShopProductForm.tsx`, `components/admin/shop/ShopSubrouteHeader.tsx`

- [ ] Detail page loads the product plus image/variant counts, renders `ShopProductForm` beside a `SectionGrid` linking to Imagini and Variante.
- [ ] Form fields: name, slug, description, price, currency, status, delivery checkboxes, and `stock` — shown only when the product has zero variants, with a hint pointing to the variants tab otherwise.
- [ ] Commit `feat(shop): product detail and core form`.

---

### Task 7: Image gallery

**Files:**
- Create: `app/admin/shop/[id]/images/page.tsx`, `components/admin/shop/ShopGalleryManager.tsx`

- [ ] Grid of uploaded images ordered by `sort_order`; first is badged "Copertă"; per-image move-left/move-right and delete; a drop zone that uploads on pick.
- [ ] Commit `feat(shop): product image gallery`.

---

### Task 8: Variants manager

**Files:**
- Create: `app/admin/shop/[id]/variants/page.tsx`, `components/admin/shop/ShopVariantsManager.tsx`

- [ ] Table of variants (culoare, greutate kg, preț override, stoc) with inline add row and delete; empty price cell means "inherits the product price" (hint shown).
- [ ] Commit `feat(shop): product variants manager`.

---

### Task 9: Verification

- [ ] `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` — all clean.
- [ ] Report results honestly; commit any fixes.

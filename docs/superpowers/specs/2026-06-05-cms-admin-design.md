# CMS / Admin Panel — Design Spec

**Date:** 2026-06-05
**Status:** Approved (user delegated all technical decisions; in-scope locked via brainstorming)
**Related:** [DBSPEC.md](../../../DBSPEC.md), [Detalii si informatii site FITEDUCATION.pdf](../../../Detalii%20si%20informatii%20site%20FITEDUCATION.pdf), [2026-06-04 admin login shell](./2026-06-04-admin-login-shell-design.md)

---

## 1. Scope

In scope (this build):
1. **Database & storage** — full DBSPEC.md schema applied to Supabase, plus enrollment payment-tracking extensions (see §3). RLS, storage buckets, admin-only write policies, seed data for all 8 courses with full curriculum from the PDF.
2. **Admin CRUD UI** — real pages replacing every `ComingSoon` stub. Drilldown shape (master + sub-routes), shadcn-only components, server actions for all mutations, image upload to Supabase Storage with preview.

Out of scope (explicitly deferred):
- Public site refactor (Phase 2 — home and `/curs/[id]` still read from `data/*.ts`).
- Stripe checkout + webhook (Phase 4).
- Student portal, document upload (Phase 3).

The enrollment schema is extended now (payment fields) so Stripe later just fills in the same columns — no breaking change required.

## 2. Architectural decisions

| Decision | Choice | Rationale |
|---|---|---|
| Editor shape | **Drilldown** — master page + sub-routes per relation | Smaller focused screens, real list views for child entities, linkable URLs, no "unsaved tab" footguns. Better fit for 8 courses authored once then occasionally tweaked. |
| Seed strategy | **Seed everything**, `status='draft'` | Migrations insert all 8 courses, sessions, full curriculum, shared lookups. Admin UI is then used for tweaks/publish. Nothing public until explicit publish. |
| Image upload | **Drop zone + preview + server action** | Server action uses service-role client → lets us tighten storage write RLS to admin-only via `public.is_admin()`. Hashed filenames per DBSPEC for cache busting. |
| Mutation transport | **Server actions only**, every action begins with `assertAdmin()` | Defense in depth alongside RLS. Keeps client bundles thin. |
| Auth & boundaries | Existing `proxy.ts` + `app/admin/layout.tsx` + `is_admin()` RPC | Already in place from prior phase; no changes. |
| Components | **shadcn only** (already installed set) | User-mandated. Set already covers Tabs, Sheet, Dialog, Sidebar, Table, Form, Select, Textarea. No new UI libs. |
| Drag-reorder (curriculum) | Native HTML5 drag-and-drop with `sort_order` updates via server action | No new deps; curriculum reordering is the only place that needs it. |
| Currency | Display via `Intl.NumberFormat` keyed on `currency` column — never hardcode RON/EUR | DBSPEC rule #1. |

## 3. Schema additions beyond DBSPEC.md

DBSPEC.md is implemented verbatim, with these additions to support payment tracking (per user requirement: "see / add users that paid by Stripe, invoice, or cash"):

```sql
create type payment_method as enum ('stripe', 'transfer', 'cash', 'other');

alter table enrollments
  add column payment_method payment_method,
  add column paid_amount numeric(10,2),
  add column paid_currency currency_code,
  add column paid_at timestamptz,
  add column invoice_number text,
  add column internal_notes text,
  add column created_by_admin boolean not null default false;

create index idx_enrollments_payment on enrollments(payment_method, paid_at);
```

`status='platit'` and `paid_at IS NOT NULL` are kept consistent at the application layer (server action sets both atomically). When Stripe lands, the webhook fills in `payment_method='stripe'` + `paid_amount` + `paid_at` and bumps `status` — same shape as a manual entry.

Manual enrollments (admin enters someone who paid offline) set `created_by_admin=true` and may set payment fields immediately.

## 4. Storage RLS

DBSPEC defaults write policies to `auth.role() = 'authenticated'`. We tighten to admin-only since only admins write images:

```sql
create policy "admin write course images" on storage.objects
  for all using (bucket_id = 'course-images' and public.is_admin())
  with check (bucket_id = 'course-images' and public.is_admin());

create policy "admin write trainer images" on storage.objects
  for all using (bucket_id = 'trainer-images' and public.is_admin())
  with check (bucket_id = 'trainer-images' and public.is_admin());
```

Public read policies remain as DBSPEC specifies.

## 5. Route map

```
/admin                              dashboard
/admin/products                     list (title, type, status, price, sessions count, updated)
/admin/products/new
/admin/products/[id]                master editor (core fields + sub-section grid w/ counts)
/admin/products/[id]/sessions
/admin/products/[id]/curriculum
/admin/products/[id]/trainers
/admin/products/[id]/requirements
/admin/products/[id]/certifications
/admin/products/[id]/audiences
/admin/products/[id]/images
/admin/trainers                     list
/admin/trainers/new
/admin/trainers/[id]
/admin/locations                    list + inline CRUD (small enough)
/admin/library                      shadcn Tabs: Requirements · Certifications · Audiences
/admin/enrollments                  list + filter + sort + CSV export
/admin/enrollments/new              manual enrollment (full form + payment fields)
/admin/enrollments/[id]             detail + status + payment update + internal notes
```

Sidebar groups: **Conținut** (Products, Trainers, Library, Locations) · **Operare** (Enrollments).

## 6. File layout

```
supabase/migrations/
  20260605_0001_schema.sql          enums + tables + indexes + updated_at trigger
  20260605_0002_rls_storage.sql     RLS policies + storage buckets + admin write policies
  20260605_0003_seed.sql            shared lookups + 8 courses + sessions + curriculum + pivots

lib/supabase/
  types.ts                          regenerated
  storage.ts                        getPublicUrl, uploadCourseImage, uploadTrainerImage (server-only)
  queries/
    courses.ts                      listCourses, getCourseBySlug, getCourseWithRelations
    trainers.ts
    enrollments.ts
    library.ts                      requirements, certifications, audiences, locations
  guards.ts                         assertAdmin() — server-side, throws if not admin

components/admin/
  AdminShell.tsx                    (exists)
  AdminSidebar.tsx                  (exists; sidebar items updated)
  ImageUploader.tsx                 drop zone + preview + alt text
  ConfirmDialog.tsx                 shadcn AlertDialog wrapper
  DataTable.tsx                     thin wrapper over shadcn Table for list views
  SectionGrid.tsx                   master-page card grid with counts
  forms/
    CourseCoreForm.tsx
    TrainerForm.tsx
    SessionForm.tsx
    EnrollmentForm.tsx
    PaymentForm.tsx

app/admin/
  layout.tsx                        (exists, no change)
  page.tsx                          dashboard
  actions.ts                        (exists: signInAdmin, signOutAdmin)
  products/
    page.tsx
    new/page.tsx
    [id]/
      page.tsx                      master
      sessions/page.tsx
      curriculum/page.tsx
      trainers/page.tsx
      requirements/page.tsx
      certifications/page.tsx
      audiences/page.tsx
      images/page.tsx
    _actions.ts                     all product mutations
  trainers/
    page.tsx · new/page.tsx · [id]/page.tsx · _actions.ts
  locations/
    page.tsx · _actions.ts
  library/
    page.tsx · _actions.ts
  enrollments/
    page.tsx · new/page.tsx · [id]/page.tsx · _actions.ts · export/route.ts (CSV)
```

## 7. UX patterns

- **List pages**: shadcn Table inside a Card, top-bar filters (Select + Input), "+ New" button top-right. Row click → detail.
- **Master editor** (`/admin/products/[id]`): two-column on desktop. Left: core fields form (title, slug, motto, description, price, currency, full_payment_price, klarna_enabled, duration_hours, language, launch_date, min_age, requires_bacalaureat, announcement_bar_text, show_in_hero, hero_sort_order, status). Right: `SectionGrid` of clickable cards — *Sesiuni (4)*, *Programa (6 secțiuni)*, *Formatori (2)*, *Cerințe (4)*, *Certificări (3)*, *Audiență (2)*, *Imagini*.
- **Sub-route pages**: breadcrumb back to master, page-local CRUD with shadcn Sheet for create/edit (lighter than Dialog for forms with several fields).
- **Curriculum**: list of sections with their items nested; drag handle per row updates `sort_order`. Add/edit section in a Sheet; items edited inline (textarea + save).
- **Pivot pickers** (trainers, requirements, certifications, audiences): two-column transfer pattern — "Disponibile" left, "Atașate" right, with role/featured/sort metadata inline for trainers.
- **Image uploader**: drop zone shows current image (Supabase public URL), drag-drop or click, alt text field below, replace/remove buttons. On replace, new hashed filename uploaded, old object deleted after successful DB update.
- **Confirm destructive actions** (delete course, delete trainer, delete enrollment): shadcn AlertDialog with typed confirmation for deletes that cascade.
- **Empty states**: friendly "Adaugă primul…" CTA per list page.

## 8. Server-action contract

Every action file follows:

```ts
'use server';

import { assertAdmin } from '@/lib/supabase/guards';
import { revalidatePath } from 'next/cache';

export async function createCourse(input: ...) {
  await assertAdmin();
  // ... mutation via server (anon RLS-bound) client; storage via admin client only when writing files
  revalidatePath('/admin/products');
}
```

Mutations return `{ ok: true } | { ok: false, error: string }`. Forms render errors inline. No optimistic UI — these screens are admin tools, simplicity wins.

## 9. Out-of-scope reminders

- Public site (`app/page.tsx`, `app/curs/[id]/page.tsx`) keeps reading from `data/*.ts`. Phase 2 will switch the queries.
- Stripe: enrollment schema is forward-compatible; no Stripe code yet.
- No analytics / audit log / soft delete on content models — admin is single-tenant single-user; YAGNI.

## 10. Testing & verification

- Type check (`npx tsc --noEmit`) after each phase.
- Manual click-through of every admin page in the browser at the end of phase 6, 7, 8.
- Supabase advisor check after migrations (`get_advisors`) to catch unindexed FKs / RLS gaps.

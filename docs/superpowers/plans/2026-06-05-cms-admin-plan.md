# CMS / Admin Panel — Implementation Plan

**Spec:** [2026-06-05-cms-admin-design.md](../specs/2026-06-05-cms-admin-design.md)

Phases are ordered to maximize independent verifiability. Each phase ends with a `tsc --noEmit` check and (where applicable) a Supabase advisor check.

---

## Phase 1 — DB schema migration
**Output:** `supabase/migrations/20260605_0001_schema.sql`

1. Enums: `course_type`, `course_status`, `currency_code`, `trainer_role`, `requirement_category`, `payment_plan`, `enrollment_status`, **`payment_method`** (new).
2. Tables in dependency order: `locations`, `courses`, `course_sessions`, `trainers`, `course_trainers`, `curriculum_sections`, `curriculum_items`, `requirements`, `course_requirements`, `certifications`, `course_certifications`, `audiences`, `course_audiences`, `enrollments` (with payment extension columns).
3. `updated_at` trigger function + per-table triggers on `courses`, `trainers`, `enrollments`.
4. Indexes per DBSPEC + `idx_enrollments_payment`.
5. RLS enable on all tables + policies per DBSPEC.

**Apply via:** `mcp__supabase__apply_migration`.
**Verify:** `mcp__supabase__list_tables` shows all 13 tables; `get_advisors` clean.

## Phase 2 — Storage + seed
**Output:** `supabase/migrations/20260605_0002_rls_storage.sql`, `20260605_0003_seed.sql`

1. Storage: create `course-images` + `trainer-images` buckets; public read; **admin-only write** via `public.is_admin()`.
2. Seed `audiences`, `certifications`, `requirements` (DBSPEC tables + categories).
3. Seed `locations` (Greenfield Wellness — name only; address null with note).
4. Seed `trainers`: Ana Georgescu, Robert Florea. `photo_path` null until images uploaded via admin.
5. Seed 8 `courses` rows from DBSPEC §Courses table. `status='draft'`, `cover_image_path` null, `show_in_hero=false`.
6. Seed `course_sessions` per DBSPEC §Sessions table (Hipertrofie row has null dates + the TBA note).
7. Seed `curriculum_sections` + `curriculum_items` from the PDF: full curriculum for `curs-aerobic`, `group-fitness-introduction`, `professional-development`, `functional-step-body-in-action`, `step-moves`, `cardio-moves`, `hipertrofie`. `curs-personal-trainer` gets a single placeholder section per the brief ("Pastreaza tot ce exista acum în Competențe și Abilități").
8. Seed pivots: `course_requirements` (workshops = age/medical/ID; accredited = all), `course_certifications` (per DBSPEC table), `course_audiences` (per DBSPEC), `course_trainers` (Ana → group-fitness-introduction primary featured; Robert → hipertrofie primary featured).
9. Announcement bar text set on both accredited courses.

**Verify:** `execute_sql` row counts match expectations (8 courses, 5 named sessions + 1 TBA, ~40 curriculum items, etc.).

## Phase 3 — Types + shared admin infra
1. `mcp__supabase__generate_typescript_types` → overwrite `lib/supabase/types.ts`. Preserve the existing `is_admin` RPC declaration only if regen omits it.
2. `lib/supabase/guards.ts`: `assertAdmin()` (throws 403-equivalent).
3. `lib/supabase/storage.ts`: `publicUrl(bucket, path)`, `uploadCourseImage(file, courseId, kind)`, `uploadTrainerImage(file, trainerId)`, `deleteStorageObject(bucket, path)`. Uses admin client (service role).
4. `lib/supabase/queries/*.ts`: read-side helpers used by admin pages.
5. Shared components: `ImageUploader`, `ConfirmDialog`, `DataTable`, `SectionGrid`, `forms/*` (skeleton — populated in later phases).
6. Update `components/admin/AdminSidebar.tsx` items: Dashboard · Products · Trainers · Library · Locations · Enrollments.

## Phase 4 — Library + Locations admin
Simplest CRUD; warm-up for the pattern.

1. `/admin/library` (Tabs: Requirements / Certifications / Audiences) — table per tab + Sheet for create/edit.
2. `/admin/locations` — table + Sheet.
3. Server actions in `_actions.ts` per route.
4. Verify by adding, editing, deleting one of each through the UI.

## Phase 5 — Trainers admin
1. `/admin/trainers` list (name, courses count, updated_at).
2. `/admin/trainers/new` and `/admin/trainers/[id]` editor with `ImageUploader` for `photo_path`/`photo_alt` and Instagram URL field.
3. Replace the `ComingSoon` stub.
4. Verify upload + delete works end-to-end (image lands in `trainer-images` bucket, public URL renders).

## Phase 6 — Products master + sub-routes
The big one. Build incrementally and verify each sub-route before moving on.

1. `/admin/products` list — title, type badge, status badge, price+currency, sessions count, updated_at; filter by type and status.
2. `/admin/products/new` — minimum fields (type, title, slug, currency, price, duration_hours). On save → redirect to `/admin/products/[id]`.
3. `/admin/products/[id]` master:
   - Left: `CourseCoreForm` (all scalar fields).
   - Right: `SectionGrid` linking to each sub-route with live counts.
4. Sub-routes in order: **images** → **sessions** → **trainers (pivot)** → **requirements** → **certifications** → **audiences** → **curriculum**.
5. Delete course (cascade) behind AlertDialog with typed confirmation.

## Phase 7 — Enrollments admin
1. `/admin/enrollments` list with shadcn Table; filters: course, status, payment_method, date range. Sortable. Paid/unpaid badge.
2. `/admin/enrollments/new` — manual entry form (full public-form fields + payment block + internal notes; sets `created_by_admin=true`).
3. `/admin/enrollments/[id]` — detail view, status dropdown, payment block (method/amount/currency/paid_at/invoice_number), internal_notes textarea. Save bumps `status='platit'` if `paid_at` set.
4. CSV export: `/admin/enrollments/export/route.ts` — respects current filter via query params; returns `text/csv`.
5. Hard-delete behind AlertDialog.

## Phase 8 — Dashboard + memory + verification
1. Real dashboard: counts of draft courses, total published, new enrollments (status='nou'), unpaid enrollments.
2. Update `MEMORY.md`: mark DB state, admin CMS as complete; remove "Phase 1 schema doesn't exist" caveat; add the new payment_method enum + columns.
3. End-to-end verify: launch dev server, click every admin page, perform one CRUD per model, confirm no console errors and no RLS denials.
4. Commit each phase as it lands.

---

## Risk notes

- **Existing `data/*.ts` files** stay untouched — public site keeps working through this build.
- **`is_admin()` RPC** is already declared in `types.ts`; if `generate_typescript_types` drops it, re-add manually.
- **Migration replay safety**: every `create` is plain `create` (not `create if not exists`) because we are applying to a fresh schema (memory confirms only `user_roles` exists). If applied to a partial state, this will fail loudly — preferable to silent skip.

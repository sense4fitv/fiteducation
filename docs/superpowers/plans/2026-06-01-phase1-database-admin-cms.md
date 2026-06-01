# Phase 1: Database + Admin CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase backend (schema, RLS, storage) and build an admin CMS at `/admin` for managing products and trainers.

**Architecture:** Supabase Postgres for data, Supabase Auth for admin login, Supabase Storage for images. Admin panel built as Next.js App Router pages under `/admin` with its own layout. Server Components for data fetching, Client Components for forms.

**Tech Stack:** Next.js 16, Supabase (postgres + auth + storage), @supabase/ssr, Tailwind CSS

---

### Task 1: Install Dependencies & Environment Setup

**Files:**
- Modify: `package.json`
- Create: `.env.local`

- [ ] **Step 1: Install Supabase packages**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create `.env.local` with Supabase credentials**

```env
NEXT_PUBLIC_SUPABASE_URL=https://mwoqyszevkeiswcaxlwm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from supabase dashboard>
```

- [ ] **Step 3: Add `.env.local` to `.gitignore` if not already there**

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "feat: install Supabase dependencies"
```

---

### Task 2: Database Migration — Tables, RLS, Storage

**Files:**
- Remote: Supabase project (via MCP `apply_migration`)

- [ ] **Step 1: Apply migration for trainers table**

- [ ] **Step 2: Apply migration for products table**

- [ ] **Step 3: Apply migration for product_trainers table**

- [ ] **Step 4: Apply migration for user_roles table**

- [ ] **Step 5: Apply migration for enrollments table**

- [ ] **Step 6: Apply RLS policies**

RLS helper function:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

Products policies:
- Public SELECT where status = 'published'
- Admin full CRUD (using is_admin())

Trainers policies:
- Public SELECT all
- Admin full CRUD

product_trainers policies:
- Public SELECT all
- Admin full CRUD

user_roles policies:
- Users SELECT own row
- Admin full CRUD

enrollments policies:
- Users SELECT own rows
- Admin full CRUD

- [ ] **Step 7: Create storage buckets** (product-images, trainer-images, user-documents)

- [ ] **Step 8: Apply updated_at trigger for products and trainers**

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

- [ ] **Step 9: Verify tables exist via execute_sql**

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

### Task 3: Seed Migration — Existing Data

**Files:**
- Remote: Supabase project (via MCP `apply_migration` or `execute_sql`)

- [ ] **Step 1: Insert 6 trainers from data/trainers.ts**

- [ ] **Step 2: Insert 3 courses from data/courses.ts as products**

Map fields: title, slug, description, full_description, price (numeric), type='course', status='published', category='foundation', plus all JSONB fields (curriculum from modules, highlights, included, testimonials, faq, requirements_docs, fees_structure, exam_info).

- [ ] **Step 3: Insert 3 specializations from data/specializations.ts as products**

The 2 specializations that overlap with courses (personal-training, aerobic-group) should NOT be duplicated — they map to the same products. Insert only the 3 unique ones: certificare-profesionala, vipr, crab.

- [ ] **Step 4: Insert product_trainers relationships**

Link all 6 trainers to the personal-training course (since that's the main course currently displayed).

- [ ] **Step 5: Verify seed data**

```sql
SELECT id, title, type, status FROM products;
SELECT id, name FROM trainers;
SELECT * FROM product_trainers;
```

---

### Task 4: Supabase Client Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/admin.ts`
- Create: `lib/supabase/types.ts`
- Create: `lib/helpers/pricing.ts`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create browser client** (`lib/supabase/client.ts`)

Uses `createBrowserClient` from `@supabase/ssr`.

- [ ] **Step 2: Create server client** (`lib/supabase/server.ts`)

Uses `createServerClient` from `@supabase/ssr` with Next.js cookies.

- [ ] **Step 3: Create admin/service-role client** (`lib/supabase/admin.ts`)

Uses `createClient` from `@supabase/supabase-js` with service role key. Server-only.

- [ ] **Step 4: Generate TypeScript types** (`lib/supabase/types.ts`)

Use MCP `generate_typescript_types` tool, save output.

- [ ] **Step 5: Create pricing helper** (`lib/helpers/pricing.ts`)

```typescript
export function getCurrentPrice(product: { price: number; promo_price?: number | null; promo_start?: string | null; promo_end?: string | null }): { current: number; original: number; isPromo: boolean } {
  const now = new Date();
  if (product.promo_price && product.promo_start && product.promo_end) {
    if (now >= new Date(product.promo_start) && now <= new Date(product.promo_end)) {
      return { current: product.promo_price, original: product.price, isPromo: true };
    }
  }
  return { current: product.price, original: product.price, isPromo: false };
}
```

- [ ] **Step 6: Commit**

---

### Task 5: Admin Layout, Auth Guard & Login Page

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/login/page.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create admin login page**

Simple email/password form using Supabase auth `signInWithPassword`. Redirects to `/admin` on success.

- [ ] **Step 2: Create AdminSidebar component**

Links: Dashboard, Products, Trainers, Enrollments. Active state. Logout button.

- [ ] **Step 3: Create admin layout with auth guard**

Server component that checks session via `createServerClient`. If no session or not admin (check user_roles), redirect to `/admin/login`. Renders sidebar + children.

- [ ] **Step 4: Create admin dashboard page**

Quick stats: total products, total trainers, published products count. Fetched server-side.

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

---

### Task 6: JSONB Field Editor Components

**Files:**
- Create: `components/admin/fields/ListEditor.tsx`
- Create: `components/admin/fields/CurriculumEditor.tsx`
- Create: `components/admin/fields/FAQEditor.tsx`
- Create: `components/admin/fields/CompetenciesEditor.tsx`
- Create: `components/admin/fields/TestimonialsEditor.tsx`
- Create: `components/admin/fields/FeesEditor.tsx`
- Create: `components/admin/fields/ExamInfoEditor.tsx`
- Create: `components/admin/fields/CertificationsEditor.tsx`
- Create: `components/admin/fields/JsonFallback.tsx`

All are client components that receive `value` and `onChange` props.

- [ ] **Step 1: Create ListEditor** — reusable for string arrays (highlights, included, requirements_docs, tags). Add/remove/reorder items.

- [ ] **Step 2: Create CurriculumEditor** — array of {title, topics[]}. Add/remove modules, add/remove topics within each.

- [ ] **Step 3: Create FAQEditor** — array of {question, answer}. Add/remove pairs.

- [ ] **Step 4: Create CompetenciesEditor** — array of {title, icon, items[]}. Icon is a text field (Lucide icon name).

- [ ] **Step 5: Create TestimonialsEditor** — array of {name, role, text, image_url}. Text inputs for each field.

- [ ] **Step 6: Create FeesEditor** — object with inscription, monthly, total fields.

- [ ] **Step 7: Create ExamInfoEditor** — object with format, duration, passing_grade, certification.

- [ ] **Step 8: Create CertificationsEditor** — array of {label, title, description}.

- [ ] **Step 9: Create JsonFallback** — textarea with JSON validation, shown via toggle.

- [ ] **Step 10: Commit**

---

### Task 7: Image Upload Component

**Files:**
- Create: `components/admin/ImageUpload.tsx`

- [ ] **Step 1: Create ImageUpload component**

Client component. Props: `bucket: string`, `value: string | null`, `onChange: (url: string) => void`. Shows current image preview, file picker, uploads to Supabase Storage, returns public URL.

- [ ] **Step 2: Commit**

---

### Task 8: Trainers CRUD

**Files:**
- Create: `components/admin/TrainerForm.tsx`
- Create: `app/admin/trainers/page.tsx`
- Create: `app/admin/trainers/new/page.tsx`
- Create: `app/admin/trainers/[id]/page.tsx`

- [ ] **Step 1: Create TrainerForm component**

Client component with fields: name, description, image (via ImageUpload), sort_order. Handles both create and edit (receives optional `trainer` prop). On submit: calls Supabase insert or update, then redirects to trainer list.

- [ ] **Step 2: Create trainers list page**

Server component. Fetches all trainers ordered by sort_order. Table with name, image preview, actions (edit, delete). "Add Trainer" button links to /admin/trainers/new.

- [ ] **Step 3: Create new trainer page**

Renders TrainerForm with no initial data.

- [ ] **Step 4: Create edit trainer page**

Server component. Fetches trainer by id from params. Renders TrainerForm with trainer data.

- [ ] **Step 5: Add delete functionality**

Client-side delete button with confirmation. Calls Supabase delete, refreshes list.

- [ ] **Step 6: Verify build & test manually**

- [ ] **Step 7: Commit**

---

### Task 9: Products CRUD — The Big Form

**Files:**
- Create: `components/admin/ProductForm.tsx`
- Create: `components/admin/ProductTrainerPicker.tsx`
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/new/page.tsx`
- Create: `app/admin/products/[id]/page.tsx`

- [ ] **Step 1: Create ProductTrainerPicker component**

Client component. Fetches all trainers. Checkbox multi-select with sort_order. Props: `value: {trainer_id, sort_order}[]`, `onChange`.

- [ ] **Step 2: Create ProductForm component**

Client component organized in accordion/tab sections:
1. Basic Info — title, slug (auto-gen), type select, status select, category select, description textarea, image upload
2. Pricing & Schedule — price, promo_price, promo_start (date), promo_end (date), start_date, duration, schedule, location, spots_total
3. Content — full_description textarea, ListEditor for highlights, ListEditor for included, CompetenciesEditor, CurriculumEditor
4. Enrollment — ListEditor for requirements_docs, FeesEditor, ExamInfoEditor, CertificationsEditor
5. Social Proof — TestimonialsEditor, FAQEditor
6. Trainers — ProductTrainerPicker
7. Meta — ListEditor for tags, level input, language input, min_education input, external_checkout_url input

On submit: upsert product + sync product_trainers (delete old, insert new). Redirect to product list.

- [ ] **Step 3: Create products list page**

Server component. Fetches all products (any status) ordered by sort_order. Table with: status badge, type badge, title, price, start_date, actions (edit, delete). "Add Product" button.

- [ ] **Step 4: Create new product page**

Renders ProductForm with no initial data.

- [ ] **Step 5: Create edit product page**

Server component. Fetches product by id + its product_trainers. Renders ProductForm with data.

- [ ] **Step 6: Add delete functionality with confirmation**

- [ ] **Step 7: Verify build**

- [ ] **Step 8: Commit**

---

### Task 10: Enrollments List (Read-Only Placeholder)

**Files:**
- Create: `app/admin/enrollments/page.tsx`

- [ ] **Step 1: Create enrollments page**

Server component. Fetches enrollments joined with products and auth.users (if any). Shows empty state message for now. Table structure ready for: student name, product title, status, amount, date.

- [ ] **Step 2: Commit**

---

### Task 11: Final Verification & Build

- [ ] **Step 1: Run `npm run build`** — fix any TypeScript or build errors
- [ ] **Step 2: Verify all admin routes load**
- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: Phase 1 complete — database schema, admin CMS"
```

# Phase 1: Database Schema + Supabase Setup + Admin CMS

## Overview

Add a Supabase backend to the existing Fiteducation Next.js site. Phase 1 covers:
- Full Postgres schema (products, trainers, enrollments, roles)
- RLS policies and Supabase Storage buckets
- Admin CMS panel at `/admin` with CRUD for products and trainers
- Seed migration for existing hardcoded data

Phase 1 does NOT include: frontend refactor, user auth flow, Stripe payments, student portal.

## Database Schema

### `trainers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK (gen_random_uuid()) | |
| name | text NOT NULL | |
| description | text | bio/role shown everywhere |
| image_url | text | path in Supabase Storage or /public |
| sort_order | int DEFAULT 0 | controls display order |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### `products`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK (gen_random_uuid()) | |
| type | text NOT NULL CHECK ('course', 'workshop') | |
| status | text NOT NULL DEFAULT 'draft' CHECK ('draft', 'published', 'archived') | |
| category | text | 'foundation', 'direction', 'specialization' — used by Configurator |
| title | text NOT NULL | |
| slug | text UNIQUE NOT NULL | URL-friendly, used in frontend routing |
| description | text | short description for cards/listings |
| full_description | text | longer description for detail page |
| image_url | text | hero/card image |
| price | numeric(10,2) NOT NULL | standard price in RON |
| promo_price | numeric(10,2) | reduced price during promo window |
| promo_start | timestamptz | promo window start |
| promo_end | timestamptz | promo window end |
| start_date | date | |
| duration | text | free-form: "1080 ore", "3 zile" |
| schedule | text | "Luni-Vineri 18:00-21:00" |
| language | text DEFAULT 'Romana' | |
| location | text | |
| min_education | text | |
| level | text | "Incepator", "Intermediar", etc. |
| spots_total | int | |
| external_checkout_url | text | Stripe/external link if applicable |
| curriculum | jsonb DEFAULT '[]' | see JSONB schemas below |
| highlights | jsonb DEFAULT '[]' | |
| included | jsonb DEFAULT '[]' | |
| competencies | jsonb DEFAULT '[]' | |
| requirements_docs | jsonb DEFAULT '[]' | |
| fees_structure | jsonb DEFAULT '{}' | |
| exam_info | jsonb DEFAULT '{}' | |
| faq | jsonb DEFAULT '[]' | |
| testimonials | jsonb DEFAULT '[]' | |
| tags | jsonb DEFAULT '[]' | |
| certifications | jsonb DEFAULT '[]' | |
| sort_order | int DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### `product_trainers`

| Column | Type | Notes |
|--------|------|-------|
| product_id | uuid FK -> products(id) ON DELETE CASCADE | |
| trainer_id | uuid FK -> trainers(id) ON DELETE CASCADE | |
| sort_order | int DEFAULT 0 | order of trainers within a product |
| PRIMARY KEY | (product_id, trainer_id) | |

### `enrollments` (structure only, populated in later phases)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK (gen_random_uuid()) | |
| user_id | uuid FK -> auth.users(id) | |
| product_id | uuid FK -> products(id) | |
| status | text DEFAULT 'pending' CHECK ('pending', 'paid_stripe', 'paid_manual', 'cancelled') | |
| amount_paid | numeric(10,2) | |
| notes | text | admin notes |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### `user_roles`

| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid PK FK -> auth.users(id) ON DELETE CASCADE | |
| role | text NOT NULL DEFAULT 'user' CHECK ('user', 'admin') | |

## JSONB Schemas

### curriculum
```json
[
  {
    "title": "Module Name",
    "topics": ["Topic 1", "Topic 2"]
  }
]
```

### highlights / included / requirements_docs / tags
```json
["Item 1", "Item 2", "Item 3"]
```

### competencies
```json
[
  {
    "title": "Competency title",
    "icon": "Target",
    "items": ["Skill 1", "Skill 2"]
  }
]
```

### fees_structure
```json
{
  "inscription": "500 RON",
  "monthly": "850 RON x 4 luni",
  "total": "3.900 RON"
}
```

### exam_info
```json
{
  "format": "Examen teoretic + practic",
  "duration": "3 ore",
  "passing_grade": "75%",
  "certification": "Certificare EREPS Nivel 3"
}
```

### faq
```json
[
  {
    "question": "Question text?",
    "answer": "Answer text."
  }
]
```

### testimonials
```json
[
  {
    "name": "Name",
    "role": "Role",
    "text": "Testimonial text",
    "image_url": "/path/to/image.jpg"
  }
]
```

### certifications
```json
[
  {
    "label": "CERTIFICAT OFICIAL",
    "title": "Certificat de Absolvire",
    "description": "Acreditat de Ministerul Muncii..."
  }
]
```

## RLS Policies

### products, trainers, product_trainers
- Public: SELECT where `status = 'published'` (products) or unrestricted (trainers)
- Admin: full CRUD, checked via `user_roles.role = 'admin'`

### enrollments
- Users: SELECT/INSERT own rows (`user_id = auth.uid()`)
- Admin: full CRUD

### user_roles
- Users: SELECT own row
- Admin: full CRUD

## Supabase Storage Buckets

- `product-images` — public read, admin write
- `trainer-images` — public read, admin write
- `user-documents` — private, user read own, admin read all (created now, used in Phase 3)

## Admin CMS

### Folder structure

```
app/
  admin/
    layout.tsx              — admin shell: sidebar nav + auth guard
    page.tsx                — dashboard with quick stats
    products/
      page.tsx              — product list table (status, type, title, price, actions)
      new/
        page.tsx            — create product form
      [id]/
        page.tsx            — edit product form
    trainers/
      page.tsx              — trainer list
      new/
        page.tsx            — create trainer
      [id]/
        page.tsx            — edit trainer
    enrollments/
      page.tsx              — enrollment list (read-only placeholder)

lib/
  supabase/
    client.ts               — browser client (createBrowserClient)
    server.ts               — server client (createServerClient)
    admin.ts                — service-role client for admin ops
    types.ts                — generated TypeScript types
  helpers/
    pricing.ts              — getCurrentPrice(product) promo window logic

components/
  admin/
    AdminSidebar.tsx        — sidebar navigation
    ProductForm.tsx         — shared create/edit form with all fields
    TrainerForm.tsx         — shared create/edit trainer form
    ProductTrainerPicker.tsx — multi-select trainer assignment
    ImageUpload.tsx         — Supabase Storage upload, returns URL
    fields/
      CurriculumEditor.tsx      — add/remove/reorder modules + topics
      FAQEditor.tsx             — add/remove Q&A pairs
      ListEditor.tsx            — reusable for highlights, included, requirements_docs, tags
      CompetenciesEditor.tsx    — competency blocks with items
      TestimonialsEditor.tsx    — testimonials with image upload
      FeesEditor.tsx            — structured inscription/monthly/total
      ExamInfoEditor.tsx        — format/duration/grade/certification
      CertificationsEditor.tsx  — certification cards
      JsonFallback.tsx          — raw JSON toggle (hidden by default)
```

### ProductForm sections (tabs or accordion)

1. **Basic Info** — title, slug (auto-gen from title), type, status, category, description, image
2. **Pricing & Schedule** — price, promo price/window, start date, duration, schedule, location, spots
3. **Content** — full description, highlights, included, competencies, curriculum
4. **Enrollment** — requirements docs, fees structure, exam info, certifications
5. **Social Proof** — testimonials, FAQ
6. **Trainers** — multi-select picker
7. **Meta** — tags, level, language, min education, external checkout URL

### Auth guard (lightweight for Phase 1)

- Supabase email/password login
- Check `user_roles` for `role = 'admin'`
- Redirect non-admin to homepage
- Seed one admin user manually via Supabase dashboard

## Pricing Helper Logic

```
function getCurrentPrice(product):
  if promo_price AND promo_start AND promo_end:
    if now >= promo_start AND now <= promo_end:
      return promo_price
  return price
```

Consistent between frontend display, sticky bar, and checkout (enforced in Phase 2).

## Seed Migration

Migrate existing hardcoded data into DB:
- 3 courses from `data/courses.ts`
- 5 specializations from `data/specializations.ts` (as products with category)
- 6 trainers from `data/trainers.ts`
- Product-trainer relationships

Existing `/public` image paths preserved as-is in seed data. Storage upload handled when admins edit via CMS.

## Execution Order

1. Install `@supabase/supabase-js` and `@supabase/ssr`
2. Create DB migration (tables, RLS, storage buckets)
3. Generate TypeScript types
4. Set up Supabase clients (client.ts, server.ts, admin.ts)
5. Create pricing helper
6. Run seed migration (existing data into DB)
7. Build admin layout (sidebar, auth guard, dashboard)
8. Build reusable JSONB field editors
9. Build Trainers CRUD
10. Build Products CRUD (the big form)
11. Build Product-Trainer assignment (picker in product form)
12. Build Enrollments list (read-only)
13. Build image upload (Supabase Storage)

## Out of Scope

- Frontend refactor to consume dynamic data (Phase 2)
- User registration/login flow (Phase 3)
- Student portal and document upload (Phase 3)
- Stripe payment integration (Phase 4)
- Sticky bar promo display (Phase 2)

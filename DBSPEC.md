# FITEDUCATION — Database Specification (Supabase / Postgres)

Specification for the FITEDUCATION course platform database. Implement as Supabase migrations. Two product types share one `courses` table (single-table inheritance via `type`): accredited courses (RON pricing, 1080h, ANC certification) and workshops (EUR pricing, 16–48h, specific event dates and locations).

## Conventions

- Primary keys: `uuid default gen_random_uuid()`
- All tables get `created_at timestamptz default now()` and `updated_at timestamptz default now()` (add an `updated_at` trigger)
- Images: stored in Supabase Storage, DB keeps only the **path within the bucket**, never full URLs
- RLS enabled on all tables

## Enums

```sql
create type course_type as enum ('curs_acreditat', 'workshop');
create type course_status as enum ('draft', 'published', 'archived');
create type currency_code as enum ('RON', 'EUR');
create type trainer_role as enum ('principal', 'secundar');
create type requirement_category as enum ('inscriere', 'acte', 'participare', 'examen');
create type payment_plan as enum ('integral', 'rate_klarna');
create type enrollment_status as enum ('nou', 'contactat', 'confirmat', 'platit', 'anulat');
```

## Tables

### courses

The central table. Both course types live here.

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  type course_type not null,
  slug text not null unique,
  title text not null,
  motto text,
  description text,                          -- long-form, markdown allowed
  price_amount numeric(10,2) not null,
  currency currency_code not null,           -- RON for accredited, EUR for workshops
  full_payment_price numeric(10,2),          -- discount price for full payment; null for workshops
  klarna_enabled boolean not null default true,
  duration_hours int not null,
  language text not null default 'română',
  launch_date date,                          -- accredited courses only ("data lansării")
  min_age int not null default 18,
  requires_bacalaureat boolean not null default false,  -- true only for accredited
  announcement_bar_text text,                -- e.g. "DISCOUNT la plata integrală: 7500 lei"
  cover_image_path text,                     -- card/listing image (bucket: course-images)
  hero_image_path text,                      -- optional wider hero crop
  cover_image_alt text,
  show_in_hero boolean not null default false,
  hero_sort_order int,
  status course_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_courses_status_type on courses(status, type);
create index idx_courses_hero on courses(show_in_hero, hero_sort_order) where show_in_hero = true;
```

Hero fallback rule (implement in queries/views): `coalesce(hero_image_path, cover_image_path)`.

### locations

```sql
create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,                        -- e.g. "Greenfield Wellness"
  address text,
  map_url text,
  created_at timestamptz not null default now()
);
```

### course_sessions

Editions/dates of a course. Workshops have 1+ sessions (Hipertrofie spans 2–4 weekends → multiple rows, dates may be null/TBA). Accredited courses may have zero rows (they use `launch_date`).

```sql
create table course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  start_date date,                           -- nullable = TBA
  end_date date,
  location_id uuid references locations(id) on delete set null,
  note text,                                 -- e.g. "Weekend 1 din 4, datele se anunță înainte de start"
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_sessions_course on course_sessions(course_id, start_date);
```

### trainers

```sql
create table trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  credentials text,                          -- certifications, accolades
  photo_path text,                           -- bucket: trainer-images
  photo_alt text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### course_trainers (pivot)

```sql
create table course_trainers (
  course_id uuid not null references courses(id) on delete cascade,
  trainer_id uuid not null references trainers(id) on delete cascade,
  role trainer_role not null default 'secundar',
  is_featured boolean not null default false,  -- the 2-3 trainers shown directly on the page; rest go in carousel/"see more"
  sort_order int not null default 0,
  primary key (course_id, trainer_id)
);
```

### curriculum_sections + curriculum_items

Hierarchical "programa". Sections map to things like "Ziua 1 – Fundamentele mișcării", "Part 2: Body in Action", or competence groups like "Să organizeze și să coordoneze clase de aerobic-fitness". Items are the bullet points within.

```sql
create table curriculum_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  subtitle text,                             -- e.g. "**Ziua 1 creează fundamentul..."
  sort_order int not null default 0
);

create table curriculum_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references curriculum_sections(id) on delete cascade,
  content text not null,
  sort_order int not null default 0
);

create index idx_curriculum_course on curriculum_sections(course_id, sort_order);
create index idx_curriculum_items on curriculum_items(section_id, sort_order);
```

### requirements + course_requirements (pivot)

Reusable enrollment/participation requirements — the same 3–4 items repeat across all 8 products.

```sql
create table requirements (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  category requirement_category not null,
  sort_order int not null default 0
);

create table course_requirements (
  course_id uuid not null references courses(id) on delete cascade,
  requirement_id uuid not null references requirements(id) on delete cascade,
  primary key (course_id, requirement_id)
);
```

### certifications + course_certifications (pivot)

```sql
create table certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,                               -- "ANC & Ministerul Muncii", "FITEDUCATION", "Formatori internaționali"
  description text
);

create table course_certifications (
  course_id uuid not null references courses(id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  primary key (course_id, certification_id)
);
```

### audiences + course_audiences (pivot)

Powers the "Pentru cine este acest workshop?" badge section.

```sql
create table audiences (
  id uuid primary key default gen_random_uuid(),
  label text not null unique                 -- 'Începători', 'Instructori', 'Antrenori', 'Pasionați fitness'
);

create table course_audiences (
  course_id uuid not null references courses(id) on delete cascade,
  audience_id uuid not null references audiences(id) on delete cascade,
  primary key (course_id, audience_id)
);
```

### enrollments

The enrollment form submissions ("Formular de înscriere").

```sql
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete restrict,
  session_id uuid references course_sessions(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  message text,
  payment_plan payment_plan,
  status enrollment_status not null default 'nou',
  gdpr_accepted_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_enrollments_course on enrollments(course_id, status);
create index idx_enrollments_email on enrollments(email);
```

## Storage buckets

| Bucket | Access | Structure |
|---|---|---|
| `course-images` | public read | `{course_id}/cover-{hash}.webp`, `{course_id}/hero-{hash}.webp` |
| `trainer-images` | public read | `{trainer_id}/profile-{hash}.webp` |

Use hashed/timestamped filenames (not fixed names) to avoid stale CDN cache after replacing an image. Upload as WebP. Use Supabase image transformations for responsive sizes when on Pro plan.

```sql
insert into storage.buckets (id, name, public) values
  ('course-images', 'course-images', true),
  ('trainer-images', 'trainer-images', true);

create policy "public read course images" on storage.objects
  for select using (bucket_id = 'course-images');

create policy "public read trainer images" on storage.objects
  for select using (bucket_id = 'trainer-images');

create policy "authenticated write course images" on storage.objects
  for insert with check (bucket_id = 'course-images' and auth.role() = 'authenticated');

create policy "authenticated write trainer images" on storage.objects
  for insert with check (bucket_id = 'trainer-images' and auth.role() = 'authenticated');
```

If site visitors will ever authenticate, tighten write policies to an admin check (e.g. a `profiles.is_admin` flag or custom JWT claim) instead of `auth.role() = 'authenticated'`.

## RLS policies

The public site reads with the anon key; admin work happens via the dashboard/service role (service role bypasses RLS).

```sql
-- Enable RLS everywhere
alter table courses enable row level security;
alter table locations enable row level security;
alter table course_sessions enable row level security;
alter table trainers enable row level security;
alter table course_trainers enable row level security;
alter table curriculum_sections enable row level security;
alter table curriculum_items enable row level security;
alter table requirements enable row level security;
alter table course_requirements enable row level security;
alter table certifications enable row level security;
alter table course_certifications enable row level security;
alter table audiences enable row level security;
alter table course_audiences enable row level security;
alter table enrollments enable row level security;

-- Public can read published courses and all related content
create policy "anon read published courses" on courses
  for select using (status = 'published');

create policy "anon read" on locations for select using (true);
create policy "anon read" on course_sessions for select using (true);
create policy "anon read" on trainers for select using (true);
create policy "anon read" on course_trainers for select using (true);
create policy "anon read" on curriculum_sections for select using (true);
create policy "anon read" on curriculum_items for select using (true);
create policy "anon read" on requirements for select using (true);
create policy "anon read" on course_requirements for select using (true);
create policy "anon read" on certifications for select using (true);
create policy "anon read" on course_certifications for select using (true);
create policy "anon read" on audiences for select using (true);
create policy "anon read" on course_audiences for select using (true);

-- Enrollments: public can INSERT only (form submission), never read
create policy "anon insert enrollments" on enrollments
  for insert with check (true);
```

Consider rate-limiting enrollment inserts at the edge (or a captcha) since the insert policy is open.

## Seed data

### Requirements (shared)

| label | category |
|---|---|
| Vârstă minimă: 18 ani împliniți | inscriere |
| Adeverință medicală „apt pentru efort fizic" / „clinic sănătos" | inscriere |
| Act de identitate valabil | inscriere |
| Studii finalizate: minimum diplomă de Bacalaureat | inscriere |
| Copie act de identitate | acte |
| Copie diplomă de studii (minim Bacalaureat) | acte |
| Copie certificat de căsătorie/divorț (dacă numele diferă de actele de studii) | acte |
| Semnarea documentelor cursului (contract, T&C, GDPR) | participare |
| Prezență minimă obligatorie de 90% | participare |
| Participare activă la componentele teoretice și practice | participare |
| Achitarea integrală a taxelor programului | examen |
| Dosar complet și valid conform cerințelor administrative | examen |

Workshops get only: age, medical certificate, ID. Accredited courses get all of them.

### Certifications

| name | issuer | attach to |
|---|---|---|
| Certificare acreditată ANC & Ministerul Muncii | ANC & Ministerul Muncii | accredited only |
| Diplomă de participare FITEDUCATION | FITEDUCATION | accredited only |
| Diplome de participare la workshopuri & specializări | Formatori internaționali | all workshops |

### Audiences

`Începători`, `Instructori`, `Antrenori`, `Pasionați fitness`

### Trainers (known so far)

| name | note |
|---|---|
| Ana Georgescu | leads Group Fitness Introduction |
| Robert Florea | leads Hipertrofie workshop |

More trainers (the full team for accredited courses) to be added later — schema supports it via `course_trainers` with `is_featured`.

### Courses (8 products)

| slug | type | title | price | currency | full_payment_price | duration_hours | launch_date | requires_bacalaureat |
|---|---|---|---|---|---|---|---|---|
| curs-personal-trainer | curs_acreditat | Instructor Fitness Certificat / Personal Trainer | 7900 | RON | 7500 | 1080 | 2026-07-18 | true |
| curs-aerobic | curs_acreditat | Instructor Certificat Aerobic | 7900 | RON | 7500 | 1080 | 2026-07-18 | true |
| group-fitness-introduction | workshop | Group Fitness Introduction | 300 | EUR | null | 16 | null | false |
| professional-development | workshop | Professional Development | 300 | EUR | null | 16 | null | false |
| functional-step-body-in-action | workshop | Functional Step. Body in Action. Strength & Stretch | 300 | EUR | null | 16 | null | false |
| step-moves | workshop | Step Moves | 300 | EUR | null | 16 | null | false |
| cardio-moves | workshop | Cardio Moves | 300 | EUR | null | 16 | null | false |
| hipertrofie | workshop | Hipertrofie (cu Robert Florea) | 600 | EUR | null | 48 | null | false |

Mottos:

- curs-personal-trainer: "Devino antrenor personal certificat internațional"
- curs-aerobic: "Devino instructor aerobic certificat și transformă energia, mișcarea și muzica într-o experiență care inspiră oamenii."
- group-fitness-introduction: "Primul pas în fitnessul de grup începe cu energia pe care alegi să o transmiți."
- professional-development: "De la instructor la profesionist complet în fitnessul de grup."
- functional-step-body-in-action: "Mișcarea eficientă înseamnă control, forță și echilibru."
- step-moves: "Fiecare pas poate deveni mișcare cu intenție și energie."
- cardio-moves: "Energie, ritm și mișcare fără limite."
- hipertrofie: "Construirea masei musculare începe cu antrenamentul inteligent."

Announcement bar (both accredited courses): `DISCOUNT la plata integrală: 7500 lei`

### Locations

| name |
|---|
| Greenfield Wellness *(name and address to be confirmed)* |

### Sessions

| course | start_date | end_date | location | note |
|---|---|---|---|---|
| group-fitness-introduction | 2026-09-26 | 2026-09-27 | Greenfield Wellness | |
| professional-development | 2026-10-17 | 2026-10-18 | Greenfield Wellness | |
| step-moves | 2026-10-03 | 2026-10-04 | null | |
| functional-step-body-in-action | 2026-10-24 | 2026-10-25 | null | |
| cardio-moves | 2026-12-05 | 2026-12-06 | null | |
| hipertrofie | null | null | null | Desfășurat pe 2–4 weekenduri, datele se comunică înainte de start |

### Curriculum

Seed `curriculum_sections` / `curriculum_items` from the content brief. Structure per course:

- **curs-aerobic**: sections = the competence groups ("Să organizeze și să coordoneze clase de aerobic-fitness", "Să aplice corect tehnica exercițiilor...", etc.), items = the bullets under each.
- **curs-personal-trainer**: placeholder — brief says keep existing "Competențe și Abilități" structure from the current site.
- **group-fitness-introduction**: sections "Ziua 1 – Fundamentele mișcării și conexiunea cu muzica" and "Ziua 2 – Didactică, stil și dezvoltarea instructorului", plus a "Ce vei învăța" section.
- **professional-development**: sections "Ziua 1 – Optimizarea performanței ca instructor" (modules 1–4) and "Ziua 2 – Identitate, comunicare și impact" (modules 5–8).
- **functional-step-body-in-action**: sections "Part 1: Functional Step", "Part 2: Body in Action", "Part 3: Strength & Stretch".
- **step-moves / cardio-moves**: sections "Descriere", "Beneficii pentru participanți", "Rezultatul final".
- **hipertrofie**: single "Ce vei înváța" section with the 10 listed items.

## Implementation notes for the frontend

1. **Currency display**: always render `price_amount` with `currency` — accredited courses are RON, workshops are EUR. Never assume one currency.
2. **Hero query**: `select ... from courses where show_in_hero and status = 'published' order by hero_sort_order` with image fallback `coalesce(hero_image_path, cover_image_path)`.
3. **Image URLs**: build with `supabase.storage.from(bucket).getPublicUrl(path)` at render time; DB stores paths only.
4. **Workshop dates**: a session with null dates renders as "Datele vor fi anunțate" (TBA) plus the `note`.
5. **Trainers UI**: show `is_featured = true` trainers directly (2–3), the rest in a carousel or behind "see more", per the brief.
6. **Requirements UI**: collapse with "see more" on accredited course pages (brief explicitly asks to avoid the wall of text).
7. **Klarna**: `klarna_enabled` toggles the "Posibilitatea de a achita în rate prin Klarna" line near the price.
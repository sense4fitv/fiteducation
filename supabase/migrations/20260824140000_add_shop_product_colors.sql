-- Colour becomes its own level: one colour carries the swatch and the photo,
-- and its weights hang underneath it as variants.
-- Applied while shop_product_variants was still empty, hence the plain column drop.

create table if not exists public.shop_product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shop_products (id) on delete cascade,
  name text not null,
  hex text,
  -- The photo is picked from the product gallery, so a deleted image just clears it.
  image_id uuid references public.shop_product_images (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint shop_product_colors_hex_format check (hex is null or hex ~ '^#[0-9a-f]{6}$'),
  constraint shop_product_colors_unique_name unique (product_id, name)
);

create index if not exists shop_product_colors_product_idx
  on public.shop_product_colors (product_id, sort_order);

alter table public.shop_product_variants
  drop constraint if exists shop_product_variants_unique_attrs;

alter table public.shop_product_variants
  drop column if exists color;

alter table public.shop_product_variants
  add column if not exists color_id uuid
    references public.shop_product_colors (id) on delete cascade;

alter table public.shop_product_variants
  add constraint shop_product_variants_unique_attrs
    unique (product_id, color_id, weight_kg);

create index if not exists shop_product_variants_color_idx
  on public.shop_product_variants (color_id);

-- RLS ------------------------------------------------------------------

alter table public.shop_product_colors enable row level security;

drop policy if exists "admin all" on public.shop_product_colors;
create policy "admin all" on public.shop_product_colors
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anon read published" on public.shop_product_colors;
create policy "anon read published" on public.shop_product_colors
  for select using (
    exists (
      select 1 from public.shop_products p
      where p.id = product_id and p.status = 'published'
    )
  );

-- Shop products: physical gym gear sold from the site.
-- Admin CMS only for now; the anon SELECT policies are here for the future storefront.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'shop_delivery_option') then
    create type public.shop_delivery_option as enum ('summit_pickup', 'courier');
  end if;
end $$;

create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null,
  currency public.currency_code not null default 'RON',
  status public.course_status not null default 'draft',
  delivery_options public.shop_delivery_option[] not null default '{}',
  -- Used only when the product has no variants; otherwise stock lives per variant.
  stock integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shop_products_price_non_negative check (price >= 0),
  constraint shop_products_stock_non_negative check (stock is null or stock >= 0)
);

create table if not exists public.shop_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shop_products (id) on delete cascade,
  path text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.shop_product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shop_products (id) on delete cascade,
  color text,
  weight_kg numeric(6, 2),
  -- null price means "inherit the product price"
  price numeric(10, 2),
  stock integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint shop_product_variants_price_non_negative check (price is null or price >= 0),
  constraint shop_product_variants_stock_non_negative check (stock >= 0),
  constraint shop_product_variants_unique_attrs unique (product_id, color, weight_kg)
);

create index if not exists shop_products_status_idx
  on public.shop_products (status);
create index if not exists shop_product_images_product_idx
  on public.shop_product_images (product_id, sort_order);
create index if not exists shop_product_variants_product_idx
  on public.shop_product_variants (product_id, sort_order);

drop trigger if exists trg_shop_products_updated_at on public.shop_products;
create trigger trg_shop_products_updated_at
  before update on public.shop_products
  for each row execute function public.set_updated_at();

-- RLS ------------------------------------------------------------------

alter table public.shop_products enable row level security;
alter table public.shop_product_images enable row level security;
alter table public.shop_product_variants enable row level security;

drop policy if exists "admin all" on public.shop_products;
create policy "admin all" on public.shop_products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all" on public.shop_product_images;
create policy "admin all" on public.shop_product_images
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all" on public.shop_product_variants;
create policy "admin all" on public.shop_product_variants
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anon read published" on public.shop_products;
create policy "anon read published" on public.shop_products
  for select using (status = 'published');

drop policy if exists "anon read published" on public.shop_product_images;
create policy "anon read published" on public.shop_product_images
  for select using (
    exists (
      select 1 from public.shop_products p
      where p.id = product_id and p.status = 'published'
    )
  );

drop policy if exists "anon read published" on public.shop_product_variants;
create policy "anon read published" on public.shop_product_variants
  for select using (
    exists (
      select 1 from public.shop_products p
      where p.id = product_id and p.status = 'published'
    )
  );

-- Storage --------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('shop-product-images', 'shop-product-images', true)
on conflict (id) do nothing;

drop policy if exists "shop images public read" on storage.objects;
create policy "shop images public read" on storage.objects
  for select using (bucket_id = 'shop-product-images');

drop policy if exists "shop images admin write" on storage.objects;
create policy "shop images admin write" on storage.objects
  for all using (bucket_id = 'shop-product-images' and public.is_admin())
  with check (bucket_id = 'shop-product-images' and public.is_admin());

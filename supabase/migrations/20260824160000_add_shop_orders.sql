-- Single-product shop orders. Separate from `payments`, whose course_id is NOT NULL.
-- Product/variant/price are snapshotted so editing a product never rewrites
-- what somebody bought, and the invoice keeps matching the order.

create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.shop_products (id) on delete set null,
  variant_id uuid references public.shop_product_variants (id) on delete set null,
  product_name text not null,
  variant_label text,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1,
  amount numeric(10, 2) not null,
  currency public.currency_code not null default 'RON',
  delivery_option public.shop_delivery_option not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  status public.payment_status not null default 'pending',
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  stripe_payment_method_type text,
  invoice_status public.invoice_status not null default 'pending',
  invoice_series text,
  invoice_number text,
  invoice_url text,
  invoice_error text,
  invoice_issued_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shop_orders_quantity_positive check (quantity > 0),
  constraint shop_orders_amount_non_negative check (amount >= 0)
);

create index if not exists shop_orders_status_idx on public.shop_orders (status);
create index if not exists shop_orders_created_idx on public.shop_orders (created_at desc);
create index if not exists shop_orders_product_idx on public.shop_orders (product_id);

drop trigger if exists trg_shop_orders_updated_at on public.shop_orders;
create trigger trg_shop_orders_updated_at
  before update on public.shop_orders
  for each row execute function public.set_updated_at();

alter table public.shop_orders enable row level security;

-- Admin-only. Orders are written by the service-role client, like public
-- enrollment inserts, so no anon policy is needed.
drop policy if exists "admin all" on public.shop_orders;
create policy "admin all" on public.shop_orders
  for all using (public.is_admin()) with check (public.is_admin());

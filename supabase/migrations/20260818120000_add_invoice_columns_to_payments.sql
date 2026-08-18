-- SmartBill invoicing: track invoice emission per payment.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('pending', 'issued', 'failed', 'skipped');
  end if;
end $$;

alter table public.payments
  add column if not exists invoice_status public.invoice_status not null default 'pending',
  add column if not exists invoice_series text,
  add column if not exists invoice_number text,
  add column if not exists invoice_url text,
  add column if not exists invoice_error text,
  add column if not exists invoice_issued_at timestamptz;

create index if not exists payments_invoice_status_idx
  on public.payments (invoice_status);

-- The webhook upserts on stripe_session_id for idempotency; the required UNIQUE
-- constraint (payments_stripe_session_id_key) already exists on the table.

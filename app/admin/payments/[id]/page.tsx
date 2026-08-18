import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { InvoiceRetryButton } from "@/components/admin/payments/InvoiceRetryButton";
import { InvoiceStatusBadge } from "@/components/admin/payments/InvoiceStatusBadge";
import { PaymentStatusBadge } from "@/components/admin/payments/PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/format";
import { assertAdmin } from "@/lib/supabase/guards";

import { retryInvoice } from "../_actions";

export const metadata = { title: "Detalii plată · Admin FitEducation" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: p } = await supabase
    .from("payments")
    .select(
      "*, courses!inner(id, title, slug), enrollments(id, full_name, email, phone, status)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!p) notFound();

  const stripeDashUrl = p.stripe_session_id
    ? `https://dashboard.stripe.com/${p.stripe_session_id.startsWith("cs_test_") ? "test/" : ""}payments/${p.stripe_payment_intent_id ?? ""}`
    : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href="/admin/payments" aria-label="Înapoi" />}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Detalii plată</h1>
        <PaymentStatusBadge status={p.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Sumă">
          <p className="text-2xl font-semibold tabular-nums">
            {formatPrice(Number(p.amount), p.currency as "RON" | "EUR")}
          </p>
          {p.stripe_payment_method_type ? (
            <p className="mt-1 text-xs text-muted-foreground capitalize">
              Metodă: {p.stripe_payment_method_type}
            </p>
          ) : null}
        </Card>

        <Card title="Curs">
          <Link
            href={`/curs/${p.courses?.slug}`}
            className="text-sm font-medium hover:underline"
          >
            {p.courses?.title ?? "—"}
          </Link>
        </Card>

        <Card title="Client">
          <Field label="Nume" value={p.customer_name} />
          <Field label="Email" value={p.customer_email} />
          <Field label="Telefon" value={p.customer_phone} />
        </Card>

        <Card title="Înscriere">
          {p.enrollments ? (
            <div className="space-y-2">
              <Link
                href={`/admin/enrollments/${p.enrollments.id}`}
                className="text-sm font-medium hover:underline"
              >
                {p.enrollments.full_name}
              </Link>
              <p className="text-xs text-muted-foreground">
                Status: {p.enrollments.status}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nicio înscriere asociată încă.
            </p>
          )}
        </Card>

        <Card title="Stripe">
          <Field label="Session" value={p.stripe_session_id} mono />
          <Field
            label="Payment Intent"
            value={p.stripe_payment_intent_id}
            mono
          />
          {stripeDashUrl && p.stripe_payment_intent_id ? (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              render={
                <a
                  href={stripeDashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Deschide în Stripe
              <ExternalLink />
            </Button>
          ) : null}
        </Card>

        <Card title="Factură SmartBill">
          <div className="flex items-center gap-2">
            <InvoiceStatusBadge status={p.invoice_status} />
            {p.invoice_series && p.invoice_number ? (
              <span className="text-sm font-medium tabular-nums">
                {p.invoice_series} {p.invoice_number}
              </span>
            ) : null}
          </div>

          {p.invoice_issued_at ? (
            <Field label="Emisă" value={formatDate(p.invoice_issued_at)} />
          ) : null}

          {p.invoice_error ? (
            <p className="mt-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
              {p.invoice_error}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {p.invoice_url ? (
              <Button
                variant="outline"
                size="sm"
                render={
                  <a
                    href={p.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Deschide factura
                <ExternalLink />
              </Button>
            ) : null}

            {p.status === "completed" && !p.invoice_number ? (
              <InvoiceRetryButton
                onRetry={async () => {
                  "use server";
                  await retryInvoice(id);
                }}
              />
            ) : null}
          </div>
        </Card>

        <Card title="Timeline">
          <Field label="Creat" value={formatDate(p.created_at)} />
          <Field
            label="Completat"
            value={p.completed_at ? formatDate(p.completed_at) : null}
          />
          {p.error_message ? (
            <Field label="Eroare" value={p.error_message} />
          ) : null}
        </Card>
      </div>

      {p.metadata && Object.keys(p.metadata as object).length > 0 ? (
        <Card title="Metadata">
          <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(p.metadata, null, 2)}
          </pre>
        </Card>
      ) : null}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-sm ${mono ? "font-mono text-xs" : ""} ${value ? "" : "text-muted-foreground"}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

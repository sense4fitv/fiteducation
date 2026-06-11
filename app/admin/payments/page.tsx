import Link from "next/link";
import { Eye } from "lucide-react";

import { PaymentsFilters } from "@/components/admin/payments/PaymentsFilters";
import { PaymentStatusBadge } from "@/components/admin/payments/PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

export const metadata = { title: "Plăți · Admin FitEducation" };
export const dynamic = "force-dynamic";

type SP = {
  course?: string;
  status?: string;
};

const STATUSES: Enums<"payment_status">[] = [
  "pending",
  "completed",
  "failed",
  "refunded",
  "expired",
];

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { supabase } = await assertAdmin();

  let query = supabase
    .from("payments")
    .select(
      "id, status, amount, currency, customer_email, customer_name, stripe_payment_method_type, created_at, completed_at, course_id, enrollment_id, courses!inner(id, title)",
    )
    .order("created_at", { ascending: false });

  if (sp.course) query = query.eq("course_id", sp.course);
  const statusFilter = STATUSES.find((s) => s === sp.status);
  if (statusFilter) query = query.eq("status", statusFilter);

  const [{ data }, { data: courses }] = await Promise.all([
    query,
    supabase.from("courses").select("id, title").order("title"),
  ]);

  const items = data ?? [];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Plăți</h1>
        <p className="text-sm text-muted-foreground">
          Toate tranzacțiile Stripe. Actualizate automat prin webhook —
          read-only.
        </p>
      </div>

      <PaymentsFilters courses={courses ?? []} />

      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "rezultat" : "rezultate"}
      </p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nicio plată care să corespundă filtrelor.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Curs</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead>Sumă</TableHead>
                <TableHead className="w-24">Metodă</TableHead>
                <TableHead className="w-28">Creat</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/payments/${p.id}`}
                      className="hover:underline"
                    >
                      {p.customer_name ?? p.customer_email ?? "—"}
                    </Link>
                    {p.customer_email && p.customer_name ? (
                      <p className="text-xs text-muted-foreground">
                        {p.customer_email}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.courses?.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatPrice(
                      Number(p.amount),
                      p.currency as "RON" | "EUR",
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">
                    {p.stripe_payment_method_type ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(p.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/admin/payments/${p.id}`}
                          aria-label="Detalii"
                        />
                      }
                    >
                      <Eye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

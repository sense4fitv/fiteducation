import Link from "next/link";
import { Download, Plus } from "lucide-react";

import { EnrollmentsFilters } from "@/components/admin/enrollments/EnrollmentsFilters";
import {
  EnrollmentsList,
  type EnrollmentRow,
} from "@/components/admin/enrollments/EnrollmentsList";
import { Button } from "@/components/ui/button";
import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

export const metadata = { title: "Înscrieri · Admin FitEducation" };
export const dynamic = "force-dynamic";

type SP = {
  course?: string;
  status?: string;
  method?: string;
  from?: string;
  to?: string;
};

const STATUSES: Enums<"enrollment_status">[] = [
  "nou",
  "contactat",
  "confirmat",
  "platit",
  "anulat",
];
const METHODS: Enums<"payment_method">[] = [
  "stripe",
  "transfer",
  "cash",
  "other",
];

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { supabase } = await assertAdmin();

  let query = supabase
    .from("enrollments")
    .select(
      "id, full_name, email, phone, status, payment_method, paid_amount, paid_currency, created_at, course_id, courses!inner(id, title)",
    )
    .order("created_at", { ascending: false });

  if (sp.course) query = query.eq("course_id", sp.course);
  const statusFilter = STATUSES.find((s) => s === sp.status);
  if (statusFilter) query = query.eq("status", statusFilter);
  const methodFilter = METHODS.find((m) => m === sp.method);
  if (methodFilter) query = query.eq("payment_method", methodFilter);
  if (sp.from) query = query.gte("created_at", `${sp.from}T00:00:00Z`);
  if (sp.to) query = query.lte("created_at", `${sp.to}T23:59:59Z`);

  const [{ data }, { data: courses }] = await Promise.all([
    query,
    supabase.from("courses").select("id, title").order("title"),
  ]);

  const items: EnrollmentRow[] = (data ?? []).map((e) => ({
    id: e.id,
    full_name: e.full_name,
    email: e.email,
    phone: e.phone,
    status: e.status,
    payment_method: e.payment_method,
    paid_amount: e.paid_amount,
    paid_currency: e.paid_currency,
    course_title: e.courses?.title ?? "—",
    created_at: e.created_at,
  }));

  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(sp).filter(([, v]) => typeof v === "string" && v !== ""),
    ) as Record<string, string>,
  ).toString();
  const exportHref = qs
    ? `/admin/enrollments/export?${qs}`
    : "/admin/enrollments/export";

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Înscrieri</h1>
          <p className="text-sm text-muted-foreground">
            Toate înscrierile, manuale și automate. Filtrează ca să exportezi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<a href={exportHref} />}>
            <Download />
            Export CSV
          </Button>
          <Button render={<Link href="/admin/enrollments/new" />}>
            <Plus />
            Înscriere manuală
          </Button>
        </div>
      </div>

      <EnrollmentsFilters courses={courses ?? []} />

      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "rezultat" : "rezultate"}
      </p>

      <EnrollmentsList items={items} />
    </div>
  );
}

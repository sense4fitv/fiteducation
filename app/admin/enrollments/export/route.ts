import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

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

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: Request) {
  const { supabase } = await assertAdmin();
  const url = new URL(request.url);
  const sp = Object.fromEntries(url.searchParams.entries());

  let query = supabase
    .from("enrollments")
    .select(
      "created_at, full_name, email, phone, message, status, payment_method, paid_amount, paid_currency, paid_at, invoice_number, internal_notes, created_by_admin, courses!inner(title)",
    )
    .order("created_at", { ascending: false });

  if (sp.course) query = query.eq("course_id", sp.course);
  const statusFilter = STATUSES.find((s) => s === sp.status);
  if (statusFilter) query = query.eq("status", statusFilter);
  const methodFilter = METHODS.find((m) => m === sp.method);
  if (methodFilter) query = query.eq("payment_method", methodFilter);
  if (sp.from) query = query.gte("created_at", `${sp.from}T00:00:00Z`);
  if (sp.to) query = query.lte("created_at", `${sp.to}T23:59:59Z`);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers = [
    "Data crearii",
    "Nume",
    "Email",
    "Telefon",
    "Mesaj",
    "Curs",
    "Status",
    "Metoda plata",
    "Suma platita",
    "Moneda",
    "Data platii",
    "Numar factura",
    "Notite interne",
    "Adaugata manual",
  ];

  const rows = (data ?? []).map((e) =>
    [
      e.created_at,
      e.full_name,
      e.email,
      e.phone,
      e.message,
      e.courses?.title,
      e.status,
      e.payment_method,
      e.paid_amount,
      e.paid_currency,
      e.paid_at,
      e.invoice_number,
      e.internal_notes,
      e.created_by_admin ? "da" : "nu",
    ].map(csvEscape).join(","),
  );

  const csv = [headers.map(csvEscape).join(","), ...rows].join("\n");
  const filename = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

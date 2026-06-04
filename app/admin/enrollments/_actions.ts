"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums, TablesInsert } from "@/lib/supabase/types";

export type EnrollmentActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

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

const PLANS: Enums<"payment_plan">[] = ["integral", "rate_klarna"];

function clean(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

function numberOr(
  value: FormDataEntryValue | null,
  fallback: number | null,
): number | null {
  const raw = String(value ?? "").trim();
  if (raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function enumOr<T extends string>(
  value: FormDataEntryValue | null,
  allowed: T[],
): T | null {
  const v = String(value ?? "");
  return allowed.includes(v as T) ? (v as T) : null;
}

function timestampOr(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function buildPayload(fd: FormData): {
  payload: TablesInsert<"enrollments"> | null;
  error?: string;
} {
  const course_id = String(fd.get("course_id") ?? "").trim();
  const full_name = String(fd.get("full_name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();

  if (!course_id) return { payload: null, error: "Selectează un curs." };
  if (!full_name) return { payload: null, error: "Numele este obligatoriu." };
  if (!email) return { payload: null, error: "Email-ul este obligatoriu." };
  if (!phone) return { payload: null, error: "Telefonul este obligatoriu." };

  const method = enumOr(fd.get("payment_method"), METHODS);
  const paidAt = timestampOr(fd.get("paid_at"));
  const status =
    enumOr(fd.get("status"), STATUSES) ?? (paidAt ? "platit" : "nou");

  const payload: TablesInsert<"enrollments"> = {
    course_id,
    session_id: clean(fd.get("session_id")),
    full_name,
    email,
    phone,
    message: clean(fd.get("message")),
    payment_plan: enumOr(fd.get("payment_plan"), PLANS),
    status,
    payment_method: method,
    paid_amount: numberOr(fd.get("paid_amount"), null),
    paid_currency: enumOr(fd.get("paid_currency"), [
      "RON",
      "EUR",
    ] as Enums<"currency_code">[]),
    paid_at: paidAt,
    invoice_number: clean(fd.get("invoice_number")),
    internal_notes: clean(fd.get("internal_notes")),
    gdpr_accepted_at:
      timestampOr(fd.get("gdpr_accepted_at")) ?? new Date().toISOString(),
  };

  return { payload };
}

export async function createEnrollment(
  _prev: EnrollmentActionState,
  fd: FormData,
): Promise<EnrollmentActionState> {
  const { supabase } = await assertAdmin();
  const built = buildPayload(fd);
  if (!built.payload) return { ok: false, error: built.error ?? "Date invalide." };

  const { data, error } = await supabase
    .from("enrollments")
    .insert({ ...built.payload, created_by_admin: true })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/enrollments");
  redirect(`/admin/enrollments/${data.id}`);
}

export async function updateEnrollment(
  _prev: EnrollmentActionState,
  fd: FormData,
): Promise<EnrollmentActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  if (!id) return { ok: false, error: "ID lipsă." };

  const built = buildPayload(fd);
  if (!built.payload) return { ok: false, error: built.error ?? "Date invalide." };

  const { error } = await supabase
    .from("enrollments")
    .update(built.payload)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/enrollments/${id}`);
  return { ok: true };
}

export async function deleteEnrollment(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("enrollments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/enrollments");
}

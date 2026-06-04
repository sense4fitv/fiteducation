"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Enums } from "@/lib/supabase/types";

export type EnrollSubmitState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEnrollment(
  _prev: EnrollSubmitState,
  fd: FormData,
): Promise<EnrollSubmitState> {
  const courseId = String(fd.get("course_id") ?? "");
  const sessionId = String(fd.get("session_id") ?? "");
  const fullName = String(fd.get("full_name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim() || null;
  const paymentPlanRaw = String(fd.get("payment_plan") ?? "");
  const paymentPlan =
    paymentPlanRaw === "integral" || paymentPlanRaw === "rate_klarna"
      ? (paymentPlanRaw as Enums<"payment_plan">)
      : null;
  const gdpr = fd.get("gdpr") === "on";

  if (!courseId) return { ok: false, error: "Curs invalid." };
  if (!fullName) return { ok: false, error: "Numele este obligatoriu." };
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Email invalid." };
  if (!phone) return { ok: false, error: "Telefonul este obligatoriu." };
  if (!gdpr)
    return {
      ok: false,
      error: "Trebuie să accepți politica de confidențialitate.",
    };

  // Use the service-role client because public anon role only has INSERT (no
  // SELECT), and we want to bypass RLS for this single insert without exposing
  // a broader admin-write surface.
  const admin = createAdminClient();
  const { error } = await admin.from("enrollments").insert({
    course_id: courseId,
    session_id: sessionId || null,
    full_name: fullName,
    email,
    phone,
    message,
    payment_plan: paymentPlan,
    gdpr_accepted_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/enrollments");
  return { ok: true };
}

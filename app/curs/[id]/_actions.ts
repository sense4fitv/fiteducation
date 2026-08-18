"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { klarnaSupportedFor, stripe } from "@/lib/stripe";
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

async function getSiteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function startStripeCheckout(fd: FormData): Promise<void> {
  const courseId = String(fd.get("course_id") ?? "");
  const slug = String(fd.get("slug") ?? "");
  const klarnaOnly = fd.get("klarna_only") === "1";
  if (!courseId || !slug) throw new Error("Curs invalid.");

  const admin = createAdminClient();
  const { data: course, error } = await admin
    .from("courses")
    .select(
      "id, slug, title, price_amount, full_payment_price, currency, klarna_enabled, status",
    )
    .eq("id", courseId)
    .maybeSingle();

  if (error || !course) throw new Error("Cursul nu a fost găsit.");
  if (course.status !== "published")
    throw new Error("Cursul nu este disponibil pentru achiziție.");

  // Prefer the full-payment price if defined (it's the "pay upfront" amount).
  const amount = Number(course.full_payment_price ?? course.price_amount);
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Prețul cursului nu este valid.");

  const currency = course.currency.toLowerCase();
  const klarnaAvailable =
    course.klarna_enabled && klarnaSupportedFor(currency);

  if (klarnaOnly && !klarnaAvailable) {
    throw new Error("Klarna nu este disponibilă pentru acest curs.");
  }

  const paymentMethodTypes: Array<"card" | "klarna"> = klarnaOnly
    ? ["klarna"]
    : klarnaAvailable
      ? ["card", "klarna"]
      : ["card"];

  const origin = await getSiteOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodTypes,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: course.title,
            metadata: { course_id: course.id, slug: course.slug },
          },
        },
      },
    ],
    phone_number_collection: { enabled: true },
    // Both are needed to issue a legally complete SmartBill invoice: the address
    // fills the client record, the tax ID turns the buyer into a company invoice.
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    customer_creation: "always",
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "Sunt de acord cu [Termenii și Condițiile](/termeni-si-conditii) Fiteducation.",
      },
    },
    metadata: { course_id: course.id, slug: course.slug },
    success_url: `${origin}/curs/${course.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/curs/${course.slug}?canceled=1#inscriere`,
  });

  // Pre-record the payment row so the webhook can resolve it by session id.
  await admin.from("payments").insert({
    course_id: course.id,
    stripe_session_id: session.id,
    status: "pending",
    amount,
    currency: course.currency,
    payment_plan: paymentMethodTypes.includes("klarna") ? null : "integral",
  });

  if (!session.url) throw new Error("Stripe nu a returnat un URL de plată.");
  redirect(session.url);
}

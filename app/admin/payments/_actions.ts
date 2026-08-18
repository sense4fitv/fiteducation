"use server";

import { revalidatePath } from "next/cache";

import { issueInvoiceForPayment } from "@/lib/invoicing/issue";
import { stripe } from "@/lib/stripe";
import { assertAdmin } from "@/lib/supabase/guards";

/**
 * Re-run SmartBill invoicing for a payment whose invoice failed (or was never
 * attempted). The Checkout Session is re-read from Stripe rather than
 * reconstructed from our columns, so the billing address and tax ID are always
 * the ones the buyer actually submitted.
 */
export async function retryInvoice(paymentId: string): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: payment } = await supabase
    .from("payments")
    .select(
      "id, status, invoice_number, stripe_session_id, enrollment_id, courses(title)",
    )
    .eq("id", paymentId)
    .maybeSingle();

  if (!payment) throw new Error("Plata nu a fost găsită.");
  if (payment.invoice_number)
    throw new Error(
      `Factura este deja emisă (${payment.invoice_number}). Storneaz-o din SmartBill dacă vrei să o refaci.`,
    );
  if (payment.status !== "completed")
    throw new Error("Plata nu este finalizată — nu se poate emite factura.");
  if (!payment.stripe_session_id)
    throw new Error("Plata nu are o sesiune Stripe asociată.");

  const session = await stripe.checkout.sessions.retrieve(
    payment.stripe_session_id,
  );

  const result = await issueInvoiceForPayment({
    paymentId: payment.id,
    session,
    courseTitle: payment.courses?.title ?? "Curs Fiteducation",
    enrollmentId: payment.enrollment_id,
  });

  revalidatePath(`/admin/payments/${paymentId}`);
  revalidatePath("/admin/payments");

  if (!result.ok) throw new Error(result.error);
}

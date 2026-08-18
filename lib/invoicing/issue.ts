import "server-only";

import type Stripe from "stripe";

import { createInvoice, smartbillConfig } from "@/lib/smartbill";
import { createAdminClient } from "@/lib/supabase/admin";

import { buildInvoicePayload, invoiceInputFromSession } from "./course-invoice";

export type IssueInvoiceResult =
  | { ok: true; series: string; number: string; url: string | null }
  | { ok: false; error: string };

/**
 * Issue the SmartBill invoice for a completed payment and record the outcome.
 *
 * Never throws: the caller is either a Stripe webhook (which must still answer
 * 200 — the money is already captured) or an admin retry action (which shows the
 * error in the UI). Failures land in `payments.invoice_error` with
 * `invoice_status = 'failed'`, so nothing fails silently.
 */
export async function issueInvoiceForPayment(opts: {
  paymentId: string;
  session: Stripe.Checkout.Session;
  courseTitle: string;
  enrollmentId?: string | null;
  now?: Date;
}): Promise<IssueInvoiceResult> {
  const { paymentId, session, courseTitle, enrollmentId } = opts;
  const admin = createAdminClient();

  try {
    const input = invoiceInputFromSession(
      session,
      courseTitle,
      opts.now ?? new Date(),
    );

    // Resolved here rather than at import time, so a missing env var surfaces as
    // a recorded failure instead of crashing the route.
    const config = smartbillConfig();
    const { series, number, url } = await createInvoice(
      buildInvoicePayload(input, { cif: config.cif, series: config.series }),
      config,
    );

    await admin
      .from("payments")
      .update({
        invoice_status: "issued",
        invoice_series: series,
        invoice_number: number,
        invoice_url: url,
        invoice_error: null,
        invoice_issued_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (enrollmentId) {
      await admin
        .from("enrollments")
        .update({ invoice_number: `${series} ${number}` })
        .eq("id", enrollmentId);
    }

    return { ok: true, series, number, url };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Eroare necunoscută";
    console.error("[smartbill] invoice failed", { paymentId, error });

    await admin
      .from("payments")
      .update({ invoice_status: "failed", invoice_error: error })
      .eq("id", paymentId);

    return { ok: false, error };
  }
}

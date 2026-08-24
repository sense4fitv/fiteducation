import "server-only";

import type Stripe from "stripe";

import { createInvoice, smartbillConfig } from "@/lib/smartbill";
import { createAdminClient } from "@/lib/supabase/admin";

import { buildInvoicePayload, invoiceInputFromSession } from "./course-invoice";
import type { IssueInvoiceResult } from "./issue";

/**
 * Issue the SmartBill invoice for a paid shop order and record the outcome.
 *
 * Mirrors `issueInvoiceForPayment`, writing to `shop_orders` instead of
 * `payments`. Never throws: the caller is the Stripe webhook, which must still
 * answer 200 because the money is already captured. Failures land in
 * `shop_orders.invoice_error` with `invoice_status = 'failed'`.
 */
export async function issueInvoiceForShopOrder(opts: {
  orderId: string;
  session: Stripe.Checkout.Session;
  /** Line description: product name plus the variant, e.g. "Gantere · Negru · 10 kg". */
  description: string;
  now?: Date;
}): Promise<IssueInvoiceResult> {
  const { orderId, session, description } = opts;
  const admin = createAdminClient();

  try {
    const input = invoiceInputFromSession(
      session,
      description,
      opts.now ?? new Date(),
    );

    const config = smartbillConfig();
    const { series, number, url } = await createInvoice(
      buildInvoicePayload(input, { cif: config.cif, series: config.series }),
      config,
    );

    await admin
      .from("shop_orders")
      .update({
        invoice_status: "issued",
        invoice_series: series,
        invoice_number: number,
        invoice_url: url,
        invoice_error: null,
        invoice_issued_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    return { ok: true, series, number, url };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Eroare necunoscută";
    console.error("[smartbill] shop invoice failed", { orderId, error });

    await admin
      .from("shop_orders")
      .update({ invoice_status: "failed", invoice_error: error })
      .eq("id", orderId);

    return { ok: false, error };
  }
}

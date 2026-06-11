import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Enums } from "@/lib/supabase/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature failed: ${msg}` },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const courseId = session.metadata?.course_id;
      if (!courseId) break;

      const customerEmail =
        session.customer_details?.email ?? session.customer_email ?? null;
      const customerName = session.customer_details?.name ?? null;
      const customerPhone = session.customer_details?.phone ?? null;
      const amount = (session.amount_total ?? 0) / 100;
      const currencyUpper = (session.currency ?? "ron").toUpperCase();
      const paidCurrency: Enums<"currency_code"> | null =
        currencyUpper === "RON" || currencyUpper === "EUR"
          ? currencyUpper
          : null;
      const paymentMethodType =
        session.payment_method_types?.[0] ?? null;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null);

      // Create the enrollment (paid).
      const { data: enrollment, error: enrollErr } = await admin
        .from("enrollments")
        .insert({
          course_id: courseId,
          full_name: customerName ?? customerEmail ?? "Necunoscut",
          email: customerEmail ?? "",
          phone: customerPhone ?? "",
          payment_plan:
            paymentMethodType === "klarna" ? "rate_klarna" : "integral",
          payment_method: "stripe",
          paid_amount: amount,
          paid_currency: paidCurrency,
          paid_at: new Date().toISOString(),
          gdpr_accepted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (enrollErr) {
        console.error("[stripe webhook] enrollment insert failed", enrollErr);
      }

      // Upsert the payments row by stripe_session_id (idempotent for retries).
      const { error: payErr } = await admin
        .from("payments")
        .upsert(
          {
            course_id: courseId,
            enrollment_id: enrollment?.id ?? null,
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            stripe_payment_method_type: paymentMethodType,
            status: "completed",
            amount,
            currency: currencyUpper,
            customer_email: customerEmail,
            customer_name: customerName,
            customer_phone: customerPhone,
            payment_plan:
              paymentMethodType === "klarna" ? "rate_klarna" : "integral",
            metadata: (session.metadata ?? {}) as Record<string, string>,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "stripe_session_id" },
        );

      if (payErr) {
        console.error("[stripe webhook] payment upsert failed", payErr);
      }
      break;
    }

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await admin
        .from("payments")
        .update({
          status:
            event.type === "checkout.session.expired" ? "expired" : "failed",
        })
        .eq("stripe_session_id", session.id);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const intentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : (charge.payment_intent?.id ?? null);
      if (intentId) {
        await admin
          .from("payments")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", intentId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

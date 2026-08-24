import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { issueInvoiceForPayment } from "@/lib/invoicing/issue";
import { issueInvoiceForShopOrder } from "@/lib/invoicing/shop-order";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Enums } from "@/lib/supabase/types";

export const runtime = "nodejs";

type AdminClient = ReturnType<typeof createAdminClient>;

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
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Delayed methods (Klarna and friends) can complete the session while the
      // payment is still processing. Only a paid session becomes an enrollment
      // and an invoice; the rest arrives later as async_payment_succeeded.
      if (session.payment_status !== "paid") break;

      if (session.metadata?.shop_order_id) {
        await handlePaidShopOrder(session, admin);
      } else {
        await handlePaidSession(session, admin);
      }
      break;
    }

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const status =
        event.type === "checkout.session.expired" ? "expired" : "failed";
      const table = session.metadata?.shop_order_id
        ? "shop_orders"
        : "payments";
      await admin
        .from(table)
        .update({ status })
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
        await admin
          .from("shop_orders")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", intentId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handlePaidShopOrder(
  session: Stripe.Checkout.Session,
  admin: AdminClient,
) {
  const orderId = session.metadata?.shop_order_id;
  if (!orderId) return;

  const { data: order } = await admin
    .from("shop_orders")
    .select(
      "id, status, product_id, variant_id, product_name, variant_label, invoice_number",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    console.error("[stripe webhook] shop order not found", { orderId });
    return;
  }

  // Stripe redelivers webhooks routinely. Completing twice would decrement the
  // stock again and burn a second permanent invoice number.
  if (order.status === "completed") return;

  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? null;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const { error: updateErr } = await admin
    .from("shop_orders")
    .update({
      status: "completed",
      amount: (session.amount_total ?? 0) / 100,
      customer_email: customerEmail,
      customer_name: session.customer_details?.name ?? null,
      customer_phone: session.customer_details?.phone ?? null,
      stripe_payment_intent_id: paymentIntentId,
      stripe_payment_method_type: session.payment_method_types?.[0] ?? null,
      metadata: (session.metadata ?? {}) as Record<string, string>,
      completed_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateErr) {
    console.error("[stripe webhook] shop order update failed", updateErr);
    return;
  }

  await decrementStock(order.variant_id, order.product_id, admin);

  if (order.invoice_number) return;

  const description = order.variant_label
    ? `${order.product_name} · ${order.variant_label}`
    : order.product_name;

  // Invoicing must never fail the webhook — the money is already captured, and a
  // non-200 would make Stripe replay everything, including the stock decrement.
  await issueInvoiceForShopOrder({
    orderId: order.id,
    session,
    description,
  });
}

/** Takes one unit off the variant, or off the product when it has no variants. */
async function decrementStock(
  variantId: string | null,
  productId: string | null,
  admin: AdminClient,
) {
  if (variantId) {
    const { data: variant } = await admin
      .from("shop_product_variants")
      .select("stock")
      .eq("id", variantId)
      .maybeSingle();
    if (!variant) return;
    await admin
      .from("shop_product_variants")
      .update({ stock: Math.max(0, variant.stock - 1) })
      .eq("id", variantId);
    return;
  }

  if (!productId) return;
  const { data: product } = await admin
    .from("shop_products")
    .select("stock")
    .eq("id", productId)
    .maybeSingle();
  // A null stock means the product is not being tracked; leave it alone.
  if (!product || product.stock == null) return;
  await admin
    .from("shop_products")
    .update({ stock: Math.max(0, product.stock - 1) })
    .eq("id", productId);
}

async function handlePaidSession(
  session: Stripe.Checkout.Session,
  admin: AdminClient,
) {
  const courseId = session.metadata?.course_id;
  if (!courseId) return;

  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? null;
  const customerName = session.customer_details?.name ?? null;
  const customerPhone = session.customer_details?.phone ?? null;
  const amount = (session.amount_total ?? 0) / 100;
  const currencyUpper = (session.currency ?? "ron").toUpperCase();
  const paidCurrency: Enums<"currency_code"> | null =
    currencyUpper === "RON" || currencyUpper === "EUR" ? currencyUpper : null;
  const paymentMethodType = session.payment_method_types?.[0] ?? null;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);
  const paymentPlan: Enums<"payment_plan"> =
    paymentMethodType === "klarna" ? "rate_klarna" : "integral";

  // Stripe redelivers webhooks routinely (timeouts, 5xx, manual replay). The
  // pre-recorded row is the idempotency key: without this check a retry creates
  // a second enrollment and burns another permanent invoice number.
  const { data: existing } = await admin
    .from("payments")
    .select("id, enrollment_id, invoice_number")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  let enrollmentId = existing?.enrollment_id ?? null;

  if (!enrollmentId) {
    const { data: enrollment, error: enrollErr } = await admin
      .from("enrollments")
      .insert({
        course_id: courseId,
        full_name: customerName ?? customerEmail ?? "Necunoscut",
        email: customerEmail ?? "",
        phone: customerPhone ?? "",
        payment_plan: paymentPlan,
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
    } else {
      enrollmentId = enrollment.id;
    }
  }

  const { data: payment, error: payErr } = await admin
    .from("payments")
    .upsert(
      {
        course_id: courseId,
        enrollment_id: enrollmentId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_payment_method_type: paymentMethodType,
        status: "completed",
        amount,
        currency: currencyUpper,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_plan: paymentPlan,
        metadata: (session.metadata ?? {}) as Record<string, string>,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" },
    )
    .select("id")
    .single();

  if (payErr || !payment) {
    console.error("[stripe webhook] payment upsert failed", payErr);
    return;
  }

  if (existing?.invoice_number) return;

  const { data: course } = await admin
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .maybeSingle();

  // Invoicing must never fail the webhook — the payment is already captured, and
  // a non-200 would make Stripe replay the whole thing. issueInvoiceForPayment
  // swallows its errors into payments.invoice_error for the admin to retry.
  await issueInvoiceForPayment({
    paymentId: payment.id,
    session,
    courseTitle: course?.title ?? "Curs Fiteducation",
    enrollmentId,
  });
}

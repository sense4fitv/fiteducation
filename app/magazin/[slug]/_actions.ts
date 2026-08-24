"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";
import { isDeliveryOption, variantLabel } from "@/lib/shop";
import { createAdminClient } from "@/lib/supabase/admin";

export type ShopCheckoutState = { ok: false; error: string } | null;

/** Courier is not operating yet; pickup is the only payable option. */
const AVAILABLE_DELIVERY = "summit_pickup" as const;

async function getSiteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function startShopCheckout(
  fd: FormData,
): Promise<ShopCheckoutState> {
  const productId = String(fd.get("product_id") ?? "");
  const variantId = String(fd.get("variant_id") ?? "") || null;
  const deliveryRaw = String(fd.get("delivery_option") ?? "");

  if (!productId) return { ok: false, error: "Produs invalid." };
  if (!isDeliveryOption(deliveryRaw))
    return { ok: false, error: "Metodă de livrare invalidă." };
  if (deliveryRaw !== AVAILABLE_DELIVERY)
    return {
      ok: false,
      error: "Momentan livrăm doar prin ridicare la Sense4FIT Summit.",
    };

  // Service-role: the public anon role has no SELECT on shop tables beyond the
  // published view, and price/stock must never be trusted from the form.
  const admin = createAdminClient();

  const { data: product } = await admin
    .from("shop_products")
    .select("id, slug, name, price, currency, status, stock, delivery_options")
    .eq("id", productId)
    .maybeSingle();

  if (!product) return { ok: false, error: "Produsul nu a fost găsit." };
  if (product.status !== "published")
    return { ok: false, error: "Produsul nu este disponibil." };
  if (!product.delivery_options.includes(AVAILABLE_DELIVERY))
    return {
      ok: false,
      error: "Produsul nu poate fi ridicat de la Sense4FIT Summit.",
    };

  let unitPrice = Number(product.price);
  let label: string | null = null;

  if (variantId) {
    const { data: variant } = await admin
      .from("shop_product_variants")
      .select("id, product_id, color_id, weight_kg, price, stock")
      .eq("id", variantId)
      .maybeSingle();

    if (!variant || variant.product_id !== product.id)
      return { ok: false, error: "Varianta selectată nu există." };
    if (variant.stock <= 0)
      return { ok: false, error: "Varianta selectată este epuizată." };

    let colorName: string | null = null;
    if (variant.color_id) {
      const { data: color } = await admin
        .from("shop_product_colors")
        .select("name")
        .eq("id", variant.color_id)
        .maybeSingle();
      colorName = color?.name ?? null;
    }

    unitPrice = Number(variant.price ?? product.price);
    label = variantLabel({ colorName, weight_kg: variant.weight_kg });
  } else {
    // No variant chosen: only valid when the product has none at all.
    const { count } = await admin
      .from("shop_product_variants")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id);

    if ((count ?? 0) > 0)
      return { ok: false, error: "Alege o variantă înainte de plată." };
    if (product.stock != null && product.stock <= 0)
      return { ok: false, error: "Produsul este epuizat." };
  }

  if (!Number.isFinite(unitPrice) || unitPrice <= 0)
    return { ok: false, error: "Prețul produsului nu este valid." };

  const origin = await getSiteOrigin();
  const description = label ? `${product.name} · ${label}` : product.name;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name: description,
            metadata: { product_id: product.id, slug: product.slug },
          },
        },
      },
    ],
    phone_number_collection: { enabled: true },
    // Same settings as the course checkout: SmartBill needs a complete client
    // record, and a tax ID turns the buyer into a company invoice.
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    customer_creation: "always",
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "Sunt de acord cu [Termenii și Condițiile](/termeni-si-conditii) Fiteducation.",
      },
      submit: {
        message: "Ridicare la Sense4FIT Summit.",
      },
    },
    metadata: {
      shop_product_id: product.id,
      slug: product.slug,
      variant_id: variantId ?? "",
    },
    success_url: `${origin}/magazin/${product.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/magazin/${product.slug}?canceled=1`,
  });

  // Pre-record the order so the webhook can resolve it by session id — the same
  // idempotency key the course payments flow relies on.
  const { data: order, error: orderErr } = await admin
    .from("shop_orders")
    .insert({
      product_id: product.id,
      variant_id: variantId,
      product_name: product.name,
      variant_label: label,
      unit_price: unitPrice,
      quantity: 1,
      amount: unitPrice,
      currency: product.currency,
      delivery_option: AVAILABLE_DELIVERY,
      status: "pending",
      stripe_session_id: session.id,
    })
    .select("id")
    .single();

  if (orderErr || !order)
    return { ok: false, error: "Comanda nu a putut fi înregistrată." };

  // The webhook resolves the order by session id; this makes the link explicit
  // in Stripe's own dashboard too.
  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      shop_product_id: product.id,
      shop_order_id: order.id,
      slug: product.slug,
      variant_id: variantId ?? "",
    },
  });

  if (!session.url)
    return { ok: false, error: "Stripe nu a returnat un URL de plată." };

  redirect(session.url);
}

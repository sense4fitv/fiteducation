import type { Enums } from "@/lib/supabase/types";

export type DeliveryOption = Enums<"shop_delivery_option">;

export const DELIVERY_OPTIONS: readonly DeliveryOption[] = [
  "summit_pickup",
  "courier",
] as const;

export const DELIVERY_LABEL: Record<DeliveryOption, string> = {
  summit_pickup: "Ridicare la Sense4FIT Summit",
  courier: "Curier rapid",
};

export function isDeliveryOption(value: string): value is DeliveryOption {
  return (DELIVERY_OPTIONS as readonly string[]).includes(value);
}

/**
 * Online card payment is paused. While this is false the storefront collects a
 * call-back request instead of opening Stripe; flip it back to true (and the
 * Stripe path in `app/magazin/[slug]/_actions.ts` wakes up untouched).
 */
export const SHOP_CHECKOUT_ENABLED = false;

/** Sales line, also used for the WhatsApp shortcut on the product page. */
export const SHOP_CONTACT_PHONE = "+40740988678";
const SHOP_WHATSAPP_NUMBER = "40740988678";

export function shopWhatsappUrl(message: string): string {
  return `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** The prefilled WhatsApp text: product, chosen variant and the page it came from. */
export function shopEnquiryMessage(input: {
  productName: string;
  variantLabel?: string | null;
  url?: string | null;
}): string {
  const parts = [`Bună! Sunt interesat de „${input.productName}”`];
  if (input.variantLabel) parts.push(`(${input.variantLabel})`);
  const line = `${parts.join(" ")} din magazinul Fiteducation.`;
  return input.url ? `${line}\n${input.url}` : line;
}

/** Human label for a variant: "Negru · 10 kg", "Negru", "10 kg" or "Standard". */
export function variantLabel(variant: {
  colorName: string | null;
  weight_kg: number | null;
}): string {
  const parts: string[] = [];
  const color = variant.colorName?.trim();
  if (color) parts.push(color);
  if (variant.weight_kg != null) parts.push(`${variant.weight_kg} kg`);
  return parts.length > 0 ? parts.join(" · ") : "Standard";
}

/**
 * Normalizes a colour swatch value.
 * Blank means "no colour set" (null); anything that is not #rrggbb is "invalid",
 * so callers can tell a cleared field apart from a typo.
 */
export function normalizeHex(
  value: string | null | undefined,
): string | null | "invalid" {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  return /^#[0-9a-f]{6}$/.test(lower) ? lower : "invalid";
}

/**
 * Reads a batch of weights typed as "10, 12, 15" (commas, spaces or newlines
 * all separate; decimals use a dot). Returns them sorted and deduped, plus
 * whatever could not be read so the UI can say which entries were skipped.
 */
export function parseWeights(input: string): {
  weights: number[];
  invalid: string[];
} {
  const tokens = input
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const weights: number[] = [];
  const invalid: string[] = [];

  for (const token of tokens) {
    const n = Number(token);
    if (!Number.isFinite(n) || n < 0) {
      invalid.push(token);
      continue;
    }
    if (!weights.includes(n)) weights.push(n);
  }

  weights.sort((a, b) => a - b);
  return { weights, invalid };
}

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

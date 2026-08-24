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
  color: string | null;
  weight_kg: number | null;
}): string {
  const parts: string[] = [];
  const color = variant.color?.trim();
  if (color) parts.push(color);
  if (variant.weight_kg != null) parts.push(`${variant.weight_kg} kg`);
  return parts.length > 0 ? parts.join(" · ") : "Standard";
}

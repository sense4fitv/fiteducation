import type { Enums } from "@/lib/supabase/types";

const RO = new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 });

export function formatPrice(
  amount: number | null | undefined,
  currency: Enums<"currency_code">,
): string {
  if (amount == null) return "—";
  const formatted = RO.format(amount);
  return currency === "RON" ? `${formatted} lei` : `${formatted} €`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start && !end) return "Datele vor fi anunțate";
  if (start && end && start !== end) {
    return `${formatDate(start)} – ${formatDate(end)}`;
  }
  return formatDate(start ?? end);
}

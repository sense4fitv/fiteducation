import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // Throwing only when accessed keeps build-time imports safe in environments
  // without keys (e.g. CI for the public marketing pages).
  console.warn("STRIPE_SECRET_KEY is not set — Stripe checkout will fail.");
}

export const stripe = new Stripe(key ?? "sk_test_placeholder", {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

const KLARNA_CURRENCIES = new Set([
  "eur",
  "usd",
  "gbp",
  "sek",
  "nok",
  "dkk",
  "chf",
  "pln",
  "czk",
]);

export function klarnaSupportedFor(currency: string): boolean {
  return KLARNA_CURRENCIES.has(currency.toLowerCase());
}

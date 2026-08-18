/**
 * Pure mapping from a completed Stripe Checkout Session to a SmartBill invoice
 * payload. No I/O and no runtime imports, so it can be unit-tested with
 * `node --test` and reused from both the webhook and the admin retry action.
 */
import type Stripe from "stripe";

export type SmartBillPaymentType =
  | "Card"
  | "Chitanta"
  | "Bon"
  | "CEC"
  | "Bilet ordin"
  | "Ordin plata"
  | "Mandat postal"
  | "Alta incasare";

export type SmartBillClient = {
  name: string;
  vatCode?: string;
  isTaxPayer: boolean;
  address?: string;
  city?: string;
  county?: string;
  country: string;
  email?: string;
  phone?: string;
  saveToDb: boolean;
};

export type SmartBillProduct = {
  name: string;
  isDiscount: false;
  measuringUnitName: string;
  currency: string;
  quantity: number;
  price: number;
  isTaxIncluded: true;
  isService: true;
  saveToDb: false;
};

export type SmartBillInvoice = {
  companyVatCode: string;
  client: SmartBillClient;
  issueDate: string;
  seriesName: string;
  isDraft: boolean;
  currency: string;
  precision: number;
  products: SmartBillProduct[];
  payment: {
    value: number;
    type: SmartBillPaymentType;
    isCash: false;
  };
};

export type InvoiceCustomer = {
  name: string | null;
  email: string | null;
  phone: string | null;
  vatCode: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  /** ISO 3166-1 alpha-2, as Stripe returns it. */
  countryCode: string | null;
};

export type InvoiceInput = {
  courseTitle: string;
  amount: number;
  currency: string;
  /** Stripe's payment method type, e.g. "card" or "klarna". */
  paymentMethodType: string | null;
  customer: InvoiceCustomer;
  /** YYYY-MM-DD */
  issueDate: string;
};

/**
 * SmartBill wants a country name, Stripe gives an ISO code. Only the markets we
 * realistically sell to are mapped; anything else falls through as the raw code,
 * which SmartBill accepts as free text.
 */
const COUNTRY_NAMES: Record<string, string> = {
  RO: "Romania",
  MD: "Republica Moldova",
  IT: "Italia",
  ES: "Spania",
  DE: "Germania",
  FR: "Franta",
  GB: "Marea Britanie",
  AT: "Austria",
  BE: "Belgia",
  NL: "Olanda",
  IE: "Irlanda",
  PT: "Portugalia",
  GR: "Grecia",
  HU: "Ungaria",
  BG: "Bulgaria",
  PL: "Polonia",
  DK: "Danemarca",
  SE: "Suedia",
  CY: "Cipru",
};

export function countryName(code: string | null): string {
  if (!code) return "Romania";
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/**
 * Klarna settles to us as a transfer, not a card capture, so it must not be
 * booked as "Card" — the accountant reconciles those against different statements.
 */
export function smartbillPaymentType(
  paymentMethodType: string | null,
): SmartBillPaymentType {
  return paymentMethodType === "card" ? "Card" : "Alta incasare";
}

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed || undefined;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildInvoicePayload(
  input: InvoiceInput,
  config: { cif: string; series: string },
): SmartBillInvoice {
  const amount = round2(input.amount);
  const currency = input.currency.toUpperCase();
  const vatCode = clean(input.customer.vatCode);

  const client: SmartBillClient = {
    // Fall back through email so we never send an empty name, which SmartBill rejects.
    name: clean(input.customer.name) ?? clean(input.customer.email) ?? "Client",
    isTaxPayer: Boolean(vatCode),
    country: countryName(input.customer.countryCode),
    saveToDb: true,
  };

  if (vatCode) client.vatCode = vatCode;
  const address = clean(input.customer.address);
  if (address) client.address = address;
  const city = clean(input.customer.city);
  if (city) client.city = city;
  const county = clean(input.customer.county);
  if (county) client.county = county;
  const email = clean(input.customer.email);
  if (email) client.email = email;
  const phone = clean(input.customer.phone);
  if (phone) client.phone = phone;

  return {
    companyVatCode: config.cif,
    client,
    issueDate: input.issueDate,
    seriesName: config.series,
    isDraft: false,
    currency,
    precision: 2,
    products: [
      {
        // The company is a non-VAT payer, so taxName/taxPercentage must be
        // omitted entirely — sending them fails with
        // "Cota tva a produsului ... nu a fost gasita pe server!".
        name: clean(input.courseTitle) ?? "Curs",
        isDiscount: false,
        measuringUnitName: "buc",
        currency,
        quantity: 1,
        price: amount,
        isTaxIncluded: true,
        isService: true,
        saveToDb: false,
      },
    ],
    payment: {
      value: amount,
      type: smartbillPaymentType(input.paymentMethodType),
      isCash: false,
    },
  };
}

/** YYYY-MM-DD in Romanian local time, which is what the invoice date must reflect. */
export function invoiceDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function invoiceInputFromSession(
  session: Stripe.Checkout.Session,
  courseTitle: string,
  now: Date,
): InvoiceInput {
  const details = session.customer_details;
  const address = details?.address ?? null;
  const taxId = details?.tax_ids?.[0]?.value ?? null;

  return {
    courseTitle,
    amount: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? "ron").toUpperCase(),
    paymentMethodType: session.payment_method_types?.[0] ?? null,
    issueDate: invoiceDate(now),
    customer: {
      name: details?.name ?? null,
      email: details?.email ?? session.customer_email ?? null,
      phone: details?.phone ?? null,
      vatCode: taxId,
      // line2 is optional and usually empty; joining keeps the street complete.
      address: [address?.line1, address?.line2].filter(Boolean).join(", ") || null,
      city: address?.city ?? null,
      county: address?.state ?? null,
      countryCode: address?.country ?? null,
    },
  };
}

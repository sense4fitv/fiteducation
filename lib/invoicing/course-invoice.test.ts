import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildInvoicePayload,
  countryName,
  invoiceDate,
  smartbillPaymentType,
  type InvoiceInput,
} from "./course-invoice.ts";

const CONFIG = { cif: "33415055", series: "FIT" };

function input(overrides: Partial<InvoiceInput> = {}): InvoiceInput {
  return {
    courseTitle: "Curs Instructor Fitness",
    amount: 1490,
    currency: "RON",
    paymentMethodType: "card",
    issueDate: "2026-08-18",
    customer: {
      name: "Ion Popescu",
      email: "ion@example.com",
      phone: "+40712345678",
      vatCode: null,
      address: "Str. Sperantei 5",
      city: "Sibiu",
      county: "Sibiu",
      countryCode: "RO",
    },
    ...overrides,
  };
}

test("natural person: no vatCode, isTaxPayer false", () => {
  const payload = buildInvoicePayload(input(), CONFIG);

  assert.equal(payload.client.isTaxPayer, false);
  assert.equal(payload.client.vatCode, undefined);
  assert.equal(payload.client.name, "Ion Popescu");
  assert.equal(payload.client.country, "Romania");
  assert.equal(payload.companyVatCode, "33415055");
  assert.equal(payload.seriesName, "FIT");
  assert.equal(payload.isDraft, false);
});

test("company: tax id promotes the client to VAT payer", () => {
  const payload = buildInvoicePayload(
    input({
      customer: { ...input().customer, name: "Fit SRL", vatCode: "RO12345678" },
    }),
    CONFIG,
  );

  assert.equal(payload.client.isTaxPayer, true);
  assert.equal(payload.client.vatCode, "RO12345678");
});

test("never emits tax fields — the company is a non-VAT payer", () => {
  const payload = buildInvoicePayload(input(), CONFIG);
  const product = payload.products[0] as Record<string, unknown>;

  assert.ok(!("taxName" in product), "taxName must not be sent");
  assert.ok(!("taxPercentage" in product), "taxPercentage must not be sent");
});

test("card payment is booked as collected by card", () => {
  const payload = buildInvoicePayload(input(), CONFIG);

  assert.deepEqual(payload.payment, {
    value: 1490,
    type: "Card",
    isCash: false,
  });
});

test("klarna is not booked as a card collection", () => {
  const payload = buildInvoicePayload(
    input({ paymentMethodType: "klarna" }),
    CONFIG,
  );

  assert.equal(payload.payment.type, "Alta incasare");
});

test("EUR invoices carry the currency and no exchange rate", () => {
  const payload = buildInvoicePayload(
    input({ currency: "eur", amount: 299 }),
    CONFIG,
  );

  assert.equal(payload.currency, "EUR");
  assert.equal(payload.products[0].currency, "EUR");
  assert.ok(!("exchangeRate" in payload), "SmartBill applies the BNR rate itself");
});

test("amounts are rounded to 2 decimals", () => {
  const payload = buildInvoicePayload(input({ amount: 1490.005 }), CONFIG);

  assert.equal(payload.products[0].price, 1490.01);
  assert.equal(payload.payment.value, 1490.01);
});

test("missing name falls back to email, then to a placeholder", () => {
  const noName = buildInvoicePayload(
    input({ customer: { ...input().customer, name: null } }),
    CONFIG,
  );
  assert.equal(noName.client.name, "ion@example.com");

  const nothing = buildInvoicePayload(
    input({ customer: { ...input().customer, name: null, email: null } }),
    CONFIG,
  );
  assert.equal(nothing.client.name, "Client");
});

test("blank optional fields are omitted rather than sent empty", () => {
  const payload = buildInvoicePayload(
    input({
      customer: {
        ...input().customer,
        phone: "   ",
        county: null,
        address: "",
      },
    }),
    CONFIG,
  );

  assert.ok(!("phone" in payload.client));
  assert.ok(!("county" in payload.client));
  assert.ok(!("address" in payload.client));
});

test("country codes map to SmartBill country names", () => {
  assert.equal(countryName("RO"), "Romania");
  assert.equal(countryName("it"), "Italia");
  assert.equal(countryName("JP"), "JP");
  assert.equal(countryName(null), "Romania");
});

test("payment type mapping", () => {
  assert.equal(smartbillPaymentType("card"), "Card");
  assert.equal(smartbillPaymentType("klarna"), "Alta incasare");
  assert.equal(smartbillPaymentType(null), "Alta incasare");
});

test("issue date uses Romanian local time", () => {
  // 22:30 UTC on Aug 17 is already Aug 18 in Bucharest (UTC+3 in summer).
  assert.equal(invoiceDate(new Date("2026-08-17T22:30:00Z")), "2026-08-18");
});

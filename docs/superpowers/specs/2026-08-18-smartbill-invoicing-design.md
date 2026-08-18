# SmartBill invoicing on Stripe payment — design

**Date:** 2026-08-18
**Status:** approved

## Goal

When a Stripe Checkout payment for a course completes, automatically issue a
SmartBill invoice marked as **collected by card**, and surface its series /
number / link in the admin.

## Account facts (verified live against the SmartBill account, 2026-08-18)

- `GET /SBORO/api/series?cif=33415055&type=f` → one series: **`FIT`**, `nextNumber: 40`.
- `GET /SBORO/api/tax?cif=33415055` → `"Firma este neplatitoare de tva."`

Both drive the payload below. The company being a **non-VAT payer** is the single
most important constraint: products must be sent **without** `taxName` /
`taxPercentage`. Sending them yields
`Cota tva a produsului <name> nu a fost gasita pe server!`. Per SmartBill docs,
for non-VAT payers only `price` is mandatory and tax fields are ignored.

## Architecture

Three units, each independently understandable and testable.

### 1. `lib/smartbill.ts` — transport

Server-only. No new npm dependency; native `fetch`.

- Base URL `https://ws.smartbill.ro/SBORO/api`
- Auth `Authorization: Basic base64(SMARTBILL_USERNAME:SMARTBILL_TOKEN)`
- `createInvoice(payload): Promise<SmartBillInvoiceResult>` → `POST /invoice`

**Critical quirk:** SmartBill returns HTTP 200 even on failure, with a non-empty
`errorText` field. The client throws `SmartBillError` when `errorText !== ""`,
so callers can rely on normal exception flow.

Config is read lazily inside the call, not at module load, so importing the
module in an environment without keys (CI, public marketing build) is safe.

### 2. `lib/invoicing/course-invoice.ts` — mapping

Pure functions, zero I/O, zero runtime imports — so they run under `node --test`
with native type stripping.

- `buildInvoicePayload(input: InvoiceInput): SmartBillInvoice`
- `invoiceInputFromSession(session, courseTitle): InvoiceInput` — extracts
  `customer_details` (name, email, phone, address) and `customer_details.tax_ids[0]`
  from a Stripe Checkout Session.

### 3. Webhook call site — orchestration

`app/api/stripe/webhook/route.ts`, after enrollment and payment rows are written.

## Payload

```json
{
  "companyVatCode": "33415055",
  "seriesName": "FIT",
  "isDraft": false,
  "issueDate": "2026-08-18",
  "currency": "RON",
  "precision": 2,
  "client": {
    "name": "...", "vatCode": "RO123...", "isTaxPayer": true,
    "address": "...", "city": "...", "county": "...", "country": "Romania",
    "email": "...", "phone": "...", "saveToDb": true
  },
  "products": [{
    "name": "<course title>", "quantity": 1, "price": 1490,
    "measuringUnitName": "buc", "isService": true,
    "isTaxIncluded": true, "isDiscount": false, "saveToDb": false
  }],
  "payment": { "value": 1490, "type": "Card", "isCash": false }
}
```

Decisions encoded here:

- `payment.type: "Card"`, `isCash: false` makes the invoice **collected by card**
  in one request. No second call to `/payment` is needed.
- Klarna maps to `type: "Alta incasare"` — it is not a card collection.
- EUR courses send `currency: "EUR"` with **no** `exchangeRate`; SmartBill applies
  the BNR rate for the issue date.
- `isTaxPayer` / `vatCode` are set only when the buyer supplied a tax ID at
  checkout; otherwise the client is a natural person.
- `isDraft: false` — invoices are issued for real, per explicit user decision.
  Every call, including tests, consumes a permanent number in series FIT.

## Checkout changes

`app/curs/[id]/_actions.ts`:

- `billing_address_collection: "required"`
- `tax_id_collection: { enabled: true }`
- `customer_creation: "always"` (Stripe requires a customer in `payment` mode for
  tax ID collection)

## Schema

New columns on `payments`:

| column | type | notes |
|---|---|---|
| `invoice_status` | enum `invoice_status` | `pending` \| `issued` \| `failed` \| `skipped`, default `pending` |
| `invoice_series` | text | e.g. `FIT` |
| `invoice_number` | text | e.g. `0040` |
| `invoice_url` | text | SmartBill link |
| `invoice_error` | text | last failure message |
| `invoice_issued_at` | timestamptz | |

The number also propagates to `enrollments.invoice_number`, which already exists.

## Failure isolation

Invoicing must **never** break the webhook. It runs in `try/catch`; on failure the
payment row gets `invoice_status: 'failed'` plus `invoice_error`, and the route
still returns 200 to Stripe. The money is already captured — a Stripe retry must
not reprocess the payment because SmartBill was down.

Recovery is explicit rather than silent: `/admin/payments/[id]` shows invoice
status and offers an **"Emite factura"** button running a server action over the
same mapper.

## Idempotency

Stripe retries webhooks routinely (timeouts, 5xx, manual redelivery). Before
writing, the handler loads the `payments` row by `stripe_session_id`:

- row already has `enrollment_id` → skip enrollment insert (fixes an existing
  duplicate-enrollment bug)
- row already has `invoice_number` → skip invoicing

Without this, a retry would burn another permanent number in series FIT.

## Paid-only guard (added during implementation)

`checkout.session.completed` can fire while a delayed payment method is still
processing, with `payment_status` `unpaid` or `processing`. Invoicing such a
session would issue a real fiscal document for money not yet received. The
handler therefore acts only on `payment_status === "paid"`, and
`checkout.session.async_payment_succeeded` is handled by the same code path so
delayed payments still produce an enrollment and an invoice when they settle.

## Testing

Unit tests for the mapper via `node --test` (Node 24 strips types natively — no
test framework dependency): natural person vs company with CUI, RON vs EUR,
card vs Klarna, and the assertion that tax fields are never emitted.

Live verification is a real invoice against series FIT, since `isDraft: false`
was chosen. Test invoices can be storno'd from SmartBill afterwards.

## Invoice PDF (added after the live test)

The live test showed SmartBill returns an empty `url` on invoice creation — that
field is a payment link, not the document, and it stays empty for invoices
already collected. The PDF lives behind `GET /invoice/pdf` and needs Basic auth,
so it cannot be linked directly from the browser.

`app/admin/payments/[id]/invoice/route.ts` proxies it behind the admin session
and streams it as `application/pdf`. `invoice_url` is still stored when present,
but the admin link uses the proxy.

## Environment

```
SMARTBILL_USERNAME=flaviusturcanu@gmail.com
SMARTBILL_TOKEN=<token>
SMARTBILL_CIF=33415055
SMARTBILL_SERIES=FIT
```

The token was shared over chat and should be regenerated in SmartBill Cloud once
integration is verified.

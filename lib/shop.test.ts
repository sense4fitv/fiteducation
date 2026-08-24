import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DELIVERY_LABEL,
  DELIVERY_OPTIONS,
  isDeliveryOption,
  variantLabel,
} from "./shop.ts";

test("delivery options carry their Romanian labels", () => {
  assert.deepEqual(DELIVERY_OPTIONS, ["summit_pickup", "courier"]);
  assert.equal(
    DELIVERY_LABEL.summit_pickup,
    "Ridicare la Sense4FIT Summit",
  );
  assert.equal(DELIVERY_LABEL.courier, "Curier rapid");
});

test("isDeliveryOption rejects unknown values", () => {
  assert.equal(isDeliveryOption("courier"), true);
  assert.equal(isDeliveryOption("posta"), false);
});

test("variantLabel joins colour and weight", () => {
  assert.equal(variantLabel({ color: "Negru", weight_kg: 10 }), "Negru · 10 kg");
});

test("variantLabel handles colour-only variants", () => {
  assert.equal(variantLabel({ color: "Negru", weight_kg: null }), "Negru");
});

test("variantLabel handles weight-only variants", () => {
  assert.equal(variantLabel({ color: null, weight_kg: 7.5 }), "7.5 kg");
});

test("variantLabel falls back to Standard when both are missing", () => {
  assert.equal(variantLabel({ color: "  ", weight_kg: null }), "Standard");
  assert.equal(variantLabel({ color: null, weight_kg: null }), "Standard");
});

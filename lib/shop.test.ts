import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DELIVERY_LABEL,
  DELIVERY_OPTIONS,
  isDeliveryOption,
  normalizeHex,
  parseWeights,
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

test("variantLabel joins colour name and weight", () => {
  assert.equal(
    variantLabel({ colorName: "Negru", weight_kg: 10 }),
    "Negru · 10 kg",
  );
});

test("variantLabel handles colour-only variants", () => {
  assert.equal(variantLabel({ colorName: "Negru", weight_kg: null }), "Negru");
});

test("variantLabel handles weight-only variants", () => {
  assert.equal(variantLabel({ colorName: null, weight_kg: 7.5 }), "7.5 kg");
});

test("variantLabel falls back to Standard when both are missing", () => {
  assert.equal(variantLabel({ colorName: "  ", weight_kg: null }), "Standard");
  assert.equal(variantLabel({ colorName: null, weight_kg: null }), "Standard");
});

test("normalizeHex lowercases a valid hex", () => {
  assert.equal(normalizeHex("#1A2B3C"), "#1a2b3c");
  assert.equal(normalizeHex("  #ffffff "), "#ffffff");
});

test("normalizeHex returns null for blank input", () => {
  assert.equal(normalizeHex(""), null);
  assert.equal(normalizeHex("   "), null);
  assert.equal(normalizeHex(null), null);
});

test("normalizeHex reports invalid values as invalid, not null", () => {
  assert.equal(normalizeHex("rosu"), "invalid");
  assert.equal(normalizeHex("#abc"), "invalid");
  assert.equal(normalizeHex("#12345g"), "invalid");
});

test("parseWeights splits on commas, spaces and newlines", () => {
  assert.deepEqual(parseWeights("10, 12, 15"), {
    weights: [10, 12, 15],
    invalid: [],
  });
  assert.deepEqual(parseWeights("10 12\n15"), {
    weights: [10, 12, 15],
    invalid: [],
  });
});

test("parseWeights accepts dot decimals; commas only ever separate", () => {
  assert.deepEqual(parseWeights("7.5, 12.5"), {
    weights: [7.5, 12.5],
    invalid: [],
  });
  assert.deepEqual(parseWeights("2,5"), { weights: [2, 5], invalid: [] });
});

test("parseWeights dedupes and sorts ascending", () => {
  assert.deepEqual(parseWeights("15, 10, 15, 10"), {
    weights: [10, 15],
    invalid: [],
  });
});

test("parseWeights collects entries it cannot read", () => {
  assert.deepEqual(parseWeights("10, greu, -4"), {
    weights: [10],
    invalid: ["greu", "-4"],
  });
});

test("parseWeights on empty input yields nothing", () => {
  assert.deepEqual(parseWeights("  "), { weights: [], invalid: [] });
});

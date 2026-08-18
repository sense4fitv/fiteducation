import "server-only";

import type { SmartBillInvoice } from "@/lib/invoicing/course-invoice";

const BASE_URL = "https://ws.smartbill.ro/SBORO/api";

export class SmartBillError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SmartBillError";
  }
}

export type SmartBillConfig = {
  username: string;
  token: string;
  cif: string;
  series: string;
};

/**
 * Read config lazily (not at module load) so importing this module stays safe in
 * environments without SmartBill keys — CI, or a build of the public pages.
 */
export function smartbillConfig(): SmartBillConfig {
  const username = process.env.SMARTBILL_USERNAME;
  const token = process.env.SMARTBILL_TOKEN;
  const cif = process.env.SMARTBILL_CIF;
  const series = process.env.SMARTBILL_SERIES;

  const missing = [
    !username && "SMARTBILL_USERNAME",
    !token && "SMARTBILL_TOKEN",
    !cif && "SMARTBILL_CIF",
    !series && "SMARTBILL_SERIES",
  ].filter(Boolean);

  if (missing.length) {
    throw new SmartBillError(
      `SmartBill nu este configurat — lipsesc: ${missing.join(", ")}.`,
    );
  }

  return {
    username: username!,
    token: token!,
    cif: cif!,
    series: series!,
  };
}

export function isSmartBillConfigured(): boolean {
  try {
    smartbillConfig();
    return true;
  } catch {
    return false;
  }
}

/** Shape SmartBill returns for every endpoint, success or failure. */
type SmartBillResponse = {
  errorText?: string;
  message?: string;
  number?: string;
  series?: string;
  url?: string;
};

export type SmartBillInvoiceResult = {
  series: string;
  number: string;
  url: string | null;
};

async function request<T extends SmartBillResponse>(
  path: string,
  init: { method: string; body?: unknown },
  config: SmartBillConfig,
): Promise<T> {
  const auth = Buffer.from(`${config.username}:${config.token}`).toString(
    "base64",
  );

  const res = await fetch(`${BASE_URL}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const raw = await res.text();

  let parsed: T;
  try {
    parsed = JSON.parse(raw) as T;
  } catch {
    throw new SmartBillError(
      `Răspuns invalid de la SmartBill (${res.status}): ${raw.slice(0, 300)}`,
      res.status,
    );
  }

  if (!res.ok) {
    throw new SmartBillError(
      parsed.errorText || parsed.message || `HTTP ${res.status}`,
      res.status,
    );
  }

  // SmartBill answers 200 even for business errors — the signal is errorText.
  if (parsed.errorText) {
    throw new SmartBillError(parsed.errorText, res.status);
  }

  return parsed;
}

export async function createInvoice(
  payload: SmartBillInvoice,
  config: SmartBillConfig = smartbillConfig(),
): Promise<SmartBillInvoiceResult> {
  const data = await request<SmartBillResponse>(
    "/invoice",
    { method: "POST", body: payload },
    config,
  );

  if (!data.number) {
    throw new SmartBillError(
      "SmartBill nu a returnat un număr de factură.",
      200,
    );
  }

  return {
    series: data.series || payload.seriesName,
    number: data.number,
    url: data.url || null,
  };
}

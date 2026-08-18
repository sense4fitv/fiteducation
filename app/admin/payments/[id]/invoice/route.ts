import { NextResponse } from "next/server";

import { fetchInvoicePdf } from "@/lib/smartbill";
import { assertAdmin } from "@/lib/supabase/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stream the SmartBill invoice PDF behind the admin session. SmartBill's PDF
 * endpoint needs Basic auth, so it can't be a plain link in the page.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: payment } = await supabase
    .from("payments")
    .select("invoice_series, invoice_number")
    .eq("id", id)
    .maybeSingle();

  if (!payment?.invoice_series || !payment.invoice_number) {
    return NextResponse.json({ error: "Factura nu există." }, { status: 404 });
  }

  try {
    const pdf = await fetchInvoicePdf(
      payment.invoice_series,
      payment.invoice_number,
    );

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="factura-${payment.invoice_series}${payment.invoice_number}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare necunoscută";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

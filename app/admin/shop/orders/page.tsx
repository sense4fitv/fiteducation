import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import { DELIVERY_LABEL } from "@/lib/shop";
import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

export const metadata = { title: "Comenzi magazin · Admin FitEducation" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<Enums<"payment_status">, string> = {
  pending: "În așteptare",
  completed: "Plătită",
  failed: "Eșuată",
  refunded: "Refundată",
  expired: "Expirată",
};

const INVOICE_LABEL: Record<Enums<"invoice_status">, string> = {
  pending: "În așteptare",
  issued: "Emisă",
  failed: "Eșuată",
  skipped: "Omisă",
};

export default async function ShopOrdersPage() {
  const { supabase } = await assertAdmin();

  const { data: orders } = await supabase
    .from("shop_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = orders ?? [];
  const paid = rows.filter((o) => o.status === "completed");
  const revenue = paid.reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/shop"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Magazin
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Comenzi</h1>
            <p className="text-sm text-muted-foreground">
              {paid.length} {paid.length === 1 ? "comandă plătită" : "comenzi plătite"}
              {paid.length > 0 ? ` · ${formatPrice(revenue, "RON")}` : ""}
            </p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nicio comandă încă.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Data</TableHead>
                <TableHead>Produs</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="w-40">Livrare</TableHead>
                <TableHead className="w-28 text-right">Sumă</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-32">Factură</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.product_name}</p>
                    {order.variant_label ? (
                      <p className="text-xs text-muted-foreground">
                        {order.variant_label}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{order.customer_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer_email ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {DELIVERY_LABEL[order.delivery_option]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPrice(order.amount, order.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed" ? "default" : "outline"
                      }
                    >
                      {STATUS_LABEL[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {order.invoice_number ? (
                      <span className="font-medium">
                        {order.invoice_series} {order.invoice_number}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {INVOICE_LABEL[order.invoice_status]}
                      </span>
                    )}
                    {order.invoice_error ? (
                      <p className="mt-0.5 text-destructive">
                        {order.invoice_error}
                      </p>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

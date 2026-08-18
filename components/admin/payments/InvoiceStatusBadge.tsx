import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/types";

const LABEL: Record<Enums<"invoice_status">, string> = {
  pending: "Neemisă",
  issued: "Emisă",
  failed: "Eșuată",
  skipped: "Ignorată",
};

const CLASS: Record<Enums<"invoice_status">, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  issued: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-600 border-red-500/30",
  skipped: "bg-muted text-muted-foreground border-border",
};

export function InvoiceStatusBadge({
  status,
}: {
  status: Enums<"invoice_status">;
}) {
  return (
    <Badge variant="outline" className={CLASS[status]}>
      {LABEL[status]}
    </Badge>
  );
}

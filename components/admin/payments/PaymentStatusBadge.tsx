import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/types";

const LABEL: Record<Enums<"payment_status">, string> = {
  pending: "În așteptare",
  completed: "Plătit",
  failed: "Eșuat",
  refunded: "Rambursat",
  expired: "Expirat",
};

const CLASS: Record<Enums<"payment_status">, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-600 border-red-500/30",
  refunded: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  expired: "bg-muted text-muted-foreground border-border",
};

export function PaymentStatusBadge({
  status,
}: {
  status: Enums<"payment_status">;
}) {
  return (
    <Badge variant="outline" className={CLASS[status]}>
      {LABEL[status]}
    </Badge>
  );
}

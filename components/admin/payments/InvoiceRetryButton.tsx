"use client";

import { useTransition } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function InvoiceRetryButton({
  onRetry,
  label = "Emite factura",
}: {
  onRetry: () => Promise<void>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await onRetry();
            toast.success("Factura a fost emisă");
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Emiterea facturii a eșuat",
            );
          }
        });
      }}
    >
      <FileText />
      {isPending ? "Se emite…" : label}
    </Button>
  );
}

"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function RowDeleteButton({
  onDelete,
  confirmMessage,
}: {
  onDelete: () => Promise<void>;
  confirmMessage: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          try {
            await onDelete();
            toast.success("Șters");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Eroare la ștergere");
          }
        });
      }}
      aria-label="Șterge"
    >
      <Trash2 className="text-destructive" />
    </Button>
  );
}

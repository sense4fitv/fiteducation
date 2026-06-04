"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PivotOption = {
  id: string;
  label: string;
  meta?: string;
  badge?: string;
};

export function PivotPicker({
  available,
  attached,
  onToggle,
  emptyLeft = "Toate elementele sunt deja atașate.",
  emptyRight = "Niciun element atașat.",
}: {
  available: PivotOption[];
  attached: PivotOption[];
  onToggle: (id: string, attached: boolean) => Promise<void>;
  emptyLeft?: string;
  emptyRight?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function run(id: string, attached: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await onToggle(id, attached);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Column
        title="Disponibile"
        subtitle={`${available.length} elemente`}
        items={available}
        empty={emptyLeft}
        side="left"
        pendingId={pendingId}
        isPending={isPending}
        onAction={(id) => run(id, true)}
      />
      <Column
        title="Atașate"
        subtitle={`${attached.length} elemente`}
        items={attached}
        empty={emptyRight}
        side="right"
        pendingId={pendingId}
        isPending={isPending}
        onAction={(id) => run(id, false)}
      />
    </div>
  );
}

function Column({
  title,
  subtitle,
  items,
  empty,
  side,
  pendingId,
  isPending,
  onAction,
}: {
  title: string;
  subtitle: string;
  items: PivotOption[];
  empty: string;
  side: "left" | "right";
  pendingId: string | null;
  isPending: boolean;
  onAction: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-3">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ul className="divide-y divide-border">
        {items.length === 0 ? (
          <li className="p-4 text-center text-sm text-muted-foreground">
            {empty}
          </li>
        ) : (
          items.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between gap-3 p-3"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm">{o.label}</p>
                {o.meta ? (
                  <p className="text-xs text-muted-foreground">{o.meta}</p>
                ) : null}
                {o.badge ? (
                  <Badge variant="outline" className="mt-1">
                    {o.badge}
                  </Badge>
                ) : null}
              </div>
              <Button
                type="button"
                variant={side === "left" ? "default" : "outline"}
                size="sm"
                disabled={isPending && pendingId === o.id}
                onClick={() => onAction(o.id)}
              >
                {side === "left" ? (
                  <>
                    Atașează <ChevronRight />
                  </>
                ) : (
                  <>
                    <ChevronLeft /> Detașează
                  </>
                )}
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

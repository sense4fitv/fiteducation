import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

export type SectionGridItem = {
  href: string;
  label: string;
  count: number;
  icon: LucideIcon;
  hint?: string;
};

export function SectionGrid({ items }: { items: SectionGridItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((s) => {
        const Icon = s.icon;
        return (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-card/80"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">
                  {s.count} {s.count === 1 ? "element" : "elemente"}
                  {s.hint ? ` · ${s.hint}` : ""}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}

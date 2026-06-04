import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-center">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-primary/15 text-accent-primary">
            <Icon className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
            <p className="text-sm text-zinc-400">
              Această secțiune va fi disponibilă în curând.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

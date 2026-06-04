"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { toast } from "sonner";

import {
  setCourseTrainer,
  updateCourseTrainerMeta,
} from "@/app/admin/products/_actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Enums } from "@/lib/supabase/types";

export type TrainerLite = {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
};

export type AttachedTrainer = TrainerLite & {
  role: Enums<"trainer_role">;
  is_featured: boolean;
  sort_order: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Photo({ t }: { t: TrainerLite }) {
  return (
    <Avatar className="size-9">
      {t.photo_url ? (
        <Image
          src={t.photo_url}
          alt={t.name}
          width={36}
          height={36}
          className="size-full object-cover"
          unoptimized
        />
      ) : (
        <AvatarFallback className="text-xs">{initials(t.name)}</AvatarFallback>
      )}
    </Avatar>
  );
}

export function CourseTrainersManager({
  courseId,
  available,
  attached,
}: {
  courseId: string;
  available: TrainerLite[];
  attached: AttachedTrainer[];
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function call(action: () => Promise<void>, id: string) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="text-sm font-medium">Disponibili</p>
          <p className="text-xs text-muted-foreground">
            {available.length} formatori
          </p>
        </div>
        <ul className="divide-y divide-border">
          {available.length === 0 ? (
            <li className="p-4 text-center text-sm text-muted-foreground">
              Toți formatorii sunt deja atașați.
            </li>
          ) : (
            available.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Photo t={t} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.slug}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending && pendingId === t.id}
                  onClick={() =>
                    call(() => setCourseTrainer(courseId, t.id, true), t.id)
                  }
                >
                  Atașează
                  <ChevronRight />
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="text-sm font-medium">Atașați</p>
          <p className="text-xs text-muted-foreground">
            {attached.length} formatori
          </p>
        </div>
        <ul className="divide-y divide-border">
          {attached.length === 0 ? (
            <li className="p-4 text-center text-sm text-muted-foreground">
              Niciun formator atașat.
            </li>
          ) : (
            attached.map((t) => (
              <li key={t.id} className="space-y-3 p-3">
                <div className="flex items-center gap-3">
                  <Photo t={t} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.slug}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Detașează"
                    disabled={isPending && pendingId === t.id}
                    onClick={() =>
                      call(
                        () => setCourseTrainer(courseId, t.id, false),
                        t.id,
                      )
                    }
                  >
                    <ChevronLeft />
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                  <Select
                    value={t.role}
                    onValueChange={(v) =>
                      call(
                        () =>
                          updateCourseTrainerMeta(courseId, t.id, {
                            role: v as Enums<"trainer_role">,
                          }),
                        t.id,
                      )
                    }
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="secundar">Secundar</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    defaultValue={t.sort_order}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v) && v !== t.sort_order) {
                        call(
                          () =>
                            updateCourseTrainerMeta(courseId, t.id, {
                              sort_order: v,
                            }),
                          t.id,
                        );
                      }
                    }}
                    placeholder="Ordine"
                  />
                  <Button
                    type="button"
                    variant={t.is_featured ? "default" : "outline"}
                    size="sm"
                    aria-label={
                      t.is_featured ? "Eliminat din featured" : "Marchează featured"
                    }
                    disabled={isPending && pendingId === t.id}
                    onClick={() =>
                      call(
                        () =>
                          updateCourseTrainerMeta(courseId, t.id, {
                            is_featured: !t.is_featured,
                          }),
                        t.id,
                      )
                    }
                  >
                    {t.is_featured ? <Star /> : <Star />}
                    Featured
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

// keep import shape stable for unused icon import
export const _ = X;

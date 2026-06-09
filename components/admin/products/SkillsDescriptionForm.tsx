"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { updateSkillsDescription } from "@/app/admin/products/_actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SkillsDescriptionForm({
  courseId,
  initialValue,
}: {
  courseId: string;
  initialValue: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  function submit(fd: FormData) {
    fd.set("course_id", courseId);
    startTransition(async () => {
      const result = await updateSkillsDescription(null, fd);
      if (result?.ok) toast.success("Salvat");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form
      action={submit}
      className="space-y-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="space-y-1">
        <Label htmlFor="skills-desc" className="text-sm font-medium">
          Competențe și Abilități
        </Label>
        <p className="text-xs text-muted-foreground">
          Descriere scurtă afișată deasupra secțiunilor de programă pe pagina
          publică. Lasă gol pentru a ascunde cardul.
        </p>
      </div>
      <Textarea
        id="skills-desc"
        name="skills_description"
        rows={4}
        defaultValue={initialValue ?? ""}
        placeholder="ex. La finalul cursului, vei putea evalua, programa și conduce sesiuni individuale de antrenament."
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Se salvează…" : "Salvează"}
        </Button>
      </div>
    </form>
  );
}

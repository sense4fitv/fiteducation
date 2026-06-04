"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createTrainer,
  updateTrainer,
} from "@/app/admin/trainers/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import type { Tables } from "@/lib/supabase/types";

type Trainer = Tables<"trainers">;

export function TrainerCoreForm({
  initial,
  mode,
}: {
  initial?: Trainer | null;
  mode: "create" | "edit";
}) {
  const action = mode === "create" ? createTrainer : updateTrainer;
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.ok) {
        toast.success("Salvat");
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {mode === "edit" && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trainer-name">Nume</Label>
          <Input
            id="trainer-name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              if (!slugTouched) setSlug(slugify(v));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainer-slug">Slug</Label>
          <Input
            id="trainer-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="ex. ana-georgescu"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainer-bio">Biografie</Label>
        <Textarea
          id="trainer-bio"
          name="bio"
          rows={5}
          defaultValue={initial?.bio ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainer-creds">Certificări / acreditări</Label>
        <Textarea
          id="trainer-creds"
          name="credentials"
          rows={3}
          defaultValue={initial?.credentials ?? ""}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trainer-ig">Instagram URL</Label>
          <Input
            id="trainer-ig"
            name="instagram_url"
            type="url"
            defaultValue={initial?.instagram_url ?? ""}
            placeholder="https://instagram.com/…"
          />
        </div>
        {mode === "edit" ? (
          <div className="space-y-2">
            <Label htmlFor="trainer-alt">Text alternativ imagine</Label>
            <Input
              id="trainer-alt"
              name="photo_alt"
              defaultValue={initial?.photo_alt ?? ""}
              placeholder={`ex. ${initial?.name ?? "Nume trainer"}`}
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Se salvează…"
            : mode === "create"
              ? "Creează trainer"
              : "Salvează modificări"}
        </Button>
      </div>
    </form>
  );
}

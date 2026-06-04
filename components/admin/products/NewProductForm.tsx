"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createCourse } from "@/app/admin/products/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/slug";

export function NewProductForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [type, setType] = useState<"curs_acreditat" | "workshop">("workshop");
  const [currency, setCurrency] = useState<"RON" | "EUR">("EUR");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    // overlay controlled values that aren't form fields
    fd.set("type", type);
    fd.set("currency", currency);
    startTransition(async () => {
      const result = await createCourse(null, fd);
      if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="np-title">Titlu</Label>
          <Input
            id="np-title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="np-slug">Slug</Label>
          <Input
            id="np-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="ex. curs-personal-trainer"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Tip</Label>
          <Select
            value={type}
            onValueChange={(v) => {
              const next = v as "curs_acreditat" | "workshop";
              setType(next);
              setCurrency(next === "curs_acreditat" ? "RON" : "EUR");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curs_acreditat">Curs acreditat</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Monedă</Label>
          <Select
            value={currency}
            onValueChange={(v) => setCurrency(v as "RON" | "EUR")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RON">RON</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="np-price">Preț</Label>
          <Input
            id="np-price"
            name="price_amount"
            type="number"
            step="0.01"
            min={0}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="np-hours">Durată (ore)</Label>
          <Input
            id="np-hours"
            name="duration_hours"
            type="number"
            min={1}
            required
            defaultValue={type === "curs_acreditat" ? 1080 : 16}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Se creează…" : "Creează produs"}
        </Button>
      </div>
    </form>
  );
}

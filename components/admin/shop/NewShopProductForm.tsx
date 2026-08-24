"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createShopProduct } from "@/app/admin/shop/_actions";
import { DeliveryOptionsField } from "@/components/admin/shop/DeliveryOptionsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DeliveryOption } from "@/lib/shop";
import { slugify } from "@/lib/slug";

export function NewShopProductForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryOption[]>(["courier"]);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    fd.delete("delivery_options");
    for (const option of delivery) fd.append("delivery_options", option);
    startTransition(async () => {
      const result = await createShopProduct(null, fd);
      if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ns-name">Nume</Label>
          <Input
            id="ns-name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="ex. Gantere hexagonale"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ns-slug">Slug</Label>
          <Input
            id="ns-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="ex. gantere-hexagonale"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ns-price">Preț (lei)</Label>
          <Input
            id="ns-price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            required
          />
        </div>
        <DeliveryOptionsField
          value={delivery}
          onChange={setDelivery}
          idPrefix="ns"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ns-desc">Descriere</Label>
        <Textarea id="ns-desc" name="description" rows={5} />
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Se creează…" : "Creează produs"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { upsertShopColor } from "@/app/admin/shop/_actions";
import { ColorCard, type ColorGroup } from "@/components/admin/shop/ColorCard";
import { ColorSwatchField } from "@/components/admin/shop/ColorSwatchField";
import {
  ImagePickerField,
  type PickableImage,
} from "@/components/admin/shop/ImagePickerField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Enums } from "@/lib/supabase/types";

function NewColorForm({
  productId,
  nextSortOrder,
  images,
}: {
  productId: string;
  nextSortOrder: number;
  images: PickableImage[];
}) {
  const [hex, setHex] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  function handleSubmit(fd: FormData) {
    fd.set("hex", hex ?? "");
    fd.set("image_id", imageId ?? "");
    startTransition(async () => {
      const result = await upsertShopColor(null, fd);
      if (result?.ok) {
        toast.success("Culoare adăugată");
        setHex(null);
        setImageId(null);
        setFormKey((k) => k + 1);
      } else if (result && result.ok === false) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      key={formKey}
      action={handleSubmit}
      className="space-y-4 rounded-lg border border-dashed border-border bg-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground">
        Adaugă culoare
      </h3>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="sort_order" value={nextSortOrder} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="nc-name">Nume culoare</Label>
          <Input id="nc-name" name="name" required placeholder="ex. Negru" />
        </div>
        <ColorSwatchField value={hex} onChange={setHex} idPrefix="nc" />
        <ImagePickerField
          images={images}
          value={imageId}
          onChange={setImageId}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Plus />
          {isPending ? "Se adaugă…" : "Adaugă culoare"}
        </Button>
      </div>
    </form>
  );
}

export function ShopVariantsManager({
  productId,
  productPrice,
  currency,
  groups,
  images,
}: {
  productId: string;
  productPrice: number;
  currency: Enums<"currency_code">;
  groups: ColorGroup[];
  images: PickableImage[];
}) {
  const nextSortOrder =
    groups.reduce(
      (max, g) => (g.id ? Math.max(max, g.sort_order) : max),
      -1,
    ) + 1;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {groups.map((group) => (
          <ColorCard
            key={group.id ?? "__none__"}
            group={group}
            productId={productId}
            productPrice={productPrice}
            currency={currency}
            images={images}
          />
        ))}
      </div>

      <NewColorForm
        productId={productId}
        nextSortOrder={nextSortOrder}
        images={images}
      />
    </div>
  );
}

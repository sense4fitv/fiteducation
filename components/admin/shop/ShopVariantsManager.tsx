"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  deleteShopVariant,
  upsertShopVariant,
} from "@/app/admin/shop/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { variantLabel } from "@/lib/shop";
import type { Enums, Tables } from "@/lib/supabase/types";

type Variant = Tables<"shop_product_variants">;

const VARIANT_GRID = "grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto]";

function VariantRow({
  variant,
  productPrice,
  currency,
}: {
  variant: Variant;
  productPrice: number;
  currency: Enums<"currency_code">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      const result = await upsertShopVariant(null, fd);
      if (result?.ok) toast.success("Variantă salvată");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="border-t border-border first:border-t-0">
          <input type="hidden" name="product_id" value={variant.product_id} />
          <input type="hidden" name="variant_id" value={variant.id} />
          <div className={`${VARIANT_GRID} items-center gap-2 px-4 py-2`}>
            <Input
              name="color"
              defaultValue={variant.color ?? ""}
              placeholder="Culoare"
              aria-label="Culoare"
            />
            <Input
              name="weight_kg"
              type="number"
              step="0.01"
              min={0}
              defaultValue={variant.weight_kg ?? ""}
              placeholder="Greutate (kg)"
              aria-label="Greutate"
            />
            <Input
              name="price"
              type="number"
              step="0.01"
              min={0}
              defaultValue={variant.price ?? ""}
              placeholder={formatPrice(productPrice, currency)}
              aria-label="Preț"
            />
            <Input
              name="stock"
              type="number"
              min={0}
              defaultValue={variant.stock}
              placeholder="Stoc"
              aria-label="Stoc"
            />
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending ? "…" : "Salvează"}
            </Button>
            <RowDeleteButton
              onDelete={() => deleteShopVariant(variant.id)}
              confirmMessage={`Ștergi varianta „${variantLabel(variant)}"?`}
            />
          </div>
    </form>
  );
}

function NewVariantForm({
  productId,
  nextSortOrder,
}: {
  productId: string;
  nextSortOrder: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      const result = await upsertShopVariant(null, fd);
      if (result?.ok) {
        toast.success("Variantă adăugată");
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
      className="space-y-4 rounded-lg border border-border bg-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground">
        Adaugă variantă
      </h3>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="sort_order" value={nextSortOrder} />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="nv-color">Culoare</Label>
          <Input id="nv-color" name="color" placeholder="ex. Negru" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nv-weight">Greutate (kg)</Label>
          <Input
            id="nv-weight"
            name="weight_kg"
            type="number"
            step="0.01"
            min={0}
            placeholder="ex. 10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nv-price">Preț (opțional)</Label>
          <Input
            id="nv-price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            placeholder="Preia prețul produsului"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nv-stock">Stoc</Label>
          <Input
            id="nv-stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Plus />
          {isPending ? "Se adaugă…" : "Adaugă variantă"}
        </Button>
      </div>
    </form>
  );
}

export function ShopVariantsManager({
  productId,
  productPrice,
  currency,
  variants,
}: {
  productId: string;
  productPrice: number;
  currency: Enums<"currency_code">;
  variants: Variant[];
}) {
  const nextSortOrder =
    variants.reduce((max, v) => Math.max(max, v.sort_order), -1) + 1;

  return (
    <div className="space-y-6">
      {variants.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nicio variantă. Fără variante, stocul se ține pe produs.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <div
            className={`${VARIANT_GRID} gap-2 border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground`}
          >
            <span>Culoare</span>
            <span>Greutate (kg)</span>
            <span>Preț</span>
            <span>Stoc</span>
            <span />
            <span />
          </div>
          {variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              productPrice={productPrice}
              currency={currency}
            />
          ))}
        </div>
      )}

      <NewVariantForm productId={productId} nextSortOrder={nextSortOrder} />
    </div>
  );
}

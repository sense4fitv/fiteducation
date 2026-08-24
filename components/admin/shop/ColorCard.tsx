"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  addShopWeights,
  deleteShopColor,
  deleteShopVariant,
  updateShopVariant,
  upsertShopColor,
} from "@/app/admin/shop/_actions";
import { RowDeleteButton } from "@/components/admin/RowDeleteButton";
import { ColorSwatchField } from "@/components/admin/shop/ColorSwatchField";
import {
  ImagePickerField,
  type PickableImage,
} from "@/components/admin/shop/ImagePickerField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { variantLabel } from "@/lib/shop";
import type { Enums, Tables } from "@/lib/supabase/types";

type Variant = Tables<"shop_product_variants">;

export type ColorGroup = {
  id: string | null;
  name: string | null;
  hex: string | null;
  image_id: string | null;
  image_url: string | null;
  sort_order: number;
  variants: Variant[];
};

const WEIGHT_GRID = "grid grid-cols-[1fr_1fr_1fr_auto_auto]";

function WeightRow({
  variant,
  colorName,
  productPrice,
  currency,
}: {
  variant: Variant;
  colorName: string | null;
  productPrice: number;
  currency: Enums<"currency_code">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      const result = await updateShopVariant(null, fd);
      if (result?.ok) toast.success("Salvat");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="border-t border-border">
      <input type="hidden" name="product_id" value={variant.product_id} />
      <input type="hidden" name="variant_id" value={variant.id} />
      <div className={`${WEIGHT_GRID} items-center gap-2 px-3 py-2`}>
        <Input
          name="weight_kg"
          type="number"
          step="0.01"
          min={0}
          defaultValue={variant.weight_kg ?? ""}
          placeholder="Greutate"
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
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          {isPending ? "…" : "Salvează"}
        </Button>
        <RowDeleteButton
          onDelete={() => deleteShopVariant(variant.id)}
          confirmMessage={`Ștergi varianta „${variantLabel({
            colorName,
            weight_kg: variant.weight_kg,
          })}"?`}
        />
      </div>
    </form>
  );
}

function AddWeightsForm({
  productId,
  colorId,
  productPrice,
  currency,
}: {
  productId: string;
  colorId: string | null;
  productPrice: number;
  currency: Enums<"currency_code">;
}) {
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      const result = await addShopWeights(null, fd);
      if (result?.ok) {
        toast.success("Greutăți adăugate");
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
      className="space-y-3 border-t border-border bg-muted/20 px-3 py-3"
    >
      <input type="hidden" name="product_id" value={productId} />
      {colorId ? (
        <input type="hidden" name="color_id" value={colorId} />
      ) : null}
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <div className="space-y-1.5">
          <Label htmlFor={`aw-${colorId ?? "none"}`} className="text-xs">
            Greutăți (kg)
          </Label>
          <Input
            id={`aw-${colorId ?? "none"}`}
            name="weights"
            placeholder="ex. 10, 12, 15"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor={`aw-price-${colorId ?? "none"}`}
            className="text-xs"
          >
            Preț
          </Label>
          <Input
            id={`aw-price-${colorId ?? "none"}`}
            name="price"
            type="number"
            step="0.01"
            min={0}
            placeholder={formatPrice(productPrice, currency)}
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor={`aw-stock-${colorId ?? "none"}`}
            className="text-xs"
          >
            Stoc
          </Label>
          <Input
            id={`aw-stock-${colorId ?? "none"}`}
            name="stock"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          <Plus />
          {isPending ? "Se adaugă…" : "Adaugă"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Scrie mai multe greutăți deodată, separate prin virgulă. Prețul și
        stocul se aplică tuturor și pot fi ajustate după.
      </p>
    </form>
  );
}

export function ColorCard({
  group,
  productId,
  productPrice,
  currency,
  images,
}: {
  group: ColorGroup;
  productId: string;
  productPrice: number;
  currency: Enums<"currency_code">;
  images: PickableImage[];
}) {
  const [hex, setHex] = useState<string | null>(group.hex);
  const [imageId, setImageId] = useState<string | null>(group.image_id);
  const [isPending, startTransition] = useTransition();

  const isUnassigned = group.id === null;

  function handleSubmit(fd: FormData) {
    fd.set("hex", hex ?? "");
    fd.set("image_id", imageId ?? "");
    startTransition(async () => {
      const result = await upsertShopColor(null, fd);
      if (result?.ok) toast.success("Culoare salvată");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {isUnassigned ? (
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Fără culoare</p>
            <p className="text-xs text-muted-foreground">
              Variante care diferă doar prin greutate.
            </p>
          </div>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-4 px-4 py-4">
          <input type="hidden" name="product_id" value={productId} />
          <input type="hidden" name="color_id" value={group.id ?? ""} />
          <input type="hidden" name="sort_order" value={group.sort_order} />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-6 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: hex ?? "transparent" }}
              />
              {group.image_url ? (
                <div className="relative size-10 overflow-hidden rounded-md border border-border">
                  <Image
                    src={group.image_url}
                    alt=""
                    fill
                    unoptimized
                    sizes="40px"
                    className="object-contain p-1"
                  />
                </div>
              ) : null}
              <div>
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.variants.length}{" "}
                  {group.variants.length === 1 ? "greutate" : "greutăți"}
                </p>
              </div>
            </div>
            <RowDeleteButton
              onDelete={() => deleteShopColor(group.id!)}
              confirmMessage={`Ștergi culoarea „${group.name}"? Toate greutățile ei vor fi șterse.`}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={`color-name-${group.id}`}>Nume culoare</Label>
              <Input
                id={`color-name-${group.id}`}
                name="name"
                required
                defaultValue={group.name ?? ""}
              />
            </div>
            <ColorSwatchField
              value={hex}
              onChange={setHex}
              idPrefix={`color-${group.id}`}
            />
            <ImagePickerField
              images={images}
              value={imageId}
              onChange={setImageId}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "Se salvează…" : "Salvează culoarea"}
            </Button>
          </div>
        </form>
      )}

      {group.variants.length > 0 ? (
        <div>
          <div
            className={`${WEIGHT_GRID} gap-2 border-t border-border px-3 py-2 text-xs font-medium text-muted-foreground`}
          >
            <span>Greutate (kg)</span>
            <span>Preț</span>
            <span>Stoc</span>
            <span />
            <span />
          </div>
          {group.variants.map((variant) => (
            <WeightRow
              key={variant.id}
              variant={variant}
              colorName={group.name}
              productPrice={productPrice}
              currency={currency}
            />
          ))}
        </div>
      ) : null}

      <AddWeightsForm
        productId={productId}
        colorId={group.id}
        productPrice={productPrice}
        currency={currency}
      />
    </div>
  );
}

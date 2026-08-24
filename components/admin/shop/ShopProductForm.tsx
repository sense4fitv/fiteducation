"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateShopProduct } from "@/app/admin/shop/_actions";
import { DeliveryOptionsField } from "@/components/admin/shop/DeliveryOptionsField";
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
import { Textarea } from "@/components/ui/textarea";
import type { DeliveryOption } from "@/lib/shop";
import { slugify } from "@/lib/slug";
import type { Enums, Tables } from "@/lib/supabase/types";

type ShopProduct = Tables<"shop_products">;

export function ShopProductForm({
  product,
  variantsCount,
}: {
  product: ShopProduct;
  variantsCount: number;
}) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [slugTouched, setSlugTouched] = useState(true);
  const [status, setStatus] = useState<Enums<"course_status">>(product.status);
  const [currency, setCurrency] = useState<Enums<"currency_code">>(
    product.currency,
  );
  const [delivery, setDelivery] = useState<DeliveryOption[]>(
    product.delivery_options,
  );
  const [isPending, startTransition] = useTransition();

  const hasVariants = variantsCount > 0;

  function handleSubmit(fd: FormData) {
    fd.set("status", status);
    fd.set("currency", currency);
    fd.delete("delivery_options");
    for (const option of delivery) fd.append("delivery_options", option);
    if (hasVariants) fd.delete("stock");
    startTransition(async () => {
      const result = await updateShopProduct(null, fd);
      if (result?.ok) toast.success("Salvat");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={product.id} />

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Identitate
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sp-name">Nume</Label>
            <Input
              id="sp-name"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sp-slug">Slug</Label>
            <Input
              id="sp-slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sp-desc">Descriere</Label>
            <Textarea
              id="sp-desc"
              name="description"
              rows={7}
              defaultValue={product.description ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Preț & stoc
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sp-price">Preț</Label>
            <Input
              id="sp-price"
              name="price"
              type="number"
              step="0.01"
              min={0}
              required
              defaultValue={product.price}
            />
          </div>
          <div className="space-y-2">
            <Label>Monedă</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as Enums<"currency_code">)}
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
            <Label htmlFor="sp-stock">Stoc</Label>
            <Input
              id="sp-stock"
              name="stock"
              type="number"
              min={0}
              disabled={hasVariants}
              defaultValue={product.stock ?? ""}
              placeholder={hasVariants ? "—" : "Opțional"}
            />
            <p className="text-xs text-muted-foreground">
              {hasVariants
                ? `Stocul este gestionat pe cele ${variantsCount} variante.`
                : "Lasă gol dacă nu urmărești stocul."}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Livrare & vizibilitate
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <DeliveryOptionsField
            value={delivery}
            onChange={setDelivery}
            idPrefix="sp"
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as Enums<"course_status">)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publicat</SelectItem>
                  <SelectItem value="archived">Arhivat</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Publicarea cere cel puțin o metodă de livrare.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-order">Ordine în magazin</Label>
              <Input
                id="sp-order"
                name="sort_order"
                type="number"
                defaultValue={product.sort_order}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Se salvează…" : "Salvează modificări"}
        </Button>
      </div>
    </form>
  );
}

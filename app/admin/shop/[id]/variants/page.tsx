import { notFound } from "next/navigation";

import type { ColorGroup } from "@/components/admin/shop/ColorCard";
import type { PickableImage } from "@/components/admin/shop/ImagePickerField";
import { ShopSubrouteHeader } from "@/components/admin/shop/ShopSubrouteHeader";
import { ShopVariantsManager } from "@/components/admin/shop/ShopVariantsManager";
import { assertAdmin } from "@/lib/supabase/guards";
import { SHOP_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function ShopProductVariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: product } = await supabase
    .from("shop_products")
    .select("id, name, price, currency")
    .eq("id", id)
    .maybeSingle();
  if (!product) notFound();

  const [{ data: colors }, { data: variants }, { data: imageRows }] =
    await Promise.all([
      supabase
        .from("shop_product_colors")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_variants")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_images")
        .select("id, path, sort_order")
        .eq("product_id", id)
        .order("sort_order", { ascending: true }),
    ]);

  const images: PickableImage[] = (imageRows ?? []).map((row) => ({
    id: row.id,
    url: publicUrl(SHOP_BUCKET, row.path),
  }));
  const imageUrlById = new Map(images.map((image) => [image.id, image.url]));

  const groups: ColorGroup[] = (colors ?? []).map((color) => ({
    id: color.id,
    name: color.name,
    hex: color.hex,
    image_id: color.image_id,
    image_url: color.image_id
      ? (imageUrlById.get(color.image_id) ?? null)
      : null,
    sort_order: color.sort_order,
    variants: (variants ?? []).filter((v) => v.color_id === color.id),
  }));

  const unassigned = (variants ?? []).filter((v) => v.color_id === null);

  // The colour-less group is shown when it holds variants, and also when there
  // are no colours at all — otherwise a weight-only product has nowhere to start.
  if (unassigned.length > 0 || groups.length === 0) {
    groups.push({
      id: null,
      name: null,
      hex: null,
      image_id: null,
      image_url: null,
      sort_order: 0,
      variants: unassigned,
    });
  }

  return (
    <div className="space-y-6 p-6">
      <ShopSubrouteHeader
        productId={id}
        productName={product.name}
        title="Variante"
        description="Adaugă întâi culoarea, cu swatch și fotografie, apoi greutățile ei — mai multe deodată, ex. 10, 12, 15. Prețul gol preia prețul produsului."
      />

      <ShopVariantsManager
        productId={id}
        productPrice={product.price}
        currency={product.currency}
        groups={groups}
        images={images}
      />
    </div>
  );
}

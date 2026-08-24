import { notFound } from "next/navigation";

import {
  ShopGalleryManager,
  type GalleryImage,
} from "@/components/admin/shop/ShopGalleryManager";
import { ShopSubrouteHeader } from "@/components/admin/shop/ShopSubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";
import { SHOP_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function ShopProductImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: product } = await supabase
    .from("shop_products")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();
  if (!product) notFound();

  const { data: rows } = await supabase
    .from("shop_product_images")
    .select("id, path, alt, sort_order")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  const images: GalleryImage[] = (rows ?? []).map((row) => ({
    id: row.id,
    url: publicUrl(SHOP_BUCKET, row.path),
    alt: row.alt,
  }));

  return (
    <div className="space-y-6 p-6">
      <ShopSubrouteHeader
        productId={id}
        productName={product.name}
        title="Fotografii"
        description="Prima fotografie este coperta folosită în listing. Folosește săgețile pentru a schimba ordinea."
      />

      <ShopGalleryManager productId={id} images={images} />
    </div>
  );
}

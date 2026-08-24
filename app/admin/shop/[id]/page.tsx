import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, Layers } from "lucide-react";

import {
  SectionGrid,
  type SectionGridItem,
} from "@/components/admin/products/SectionGrid";
import { ShopProductForm } from "@/components/admin/shop/ShopProductForm";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: product } = await supabase
    .from("shop_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!product) notFound();

  const [images, variants] = await Promise.all([
    supabase
      .from("shop_product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", id),
    supabase
      .from("shop_product_variants")
      .select("id", { count: "exact", head: true })
      .eq("product_id", id),
  ]);

  const variantsCount = variants.count ?? 0;

  const items: SectionGridItem[] = [
    {
      href: `/admin/shop/${id}/images`,
      label: "Fotografii",
      count: images.count ?? 0,
      icon: ImageIcon,
      hint: "prima este coperta",
    },
    {
      href: `/admin/shop/${id}/variants`,
      label: "Variante",
      count: variantsCount,
      icon: Layers,
      hint: "culoare & greutate",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/shop"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Magazin
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <p className="text-xs text-muted-foreground">{product.slug}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ShopProductForm product={product} variantsCount={variantsCount} />
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Conținut asociat
          </p>
          <SectionGrid items={items} />
        </div>
      </div>
    </div>
  );
}

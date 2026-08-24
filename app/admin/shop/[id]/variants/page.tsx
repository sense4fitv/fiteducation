import { notFound } from "next/navigation";

import { ShopSubrouteHeader } from "@/components/admin/shop/ShopSubrouteHeader";
import { ShopVariantsManager } from "@/components/admin/shop/ShopVariantsManager";
import { assertAdmin } from "@/lib/supabase/guards";

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

  const { data: variants } = await supabase
    .from("shop_product_variants")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6 p-6">
      <ShopSubrouteHeader
        productId={id}
        productName={product.name}
        title="Variante"
        description="Culoare și greutate. Lasă prețul gol pentru a folosi prețul produsului. Când există variante, stocul se ține aici."
      />

      <ShopVariantsManager
        productId={id}
        productPrice={product.price}
        currency={product.currency}
        variants={variants ?? []}
      />
    </div>
  );
}

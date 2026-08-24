import Link from "next/link";
import { Plus } from "lucide-react";

import {
  ShopProductsList,
  type ShopRow,
} from "@/components/admin/shop/ShopProductsList";
import { ShopFilters } from "@/components/admin/shop/ShopFilters";
import { Button } from "@/components/ui/button";
import { assertAdmin } from "@/lib/supabase/guards";
import { SHOP_BUCKET, publicUrl } from "@/lib/supabase/storage";
import type { Enums } from "@/lib/supabase/types";

export const metadata = { title: "Magazin · Admin FitEducation" };
export const dynamic = "force-dynamic";

const STATUSES: Enums<"course_status">[] = ["draft", "published", "archived"];

export default async function AdminShopPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const { supabase } = await assertAdmin();

  let query = supabase
    .from("shop_products")
    .select(
      "id, name, slug, price, currency, status, delivery_options, stock, sort_order, updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  const statusFilter = STATUSES.find((s) => s === sp.status);
  if (statusFilter) query = query.eq("status", statusFilter);

  const [{ data: products }, { data: variants }, { data: images }, { data: colors }] =
    await Promise.all([
      query,
      supabase.from("shop_product_variants").select("product_id"),
      supabase
        .from("shop_product_images")
        .select("product_id, path, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_colors")
        .select("product_id, name, hex, sort_order")
        .order("sort_order", { ascending: true }),
    ]);

  const variantCounts = new Map<string, number>();
  for (const v of variants ?? []) {
    variantCounts.set(v.product_id, (variantCounts.get(v.product_id) ?? 0) + 1);
  }

  const covers = new Map<string, string>();
  for (const img of images ?? []) {
    if (!covers.has(img.product_id)) covers.set(img.product_id, img.path);
  }

  const swatches = new Map<string, { name: string; hex: string | null }[]>();
  for (const color of colors ?? []) {
    const list = swatches.get(color.product_id) ?? [];
    list.push({ name: color.name, hex: color.hex });
    swatches.set(color.product_id, list);
  }

  const items: ShopRow[] = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    currency: p.currency,
    status: p.status,
    delivery_options: p.delivery_options,
    stock: p.stock,
    variants_count: variantCounts.get(p.id) ?? 0,
    colors: swatches.get(p.id) ?? [],
    cover_url: publicUrl(SHOP_BUCKET, covers.get(p.id) ?? null),
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Magazin</h1>
          <p className="text-sm text-muted-foreground">
            Produsele fizice vândute prin site. Prețurile sunt în lei.
          </p>
        </div>
        <Button render={<Link href="/admin/shop/new" />}>
          <Plus />
          Produs nou
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ShopFilters />
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "rezultat" : "rezultate"}
        </p>
      </div>

      <ShopProductsList items={items} />
    </div>
  );
}

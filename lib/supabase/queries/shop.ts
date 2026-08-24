import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SHOP_BUCKET, publicUrl } from "@/lib/supabase/storage";
import type { DeliveryOption } from "@/lib/shop";
import type { Enums } from "@/lib/supabase/types";

export type ShopImage = {
  id: string;
  url: string | null;
  alt: string | null;
};

export type ShopVariant = {
  id: string;
  weight_kg: number | null;
  /** null means "inherits the product price" — callers use `price` below. */
  price_override: number | null;
  price: number;
  stock: number;
};

export type ShopColor = {
  id: string;
  name: string;
  hex: string | null;
  image_id: string | null;
  image_url: string | null;
  variants: ShopVariant[];
};

export type ShopProductSummary = {
  id: string;
  slug: string;
  name: string;
  price: number;
  price_min: number;
  price_max: number;
  currency: Enums<"currency_code">;
  delivery_options: DeliveryOption[];
  cover: ShopImage | null;
  colors: Array<{ name: string; hex: string | null }>;
  in_stock: boolean;
};

export type ShopProductDetail = ShopProductSummary & {
  description: string | null;
  /** Product-level stock, meaningful only when there are no variants. */
  stock: number | null;
  images: ShopImage[];
  colors_detail: ShopColor[];
  /** Weight-only variants, i.e. those with no colour. */
  loose_variants: ShopVariant[];
};

function toImage(row: {
  id: string;
  path: string;
  alt: string | null;
}): ShopImage {
  return { id: row.id, url: publicUrl(SHOP_BUCKET, row.path), alt: row.alt };
}

function toVariant(
  row: { id: string; weight_kg: number | null; price: number | null; stock: number },
  productPrice: number,
): ShopVariant {
  return {
    id: row.id,
    weight_kg: row.weight_kg,
    price_override: row.price,
    price: row.price ?? productPrice,
    stock: row.stock,
  };
}

/** Cheapest and dearest buyable price, so a listing can say "de la X lei". */
export function priceRange(
  productPrice: number,
  variants: ShopVariant[],
): { min: number; max: number } {
  if (variants.length === 0) return { min: productPrice, max: productPrice };
  const prices = variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export async function listShopProducts(): Promise<ShopProductSummary[]> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("shop_products")
    .select(
      "id, slug, name, price, currency, delivery_options, stock, sort_order",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (!products || products.length === 0) return [];

  const ids = products.map((p) => p.id);

  const [{ data: images }, { data: colors }, { data: variants }] =
    await Promise.all([
      supabase
        .from("shop_product_images")
        .select("id, product_id, path, alt, sort_order")
        .in("product_id", ids)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_colors")
        .select("id, product_id, name, hex, sort_order")
        .in("product_id", ids)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_variants")
        .select("id, product_id, weight_kg, price, stock")
        .in("product_id", ids),
    ]);

  const coverByProduct = new Map<string, ShopImage>();
  for (const image of images ?? []) {
    if (!coverByProduct.has(image.product_id)) {
      coverByProduct.set(image.product_id, toImage(image));
    }
  }

  const colorsByProduct = new Map<
    string,
    Array<{ name: string; hex: string | null }>
  >();
  for (const color of colors ?? []) {
    const list = colorsByProduct.get(color.product_id) ?? [];
    list.push({ name: color.name, hex: color.hex });
    colorsByProduct.set(color.product_id, list);
  }

  return products.map((product) => {
    const productVariants = (variants ?? [])
      .filter((v) => v.product_id === product.id)
      .map((v) => toVariant(v, product.price));

    const { min, max } = priceRange(product.price, productVariants);

    const inStock =
      productVariants.length > 0
        ? productVariants.some((v) => v.stock > 0)
        : product.stock == null || product.stock > 0;

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      price_min: min,
      price_max: max,
      currency: product.currency,
      delivery_options: product.delivery_options,
      cover: coverByProduct.get(product.id) ?? null,
      colors: colorsByProduct.get(product.id) ?? [],
      in_stock: inStock,
    };
  });
}

export async function getShopProductBySlug(
  slug: string,
): Promise<ShopProductDetail | null> {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("shop_products")
    .select(
      "id, slug, name, description, price, currency, delivery_options, stock",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!product) return null;

  const [{ data: imageRows }, { data: colorRows }, { data: variantRows }] =
    await Promise.all([
      supabase
        .from("shop_product_images")
        .select("id, path, alt, sort_order")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_colors")
        .select("id, name, hex, image_id, sort_order")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("shop_product_variants")
        .select("id, color_id, weight_kg, price, stock")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
    ]);

  const images = (imageRows ?? []).map(toImage);
  const imageById = new Map(images.map((image) => [image.id, image]));
  const allVariants = (variantRows ?? []).map((v) => ({
    color_id: v.color_id,
    variant: toVariant(v, product.price),
  }));

  const colorsDetail: ShopColor[] = (colorRows ?? []).map((color) => ({
    id: color.id,
    name: color.name,
    hex: color.hex,
    image_id: color.image_id,
    image_url: color.image_id
      ? (imageById.get(color.image_id)?.url ?? null)
      : null,
    variants: allVariants
      .filter((v) => v.color_id === color.id)
      .map((v) => v.variant),
  }));

  const looseVariants = allVariants
    .filter((v) => v.color_id === null)
    .map((v) => v.variant);

  const buyable = [
    ...colorsDetail.flatMap((c) => c.variants),
    ...looseVariants,
  ];
  const { min, max } = priceRange(product.price, buyable);

  const inStock =
    buyable.length > 0
      ? buyable.some((v) => v.stock > 0)
      : product.stock == null || product.stock > 0;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    price_min: min,
    price_max: max,
    currency: product.currency,
    delivery_options: product.delivery_options,
    stock: product.stock,
    cover: images[0] ?? null,
    images,
    colors: colorsDetail.map((c) => ({ name: c.name, hex: c.hex })),
    colors_detail: colorsDetail,
    loose_variants: looseVariants,
    in_stock: inStock,
  };
}

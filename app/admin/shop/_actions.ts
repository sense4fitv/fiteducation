"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  isDeliveryOption,
  normalizeHex,
  parseWeights,
  type DeliveryOption,
} from "@/lib/shop";
import { slugify } from "@/lib/slug";
import { assertAdmin } from "@/lib/supabase/guards";
import {
  SHOP_BUCKET,
  deleteStorageObject,
  uploadShopProductImage,
} from "@/lib/supabase/storage";
import type { Enums } from "@/lib/supabase/types";

export type ShopActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function cleanString(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

function numberOr(
  value: FormDataEntryValue | null,
  fallback: number | null,
): number | null {
  const raw = String(value ?? "").trim();
  if (raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function deliveryFrom(fd: FormData): DeliveryOption[] {
  return fd
    .getAll("delivery_options")
    .map((v) => String(v))
    .filter(isDeliveryOption);
}

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

function bumpShopPaths(productId?: string) {
  revalidatePath("/admin/shop");
  if (productId) {
    revalidatePath(`/admin/shop/${productId}`);
    revalidatePath(`/admin/shop/${productId}/images`);
    revalidatePath(`/admin/shop/${productId}/variants`);
  }
}

// -------- Product core --------

export async function createShopProduct(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const slug = slugify(String(fd.get("slug") ?? "") || name);
  if (!slug) return { ok: false, error: "Slug invalid." };

  const price = numberOr(fd.get("price"), null);
  if (price == null || price < 0) return { ok: false, error: "Preț invalid." };

  const { data, error } = await supabase
    .from("shop_products")
    .insert({
      name,
      slug,
      description: cleanString(fd.get("description")),
      price,
      currency: "RON",
      status: "draft",
      delivery_options: deliveryFrom(fd),
    })
    .select("id")
    .single();

  if (error) {
    return {
      ok: false,
      error: isUniqueViolation(error) ? "Slug-ul este deja folosit." : error.message,
    };
  }

  revalidatePath("/admin/shop");
  redirect(`/admin/shop/${data.id}`);
}

export async function updateShopProduct(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const id = String(fd.get("id") ?? "");
  if (!id) return { ok: false, error: "ID lipsă." };

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const slug = slugify(String(fd.get("slug") ?? "") || name);
  if (!slug) return { ok: false, error: "Slug invalid." };

  const price = numberOr(fd.get("price"), null);
  if (price == null || price < 0) return { ok: false, error: "Preț invalid." };

  const stock = numberOr(fd.get("stock"), null);
  if (stock != null && stock < 0) return { ok: false, error: "Stoc invalid." };

  const status = String(fd.get("status") ?? "draft") as Enums<"course_status">;
  const currency = String(
    fd.get("currency") ?? "RON",
  ) as Enums<"currency_code">;
  const delivery = deliveryFrom(fd);

  if (status === "published" && delivery.length === 0) {
    return {
      ok: false,
      error: "Alege cel puțin o metodă de livrare înainte de publicare.",
    };
  }

  const { error } = await supabase
    .from("shop_products")
    .update({
      name,
      slug,
      description: cleanString(fd.get("description")),
      price,
      currency,
      status,
      stock,
      delivery_options: delivery,
      sort_order: numberOr(fd.get("sort_order"), 0) ?? 0,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      error: isUniqueViolation(error) ? "Slug-ul este deja folosit." : error.message,
    };
  }

  bumpShopPaths(id);
  return { ok: true };
}

export async function deleteShopProduct(id: string): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: images } = await supabase
    .from("shop_product_images")
    .select("path")
    .eq("product_id", id);

  const { error } = await supabase.from("shop_products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Rows cascade in the DB; the storage objects have to go by hand.
  for (const image of images ?? []) {
    try {
      await deleteStorageObject(SHOP_BUCKET, image.path);
    } catch {
      // A stale object is not worth failing the delete over.
    }
  }

  bumpShopPaths();
}

// -------- Images --------

export async function uploadShopImage(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const productId = String(fd.get("id") ?? "");
  if (!productId) return { ok: false, error: "ID lipsă." };

  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "Selectează o imagine." };
  if (!file.type.startsWith("image/"))
    return { ok: false, error: "Fișierul trebuie să fie o imagine." };
  if (file.size > MAX_IMAGE_BYTES)
    return { ok: false, error: "Imaginea depășește 5 MB." };

  const { data: last } = await supabase
    .from("shop_product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let path: string;
  try {
    ({ path } = await uploadShopProductImage(file, productId));
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Încărcare eșuată.",
    };
  }

  const { error } = await supabase.from("shop_product_images").insert({
    product_id: productId,
    path,
    alt: cleanString(fd.get("alt")),
    sort_order: (last?.sort_order ?? -1) + 1,
  });

  if (error) {
    await deleteStorageObject(SHOP_BUCKET, path).catch(() => {});
    return { ok: false, error: error.message };
  }

  bumpShopPaths(productId);
  return { ok: true };
}

export async function deleteShopImage(imageId: string): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: image } = await supabase
    .from("shop_product_images")
    .select("path, product_id")
    .eq("id", imageId)
    .maybeSingle();
  if (!image) return;

  const { error } = await supabase
    .from("shop_product_images")
    .delete()
    .eq("id", imageId);
  if (error) throw new Error(error.message);

  await deleteStorageObject(SHOP_BUCKET, image.path).catch(() => {});
  bumpShopPaths(image.product_id);
}

/** Swaps an image with its neighbour so admins can pick the cover. */
export async function moveShopImage(
  imageId: string,
  direction: "up" | "down",
): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: current } = await supabase
    .from("shop_product_images")
    .select("id, product_id, sort_order")
    .eq("id", imageId)
    .maybeSingle();
  if (!current) return;

  const siblings = supabase
    .from("shop_product_images")
    .select("id, sort_order")
    .eq("product_id", current.product_id);

  const { data: neighbour } = await (direction === "up"
    ? siblings
        .lt("sort_order", current.sort_order)
        .order("sort_order", { ascending: false })
    : siblings
        .gt("sort_order", current.sort_order)
        .order("sort_order", { ascending: true })
  )
    .limit(1)
    .maybeSingle();
  if (!neighbour) return;

  const { error: e1 } = await supabase
    .from("shop_product_images")
    .update({ sort_order: neighbour.sort_order })
    .eq("id", current.id);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabase
    .from("shop_product_images")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbour.id);
  if (e2) throw new Error(e2.message);

  bumpShopPaths(current.product_id);
}

// -------- Colours --------

export async function upsertShopColor(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const productId = String(fd.get("product_id") ?? "");
  if (!productId) return { ok: false, error: "ID produs lipsă." };

  const colorId = String(fd.get("color_id") ?? "");
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Numele culorii este obligatoriu." };

  const hex = normalizeHex(String(fd.get("hex") ?? ""));
  if (hex === "invalid")
    return { ok: false, error: "Codul de culoare trebuie să fie de forma #1a2b3c." };

  const imageId = cleanString(fd.get("image_id"));
  const sortOrder = numberOr(fd.get("sort_order"), 0) ?? 0;

  const values = {
    product_id: productId,
    name,
    hex,
    image_id: imageId,
    sort_order: sortOrder,
  };

  const { error } = colorId
    ? await supabase
        .from("shop_product_colors")
        .update(values)
        .eq("id", colorId)
    : await supabase.from("shop_product_colors").insert(values);

  if (error) {
    return {
      ok: false,
      error: isUniqueViolation(error)
        ? "Există deja o culoare cu acest nume."
        : error.message,
    };
  }

  bumpShopPaths(productId);
  return { ok: true };
}

export async function deleteShopColor(colorId: string): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: color } = await supabase
    .from("shop_product_colors")
    .select("product_id")
    .eq("id", colorId)
    .maybeSingle();

  // Variants under this colour cascade in the DB.
  const { error } = await supabase
    .from("shop_product_colors")
    .delete()
    .eq("id", colorId);
  if (error) throw new Error(error.message);

  bumpShopPaths(color?.product_id);
}

// -------- Variants --------

/** Adds every weight in a batch ("10, 12, 15") under one colour. */
export async function addShopWeights(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const productId = String(fd.get("product_id") ?? "");
  if (!productId) return { ok: false, error: "ID produs lipsă." };

  const colorId = cleanString(fd.get("color_id"));
  const stock = numberOr(fd.get("stock"), 0) ?? 0;
  if (stock < 0) return { ok: false, error: "Stoc invalid." };

  const price = numberOr(fd.get("price"), null);
  if (price != null && price < 0) return { ok: false, error: "Preț invalid." };

  const { weights, invalid } = parseWeights(String(fd.get("weights") ?? ""));
  if (weights.length === 0) {
    return {
      ok: false,
      error: invalid.length
        ? `Nu am putut citi: ${invalid.join(", ")}.`
        : "Scrie cel puțin o greutate, ex. 10, 12, 15.",
    };
  }

  const base = supabase
    .from("shop_product_variants")
    .select("weight_kg, sort_order")
    .eq("product_id", productId);

  const { data } = await (colorId
    ? base.eq("color_id", colorId)
    : base.is("color_id", null)
  ).order("sort_order", { ascending: false });

  const siblings = data ?? [];
  const taken = new Set(siblings.map((s) => s.weight_kg));
  const fresh = weights.filter((w) => !taken.has(w));

  if (fresh.length === 0)
    return { ok: false, error: "Toate greutățile există deja." };

  let nextOrder = (siblings[0]?.sort_order ?? -1) + 1;
  const rows = fresh.map((weight) => ({
    product_id: productId,
    color_id: colorId,
    weight_kg: weight,
    price,
    stock,
    sort_order: nextOrder++,
  }));

  const { error } = await supabase.from("shop_product_variants").insert(rows);
  if (error) {
    return {
      ok: false,
      error: isUniqueViolation(error)
        ? "Există deja o variantă cu aceeași culoare și greutate."
        : error.message,
    };
  }

  bumpShopPaths(productId);
  return { ok: true };
}

export async function updateShopVariant(
  _prev: ShopActionState,
  fd: FormData,
): Promise<ShopActionState> {
  const { supabase } = await assertAdmin();

  const productId = String(fd.get("product_id") ?? "");
  const variantId = String(fd.get("variant_id") ?? "");
  if (!productId || !variantId) return { ok: false, error: "ID lipsă." };

  const weight = numberOr(fd.get("weight_kg"), null);
  const price = numberOr(fd.get("price"), null);
  const stock = numberOr(fd.get("stock"), 0) ?? 0;

  if (weight != null && weight < 0)
    return { ok: false, error: "Greutate invalidă." };
  if (price != null && price < 0) return { ok: false, error: "Preț invalid." };
  if (stock < 0) return { ok: false, error: "Stoc invalid." };

  const { error } = await supabase
    .from("shop_product_variants")
    .update({ weight_kg: weight, price, stock })
    .eq("id", variantId);

  if (error) {
    return {
      ok: false,
      error: isUniqueViolation(error)
        ? "Există deja o variantă cu aceeași culoare și greutate."
        : error.message,
    };
  }

  bumpShopPaths(productId);
  return { ok: true };
}

export async function deleteShopVariant(variantId: string): Promise<void> {
  const { supabase } = await assertAdmin();

  const { data: variant } = await supabase
    .from("shop_product_variants")
    .select("product_id")
    .eq("id", variantId)
    .maybeSingle();

  const { error } = await supabase
    .from("shop_product_variants")
    .delete()
    .eq("id", variantId);
  if (error) throw new Error(error.message);

  bumpShopPaths(variant?.product_id);
}

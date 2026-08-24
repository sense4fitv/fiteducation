import "server-only";

import { createAdminClient } from "./admin";

export const COURSE_BUCKET = "course-images" as const;
export const TRAINER_BUCKET = "trainer-images" as const;
export const SHOP_BUCKET = "shop-product-images" as const;

export type StorageBucket =
  | typeof COURSE_BUCKET
  | typeof TRAINER_BUCKET
  | typeof SHOP_BUCKET;

const SITE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function publicUrl(
  bucket: StorageBucket,
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  return `${SITE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

function randomHash(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len);
}

function extOf(name: string) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return (m?.[1] ?? "bin").toLowerCase();
}

export async function uploadCourseImage(
  file: File,
  courseId: string,
  kind: "cover" | "hero",
): Promise<{ path: string }> {
  const admin = createAdminClient();
  const path = `${courseId}/${kind}-${randomHash()}.${extOf(file.name)}`;
  const { error } = await admin.storage.from(COURSE_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return { path };
}

export async function uploadTrainerImage(
  file: File,
  trainerId: string,
): Promise<{ path: string }> {
  const admin = createAdminClient();
  const path = `${trainerId}/profile-${randomHash()}.${extOf(file.name)}`;
  const { error } = await admin.storage.from(TRAINER_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return { path };
}

export async function uploadShopProductImage(
  file: File,
  productId: string,
): Promise<{ path: string }> {
  const admin = createAdminClient();
  const path = `${productId}/${randomHash()}.${extOf(file.name)}`;
  const { error } = await admin.storage.from(SHOP_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return { path };
}

export async function deleteStorageObject(
  bucket: StorageBucket,
  path: string,
) {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).remove([path]);
  if (error) throw error;
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/supabase/guards";
import { slugify } from "@/lib/slug";
import {
  TRAINER_BUCKET,
  deleteStorageObject,
  uploadTrainerImage,
} from "@/lib/supabase/storage";

export type TrainerActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

function cleanString(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

export async function createTrainer(
  _prev: TrainerActionState,
  fd: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await assertAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const slug = slugify(String(fd.get("slug") ?? "") || name);
  if (!slug) return { ok: false, error: "Slug invalid." };

  const { data, error } = await supabase
    .from("trainers")
    .insert({
      name,
      slug,
      bio: cleanString(fd.get("bio")),
      credentials: cleanString(fd.get("credentials")),
      instagram_url: cleanString(fd.get("instagram_url")),
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/trainers");
  redirect(`/admin/trainers/${data.id}`);
}

export async function updateTrainer(
  _prev: TrainerActionState,
  fd: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  if (!id) return { ok: false, error: "ID lipsă." };

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const slug = slugify(String(fd.get("slug") ?? "") || name);
  if (!slug) return { ok: false, error: "Slug invalid." };

  const { error } = await supabase
    .from("trainers")
    .update({
      name,
      slug,
      bio: cleanString(fd.get("bio")),
      credentials: cleanString(fd.get("credentials")),
      instagram_url: cleanString(fd.get("instagram_url")),
      photo_alt: cleanString(fd.get("photo_alt")),
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/trainers");
  revalidatePath(`/admin/trainers/${id}`);
  return { ok: true };
}

export async function uploadTrainerPhoto(
  _prev: TrainerActionState,
  fd: FormData,
): Promise<TrainerActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  const file = fd.get("file");

  if (!id) return { ok: false, error: "ID lipsă." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Selectează o imagine." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Imaginea depășește 5 MB." };
  }

  const { data: existing } = await supabase
    .from("trainers")
    .select("photo_path")
    .eq("id", id)
    .single();

  let newPath: string;
  try {
    const result = await uploadTrainerImage(file, id);
    newPath = result.path;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Eroare la upload.",
    };
  }

  const { error } = await supabase
    .from("trainers")
    .update({ photo_path: newPath })
    .eq("id", id);

  if (error) {
    await deleteStorageObject(TRAINER_BUCKET, newPath).catch(() => {});
    return { ok: false, error: error.message };
  }

  if (existing?.photo_path && existing.photo_path !== newPath) {
    await deleteStorageObject(TRAINER_BUCKET, existing.photo_path).catch(() => {});
  }

  revalidatePath(`/admin/trainers/${id}`);
  revalidatePath("/admin/trainers");
  return { ok: true };
}

export async function removeTrainerPhoto(id: string) {
  const { supabase } = await assertAdmin();
  const { data: existing } = await supabase
    .from("trainers")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("trainers")
    .update({ photo_path: null, photo_alt: null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (existing?.photo_path) {
    await deleteStorageObject(TRAINER_BUCKET, existing.photo_path).catch(() => {});
  }

  revalidatePath(`/admin/trainers/${id}`);
  revalidatePath("/admin/trainers");
}

export async function deleteTrainer(id: string) {
  const { supabase } = await assertAdmin();
  const { data: existing } = await supabase
    .from("trainers")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("trainers").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.photo_path) {
    await deleteStorageObject(TRAINER_BUCKET, existing.photo_path).catch(() => {});
  }
  revalidatePath("/admin/trainers");
  redirect("/admin/trainers");
}

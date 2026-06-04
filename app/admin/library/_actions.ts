"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

export type LibraryActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

const REQUIREMENT_CATEGORIES: Enums<"requirement_category">[] = [
  "inscriere",
  "acte",
  "participare",
  "examen",
];

// -------- Requirements --------

export async function saveRequirement(
  _prev: LibraryActionState,
  fd: FormData,
): Promise<LibraryActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const label = String(fd.get("label") ?? "").trim();
  const category = String(fd.get("category") ?? "") as Enums<"requirement_category">;
  const sort_order = Number(fd.get("sort_order") ?? 0);

  if (!label) return { ok: false, error: "Eticheta este obligatorie." };
  if (!REQUIREMENT_CATEGORIES.includes(category))
    return { ok: false, error: "Categorie invalidă." };

  const row = { label, category, sort_order: Number.isFinite(sort_order) ? sort_order : 0 };
  const { error } = id
    ? await supabase.from("requirements").update(row).eq("id", id)
    : await supabase.from("requirements").insert(row);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/library");
  return { ok: true };
}

export async function deleteRequirement(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("requirements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/library");
}

// -------- Certifications --------

export async function saveCertification(
  _prev: LibraryActionState,
  fd: FormData,
): Promise<LibraryActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const name = String(fd.get("name") ?? "").trim();
  const issuer = String(fd.get("issuer") ?? "").trim() || null;
  const description = String(fd.get("description") ?? "").trim() || null;

  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const row = { name, issuer, description };
  const { error } = id
    ? await supabase.from("certifications").update(row).eq("id", id)
    : await supabase.from("certifications").insert(row);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/library");
  return { ok: true };
}

export async function deleteCertification(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/library");
}

// -------- Audiences --------

export async function saveAudience(
  _prev: LibraryActionState,
  fd: FormData,
): Promise<LibraryActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const label = String(fd.get("label") ?? "").trim();

  if (!label) return { ok: false, error: "Eticheta este obligatorie." };

  const row = { label };
  const { error } = id
    ? await supabase.from("audiences").update(row).eq("id", id)
    : await supabase.from("audiences").insert(row);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/library");
  return { ok: true };
}

export async function deleteAudience(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("audiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/library");
}

"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/supabase/guards";

export type LocationActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

export async function saveLocation(
  _prev: LocationActionState,
  fd: FormData,
): Promise<LocationActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const name = String(fd.get("name") ?? "").trim();
  const address = String(fd.get("address") ?? "").trim() || null;
  const map_url = String(fd.get("map_url") ?? "").trim() || null;

  if (!name) return { ok: false, error: "Numele este obligatoriu." };

  const row = { name, address, map_url };
  const { error } = id
    ? await supabase.from("locations").update(row).eq("id", id)
    : await supabase.from("locations").insert(row);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function deleteLocation(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/locations");
}

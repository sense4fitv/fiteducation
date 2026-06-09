"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/supabase/guards";
import { slugify } from "@/lib/slug";
import {
  COURSE_BUCKET,
  deleteStorageObject,
  uploadCourseImage,
} from "@/lib/supabase/storage";
import type { Enums } from "@/lib/supabase/types";

export type CourseActionState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

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

function boolFrom(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

function bumpProductPaths(courseId?: string) {
  revalidatePath("/admin/products");
  if (courseId) revalidatePath(`/admin/products/${courseId}`);
}

// -------- Course core --------

export async function createCourse(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const title = String(fd.get("title") ?? "").trim();
  const type = String(fd.get("type") ?? "") as Enums<"course_type">;
  const currency = String(fd.get("currency") ?? "") as Enums<"currency_code">;
  const price = numberOr(fd.get("price_amount"), null);
  const duration = numberOr(fd.get("duration_hours"), null);
  const slug = slugify(String(fd.get("slug") ?? "") || title);

  if (!title) return { ok: false, error: "Titlul este obligatoriu." };
  if (!["curs_acreditat", "workshop"].includes(type))
    return { ok: false, error: "Tip invalid." };
  if (!["RON", "EUR"].includes(currency))
    return { ok: false, error: "Monedă invalidă." };
  if (price == null || price < 0)
    return { ok: false, error: "Preț invalid." };
  if (duration == null || duration < 1)
    return { ok: false, error: "Durată invalidă." };
  if (!slug) return { ok: false, error: "Slug invalid." };

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      type,
      currency,
      price_amount: price,
      duration_hours: duration,
      requires_bacalaureat: type === "curs_acreditat",
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  redirect(`/admin/products/${data.id}`);
}

export async function updateCourseCore(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  if (!id) return { ok: false, error: "ID lipsă." };

  const title = String(fd.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Titlul este obligatoriu." };

  const type = String(fd.get("type") ?? "") as Enums<"course_type">;
  const currency = String(fd.get("currency") ?? "") as Enums<"currency_code">;
  const status = String(fd.get("status") ?? "draft") as Enums<"course_status">;
  const slug = slugify(String(fd.get("slug") ?? "") || title);
  if (!slug) return { ok: false, error: "Slug invalid." };

  const price = numberOr(fd.get("price_amount"), null);
  const fullPrice = numberOr(fd.get("full_payment_price"), null);
  const duration = numberOr(fd.get("duration_hours"), null);
  const minAge = numberOr(fd.get("min_age"), 18);
  const heroOrder = numberOr(fd.get("hero_sort_order"), null);
  if (price == null || price < 0)
    return { ok: false, error: "Preț invalid." };
  if (duration == null || duration < 1)
    return { ok: false, error: "Durată invalidă." };

  const { error } = await supabase
    .from("courses")
    .update({
      type,
      title,
      slug,
      motto: cleanString(fd.get("motto")),
      description: cleanString(fd.get("description")),
      price_amount: price,
      currency,
      full_payment_price: fullPrice,
      klarna_enabled: boolFrom(fd.get("klarna_enabled")),
      duration_hours: duration,
      language: String(fd.get("language") ?? "română").trim() || "română",
      launch_date: cleanString(fd.get("launch_date")),
      min_age: minAge ?? 18,
      requires_bacalaureat: boolFrom(fd.get("requires_bacalaureat")),
      announcement_bar_text: cleanString(fd.get("announcement_bar_text")),
      show_in_hero: boolFrom(fd.get("show_in_hero")),
      hero_sort_order: heroOrder,
      cover_image_alt: cleanString(fd.get("cover_image_alt")),
      status,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  bumpProductPaths(id);
  return { ok: true };
}

export async function deleteCourse(id: string) {
  const { supabase } = await assertAdmin();
  const { data: existing } = await supabase
    .from("courses")
    .select("cover_image_path, hero_image_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.cover_image_path) {
    await deleteStorageObject(COURSE_BUCKET, existing.cover_image_path).catch(
      () => {},
    );
  }
  if (existing?.hero_image_path) {
    await deleteStorageObject(COURSE_BUCKET, existing.hero_image_path).catch(
      () => {},
    );
  }
  revalidatePath("/admin/products");
}

// -------- Course images --------

export async function uploadCourseImageAction(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  const kindRaw = String(fd.get("kind") ?? "");
  const kind = kindRaw === "cover" || kindRaw === "hero" ? kindRaw : null;
  const file = fd.get("file");

  if (!id) return { ok: false, error: "ID lipsă." };
  if (!kind) return { ok: false, error: "Tip imagine invalid." };
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "Selectează o imagine." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false, error: "Imaginea depășește 5 MB." };

  const column = kind === "cover" ? "cover_image_path" : "hero_image_path";
  const { data: existing } = await supabase
    .from("courses")
    .select(column)
    .eq("id", id)
    .single();

  let newPath: string;
  try {
    const result = await uploadCourseImage(file, id, kind);
    newPath = result.path;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Eroare la upload.",
    };
  }

  const { error } =
    kind === "cover"
      ? await supabase
          .from("courses")
          .update({ cover_image_path: newPath })
          .eq("id", id)
      : await supabase
          .from("courses")
          .update({ hero_image_path: newPath })
          .eq("id", id);

  if (error) {
    await deleteStorageObject(COURSE_BUCKET, newPath).catch(() => {});
    return { ok: false, error: error.message };
  }

  const prev = (existing as Record<string, string | null> | null)?.[column];
  if (prev && prev !== newPath) {
    await deleteStorageObject(COURSE_BUCKET, prev).catch(() => {});
  }

  bumpProductPaths(id);
  revalidatePath(`/admin/products/${id}/images`);
  return { ok: true };
}

export async function uploadCourseCover(
  prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  fd.set("kind", "cover");
  return uploadCourseImageAction(prev, fd);
}

export async function uploadCourseHero(
  prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  fd.set("kind", "hero");
  return uploadCourseImageAction(prev, fd);
}

export async function removeCourseCover(id: string) {
  await removeCourseImage(id, "cover");
}

export async function removeCourseHero(id: string) {
  await removeCourseImage(id, "hero");
}

export async function removeCourseImage(id: string, kind: "cover" | "hero") {
  const { supabase } = await assertAdmin();
  const column = kind === "cover" ? "cover_image_path" : "hero_image_path";
  const { data: existing } = await supabase
    .from("courses")
    .select(column)
    .eq("id", id)
    .single();

  const { error } =
    kind === "cover"
      ? await supabase
          .from("courses")
          .update({ cover_image_path: null, cover_image_alt: null })
          .eq("id", id)
      : await supabase
          .from("courses")
          .update({ hero_image_path: null })
          .eq("id", id);
  if (error) throw new Error(error.message);

  const prev = (existing as Record<string, string | null> | null)?.[column];
  if (prev) {
    await deleteStorageObject(COURSE_BUCKET, prev).catch(() => {});
  }
  bumpProductPaths(id);
  revalidatePath(`/admin/products/${id}/images`);
}

// -------- Sessions --------

export async function saveSession(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const courseId = String(fd.get("course_id") ?? "");
  const id = String(fd.get("id") ?? "") || null;
  if (!courseId) return { ok: false, error: "ID curs lipsă." };

  const row = {
    course_id: courseId,
    start_date: cleanString(fd.get("start_date")),
    end_date: cleanString(fd.get("end_date")),
    location_id: cleanString(fd.get("location_id")),
    note: cleanString(fd.get("note")),
    sort_order: numberOr(fd.get("sort_order"), 0) ?? 0,
  };

  const { error } = id
    ? await supabase.from("course_sessions").update(row).eq("id", id)
    : await supabase.from("course_sessions").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/products/${courseId}/sessions`);
  bumpProductPaths(courseId);
  return { ok: true };
}

export async function deleteSession(id: string, courseId: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("course_sessions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${courseId}/sessions`);
  bumpProductPaths(courseId);
}

// -------- Curriculum --------

export async function updateSkillsDescription(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const courseId = String(fd.get("course_id") ?? "");
  if (!courseId) return { ok: false, error: "ID curs lipsă." };

  const { error } = await supabase
    .from("courses")
    .update({ skills_description: cleanString(fd.get("skills_description")) })
    .eq("id", courseId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/products/${courseId}/curriculum`);
  bumpProductPaths(courseId);
  return { ok: true };
}

export async function saveCurriculumSection(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const courseId = String(fd.get("course_id") ?? "");
  const id = String(fd.get("id") ?? "") || null;
  const title = String(fd.get("title") ?? "").trim();
  if (!courseId) return { ok: false, error: "ID curs lipsă." };
  if (!title) return { ok: false, error: "Titlul este obligatoriu." };

  const row = {
    course_id: courseId,
    title,
    subtitle: cleanString(fd.get("subtitle")),
    sort_order: numberOr(fd.get("sort_order"), 0) ?? 0,
  };

  const { error } = id
    ? await supabase.from("curriculum_sections").update(row).eq("id", id)
    : await supabase.from("curriculum_sections").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/products/${courseId}/curriculum`);
  bumpProductPaths(courseId);
  return { ok: true };
}

export async function deleteCurriculumSection(id: string, courseId: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("curriculum_sections")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${courseId}/curriculum`);
  bumpProductPaths(courseId);
}

export async function saveCurriculumItem(
  _prev: CourseActionState,
  fd: FormData,
): Promise<CourseActionState> {
  const { supabase } = await assertAdmin();
  const courseId = String(fd.get("course_id") ?? "");
  const sectionId = String(fd.get("section_id") ?? "");
  const id = String(fd.get("id") ?? "") || null;
  const content = String(fd.get("content") ?? "").trim();
  if (!courseId || !sectionId)
    return { ok: false, error: "ID lipsă." };
  if (!content) return { ok: false, error: "Conținutul este obligatoriu." };

  const row = {
    section_id: sectionId,
    content,
    sort_order: numberOr(fd.get("sort_order"), 0) ?? 0,
  };

  const { error } = id
    ? await supabase.from("curriculum_items").update(row).eq("id", id)
    : await supabase.from("curriculum_items").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/products/${courseId}/curriculum`);
  bumpProductPaths(courseId);
  return { ok: true };
}

export async function deleteCurriculumItem(
  id: string,
  courseId: string,
) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("curriculum_items")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${courseId}/curriculum`);
  bumpProductPaths(courseId);
}

export async function reorderCurriculumSections(
  courseId: string,
  orderedIds: string[],
) {
  const { supabase } = await assertAdmin();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase
        .from("curriculum_sections")
        .update({ sort_order: i })
        .eq("id", id),
    ),
  );
  revalidatePath(`/admin/products/${courseId}/curriculum`);
}

export async function reorderCurriculumItems(
  courseId: string,
  sectionId: string,
  orderedIds: string[],
) {
  const { supabase } = await assertAdmin();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase
        .from("curriculum_items")
        .update({ sort_order: i })
        .eq("id", id),
    ),
  );
  // sectionId not strictly needed for the query but kept for revalidation grouping
  void sectionId;
  revalidatePath(`/admin/products/${courseId}/curriculum`);
}

// -------- Pivots --------

export async function setCourseTrainer(
  courseId: string,
  trainerId: string,
  attached: boolean,
) {
  const { supabase } = await assertAdmin();
  if (attached) {
    const { error } = await supabase
      .from("course_trainers")
      .insert({ course_id: courseId, trainer_id: trainerId })
      .select()
      .single();
    if (error && error.code !== "23505") throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("course_trainers")
      .delete()
      .eq("course_id", courseId)
      .eq("trainer_id", trainerId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/products/${courseId}/trainers`);
  bumpProductPaths(courseId);
}

export async function updateCourseTrainerMeta(
  courseId: string,
  trainerId: string,
  patch: {
    role?: Enums<"trainer_role">;
    is_featured?: boolean;
    sort_order?: number;
  },
) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("course_trainers")
    .update(patch)
    .eq("course_id", courseId)
    .eq("trainer_id", trainerId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${courseId}/trainers`);
}

export async function setCourseRequirement(
  courseId: string,
  requirementId: string,
  attached: boolean,
) {
  const { supabase } = await assertAdmin();
  if (attached) {
    const { error } = await supabase
      .from("course_requirements")
      .insert({ course_id: courseId, requirement_id: requirementId });
    if (error && error.code !== "23505") throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("course_requirements")
      .delete()
      .eq("course_id", courseId)
      .eq("requirement_id", requirementId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/products/${courseId}/requirements`);
  bumpProductPaths(courseId);
}

export async function setCourseCertification(
  courseId: string,
  certificationId: string,
  attached: boolean,
) {
  const { supabase } = await assertAdmin();
  if (attached) {
    const { error } = await supabase
      .from("course_certifications")
      .insert({ course_id: courseId, certification_id: certificationId });
    if (error && error.code !== "23505") throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("course_certifications")
      .delete()
      .eq("course_id", courseId)
      .eq("certification_id", certificationId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/products/${courseId}/certifications`);
  bumpProductPaths(courseId);
}

export async function setCourseAudience(
  courseId: string,
  audienceId: string,
  attached: boolean,
) {
  const { supabase } = await assertAdmin();
  if (attached) {
    const { error } = await supabase
      .from("course_audiences")
      .insert({ course_id: courseId, audience_id: audienceId });
    if (error && error.code !== "23505") throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("course_audiences")
      .delete()
      .eq("course_id", courseId)
      .eq("audience_id", audienceId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/products/${courseId}/audiences`);
  bumpProductPaths(courseId);
}

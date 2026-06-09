import "server-only";

import {
  COURSE_FALLBACK,
  COURSE_FALLBACK_DEFAULT,
  TRAINER_FALLBACK,
  TRAINER_FALLBACK_DEFAULT,
} from "@/lib/fallback-images";
import { createClient } from "@/lib/supabase/server";
import {
  COURSE_BUCKET,
  TRAINER_BUCKET,
  publicUrl,
} from "@/lib/supabase/storage";
import type { Enums } from "@/lib/supabase/types";

export type PublicCourseSummary = {
  id: string;
  slug: string;
  title: string;
  motto: string | null;
  type: Enums<"course_type">;
  price_amount: number;
  currency: Enums<"currency_code">;
  full_payment_price: number | null;
  klarna_enabled: boolean;
  duration_hours: number;
  launch_date: string | null;
  announcement_bar_text: string | null;
  cover_image: string;
  hero_image: string;
  cover_image_alt: string | null;
  show_in_hero: boolean;
  hero_sort_order: number | null;
  first_session_start: string | null;
};

export type PublicTrainer = {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  credentials: string | null;
  instagram_url: string | null;
  photo: string;
  tags: string[];
};

export type PublicCourseDetail = PublicCourseSummary & {
  description: string | null;
  skills_description: string | null;
  min_age: number;
  requires_bacalaureat: boolean;
  language: string;
  sessions: Array<{
    id: string;
    start_date: string | null;
    end_date: string | null;
    note: string | null;
    location: { id: string; name: string; address: string | null; map_url: string | null } | null;
  }>;
  curriculum: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    items: Array<{ id: string; content: string }>;
  }>;
  trainers: Array<
    PublicTrainer & { role: Enums<"trainer_role">; is_featured: boolean }
  >;
  requirements_by_category: Record<
    Enums<"requirement_category">,
    Array<{ id: string; label: string }>
  >;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string | null;
    description: string | null;
  }>;
  audiences: Array<{ id: string; label: string }>;
};

export function pickCourseImage(
  slug: string,
  path: string | null | undefined,
): string {
  return (
    publicUrl(COURSE_BUCKET, path) ??
    COURSE_FALLBACK[slug] ??
    COURSE_FALLBACK_DEFAULT
  );
}

export function pickTrainerImage(
  slug: string,
  path: string | null | undefined,
): string {
  return (
    publicUrl(TRAINER_BUCKET, path) ??
    TRAINER_FALLBACK[slug] ??
    TRAINER_FALLBACK_DEFAULT
  );
}

export function deriveTrainerTags(credentials: string | null): string[] {
  if (!credentials) return [];
  return credentials
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function listPublishedCourses(): Promise<PublicCourseSummary[]> {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select(
      "id, slug, title, motto, type, price_amount, currency, full_payment_price, klarna_enabled, duration_hours, launch_date, announcement_bar_text, cover_image_path, hero_image_path, cover_image_alt, show_in_hero, hero_sort_order",
    )
    .eq("status", "published")
    .order("type")
    .order("price_amount");

  if (!courses) return [];

  // Pull earliest sessions per course in one query.
  const ids = courses.map((c) => c.id);
  const { data: sessions } = ids.length
    ? await supabase
        .from("course_sessions")
        .select("course_id, start_date")
        .in("course_id", ids)
        .order("start_date", { nullsFirst: false })
    : { data: [] as { course_id: string; start_date: string | null }[] };

  const firstStartByCourse = new Map<string, string | null>();
  for (const s of sessions ?? []) {
    if (!firstStartByCourse.has(s.course_id)) {
      firstStartByCourse.set(s.course_id, s.start_date);
    }
  }

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    motto: c.motto,
    type: c.type,
    price_amount: c.price_amount,
    currency: c.currency,
    full_payment_price: c.full_payment_price,
    klarna_enabled: c.klarna_enabled,
    duration_hours: c.duration_hours,
    launch_date: c.launch_date,
    announcement_bar_text: c.announcement_bar_text,
    cover_image: pickCourseImage(c.slug, c.cover_image_path),
    hero_image: pickCourseImage(c.slug, c.hero_image_path ?? c.cover_image_path),
    cover_image_alt: c.cover_image_alt,
    show_in_hero: c.show_in_hero,
    hero_sort_order: c.hero_sort_order,
    first_session_start: firstStartByCourse.get(c.id) ?? null,
  }));
}

export async function listHeroCourses(): Promise<PublicCourseSummary[]> {
  const all = await listPublishedCourses();
  const flagged = all
    .filter((c) => c.show_in_hero)
    .sort((a, b) => (a.hero_sort_order ?? 0) - (b.hero_sort_order ?? 0));
  if (flagged.length > 0) return flagged;
  // Fallback: first 3 accredited + workshops by published-order.
  return all.slice(0, 3);
}

export async function listAllTrainers(): Promise<PublicTrainer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trainers")
    .select("id, slug, name, bio, credentials, instagram_url, photo_path")
    .order("created_at");

  return (data ?? []).map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    bio: t.bio,
    credentials: t.credentials,
    instagram_url: t.instagram_url,
    photo: pickTrainerImage(t.slug, t.photo_path),
    tags: deriveTrainerTags(t.credentials),
  }));
}

export async function getCourseBySlug(
  slug: string,
): Promise<PublicCourseDetail | null> {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!course) return null;

  const [sessionsRes, sectionsRes, itemsRes, ctRes, crRes, ccRes, caRes] =
    await Promise.all([
      supabase
        .from("course_sessions")
        .select(
          "id, start_date, end_date, note, sort_order, locations(id, name, address, map_url)",
        )
        .eq("course_id", course.id)
        .order("sort_order")
        .order("start_date", { nullsFirst: false }),
      supabase
        .from("curriculum_sections")
        .select("id, title, subtitle, sort_order")
        .eq("course_id", course.id)
        .order("sort_order"),
      supabase
        .from("curriculum_items")
        .select(
          "id, section_id, content, sort_order, curriculum_sections!inner(course_id)",
        )
        .eq("curriculum_sections.course_id", course.id)
        .order("sort_order"),
      supabase
        .from("course_trainers")
        .select(
          "role, is_featured, sort_order, trainers!inner(id, slug, name, bio, credentials, instagram_url, photo_path)",
        )
        .eq("course_id", course.id),
      supabase
        .from("course_requirements")
        .select("requirements!inner(id, label, category, sort_order)")
        .eq("course_id", course.id),
      supabase
        .from("course_certifications")
        .select("certifications!inner(id, name, issuer, description)")
        .eq("course_id", course.id),
      supabase
        .from("course_audiences")
        .select("audiences!inner(id, label)")
        .eq("course_id", course.id),
    ]);

  const itemsBySection = new Map<string, { id: string; content: string }[]>();
  for (const it of itemsRes.data ?? []) {
    const arr = itemsBySection.get(it.section_id) ?? [];
    arr.push({ id: it.id, content: it.content });
    itemsBySection.set(it.section_id, arr);
  }

  const curriculum = (sectionsRes.data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    items: itemsBySection.get(s.id) ?? [],
  }));

  const trainers = (ctRes.data ?? [])
    .map((p) => {
      const t = p.trainers;
      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        bio: t.bio,
        credentials: t.credentials,
        instagram_url: t.instagram_url,
        photo: pickTrainerImage(t.slug, t.photo_path),
        tags: deriveTrainerTags(t.credentials),
        role: p.role,
        is_featured: p.is_featured,
        sort_order: p.sort_order,
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);

  const requirements_by_category: PublicCourseDetail["requirements_by_category"] =
    { inscriere: [], acte: [], participare: [], examen: [] };
  for (const r of crRes.data ?? []) {
    const req = r.requirements;
    requirements_by_category[req.category].push({
      id: req.id,
      label: req.label,
    });
  }
  for (const cat of Object.keys(
    requirements_by_category,
  ) as Enums<"requirement_category">[]) {
    requirements_by_category[cat].sort((a, b) => a.label.localeCompare(b.label));
  }

  const sessions = (sessionsRes.data ?? []).map((s) => ({
    id: s.id,
    start_date: s.start_date,
    end_date: s.end_date,
    note: s.note,
    location: s.locations
      ? {
          id: s.locations.id,
          name: s.locations.name,
          address: s.locations.address,
          map_url: s.locations.map_url,
        }
      : null,
  }));

  const firstSession = sessions.find((s) => s.start_date) ?? sessions[0];

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    motto: course.motto,
    type: course.type,
    price_amount: course.price_amount,
    currency: course.currency,
    full_payment_price: course.full_payment_price,
    klarna_enabled: course.klarna_enabled,
    duration_hours: course.duration_hours,
    launch_date: course.launch_date,
    announcement_bar_text: course.announcement_bar_text,
    cover_image: pickCourseImage(course.slug, course.cover_image_path),
    hero_image: pickCourseImage(
      course.slug,
      course.hero_image_path ?? course.cover_image_path,
    ),
    cover_image_alt: course.cover_image_alt,
    show_in_hero: course.show_in_hero,
    hero_sort_order: course.hero_sort_order,
    first_session_start: firstSession?.start_date ?? null,
    description: course.description,
    skills_description: course.skills_description,
    min_age: course.min_age,
    requires_bacalaureat: course.requires_bacalaureat,
    language: course.language,
    sessions,
    curriculum,
    trainers,
    requirements_by_category,
    certifications: (ccRes.data ?? []).map((c) => ({
      id: c.certifications.id,
      name: c.certifications.name,
      issuer: c.certifications.issuer,
      description: c.certifications.description,
    })),
    audiences: (caRes.data ?? []).map((a) => ({
      id: a.audiences.id,
      label: a.audiences.label,
    })),
  };
}

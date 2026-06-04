import { formatDate } from "@/lib/format";
import type { Enums } from "@/lib/supabase/types";
import type { PublicCourseSummary } from "@/lib/supabase/queries/public";

// View-model the configurator + hero cards consume. Decoupled from the DB row
// so we can swap the upstream source later (e.g. group multiple courses into a
// pack) without touching the UI.
//
// NOTE: keep this fully serializable — instances cross the RSC → client
// boundary. Don't add Lucide icon component refs; the client resolves the
// icon from the slug (id) via pickCourseIcon.
export type SpecializationVM = {
  id: string; // slug
  title: string;
  description: string; // motto fallback
  duration: string; // "18 Iulie 2026", "26 sept – 27 sept 2026", "TBA"
  price: number;
  currency: Enums<"currency_code">;
  category: "foundation" | "specialization";
  comingSoon: boolean;
};

function formatDuration(course: PublicCourseSummary): string {
  if (course.launch_date) return formatDate(course.launch_date);
  if (course.first_session_start) return formatDate(course.first_session_start);
  return "TBA";
}

export function toSpecializationVM(course: PublicCourseSummary): SpecializationVM {
  return {
    id: course.slug,
    title: course.title,
    description: course.motto ?? "",
    duration: formatDuration(course),
    price: course.price_amount,
    currency: course.currency,
    category: course.type === "curs_acreditat" ? "foundation" : "specialization",
    comingSoon: !course.launch_date && !course.first_session_start,
  };
}

export function splitByCategory(items: SpecializationVM[]): {
  foundations: SpecializationVM[];
  specializations: SpecializationVM[];
} {
  return {
    foundations: items.filter((i) => i.category === "foundation"),
    specializations: items.filter((i) => i.category === "specialization"),
  };
}

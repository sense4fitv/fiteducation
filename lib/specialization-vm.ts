import type { LucideIcon } from "lucide-react";

import { pickCourseIcon } from "@/lib/course-icons";
import { formatDate } from "@/lib/format";
import type { Enums } from "@/lib/supabase/types";
import type { PublicCourseSummary } from "@/lib/supabase/queries/public";

// View-model the configurator + hero cards consume. Decoupled from the DB row
// so we can swap the upstream source later (e.g. group multiple courses into a
// pack) without touching the UI.
export type SpecializationVM = {
  id: string; // slug
  title: string;
  description: string; // motto fallback
  duration: string; // "18 Iulie 2026", "26 sept – 27 sept 2026", "TBA"
  price: number;
  currency: Enums<"currency_code">;
  icon: LucideIcon;
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
    icon: pickCourseIcon(course.slug),
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

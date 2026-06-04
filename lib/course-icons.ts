import {
  Activity,
  Dumbbell,
  Heart,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const COURSE_ICON: Record<string, LucideIcon> = {
  "curs-personal-trainer": Dumbbell,
  "curs-aerobic": Users,
  "group-fitness-introduction": Users,
  "professional-development": Sparkles,
  "functional-step-body-in-action": Activity,
  "step-moves": Activity,
  "cardio-moves": Heart,
  hipertrofie: Dumbbell,
};

export const COURSE_ICON_DEFAULT: LucideIcon = Sparkles;

export function pickCourseIcon(slug: string): LucideIcon {
  return COURSE_ICON[slug] ?? COURSE_ICON_DEFAULT;
}

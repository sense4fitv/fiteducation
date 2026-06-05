import CourseCard from "./CourseCard";
import type { PublicCourseSummary } from "@/lib/supabase/queries/public";

export default function CoursesSection({
  id,
  eyebrow,
  title,
  description,
  courses,
  variant,
  emptyText = "Curând disponibil.",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  courses: PublicCourseSummary[];
  variant: "large" | "compact";
  emptyText?: string;
}) {
  const gridCols =
    variant === "large"
      ? "lg:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id={id}
      className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#B8001F]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-bold text-[#0A0A0A] sm:text-5xl font-[family-name:var(--font-unbounded)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-[#666] sm:text-lg">
              {description}
            </p>
          ) : null}
        </header>

        {courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#E0E0E0] bg-white p-10 text-center text-sm text-[#888]">
            {emptyText}
          </p>
        ) : (
          <div className={`grid gap-6 ${gridCols}`}>
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Wallet } from "lucide-react";

import { formatDate, formatPrice } from "@/lib/format";
import type { PublicCourseSummary } from "@/lib/supabase/queries/public";

function startLabel(c: PublicCourseSummary): string {
  if (c.launch_date) return formatDate(c.launch_date);
  if (c.first_session_start) return formatDate(c.first_session_start);
  return "Curând";
}

export default function CourseCard({
  course,
  variant = "compact",
}: {
  course: PublicCourseSummary;
  variant?: "large" | "compact";
}) {
  const typeLabel =
    course.type === "curs_acreditat" ? "Curs acreditat" : "Workshop";
  const isLarge = variant === "large";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D0D0D0] hover:shadow-[0_18px_40px_-20px_rgba(10,10,10,0.25)]">
      <Link
        href={`/curs/${course.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={course.title}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ backgroundImage: `url(${course.cover_image})` }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 via-black/15 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1.4px] text-[#0A0A0A] shadow-sm">
          {typeLabel}
        </span>
        {course.klarna_enabled && course.type === "curs_acreditat" ? (
          <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-[#0A0A0A]/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[1.4px] text-white">
            Plată în rate
          </span>
        ) : null}
      </Link>

      <div className={`flex flex-1 flex-col ${isLarge ? "p-7" : "p-6"}`}>
        <Link
          href={`/curs/${course.slug}`}
          className="block hover:text-[#B8001F] transition-colors"
        >
          <h3
            className={`font-semibold text-[#0A0A0A] font-[family-name:var(--font-unbounded)] ${
              isLarge ? "text-2xl leading-tight" : "text-lg leading-snug"
            }`}
          >
            {course.title}
          </h3>
        </Link>
        {course.motto ? (
          <p
            className={`mt-2 text-sm text-[#666] leading-relaxed ${
              isLarge ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {course.motto}
          </p>
        ) : null}

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#EFEFEF] pt-4">
          <Stat
            icon={<Wallet size={13} />}
            label="Preț"
            value={formatPrice(course.price_amount, course.currency)}
          />
          <Stat
            icon={<CalendarDays size={13} />}
            label="Start"
            value={startLabel(course)}
          />
          <Stat
            icon={<Clock size={13} />}
            label="Durată"
            value={`${course.duration_hours} ore`}
          />
        </dl>

        {course.full_payment_price ? (
          <p className="mt-4 text-xs font-medium text-[#B8001F]">
            Plată integrală:{" "}
            {formatPrice(course.full_payment_price, course.currency)}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <Link
            href={`/curs/${course.slug}`}
            className="inline-flex w-full items-center justify-between rounded-full bg-[#0A0A0A] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B8001F]"
          >
            Vezi detalii
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[1.2px] text-[#999]">
        <span className="text-[#B8001F]">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-semibold text-[#0A0A0A]">
        {value}
      </dd>
    </div>
  );
}

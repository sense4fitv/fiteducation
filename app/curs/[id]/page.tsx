import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Instagram,
  MapPin,
} from "lucide-react";

import CourseSectionNav from "@/components/CourseSectionNav";
import EnrollmentForm from "@/components/EnrollmentForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatDate, formatDateRange, formatPrice } from "@/lib/format";
import { getCourseBySlug } from "@/lib/supabase/queries/public";
import type { Enums } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<Enums<"requirement_category">, string> = {
  inscriere: "Condiții de înscriere",
  acte: "Acte necesare",
  participare: "Participare la curs",
  examen: "Examen și certificare",
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const typeLabel =
    course.type === "curs_acreditat" ? "Curs acreditat" : "Workshop";

  const descriptionParagraphs = (course.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const requirementGroups = (
    Object.entries(course.requirements_by_category) as [
      Enums<"requirement_category">,
      Array<{ id: string; label: string }>,
    ][]
  ).filter(([, arr]) => arr.length > 0);

  const navSections: { id: string; label: string }[] = [
    descriptionParagraphs.length > 0
      ? { id: "despre", label: "Despre" }
      : null,
    course.curriculum.length > 0
      ? { id: "programa", label: "Programa" }
      : null,
    course.sessions.length > 0 ? { id: "sesiuni", label: "Sesiuni" } : null,
    course.trainers.length > 0 ? { id: "formatori", label: "Formatori" } : null,
    requirementGroups.length > 0
      ? { id: "cerinte", label: "Cerințe" }
      : null,
    course.certifications.length > 0
      ? { id: "certificari", label: "Certificări" }
      : null,
    { id: "inscriere", label: "Înscriere" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="px-4 sm:px-8 lg:px-16 pt-3 pb-2">
        <div className="mx-auto max-w-[1200px] flex items-center gap-2 text-xs text-[#888]">
          <Link href="/" className="hover:text-[#0A0A0A] transition-colors">
            Acasă
          </Link>
          <ChevronRight size={14} />
          <Link
            href="/#specializari"
            className="hover:text-[#0A0A0A] transition-colors"
          >
            {typeLabel}
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#0A0A0A]">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px] grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] min-h-[280px] lg:min-h-[420px]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${course.hero_image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10 text-white">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider">
                {typeLabel}
              </span>
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl font-[family-name:var(--font-unbounded)]">
                {course.title}
              </h1>
              {course.motto ? (
                <p className="mt-3 max-w-xl text-base text-[#cfcfcf]">
                  {course.motto}
                </p>
              ) : null}
            </div>
          </div>

          {/* Price card */}
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-[#EAEAEA] bg-white p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#888]">
                  Investiție
                </p>
                <p className="mt-1 text-3xl font-bold text-[#0A0A0A] tabular-nums">
                  {formatPrice(course.price_amount, course.currency)}
                </p>
                {course.full_payment_price ? (
                  <p className="mt-1 text-xs text-[#B8001F]">
                    Plată integrală:{" "}
                    {formatPrice(
                      course.full_payment_price,
                      course.currency,
                    )}
                  </p>
                ) : null}
                {course.klarna_enabled ? (
                  <p className="mt-1 text-xs text-[#666]">
                    Posibilitatea de plată în rate prin Klarna
                  </p>
                ) : null}
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Stat
                  label="Data lansării"
                  value={
                    course.launch_date ? formatDate(course.launch_date) : "TBA"
                  }
                />
                <Stat
                  label="Durată"
                  value={`${course.duration_hours} ore`}
                />
                <Stat label="Limbă" value={course.language} />
                <Stat label="Vârstă minimă" value={`${course.min_age} ani`} />
              </dl>
            </div>

            <a
              href="#inscriere"
              className="inline-flex items-center justify-center rounded-full bg-[#B8001F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#490207]"
            >
              Înscrie-te acum
            </a>
          </div>
        </div>

        {course.announcement_bar_text ? (
          <div className="mx-auto mt-6 max-w-[1200px] rounded-2xl border border-[#B8001F]/25 bg-[#B8001F]/5 px-5 py-3 text-sm font-medium text-[#B8001F]">
            {course.announcement_bar_text}
          </div>
        ) : null}
      </section>

      {/* Sticky section nav */}
      <div className="mt-10 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <CourseSectionNav sections={navSections} />
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-16 pb-20">
        {/* Despre */}
        {descriptionParagraphs.length > 0 ? (
          <Section id="despre" title="Despre curs">
            <div className="prose-default space-y-4">
              {descriptionParagraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-[#3A3A3A]"
                >
                  {p}
                </p>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Programa */}
        {course.curriculum.length > 0 ? (
          <Section id="programa" title="Programa">
            <ol className="space-y-10">
              {course.curriculum.map((sec, i) => (
                <li key={sec.id} className="grid gap-4 sm:grid-cols-[3rem_1fr]">
                  <span className="text-sm font-semibold text-[#B8001F] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0A0A]">
                      {sec.title}
                    </h3>
                    {sec.subtitle ? (
                      <p className="mt-1 text-sm text-[#777]">{sec.subtitle}</p>
                    ) : null}
                    {sec.items.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#3A3A3A]">
                        {sec.items.map((it) => (
                          <li key={it.id} className="flex gap-3">
                            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#B8001F]" />
                            <span>{it.content}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {/* Sesiuni */}
        {course.sessions.length > 0 ? (
          <Section id="sesiuni" title="Sesiuni programate">
            <ul className="divide-y divide-[#EFEFEF]">
              {course.sessions.map((s) => (
                <li
                  key={s.id}
                  className="grid gap-1 py-4 sm:grid-cols-[1fr_1fr] sm:items-baseline"
                >
                  <p className="text-base font-medium text-[#0A0A0A]">
                    {formatDateRange(s.start_date, s.end_date)}
                  </p>
                  <div className="text-sm text-[#666]">
                    {s.location ? (
                      <p className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {s.location.map_url ? (
                          <a
                            href={s.location.map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#B8001F]"
                          >
                            {s.location.name}
                          </a>
                        ) : (
                          <span>{s.location.name}</span>
                        )}
                      </p>
                    ) : null}
                    {s.note ? (
                      <p className="mt-1 text-[13px] text-[#888]">{s.note}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Formatori */}
        {course.trainers.length > 0 ? (
          <Section id="formatori" title="Formatori">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {course.trainers
                .slice()
                .sort((a, b) =>
                  Number(b.is_featured) - Number(a.is_featured),
                )
                .map((t) => (
                  <article
                    key={t.id}
                    className="flex gap-4 rounded-2xl border border-[#EAEAEA] bg-white p-4"
                  >
                    <div
                      className="size-16 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${t.photo})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0A0A0A]">
                        {t.name}
                      </p>
                      {t.credentials ? (
                        <p className="mt-0.5 line-clamp-2 text-xs text-[#777]">
                          {t.credentials}
                        </p>
                      ) : null}
                      {t.instagram_url ? (
                        <a
                          href={t.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-[#666] hover:text-[#B8001F]"
                        >
                          <Instagram size={12} />
                          Instagram
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
            </div>
          </Section>
        ) : null}

        {/* Audiență */}
        {course.audiences.length > 0 ? (
          <Section
            id="audienta"
            title={`Pentru cine este acest ${course.type === "workshop" ? "workshop" : "curs"}`}
            inNav={false}
          >
            <div className="flex flex-wrap gap-2">
              {course.audiences.map((a) => (
                <span
                  key={a.id}
                  className="rounded-full border border-[#EAEAEA] bg-white px-3.5 py-1.5 text-sm text-[#333]"
                >
                  {a.label}
                </span>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Cerințe */}
        {requirementGroups.length > 0 ? (
          <Section id="cerinte" title="Cerințe">
            <div className="grid gap-8 sm:grid-cols-2">
              {requirementGroups.map(([cat, arr]) => (
                <div key={cat}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#888]">
                    {CATEGORY_LABEL[cat]}
                  </h3>
                  <ul className="space-y-2 text-[15px] text-[#3A3A3A]">
                    {arr.map((r) => (
                      <li key={r.id} className="flex gap-3">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#B8001F]" />
                        <span>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Certificări */}
        {course.certifications.length > 0 ? (
          <Section id="certificari" title="Certificări">
            <ul className="space-y-5">
              {course.certifications.map((c) => (
                <li
                  key={c.id}
                  className="grid gap-1 border-l-2 border-[#B8001F]/40 pl-4"
                >
                  <p className="text-base font-semibold text-[#0A0A0A]">
                    {c.name}
                  </p>
                  {c.issuer ? (
                    <p className="text-xs uppercase tracking-wider text-[#888]">
                      {c.issuer}
                    </p>
                  ) : null}
                  {c.description ? (
                    <p className="mt-1 text-[15px] leading-relaxed text-[#3A3A3A]">
                      {c.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Înscriere */}
        <Section id="inscriere" title="Formular de înscriere">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <EnrollmentForm
              courseId={course.id}
              sessions={course.sessions.map((s) => ({
                id: s.id,
                start_date: s.start_date,
                end_date: s.end_date,
              }))}
              klarnaEnabled={course.klarna_enabled}
            />
            <aside className="space-y-3 text-sm text-[#555]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                Ce urmează
              </p>
              <p>
                Trimiți formularul → te contactăm în maxim 24 ore → confirmăm
                locul și detaliile de plată.
              </p>
              {course.klarna_enabled ? (
                <p className="text-xs text-[#888]">
                  Posibilitatea de a achita în rate prin Klarna.
                </p>
              ) : null}
            </aside>
          </div>
        </Section>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Section({
  id,
  title,
  children,
  inNav = true,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  inNav?: boolean;
}) {
  // inNav is informational only — the nav is built from the page itself —
  // but we keep the prop for future scroll-spy adjustments.
  void inNav;
  return (
    <section id={id} className="pt-16">
      <h2 className="mb-6 text-2xl font-semibold text-[#0A0A0A] sm:text-[28px] font-[family-name:var(--font-unbounded)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-[#888]">{label}</dt>
      <dd className="mt-0.5 font-medium text-[#0A0A0A]">{value}</dd>
    </div>
  );
}

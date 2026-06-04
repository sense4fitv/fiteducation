import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Instagram,
  MapPin,
  Target,
  Users,
} from "lucide-react";

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

  const featuredTrainers = course.trainers.filter((t) => t.is_featured);
  const otherTrainers = course.trainers.filter((t) => !t.is_featured);

  const descriptionParagraphs = (course.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Breadcrumbs */}
      <section className="pt-4 pb-4 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#B8001F] transition-colors">
              Acasă
            </Link>
            <ChevronRight size={16} />
            <Link
              href="/#specializari"
              className="hover:text-[#B8001F] transition-colors"
            >
              {typeLabel}
            </Link>
            <ChevronRight size={16} />
            <span className="text-[#0A0A0A] font-medium">{course.title}</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0A]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${course.hero_image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
              <div className="max-w-2xl space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#B8001F]/40 bg-[#B8001F]/20 px-4 py-1.5 text-xs uppercase tracking-wider text-white">
                  {typeLabel}
                </span>
                <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl font-[family-name:var(--font-unbounded)]">
                  {course.title}
                </h1>
                {course.motto ? (
                  <p className="text-lg text-[#A0A0A0] sm:text-xl">
                    {course.motto}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#666666]">
                      Preț
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {formatPrice(course.price_amount, course.currency)}
                    </p>
                    {course.full_payment_price ? (
                      <p className="text-xs text-[#B8001F]">
                        Plată integrală:{" "}
                        {formatPrice(course.full_payment_price, course.currency)}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href="#inscriere"
                    className="rounded-full bg-[#B8001F] px-7 py-3.5 font-semibold text-white transition-all hover:bg-[#490207] hover:shadow-lg hover:shadow-[#B8001F]/40"
                  >
                    Înscrie-te acum
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement bar */}
      {course.announcement_bar_text ? (
        <section className="px-4 sm:px-8 lg:px-16 mt-6">
          <div className="max-w-[1200px] mx-auto rounded-2xl border border-[#B8001F]/30 bg-[#B8001F]/10 px-6 py-4 text-sm font-semibold text-[#B8001F]">
            {course.announcement_bar_text}
          </div>
        </section>
      ) : null}

      {/* Info bar */}
      <section className="px-4 sm:px-8 lg:px-16 mt-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoCard
            icon={<CalendarDays size={18} />}
            label="Data lansării"
            value={course.launch_date ? formatDate(course.launch_date) : "TBA"}
          />
          <InfoCard
            icon={<Clock size={18} />}
            label="Durată"
            value={`${course.duration_hours} ore`}
          />
          <InfoCard
            icon={<Globe size={18} />}
            label="Limbă"
            value={course.language}
          />
          <InfoCard
            icon={<GraduationCap size={18} />}
            label="Vârstă minimă"
            value={`${course.min_age} ani`}
          />
        </div>
      </section>

      {/* Description */}
      {descriptionParagraphs.length > 0 ? (
        <Section id="despre" title="Despre curs">
          <div className="space-y-4 text-base leading-relaxed text-[#444]">
            {descriptionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Curriculum */}
      {course.curriculum.length > 0 ? (
        <Section id="programa" title="Programa">
          <div className="space-y-6">
            {course.curriculum.map((sec) => (
              <div
                key={sec.id}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8"
              >
                <h3 className="text-xl font-semibold text-[#0A0A0A]">
                  {sec.title}
                </h3>
                {sec.subtitle ? (
                  <p className="mt-1 text-sm text-[#666666]">{sec.subtitle}</p>
                ) : null}
                {sec.items.length > 0 ? (
                  <ul className="mt-4 space-y-2.5">
                    {sec.items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-start gap-3 text-[#444]"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#B8001F]" />
                        <span className="text-sm leading-relaxed">
                          {it.content}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Sessions */}
      {course.sessions.length > 0 ? (
        <Section id="sesiuni" title="Sesiuni programate">
          <div className="grid gap-4 sm:grid-cols-2">
            {course.sessions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-6"
              >
                <p className="text-lg font-semibold text-[#0A0A0A]">
                  {formatDateRange(s.start_date, s.end_date)}
                </p>
                {s.location ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#666666]">
                    <MapPin size={16} />
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
                  <p className="mt-3 text-sm text-[#444]">{s.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Trainers */}
      {course.trainers.length > 0 ? (
        <Section id="formatori" title="Formatori">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTrainers.concat(otherTrainers).map((t) => (
              <article
                key={t.id}
                className="overflow-hidden rounded-2xl bg-[#0A0A0A]"
              >
                <div className="relative h-72">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${t.photo})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    {t.is_featured ? (
                      <span className="mb-2 inline-block rounded-full bg-[#B8001F] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        Formator principal
                      </span>
                    ) : null}
                    <h3 className="text-lg font-bold">{t.name}</h3>
                    {t.credentials ? (
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#B8001F]">
                        {t.credentials}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-3 p-5 text-sm text-[#A0A0A0]">
                  {t.bio ? <p className="leading-relaxed">{t.bio}</p> : null}
                  {t.instagram_url ? (
                    <a
                      href={t.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-white hover:text-[#B8001F]"
                    >
                      <Instagram size={14} />
                      Instagram
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Audiences */}
      {course.audiences.length > 0 ? (
        <Section
          id="audienta"
          title={`Pentru cine este acest ${course.type === "workshop" ? "workshop" : "curs"}?`}
          icon={<Target size={20} />}
        >
          <div className="flex flex-wrap gap-3">
            {course.audiences.map((a) => (
              <span
                key={a.id}
                className="rounded-full border border-[#B8001F]/30 bg-[#B8001F]/10 px-4 py-2 text-sm font-medium text-[#B8001F]"
              >
                {a.label}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Requirements */}
      {Object.values(course.requirements_by_category).some(
        (arr) => arr.length > 0,
      ) ? (
        <Section id="cerinte" title="Cerințe">
          <div className="grid gap-6 sm:grid-cols-2">
            {(
              Object.entries(course.requirements_by_category) as [
                Enums<"requirement_category">,
                Array<{ id: string; label: string }>,
              ][]
            )
              .filter(([, arr]) => arr.length > 0)
              .map(([cat, arr]) => (
                <div
                  key={cat}
                  className="rounded-2xl border border-[#E5E5E5] bg-white p-6"
                >
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#B8001F]">
                    {CATEGORY_LABEL[cat]}
                  </h3>
                  <ul className="space-y-2">
                    {arr.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-start gap-2 text-sm text-[#444]"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-[#B8001F]"
                        />
                        <span>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </Section>
      ) : null}

      {/* Certifications */}
      {course.certifications.length > 0 ? (
        <Section
          id="certificari"
          title="Certificări"
          icon={<Award size={20} />}
        >
          <div className="space-y-4">
            {course.certifications.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-6"
              >
                <h3 className="font-semibold text-[#0A0A0A]">{c.name}</h3>
                {c.issuer ? (
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-[#B8001F]">
                    {c.issuer}
                  </p>
                ) : null}
                {c.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#444]">
                    {c.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Enrollment */}
      <Section
        id="inscriere"
        title="Formular de înscriere"
        icon={<Users size={20} />}
      >
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
          <aside className="space-y-3 rounded-2xl border border-[#E5E5E5] bg-white p-6 text-sm text-[#444]">
            <p className="text-xs uppercase tracking-wider text-[#B8001F] font-semibold">
              Ce urmează
            </p>
            <p>
              Trimiți formularul → te contactăm în maxim 24 ore → confirmăm
              locul și detaliile de plată.
            </p>
            {course.klarna_enabled ? (
              <p className="text-xs text-[#666666]">
                Posibilitatea de a achita în rate prin Klarna.
              </p>
            ) : null}
          </aside>
        </div>
      </Section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-4 sm:px-8 lg:px-16 mt-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6 flex items-center gap-2">
          {icon ? <span className="text-[#B8001F]">{icon}</span> : null}
          <h2 className="text-2xl font-bold text-[#0A0A0A] sm:text-3xl font-[family-name:var(--font-unbounded)]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#666666]">
        <span className="text-[#B8001F]">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-[#0A0A0A]">{value}</p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CalendarDays,
  ChevronLeft,
  GraduationCap,
  Image as ImageIcon,
  ListChecks,
  Target,
  Users,
} from "lucide-react";

import { CourseCoreForm } from "@/components/admin/products/CourseCoreForm";
import {
  SectionGrid,
  type SectionGridItem,
} from "@/components/admin/products/SectionGrid";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function ProductMasterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!course) notFound();

  const [sessions, sections, trainers, reqs, certs, auds] = await Promise.all([
    supabase
      .from("course_sessions")
      .select("id", { count: "exact", head: true })
      .eq("course_id", id),
    supabase
      .from("curriculum_sections")
      .select("id", { count: "exact", head: true })
      .eq("course_id", id),
    supabase
      .from("course_trainers")
      .select("trainer_id", { count: "exact", head: true })
      .eq("course_id", id),
    supabase
      .from("course_requirements")
      .select("requirement_id", { count: "exact", head: true })
      .eq("course_id", id),
    supabase
      .from("course_certifications")
      .select("certification_id", { count: "exact", head: true })
      .eq("course_id", id),
    supabase
      .from("course_audiences")
      .select("audience_id", { count: "exact", head: true })
      .eq("course_id", id),
  ]);

  const items: SectionGridItem[] = [
    {
      href: `/admin/products/${id}/sessions`,
      label: "Sesiuni",
      count: sessions.count ?? 0,
      icon: CalendarDays,
      hint: "date, locații",
    },
    {
      href: `/admin/products/${id}/curriculum`,
      label: "Programa",
      count: sections.count ?? 0,
      icon: GraduationCap,
      hint: "secțiuni & bullets",
    },
    {
      href: `/admin/products/${id}/trainers`,
      label: "Formatori",
      count: trainers.count ?? 0,
      icon: Users,
    },
    {
      href: `/admin/products/${id}/requirements`,
      label: "Cerințe",
      count: reqs.count ?? 0,
      icon: ListChecks,
    },
    {
      href: `/admin/products/${id}/certifications`,
      label: "Certificări",
      count: certs.count ?? 0,
      icon: Award,
    },
    {
      href: `/admin/products/${id}/audiences`,
      label: "Audiență",
      count: auds.count ?? 0,
      icon: Target,
    },
    {
      href: `/admin/products/${id}/images`,
      label: "Imagini",
      count:
        (course.cover_image_path ? 1 : 0) +
        (course.hero_image_path ? 1 : 0),
      icon: ImageIcon,
      hint: "cover & hero",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Cursuri & Workshops
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
        <p className="text-xs text-muted-foreground">{course.slug}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <CourseCoreForm course={course} />
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Conținut asociat
          </p>
          <SectionGrid items={items} />
        </div>
      </div>
    </div>
  );
}

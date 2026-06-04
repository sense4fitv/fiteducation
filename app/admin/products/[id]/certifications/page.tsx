import { notFound } from "next/navigation";

import { setCourseCertification } from "@/app/admin/products/_actions";
import {
  PivotPicker,
  type PivotOption,
} from "@/components/admin/products/PivotPicker";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function CourseCertificationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: all }, { data: pivot }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", id).maybeSingle(),
    supabase.from("certifications").select("*").order("name"),
    supabase
      .from("course_certifications")
      .select("certification_id")
      .eq("course_id", id),
  ]);
  if (!course) notFound();

  const attachedSet = new Set((pivot ?? []).map((p) => p.certification_id));
  const available: PivotOption[] = [];
  const attached: PivotOption[] = [];
  for (const c of all ?? []) {
    const opt: PivotOption = {
      id: c.id,
      label: c.name,
      meta: c.issuer ?? undefined,
    };
    (attachedSet.has(c.id) ? attached : available).push(opt);
  }

  async function toggle(certId: string, on: boolean) {
    "use server";
    await setCourseCertification(id, certId, on);
  }

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Certificări"
      />
      <PivotPicker
        available={available}
        attached={attached}
        onToggle={toggle}
      />
    </div>
  );
}

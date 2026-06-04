import { notFound } from "next/navigation";

import { setCourseAudience } from "@/app/admin/products/_actions";
import {
  PivotPicker,
  type PivotOption,
} from "@/components/admin/products/PivotPicker";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function CourseAudiencesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: all }, { data: pivot }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", id).maybeSingle(),
    supabase.from("audiences").select("*").order("label"),
    supabase
      .from("course_audiences")
      .select("audience_id")
      .eq("course_id", id),
  ]);
  if (!course) notFound();

  const attachedSet = new Set((pivot ?? []).map((p) => p.audience_id));
  const available: PivotOption[] = [];
  const attached: PivotOption[] = [];
  for (const a of all ?? []) {
    const opt: PivotOption = { id: a.id, label: a.label };
    (attachedSet.has(a.id) ? attached : available).push(opt);
  }

  async function toggle(audId: string, on: boolean) {
    "use server";
    await setCourseAudience(id, audId, on);
  }

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Audiență"
        description="Pentru cine este acest curs / workshop."
      />
      <PivotPicker
        available={available}
        attached={attached}
        onToggle={toggle}
      />
    </div>
  );
}

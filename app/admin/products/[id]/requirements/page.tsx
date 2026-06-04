import { notFound } from "next/navigation";

import { setCourseRequirement } from "@/app/admin/products/_actions";
import {
  PivotPicker,
  type PivotOption,
} from "@/components/admin/products/PivotPicker";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  inscriere: "Înscriere",
  acte: "Acte",
  participare: "Participare",
  examen: "Examen",
};

export default async function CourseRequirementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: all }, { data: pivot }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", id).maybeSingle(),
    supabase
      .from("requirements")
      .select("id, label, category, sort_order")
      .order("category")
      .order("sort_order"),
    supabase
      .from("course_requirements")
      .select("requirement_id")
      .eq("course_id", id),
  ]);
  if (!course) notFound();

  const attachedSet = new Set((pivot ?? []).map((p) => p.requirement_id));
  const available: PivotOption[] = [];
  const attached: PivotOption[] = [];
  for (const r of all ?? []) {
    const opt: PivotOption = {
      id: r.id,
      label: r.label,
      meta: CATEGORY_LABEL[r.category] ?? r.category,
    };
    (attachedSet.has(r.id) ? attached : available).push(opt);
  }

  async function toggle(reqId: string, on: boolean) {
    "use server";
    await setCourseRequirement(id, reqId, on);
  }

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Cerințe"
        description="Cerințele apar pe pagina de produs grupate pe categorii."
      />
      <PivotPicker
        available={available}
        attached={attached}
        onToggle={toggle}
      />
    </div>
  );
}

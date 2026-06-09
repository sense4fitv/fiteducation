import { notFound } from "next/navigation";

import {
  CurriculumManager,
  type SectionWithItems,
} from "@/components/admin/products/CurriculumManager";
import { SkillsDescriptionForm } from "@/components/admin/products/SkillsDescriptionForm";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function CourseCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: sections }, { data: items }] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id, title, skills_description")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("curriculum_sections")
        .select("*")
        .eq("course_id", id)
        .order("sort_order"),
      supabase
        .from("curriculum_items")
        .select(
          "id, section_id, content, sort_order, curriculum_sections!inner(course_id)",
        )
        .eq("curriculum_sections.course_id", id)
        .order("sort_order"),
    ]);
  if (!course) notFound();

  const itemsBySection = new Map<string, typeof items>();
  for (const it of items ?? []) {
    const arr = itemsBySection.get(it.section_id) ?? [];
    arr.push(it);
    itemsBySection.set(it.section_id, arr);
  }

  const withItems: SectionWithItems[] = (sections ?? []).map((s) => ({
    ...s,
    items: (itemsBySection.get(s.id) ?? []).map(
      ({ id, section_id, content, sort_order }) => ({
        id,
        section_id,
        content,
        sort_order,
      }),
    ),
  }));

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Programa"
        description="Secțiuni și bullet-uri. Folosește săgețile pentru a reordona."
      />
      <SkillsDescriptionForm
        courseId={id}
        initialValue={course.skills_description}
      />
      <CurriculumManager courseId={id} sections={withItems} />
    </div>
  );
}

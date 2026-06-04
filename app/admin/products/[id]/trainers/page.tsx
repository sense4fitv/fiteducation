import { notFound } from "next/navigation";

import {
  CourseTrainersManager,
  type AttachedTrainer,
  type TrainerLite,
} from "@/components/admin/products/CourseTrainersManager";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";
import { TRAINER_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function CourseTrainersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: all }, { data: pivot }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", id).maybeSingle(),
    supabase
      .from("trainers")
      .select("id, name, slug, photo_path")
      .order("name"),
    supabase
      .from("course_trainers")
      .select("trainer_id, role, is_featured, sort_order")
      .eq("course_id", id),
  ]);
  if (!course) notFound();

  const attachedMap = new Map(
    (pivot ?? []).map((p) => [p.trainer_id, p] as const),
  );
  const available: TrainerLite[] = [];
  const attached: AttachedTrainer[] = [];
  for (const t of all ?? []) {
    const photo_url = publicUrl(TRAINER_BUCKET, t.photo_path);
    const meta = attachedMap.get(t.id);
    if (meta) {
      attached.push({
        id: t.id,
        name: t.name,
        slug: t.slug,
        photo_url,
        role: meta.role,
        is_featured: meta.is_featured,
        sort_order: meta.sort_order,
      });
    } else {
      available.push({ id: t.id, name: t.name, slug: t.slug, photo_url });
    }
  }
  attached.sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Formatori"
        description="Featured = afișați direct pe pagina cursului; restul în carusel."
      />
      <CourseTrainersManager
        courseId={id}
        available={available}
        attached={attached}
      />
    </div>
  );
}

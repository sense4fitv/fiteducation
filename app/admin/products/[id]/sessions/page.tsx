import { notFound } from "next/navigation";

import { SessionsManager } from "@/components/admin/products/SessionsManager";
import { SubrouteHeader } from "@/components/admin/products/SubrouteHeader";
import { assertAdmin } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export default async function CourseSessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: course }, { data: sessions }, { data: locations }] =
    await Promise.all([
      supabase.from("courses").select("id, title").eq("id", id).maybeSingle(),
      supabase
        .from("course_sessions")
        .select("*")
        .eq("course_id", id)
        .order("sort_order")
        .order("start_date", { nullsFirst: false }),
      supabase.from("locations").select("*").order("name"),
    ]);
  if (!course) notFound();

  return (
    <div className="space-y-6 p-6">
      <SubrouteHeader
        courseId={id}
        courseTitle={course.title}
        title="Sesiuni"
      />
      <SessionsManager
        courseId={id}
        items={sessions ?? []}
        locations={locations ?? []}
      />
    </div>
  );
}

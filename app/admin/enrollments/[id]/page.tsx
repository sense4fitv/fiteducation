import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { EnrollmentForm } from "@/components/admin/enrollments/EnrollmentForm";
import { Badge } from "@/components/ui/badge";
import { assertAdmin } from "@/lib/supabase/guards";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EditEnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const [{ data: enrollment }, { data: courses }, { data: sessions }] =
    await Promise.all([
      supabase
        .from("enrollments")
        .select("*")
        .eq("id", id)
        .maybeSingle(),
      supabase.from("courses").select("id, title, currency").order("title"),
      supabase
        .from("course_sessions")
        .select("id, course_id, start_date, end_date")
        .order("start_date", { nullsFirst: false }),
    ]);
  if (!enrollment) notFound();

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/enrollments"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Înscrieri
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {enrollment.full_name}
          </h1>
          {enrollment.created_by_admin ? (
            <Badge variant="outline">Adăugată manual</Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Creată {formatDate(enrollment.created_at)}
          </span>
        </div>
      </div>

      <div className="max-w-4xl">
        <EnrollmentForm
          mode="edit"
          initial={enrollment}
          courses={courses ?? []}
          sessions={sessions ?? []}
        />
      </div>
    </div>
  );
}

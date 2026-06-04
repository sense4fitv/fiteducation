import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { EnrollmentForm } from "@/components/admin/enrollments/EnrollmentForm";
import { assertAdmin } from "@/lib/supabase/guards";

export const metadata = { title: "Înscriere manuală · Admin FitEducation" };
export const dynamic = "force-dynamic";

export default async function NewEnrollmentPage() {
  const { supabase } = await assertAdmin();
  const [{ data: courses }, { data: sessions }] = await Promise.all([
    supabase.from("courses").select("id, title, currency").order("title"),
    supabase
      .from("course_sessions")
      .select("id, course_id, start_date, end_date")
      .order("start_date", { nullsFirst: false }),
  ]);

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
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Înscriere manuală
          </h1>
          <p className="text-sm text-muted-foreground">
            Pentru cursanți care s-au înscris offline (cash, transfer, sau prin alt canal).
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <EnrollmentForm
          mode="create"
          courses={courses ?? []}
          sessions={sessions ?? []}
        />
      </div>
    </div>
  );
}

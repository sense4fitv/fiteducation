import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { TrainerCoreForm } from "@/components/admin/trainers/TrainerCoreForm";
import { assertAdmin } from "@/lib/supabase/guards";

export const metadata = { title: "Trainer nou · Admin FitEducation" };

export default async function NewTrainerPage() {
  await assertAdmin();

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/trainers"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Traineri
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Trainer nou</h1>
          <p className="text-sm text-muted-foreground">
            Datele de bază. Imaginea se poate adăuga după salvare.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <TrainerCoreForm mode="create" />
      </div>
    </div>
  );
}

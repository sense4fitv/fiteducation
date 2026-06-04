import Link from "next/link";
import { Plus } from "lucide-react";

import { TrainersList } from "@/components/admin/trainers/TrainersList";
import { Button } from "@/components/ui/button";
import { assertAdmin } from "@/lib/supabase/guards";
import { TRAINER_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const metadata = { title: "Traineri · Admin FitEducation" };

export default async function AdminTrainersPage() {
  const { supabase } = await assertAdmin();

  const [{ data: trainers }, { data: pivots }] = await Promise.all([
    supabase
      .from("trainers")
      .select("id, name, slug, instagram_url, photo_path")
      .order("name"),
    supabase.from("course_trainers").select("trainer_id"),
  ]);

  const counts = new Map<string, number>();
  for (const p of pivots ?? []) {
    counts.set(p.trainer_id, (counts.get(p.trainer_id) ?? 0) + 1);
  }

  const items = (trainers ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    instagram_url: t.instagram_url,
    photo_url: publicUrl(TRAINER_BUCKET, t.photo_path),
    courses_count: counts.get(t.id) ?? 0,
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Traineri</h1>
          <p className="text-sm text-muted-foreground">
            Echipa de formatori, atașată cursurilor prin {""}
            <Link
              href="/admin/products"
              className="text-primary hover:underline"
            >
              Cursuri & Workshops
            </Link>
            .
          </p>
        </div>
        <Button render={<Link href="/admin/trainers/new" />}>
          <Plus />
          Trainer nou
        </Button>
      </div>

      <TrainersList items={items} />
    </div>
  );
}

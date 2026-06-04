import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import {
  removeTrainerPhoto,
  uploadTrainerPhoto,
} from "@/app/admin/trainers/_actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TrainerCoreForm } from "@/components/admin/trainers/TrainerCoreForm";
import { assertAdmin } from "@/lib/supabase/guards";
import { TRAINER_BUCKET, publicUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function EditTrainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await assertAdmin();

  const { data: trainer } = await supabase
    .from("trainers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!trainer) notFound();

  const photoUrl = publicUrl(TRAINER_BUCKET, trainer.photo_path);

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
        <h1 className="text-2xl font-semibold tracking-tight">
          {trainer.name}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <TrainerCoreForm initial={trainer} mode="edit" />

        <div className="space-y-4">
          <ImageUploader
            entityId={trainer.id}
            currentUrl={photoUrl}
            uploadAction={uploadTrainerPhoto}
            removeAction={removeTrainerPhoto}
            label="Fotografie"
            hint="Format pătrat recomandat (1:1). Max 5 MB."
          />
        </div>
      </div>
    </div>
  );
}

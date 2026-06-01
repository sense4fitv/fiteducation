import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TrainerForm from "@/components/admin/TrainerForm";

interface EditTrainerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTrainerPage({ params }: EditTrainerPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trainer, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !trainer) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Edit Trainer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update trainer profile
        </p>
      </div>
      <TrainerForm
        trainer={{
          id: trainer.id,
          name: trainer.name,
          description: trainer.description ?? null,
          image_url: trainer.image_url ?? null,
          sort_order: trainer.sort_order ?? null,
        }}
      />
    </div>
  );
}

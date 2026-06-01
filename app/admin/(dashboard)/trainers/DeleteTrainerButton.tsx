"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DeleteTrainerButtonProps {
  trainerId: string;
  trainerName: string;
}

export default function DeleteTrainerButton({
  trainerId,
  trainerName,
}: DeleteTrainerButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Are you sure you want to delete "${trainerName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("trainers")
      .delete()
      .eq("id", trainerId);

    if (error) {
      alert(`Failed to delete trainer: ${error.message}`);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={13} />
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Trainer {
  id: string;
  name: string;
  image_url: string | null;
}

interface TrainerAssignment {
  trainer_id: string;
  sort_order: number;
}

interface ProductTrainerPickerProps {
  value: TrainerAssignment[];
  onChange: (value: TrainerAssignment[]) => void;
}

export default function ProductTrainerPicker({
  value,
  onChange,
}: ProductTrainerPickerProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("trainers")
        .select("id, name, image_url")
        .order("sort_order");

      setTrainers(data ?? []);
      setLoading(false);
    }
    fetchTrainers();
  }, []);

  const selectedIds = new Set(value.map((v) => v.trainer_id));

  function toggleTrainer(trainerId: string) {
    if (selectedIds.has(trainerId)) {
      onChange(value.filter((v) => v.trainer_id !== trainerId));
    } else {
      onChange([...value, { trainer_id: trainerId, sort_order: value.length }]);
    }
  }

  function updateSortOrder(trainerId: string, sortOrder: number) {
    onChange(
      value.map((v) =>
        v.trainer_id === trainerId ? { ...v, sort_order: sortOrder } : v
      )
    );
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-4">Loading trainers...</div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        No trainers found. Add trainers first.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trainers.map((trainer) => {
        const isSelected = selectedIds.has(trainer.id);
        const assignment = value.find((v) => v.trainer_id === trainer.id);

        return (
          <div
            key={trainer.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              isSelected
                ? "border-[#B8001F]/30 bg-red-50/50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleTrainer(trainer.id)}
              className="h-4 w-4 rounded border-gray-300 text-[#B8001F] focus:ring-[#B8001F]"
            />

            {trainer.image_url ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={trainer.image_url}
                  alt={trainer.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            )}

            <span className="text-sm font-medium text-gray-700 flex-1">
              {trainer.name}
            </span>

            {isSelected && (
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-500">Order:</Label>
                <Input
                  type="number"
                  value={assignment?.sort_order ?? 0}
                  onChange={(e) =>
                    updateSortOrder(trainer.id, parseInt(e.target.value, 10) || 0)
                  }
                  className="w-16 h-7 px-2 py-1 text-xs"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

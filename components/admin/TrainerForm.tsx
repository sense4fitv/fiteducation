"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

interface TrainerFormProps {
  trainer?: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    sort_order: number | null;
  };
}

export default function TrainerForm({ trainer }: TrainerFormProps) {
  const router = useRouter();
  const isEdit = Boolean(trainer);

  const [name, setName] = useState(trainer?.name ?? "");
  const [description, setDescription] = useState(trainer?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(trainer?.image_url ?? null);
  const [sortOrder, setSortOrder] = useState<string>(
    trainer?.sort_order != null ? String(trainer.sort_order) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      image_url: imageUrl || null,
      sort_order: sortOrder !== "" ? parseInt(sortOrder, 10) : null,
    };

    try {
      const supabase = createClient();

      if (isEdit && trainer) {
        const { error: updateError } = await supabase
          .from("trainers")
          .update(payload)
          .eq("id", trainer.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("trainers")
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;
      }

      router.push("/admin/trainers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trainer.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 font-poppins mb-6">
        {isEdit ? "Edit Trainer" : "Add Trainer"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent"
            placeholder="Trainer name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent resize-y"
            placeholder="Short bio or description"
          />
        </div>

        {/* Image */}
        <div>
          <ImageUpload
            bucket="trainer-images"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Trainer Photo"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label
            htmlFor="sort_order"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort Order
          </label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent"
            placeholder="e.g. 1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Link
            href="/admin/trainers"
            className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2 bg-[#B8001F] text-white text-sm font-medium rounded-lg hover:bg-[#9a0019] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
}

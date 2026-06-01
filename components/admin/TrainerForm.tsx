"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {isEdit ? "Edit Trainer" : "Add Trainer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trainer name"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short bio or description"
              className="mt-1 resize-y"
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
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="e.g. 1"
              className="mt-1"
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
            <Button variant="outline" render={<Link href="/admin/trainers" />}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Trainer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

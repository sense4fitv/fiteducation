import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import DeleteTrainerButton from "./DeleteTrainerButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TrainersPage() {
  const supabase = await createClient();

  const { data: trainers, error } = await supabase
    .from("trainers")
    .select("*")
    .order("sort_order");

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        Failed to load trainers: {error.message}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Trainers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your trainer profiles
          </p>
        </div>
        <Button render={<Link href="/admin/trainers/new" />}>
          <Plus size={16} />
          Add Trainer
        </Button>
      </div>

      {/* Empty state */}
      {(!trainers || trainers.length === 0) ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No trainers yet.</p>
          <Button className="mt-4" render={<Link href="/admin/trainers/new" />}>
            <Plus size={16} />
            Add your first trainer
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden sm:table-cell">Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  {/* Image */}
                  <TableCell>
                    {trainer.image_url ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={trainer.image_url}
                          alt={trainer.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      {trainer.name}
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <span className="text-gray-500 line-clamp-2">
                      {trainer.description
                        ? trainer.description.length > 100
                          ? trainer.description.slice(0, 100) + "..."
                          : trainer.description
                        : <span className="italic text-gray-400">&mdash;</span>}
                    </span>
                  </TableCell>

                  {/* Sort Order */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-gray-500">
                      {trainer.sort_order != null ? trainer.sort_order : "\u2014"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/admin/trainers/${trainer.id}`} />}
                      >
                        <Pencil size={13} />
                        Edit
                      </Button>
                      <DeleteTrainerButton trainerId={trainer.id} trainerName={trainer.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import DeleteTrainerButton from "./DeleteTrainerButton";

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
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">
            Trainers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your trainer profiles
          </p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8001F] text-white text-sm font-medium rounded-lg hover:bg-[#9a0019] transition-colors"
        >
          <Plus size={16} />
          Add Trainer
        </Link>
      </div>

      {/* Empty state */}
      {(!trainers || trainers.length === 0) ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No trainers yet.</p>
          <Link
            href="/admin/trainers/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#B8001F] text-white text-sm font-medium rounded-lg hover:bg-[#9a0019] transition-colors"
          >
            <Plus size={16} />
            Add your first trainer
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {trainer.name}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 hidden md:table-cell max-w-xs">
                    <span className="text-sm text-gray-500 line-clamp-2">
                      {trainer.description
                        ? trainer.description.length > 100
                          ? trainer.description.slice(0, 100) + "…"
                          : trainer.description
                        : <span className="italic text-gray-400">—</span>}
                    </span>
                  </td>

                  {/* Sort Order */}
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="text-sm text-gray-500">
                      {trainer.sort_order != null ? trainer.sort_order : "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/trainers/${trainer.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>
                      <DeleteTrainerButton trainerId={trainer.id} trainerName={trainer.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

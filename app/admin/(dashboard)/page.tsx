import { createClient } from "@/lib/supabase/server";
import { Package, Users, GraduationCap, BookOpen } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: publishedProducts },
    { count: totalTrainers },
    { count: totalEnrollments },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("trainers").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Products", value: totalProducts ?? 0, icon: Package, sub: "courses & workshops" },
    { label: "Published", value: publishedProducts ?? 0, icon: BookOpen, sub: "visible to visitors" },
    { label: "Trainers", value: totalTrainers ?? 0, icon: Users, sub: "active profiles" },
    { label: "Enrollments", value: totalEnrollments ?? 0, icon: GraduationCap, sub: "total sign-ups" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-5 flex items-start gap-4"
          >
            <div className="p-2.5 rounded-md bg-gray-100 text-gray-600">
              <stat.icon size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-0.5 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

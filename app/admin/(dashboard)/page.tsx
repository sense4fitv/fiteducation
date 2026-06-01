import { createClient } from "@/lib/supabase/server";
import { Package, Users, GraduationCap, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent-primary/10 rounded-lg text-accent-primary shrink-0">
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-text-secondary-light">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-text-primary-light font-poppins">
          {value}
        </p>
        {description && (
          <p className="text-xs text-text-secondary-light mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary-light font-poppins">
          Dashboard
        </h1>
        <p className="text-text-secondary-light text-sm mt-1">
          Overview of your platform
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={totalProducts ?? 0}
          icon={<Package size={20} />}
        />
        <StatCard
          title="Published Products"
          value={publishedProducts ?? 0}
          icon={<BookOpen size={20} />}
          description="Visible to visitors"
        />
        <StatCard
          title="Trainers"
          value={totalTrainers ?? 0}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Enrollments"
          value={totalEnrollments ?? 0}
          icon={<GraduationCap size={20} />}
        />
      </div>
    </div>
  );
}

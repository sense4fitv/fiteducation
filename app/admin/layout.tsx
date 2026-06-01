import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Auth guard — must be logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Role guard — must be admin
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleRow || roleRow.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#F4F4F5]">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

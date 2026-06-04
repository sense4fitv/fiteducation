import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin · FitEducation",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <>
      <AdminShell email={user.email ?? ""}>{children}</AdminShell>
      <Toaster richColors theme="dark" position="top-center" />
    </>
  );
}

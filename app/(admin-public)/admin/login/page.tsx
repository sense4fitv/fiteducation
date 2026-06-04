import { Suspense } from "react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin · FitEducation",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) redirect("/admin");
  }

  return (
    <div className="dark admin-surface flex min-h-screen items-center justify-center px-4 text-foreground">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Toaster richColors theme="dark" position="top-center" />
    </div>
  );
}

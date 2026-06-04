import { assertAdmin } from "@/lib/supabase/guards";

import { LibraryClient } from "@/components/admin/library/LibraryClient";

export const metadata = {
  title: "Bibliotecă · Admin FitEducation",
};

export default async function AdminLibraryPage() {
  const { supabase } = await assertAdmin();

  const [reqs, certs, auds] = await Promise.all([
    supabase
      .from("requirements")
      .select("*")
      .order("category")
      .order("sort_order"),
    supabase.from("certifications").select("*").order("name"),
    supabase.from("audiences").select("*").order("label"),
  ]);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Bibliotecă</h1>
        <p className="text-sm text-muted-foreground">
          Cerințe, certificări și audiențe partajate între cursuri și
          workshopuri.
        </p>
      </div>

      <LibraryClient
        requirements={reqs.data ?? []}
        certifications={certs.data ?? []}
        audiences={auds.data ?? []}
      />
    </div>
  );
}

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { NewProductForm } from "@/components/admin/products/NewProductForm";
import { assertAdmin } from "@/lib/supabase/guards";

export const metadata = { title: "Produs nou · Admin FitEducation" };

export default async function NewProductPage() {
  await assertAdmin();
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Cursuri & Workshops
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Produs nou</h1>
          <p className="text-sm text-muted-foreground">
            Datele minime pentru a crea draft-ul. Restul se completează apoi.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <NewProductForm />
      </div>
    </div>
  );
}

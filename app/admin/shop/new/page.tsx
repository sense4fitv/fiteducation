import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { NewShopProductForm } from "@/components/admin/shop/NewShopProductForm";
import { assertAdmin } from "@/lib/supabase/guards";

export const metadata = { title: "Produs nou · Magazin · Admin FitEducation" };

export default async function NewShopProductPage() {
  await assertAdmin();
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/shop"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Magazin
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Produs nou</h1>
          <p className="text-sm text-muted-foreground">
            Produsul se creează ca draft. Fotografiile și variantele se adaugă
            după.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <NewShopProductForm />
      </div>
    </div>
  );
}

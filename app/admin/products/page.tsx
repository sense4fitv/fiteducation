import Link from "next/link";
import { Plus } from "lucide-react";

import { ProductsFilters } from "@/components/admin/products/ProductsFilters";
import { ProductsList } from "@/components/admin/products/ProductsList";
import { Button } from "@/components/ui/button";
import { assertAdmin } from "@/lib/supabase/guards";
import type { Enums } from "@/lib/supabase/types";

export const metadata = { title: "Cursuri & Workshops · Admin FitEducation" };

type SP = { type?: string; status?: string };

const TYPES: Enums<"course_type">[] = ["curs_acreditat", "workshop"];
const STATUSES: Enums<"course_status">[] = ["draft", "published", "archived"];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { supabase } = await assertAdmin();

  let query = supabase
    .from("courses")
    .select(
      "id, slug, title, type, status, price_amount, currency, updated_at",
    )
    .order("updated_at", { ascending: false });

  const typeFilter = TYPES.find((t) => t === sp.type);
  if (typeFilter) query = query.eq("type", typeFilter);
  const statusFilter = STATUSES.find((s) => s === sp.status);
  if (statusFilter) query = query.eq("status", statusFilter);

  const [{ data: courses }, { data: sessions }] = await Promise.all([
    query,
    supabase.from("course_sessions").select("course_id"),
  ]);

  const counts = new Map<string, number>();
  for (const s of sessions ?? []) {
    counts.set(s.course_id, (counts.get(s.course_id) ?? 0) + 1);
  }

  const items = (courses ?? []).map((c) => ({
    ...c,
    sessions_count: counts.get(c.id) ?? 0,
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cursuri & Workshops
          </h1>
          <p className="text-sm text-muted-foreground">
            Toate produsele: 2 cursuri acreditate, 6 workshopuri.
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          <Plus />
          Produs nou
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductsFilters />
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "rezultat" : "rezultate"}
        </p>
      </div>

      <ProductsList items={items} />
    </div>
  );
}

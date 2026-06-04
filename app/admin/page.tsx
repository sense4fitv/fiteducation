import Link from "next/link";
import {
  AlertCircle,
  ClipboardList,
  GraduationCap,
  Package,
  Receipt,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { assertAdmin } from "@/lib/supabase/guards";
import { formatDate, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type Stat = {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  icon: typeof Package;
};

export default async function AdminDashboardPage() {
  const { supabase, user } = await assertAdmin();

  const [
    coursesTotal,
    coursesDraft,
    coursesPublished,
    workshopsCount,
    trainersCount,
    enrollNew,
    enrollUnpaid,
    enrollTotal,
    recentEnrollments,
  ] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("type", "workshop"),
    supabase.from("trainers").select("id", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "nou"),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .is("paid_at", null)
      .neq("status", "anulat"),
    supabase.from("enrollments").select("id", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select(
        "id, full_name, status, paid_amount, paid_currency, created_at, courses!inner(title)",
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const contentStats: Stat[] = [
    {
      label: "Produse total",
      value: coursesTotal.count ?? 0,
      hint: `${coursesDraft.count ?? 0} draft · ${coursesPublished.count ?? 0} publicat`,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Workshopuri",
      value: workshopsCount.count ?? 0,
      href: "/admin/products?type=workshop",
      icon: GraduationCap,
    },
    {
      label: "Traineri",
      value: trainersCount.count ?? 0,
      href: "/admin/trainers",
      icon: Users,
    },
  ];

  const opsStats: Stat[] = [
    {
      label: "Înscrieri totale",
      value: enrollTotal.count ?? 0,
      href: "/admin/enrollments",
      icon: ClipboardList,
    },
    {
      label: "Necontactate",
      value: enrollNew.count ?? 0,
      hint: "status = nou",
      href: "/admin/enrollments?status=nou",
      icon: AlertCircle,
    },
    {
      label: "Neplătite",
      value: enrollUnpaid.count ?? 0,
      hint: "fără paid_at, nu anulat",
      href: "/admin/enrollments",
      icon: Receipt,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bun venit{user.email ? `, ${user.email}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          O privire rapidă peste conținutul site-ului și înscrierile recente.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Conținut
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contentStats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Operare
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {opsStats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Înscrieri recente
          </h2>
          <Link
            href="/admin/enrollments"
            className="text-xs text-primary hover:underline"
          >
            Vezi toate →
          </Link>
        </div>
        {recentEnrollments.data && recentEnrollments.data.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {recentEnrollments.data.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/admin/enrollments/${e.id}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm font-medium">
                      {e.full_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.courses?.title ?? "—"} · {formatDate(e.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.paid_amount != null && e.paid_currency ? (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatPrice(e.paid_amount, e.paid_currency)}
                      </span>
                    ) : null}
                    <Badge
                      variant={e.status === "platit" ? "default" : "outline"}
                    >
                      {e.status}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nicio înscriere încă.
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const Wrapper = stat.href ? Link : "div";
  return (
    <Wrapper
      href={stat.href ?? "#"}
      className={`block rounded-lg border border-border bg-card p-4 transition-colors ${stat.href ? "hover:border-foreground/30 hover:bg-card/80" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
          {stat.hint ? (
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          ) : null}
        </div>
        <Icon className="size-4 text-muted-foreground" />
      </div>
    </Wrapper>
  );
}

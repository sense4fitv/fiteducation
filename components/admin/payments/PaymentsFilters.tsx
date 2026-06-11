"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CourseOption = { id: string; title: string };

export function PaymentsFilters({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const course = params?.get("course") ?? "all";
  const status = params?.get("status") ?? "all";

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (!value || value === "all" || value === "") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/admin/payments?${qs}` : "/admin/payments");
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 md:max-w-2xl">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Curs</Label>
        <Select value={course} onValueChange={(v) => setParam("course", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate cursurile</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={(v) => setParam("status", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate</SelectItem>
            <SelectItem value="pending">În așteptare</SelectItem>
            <SelectItem value="completed">Plătit</SelectItem>
            <SelectItem value="failed">Eșuat</SelectItem>
            <SelectItem value="refunded">Rambursat</SelectItem>
            <SelectItem value="expired">Expirat</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

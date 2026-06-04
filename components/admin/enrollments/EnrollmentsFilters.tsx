"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CourseOption = { id: string; title: string };

export function EnrollmentsFilters({
  courses,
}: {
  courses: CourseOption[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const course = params?.get("course") ?? "all";
  const status = params?.get("status") ?? "all";
  const method = params?.get("method") ?? "all";
  const from = params?.get("from") ?? "";
  const to = params?.get("to") ?? "";

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (!value || value === "all" || value === "") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/admin/enrollments?${qs}` : "/admin/enrollments");
  }

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
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
            <SelectItem value="nou">Nou</SelectItem>
            <SelectItem value="contactat">Contactat</SelectItem>
            <SelectItem value="confirmat">Confirmat</SelectItem>
            <SelectItem value="platit">Plătit</SelectItem>
            <SelectItem value="anulat">Anulat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Metodă plată</Label>
        <Select value={method} onValueChange={(v) => setParam("method", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="transfer">Transfer bancar</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="other">Altă metodă</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="ef-from" className="text-xs text-muted-foreground">
          De la
        </Label>
        <Input
          id="ef-from"
          type="date"
          value={from}
          onChange={(e) => setParam("from", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="ef-to" className="text-xs text-muted-foreground">
          Până la
        </Label>
        <Input
          id="ef-to"
          type="date"
          value={to}
          onChange={(e) => setParam("to", e.target.value)}
        />
      </div>
    </div>
  );
}

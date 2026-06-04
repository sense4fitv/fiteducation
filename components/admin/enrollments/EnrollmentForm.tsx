"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createEnrollment,
  updateEnrollment,
} from "@/app/admin/enrollments/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateRange } from "@/lib/format";
import type { Enums, Tables } from "@/lib/supabase/types";

type Enrollment = Tables<"enrollments">;
type Course = { id: string; title: string; currency: Enums<"currency_code"> };
type Session = {
  id: string;
  course_id: string;
  start_date: string | null;
  end_date: string | null;
};

const NONE = "__none__";

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EnrollmentForm({
  initial,
  mode,
  courses,
  sessions,
}: {
  initial?: Enrollment | null;
  mode: "create" | "edit";
  courses: Course[];
  sessions: Session[];
}) {
  const action = mode === "create" ? createEnrollment : updateEnrollment;

  const [courseId, setCourseId] = useState(initial?.course_id ?? courses[0]?.id ?? "");
  const [sessionId, setSessionId] = useState(initial?.session_id ?? NONE);
  const [status, setStatus] = useState<Enums<"enrollment_status">>(
    initial?.status ?? "nou",
  );
  const [paymentPlan, setPaymentPlan] = useState<string>(
    initial?.payment_plan ?? NONE,
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    initial?.payment_method ?? NONE,
  );
  const [paidCurrency, setPaidCurrency] = useState<string>(
    initial?.paid_currency ??
      courses.find((c) => c.id === courseId)?.currency ??
      "RON",
  );
  const [isPending, startTransition] = useTransition();

  const courseSessions = useMemo(
    () => sessions.filter((s) => s.course_id === courseId),
    [sessions, courseId],
  );

  function handleSubmit(fd: FormData) {
    fd.set("course_id", courseId);
    fd.set("session_id", sessionId === NONE ? "" : sessionId);
    fd.set("status", status);
    fd.set("payment_plan", paymentPlan === NONE ? "" : paymentPlan);
    fd.set("payment_method", paymentMethod === NONE ? "" : paymentMethod);
    fd.set("paid_currency", paidCurrency);
    startTransition(async () => {
      const result = await action(null, fd);
      if (result?.ok) toast.success("Salvat");
      else if (result && result.ok === false) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {mode === "edit" && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Cursant</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ef-name">Nume complet</Label>
            <Input
              id="ef-name"
              name="full_name"
              required
              defaultValue={initial?.full_name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ef-email">Email</Label>
            <Input
              id="ef-email"
              name="email"
              type="email"
              required
              defaultValue={initial?.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ef-phone">Telefon</Label>
            <Input
              id="ef-phone"
              name="phone"
              type="tel"
              required
              defaultValue={initial?.phone ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ef-msg">Mesaj (de la cursant)</Label>
            <Textarea
              id="ef-msg"
              name="message"
              rows={3}
              defaultValue={initial?.message ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Curs & sesiune</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Curs</Label>
            <Select
              value={courseId}
              onValueChange={(v) => {
                if (!v) return;
                setCourseId(v);
                setSessionId(NONE);
                setPaidCurrency(
                  courses.find((c) => c.id === v)?.currency ?? paidCurrency,
                );
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sesiune</Label>
            <Select
              value={sessionId}
              onValueChange={(v) => setSessionId(v ?? NONE)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Fără sesiune specifică</SelectItem>
                {courseSessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {formatDateRange(s.start_date, s.end_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Status înscriere</Label>
            <Select
              value={status}
              onValueChange={(v) =>
                v && setStatus(v as Enums<"enrollment_status">)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nou">Nou</SelectItem>
                <SelectItem value="contactat">Contactat</SelectItem>
                <SelectItem value="confirmat">Confirmat</SelectItem>
                <SelectItem value="platit">Plătit</SelectItem>
                <SelectItem value="anulat">Anulat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Plan de plată</Label>
            <Select
              value={paymentPlan}
              onValueChange={(v) => setPaymentPlan(v ?? NONE)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Neselectat</SelectItem>
                <SelectItem value="integral">Plată integrală</SelectItem>
                <SelectItem value="rate_klarna">Rate Klarna</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Plată</h3>
        <p className="text-xs text-muted-foreground">
          {'Setarea unei date de plată bumpează automat status-ul la „Plătit".'}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Metodă</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v ?? NONE)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Neplătit</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="transfer">Transfer bancar</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="other">Altă metodă</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ef-amount">Sumă plătită</Label>
            <Input
              id="ef-amount"
              name="paid_amount"
              type="number"
              step="0.01"
              min={0}
              defaultValue={initial?.paid_amount ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Monedă plată</Label>
            <Select
              value={paidCurrency}
              onValueChange={(v) => v && setPaidCurrency(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RON">RON</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ef-paid-at">Data plății</Label>
            <Input
              id="ef-paid-at"
              name="paid_at"
              type="datetime-local"
              defaultValue={toDatetimeLocal(initial?.paid_at ?? null)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ef-invoice">Număr factură / chitanță</Label>
            <Input
              id="ef-invoice"
              name="invoice_number"
              defaultValue={initial?.invoice_number ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Notițe interne</h3>
        <Textarea
          name="internal_notes"
          rows={4}
          defaultValue={initial?.internal_notes ?? ""}
          placeholder="Vizibile doar în admin."
        />
      </section>

      <input
        type="hidden"
        name="gdpr_accepted_at"
        value={initial?.gdpr_accepted_at ?? ""}
      />

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Se salvează…"
            : mode === "create"
              ? "Creează înscriere"
              : "Salvează modificări"}
        </Button>
      </div>
    </form>
  );
}

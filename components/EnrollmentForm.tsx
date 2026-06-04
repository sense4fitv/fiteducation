"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";

import { submitEnrollment } from "@/app/curs/[id]/_actions";
import { formatDateRange } from "@/lib/format";

type SessionOption = {
  id: string;
  start_date: string | null;
  end_date: string | null;
};

export default function EnrollmentForm({
  courseId,
  sessions,
  klarnaEnabled,
}: {
  courseId: string;
  sessions: SessionOption[];
  klarnaEnabled: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    setError(null);
    fd.set("course_id", courseId);
    startTransition(async () => {
      const result = await submitEnrollment(null, fd);
      if (result?.ok) {
        setSuccess(true);
      } else if (result && result.ok === false) {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-8 text-center text-white">
        <CheckCircle2 className="size-12 text-[#B8001F]" />
        <h3 className="text-xl font-bold">Mulțumim!</h3>
        <p className="text-sm text-[#A0A0A0]">
          Te vom contacta în maxim 24 de ore.
        </p>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="ef-name"
          name="full_name"
          label="Nume complet"
          required
        />
        <Field
          id="ef-email"
          name="email"
          label="Email"
          type="email"
          required
        />
        <Field
          id="ef-phone"
          name="phone"
          label="Telefon"
          type="tel"
          required
        />

        {sessions.length > 0 ? (
          <div className="space-y-1.5">
            <label
              htmlFor="ef-session"
              className="block text-xs font-medium text-[#A0A0A0]"
            >
              Sesiune
            </label>
            <select
              id="ef-session"
              name="session_id"
              defaultValue=""
              className="h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-white outline-none focus:border-[#B8001F]"
            >
              <option value="">Indiferent / urmează a fi anunțată</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDateRange(s.start_date, s.end_date)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="ef-msg"
          className="block text-xs font-medium text-[#A0A0A0]"
        >
          Mesaj (opțional)
        </label>
        <textarea
          id="ef-msg"
          name="message"
          rows={3}
          className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-white outline-none focus:border-[#B8001F]"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="ef-plan"
          className="block text-xs font-medium text-[#A0A0A0]"
        >
          Plan de plată
        </label>
        <select
          id="ef-plan"
          name="payment_plan"
          defaultValue=""
          className="h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-white outline-none focus:border-[#B8001F]"
        >
          <option value="">Voi decide ulterior</option>
          <option value="integral">Plată integrală</option>
          {klarnaEnabled ? (
            <option value="rate_klarna">Rate prin Klarna</option>
          ) : null}
        </select>
      </div>

      <label className="flex items-start gap-3 text-xs text-[#A0A0A0]">
        <input
          type="checkbox"
          name="gdpr"
          className="mt-0.5 size-4 rounded border-[#2A2A2A] bg-[#1A1A1A]"
          required
        />
        <span>
          Sunt de acord cu prelucrarea datelor personale conform politicii de
          confidențialitate.
        </span>
      </label>

      {error ? (
        <p className="rounded-lg border border-[#B8001F]/40 bg-[#B8001F]/10 px-3 py-2 text-sm text-[#ff6b7a]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#B8001F] px-6 py-4 font-semibold text-white transition-all hover:bg-[#490207] hover:shadow-lg hover:shadow-[#B8001F]/40 disabled:opacity-60"
      >
        {isPending ? "Se trimite…" : "Trimite înscrierea"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-[#A0A0A0]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-white outline-none focus:border-[#B8001F]"
      />
    </div>
  );
}

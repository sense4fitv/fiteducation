"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "fiteducation.cookie-consent.v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export default function CookieConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const hidden = pathname?.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, [hidden]);

  if (hidden) return null;

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {}
    setOpen(false);
  };

  const acceptAll = () =>
    save({
      necessary: true,
      analytics: true,
      marketing: true,
      decidedAt: new Date().toISOString(),
    });

  const rejectAll = () =>
    save({
      necessary: true,
      analytics: false,
      marketing: false,
      decidedAt: new Date().toISOString(),
    });

  const savePrefs = () =>
    save({
      necessary: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
    });

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-[1100px]">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(184,0,31,0.45),0_8px_30px_-12px_rgba(0,0,0,0.6)]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 100% 0%, rgba(184,0,31,0.7) 0%, transparent 55%)",
                }}
              />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#B8001F]/60 to-transparent" />

              <div className="relative p-5 sm:p-6">
                {!showPrefs ? (
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B8001F]/15 text-[#B8001F] ring-1 ring-[#B8001F]/30">
                      <Cookie size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-[family-name:var(--font-unbounded)] text-base sm:text-lg font-bold text-white">
                        Folosim cookie-uri
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        Folosim cookie-uri pentru a face site-ul să funcționeze
                        corect, pentru a analiza traficul și pentru a-ți oferi o
                        experiență mai bună. Poți accepta tot, refuza, sau
                        personaliza preferințele. Detalii în{" "}
                        <a
                          href="/politica-de-cookies"
                          className="text-white underline decoration-[#B8001F]/60 underline-offset-4 hover:decoration-[#B8001F]"
                        >
                          Politica de Cookies
                        </a>
                        .
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={acceptAll}
                          className="inline-flex items-center justify-center rounded-full bg-[#B8001F] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(184,0,31,0.7)] transition hover:bg-[#d4001f] hover:shadow-[0_10px_28px_-8px_rgba(184,0,31,0.85)]"
                        >
                          Accept tot
                        </button>
                        <button
                          onClick={rejectAll}
                          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/[0.08] hover:border-white/25"
                        >
                          Refuz
                        </button>
                        <button
                          onClick={() => setShowPrefs(true)}
                          className="inline-flex items-center justify-center rounded-full px-3 py-2.5 text-sm font-medium text-white/60 transition hover:text-white"
                        >
                          Personalizează
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-[family-name:var(--font-unbounded)] text-base sm:text-lg font-bold text-white">
                          Preferințe cookie-uri
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                          Alege ce categorii dorești să accepți.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPrefs(false)}
                        aria-label="Înapoi"
                        className="shrink-0 rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white transition"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      <PrefRow
                        title="Strict necesare"
                        description="Esențiale pentru funcționarea site-ului. Nu pot fi dezactivate."
                        checked
                        disabled
                      />
                      <PrefRow
                        title="Analiză și performanță"
                        description="Ne ajută să înțelegem cum este folosit site-ul și să-l îmbunătățim."
                        checked={analytics}
                        onChange={setAnalytics}
                      />
                      <PrefRow
                        title="Marketing"
                        description="Permit afișarea de conținut și anunțuri relevante pentru tine."
                        checked={marketing}
                        onChange={setMarketing}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={savePrefs}
                        className="inline-flex items-center justify-center rounded-full bg-[#B8001F] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(184,0,31,0.7)] transition hover:bg-[#d4001f]"
                      >
                        Salvează preferințele
                      </button>
                      <button
                        onClick={acceptAll}
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/[0.08]"
                      >
                        Accept tot
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PrefRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 ${
        disabled ? "opacity-80" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/55 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#B8001F]" : "bg-white/15"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

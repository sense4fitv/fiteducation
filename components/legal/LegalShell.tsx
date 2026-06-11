import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type LegalShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  updatedAt: string;
  children: React.ReactNode;
};

export default function LegalShell({
  eyebrow,
  title,
  subtitle,
  updatedAt,
  children,
}: LegalShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <header className="relative overflow-hidden border-b border-black/5 bg-gradient-to-br from-[#0A0A0A] via-[#1A0408] to-[#490207] text-white">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(184,0,31,0.4) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(184,0,31,0.25) 0%, transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
          {eyebrow ? (
            <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-[#B8001F] font-semibold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-[family-name:var(--font-unbounded)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          ) : null}
          <p className="mt-8 text-xs sm:text-sm text-white/50">
            Ultima actualizare:{" "}
            <span className="text-white/80 font-medium">{updatedAt}</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        <article className="legal-prose">{children}</article>
      </main>

      <Footer />
    </div>
  );
}

export function Section({
  number,
  title,
  children,
}: {
  number: number | string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 sm:mb-14 scroll-mt-24" id={`sectiunea-${number}`}>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-[family-name:var(--font-unbounded)] text-[#B8001F] text-sm sm:text-base font-bold tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="font-[family-name:var(--font-unbounded)] text-xl sm:text-2xl font-bold text-[#0A0A0A] leading-snug">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-[15px] sm:text-base leading-relaxed text-[#2A2A2A]">
        {children}
      </div>
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 text-sm sm:text-base font-semibold text-[#0A0A0A] tracking-tight">
      {children}
    </h3>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((it, i) => (
        <li key={i} className="relative pl-6 text-[#2A2A2A]">
          <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-[#B8001F]" />
          {it}
        </li>
      ))}
    </ul>
  );
}

export function ContactBox({
  email,
  phone,
  address,
}: {
  email: string;
  phone: string;
  address: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <dl className="grid gap-3 sm:grid-cols-3 text-sm">
        <div>
          <dt className="text-[#666] uppercase tracking-wider text-[11px] mb-1">
            Email
          </dt>
          <dd>
            <a
              href={`mailto:${email}`}
              className="text-[#0A0A0A] hover:text-[#B8001F] transition-colors font-medium break-all"
            >
              {email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-[#666] uppercase tracking-wider text-[11px] mb-1">
            Telefon
          </dt>
          <dd>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-[#0A0A0A] hover:text-[#B8001F] transition-colors font-medium"
            >
              {phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-[#666] uppercase tracking-wider text-[11px] mb-1">
            Adresă
          </dt>
          <dd className="text-[#0A0A0A]">{address}</dd>
        </div>
      </dl>
    </div>
  );
}

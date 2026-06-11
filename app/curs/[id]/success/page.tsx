import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="mx-auto max-w-[640px] px-4 sm:px-8 py-20 text-center">
        <div className="mx-auto mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[#B8001F]/10 text-[#B8001F]">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="text-3xl font-bold text-[#0A0A0A] sm:text-4xl font-[family-name:var(--font-unbounded)]">
          Plată confirmată
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#3A3A3A]">
          Mulțumim pentru achiziție! Un membru al echipei Fiteducation te va
          contacta în următoarele ore pentru a confirma detaliile și pașii
          următori. Vei primi de asemenea un email de confirmare la adresa
          furnizată.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/curs/${slug}`}
            className="inline-flex items-center justify-center rounded-full border border-[#0A0A0A]/15 bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] hover:bg-[#F4F4F4]"
          >
            Înapoi la curs
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#B8001F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#490207]"
          >
            Pagina principală
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

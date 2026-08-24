import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Comandă confirmată · Magazin Fiteducation" };

export default async function ShopSuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="mx-auto max-w-[640px] px-4 py-20 text-center sm:px-8">
        <div className="mx-auto mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[#B8001F]/10 text-[#B8001F]">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-bold text-[#0A0A0A] sm:text-4xl">
          Comandă confirmată
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#3A3A3A]">
          Mulțumim pentru comandă! Vei primi factura pe email în câteva minute.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#EAEAEA] bg-white p-5 text-left">
          <PackageCheck className="shrink-0 text-[#B8001F]" size={22} />
          <p className="text-sm leading-relaxed text-[#555]">
            <span className="font-semibold text-[#0A0A0A]">
              Ridicare la Sense4FIT Summit.
            </span>{" "}
            Te contactăm pentru a stabili momentul ridicării.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/magazin/${slug}`}
            className="inline-flex items-center justify-center rounded-full border border-[#0A0A0A]/15 bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] hover:bg-[#F4F4F4]"
          >
            Înapoi la produs
          </Link>
          <Link
            href="/magazin"
            className="inline-flex items-center justify-center rounded-full bg-[#B8001F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#490207]"
          >
            Vezi magazinul
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

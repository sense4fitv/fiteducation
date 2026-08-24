import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShopCard from "@/components/shop/ShopCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { listShopProducts } from "@/lib/supabase/queries/shop";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Magazin · Fiteducation School",
  description:
    "Echipament și produse Sense4FIT. Ridicare la Sense4FIT Summit.",
};

export default async function ShopPage() {
  const products = await listShopProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <div className="px-4 pb-2 pt-3 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 text-xs text-[#888]">
          <Link href="/" className="transition-colors hover:text-[#0A0A0A]">
            Acasă
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#0A0A0A]">Magazin</span>
        </div>
      </div>

      <section className="px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <h1 className="font-[family-name:var(--font-unbounded)] text-3xl font-bold text-[#0A0A0A] sm:text-4xl">
              Magazin
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#666]">
              Echipament selectat de echipa Sense4FIT. Comanzi online, ridici la
              Sense4FIT Summit.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-[#E0E0E0] bg-white p-16 text-center">
              <p className="text-sm text-[#888]">
                Momentan nu avem produse disponibile. Revino curând.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ShopCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-20" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

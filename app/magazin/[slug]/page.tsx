import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShopProductView from "@/components/shop/ShopProductView";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getShopProductBySlug } from "@/lib/supabase/queries/shop";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);
  if (!product) return { title: "Produs · Magazin Fiteducation" };
  return {
    title: `${product.name} · Magazin Fiteducation`,
    description:
      product.description?.slice(0, 160) ??
      `${product.name} — disponibil în magazinul Fiteducation.`,
  };
}

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);
  if (!product) notFound();

  const paragraphs = (product.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <div className="px-4 pb-2 pt-3 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 text-xs text-[#888]">
          <Link href="/" className="transition-colors hover:text-[#0A0A0A]">
            Acasă
          </Link>
          <ChevronRight size={14} />
          <Link
            href="/magazin"
            className="transition-colors hover:text-[#0A0A0A]"
          >
            Magazin
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#0A0A0A]">{product.name}</span>
        </div>
      </div>

      <section className="px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <ShopProductView product={product} />
        </div>
      </section>

      {paragraphs.length > 0 ? (
        <section className="mt-16 px-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 sm:p-10">
              <h2 className="font-[family-name:var(--font-unbounded)] text-xl font-bold text-[#0A0A0A]">
                Despre produs
              </h2>
              <div className="mt-5 max-w-3xl space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[15px] leading-relaxed text-[#555]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="h-20" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

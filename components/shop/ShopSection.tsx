"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import ShopCard from "@/components/shop/ShopCard";
import type { ShopProductSummary } from "@/lib/supabase/queries/shop";

export default function ShopSection({
  products,
}: {
  products: ShopProductSummary[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 4);
    // A 4px slack keeps the arrow from flickering on sub-pixel scroll positions.
    setAtEnd(rail.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    syncArrows();
    const rail = railRef.current;
    if (!rail) return;
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows]);

  function scrollByCard(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("[data-shop-card]");
    const step = card instanceof HTMLElement ? card.offsetWidth + 24 : 280;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section
      id="magazin"
      className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#B8001F]">
              Echipament
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-unbounded)] text-4xl font-bold text-[#0A0A0A] sm:text-5xl">
              Magazin
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#666] sm:text-lg">
              Echipament selectat de echipa Sense4FIT. Comanzi online, ridici la
              Sense4FIT Summit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                aria-label="Produsele anterioare"
                className="grid size-10 place-items-center rounded-full border border-[#E0E0E0] bg-white text-[#0A0A0A] transition-all hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#E0E0E0]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                aria-label="Produsele următoare"
                className="grid size-10 place-items-center rounded-full border border-[#E0E0E0] bg-white text-[#0A0A0A] transition-all hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#E0E0E0]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Link
              href="/magazin"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#B8001F]"
            >
              Vezi tot magazinul
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div
          ref={railRef}
          onScroll={syncArrows}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-shop-card
              className="w-[220px] shrink-0 snap-start sm:w-[240px] lg:w-[260px]"
            >
              <ShopCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

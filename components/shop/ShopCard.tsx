import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { DELIVERY_LABEL } from "@/lib/shop";
import type { ShopProductSummary } from "@/lib/supabase/queries/shop";

export default function ShopCard({ product }: { product: ShopProductSummary }) {
  const ranged = product.price_max > product.price_min;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D0D0D0] hover:shadow-[0_18px_40px_-20px_rgba(10,10,10,0.25)]">
      <Link
        href={`/magazin/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white"
        aria-label={product.name}
      >
        {product.cover?.url ? (
          /* contain, not cover: product shots must never be cropped */
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${product.cover.url})` }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[1.4px] text-[#BBB]">
            Fără imagine
          </div>
        )}
        {!product.in_stock ? (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#0A0A0A]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1.4px] text-white">
            Stoc epuizat
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link
          href={`/magazin/${product.slug}`}
          className="block transition-colors hover:text-[#B8001F]"
        >
          <h3 className="font-[family-name:var(--font-unbounded)] text-lg font-semibold leading-snug text-[#0A0A0A]">
            {product.name}
          </h3>
        </Link>

        {product.colors.length > 0 ? (
          <div className="mt-3 flex items-center gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="size-3.5 rounded-full border border-[#DDD]"
                style={{ backgroundColor: color.hex ?? "transparent" }}
              />
            ))}
            <span className="ml-1 text-[11px] text-[#999]">
              {product.colors.length}{" "}
              {product.colors.length === 1 ? "culoare" : "culori"}
            </span>
          </div>
        ) : null}

        <div className="mt-5 border-t border-[#EFEFEF] pt-4">
          <p className="text-[10px] font-medium uppercase tracking-[1.2px] text-[#999]">
            {ranged ? "De la" : "Preț"}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-[#0A0A0A]">
            {formatPrice(product.price_min, product.currency)}
          </p>
        </div>

        {product.delivery_options.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.delivery_options.map((option) => (
              <span
                key={option}
                className="inline-flex items-center gap-1 rounded-full bg-[#F4F4F4] px-2.5 py-1 text-[10px] font-medium text-[#666]"
              >
                <PackageCheck size={11} className="text-[#B8001F]" />
                {DELIVERY_LABEL[option]}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-6">
          <Link
            href={`/magazin/${product.slug}`}
            className="inline-flex w-full items-center justify-between rounded-full bg-[#0A0A0A] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B8001F]"
          >
            Vezi produsul
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Check,
  Loader2,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { startShopCheckout } from "@/app/magazin/[slug]/_actions";
import { formatPrice } from "@/lib/format";
import {
  DELIVERY_LABEL,
  SHOP_CHECKOUT_ENABLED,
  shopEnquiryMessage,
  shopWhatsappUrl,
  variantLabel,
  type DeliveryOption,
} from "@/lib/shop";
import type {
  ShopColor,
  ShopProductDetail,
  ShopVariant,
} from "@/lib/supabase/queries/shop";

/** Courier is not operating yet — it is shown, but never selectable. */
const AVAILABLE_DELIVERY: DeliveryOption = "summit_pickup";

function weightText(variant: ShopVariant) {
  return variant.weight_kg != null ? `${variant.weight_kg} kg` : "Standard";
}

export default function ShopProductView({
  product,
}: {
  product: ShopProductDetail;
}) {
  const colors = product.colors_detail;
  const hasColors = colors.length > 0;

  const firstSelectableColor =
    colors.find((c) => c.variants.some((v) => v.stock > 0)) ?? colors[0] ?? null;

  const [colorId, setColorId] = useState<string | null>(
    firstSelectableColor?.id ?? null,
  );

  const activeColor: ShopColor | null = hasColors
    ? (colors.find((c) => c.id === colorId) ?? null)
    : null;

  const weightOptions = useMemo(
    () => (hasColors ? (activeColor?.variants ?? []) : product.loose_variants),
    [hasColors, activeColor, product.loose_variants],
  );

  const [variantId, setVariantId] = useState<string | null>(
    () => weightOptions.find((v) => v.stock > 0)?.id ?? null,
  );

  // The chosen weight belongs to the chosen colour; when the colour changes the
  // old id is meaningless, so fall back to that colour's first in-stock weight.
  const selectedVariant = useMemo(() => {
    const match = weightOptions.find((v) => v.id === variantId);
    if (match) return match;
    return weightOptions.find((v) => v.stock > 0) ?? null;
  }, [weightOptions, variantId]);

  const hasVariants = hasColors || product.loose_variants.length > 0;

  const price = selectedVariant?.price ?? product.price;
  const stock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : (product.stock ?? null);
  const soldOut = hasVariants ? stock === 0 : stock === 0;

  // One source of truth for the big image: choosing a colour sets it, and a
  // thumbnail click can still override that afterwards.
  const [shownImage, setShownImage] = useState<string | null>(
    firstSelectableColor?.image_url ?? product.images[0]?.url ?? null,
  );

  const canPickup = product.delivery_options.includes(AVAILABLE_DELIVERY);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const blocked =
    soldOut || !canPickup || (hasVariants && selectedVariant == null);

  const selectionLabel = selectedVariant
    ? variantLabel({
        colorName: activeColor?.name ?? null,
        weight_kg: selectedVariant.weight_kg,
      })
    : null;

  // Card payment is paused, so the CTA opens WhatsApp with the exact selection
  // already written out and we close the sale by phone.
  const enquiryHref = shopWhatsappUrl(
    shopEnquiryMessage({
      productName: product.name,
      variantLabel: selectionLabel,
      url: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/magazin/${product.slug}`
        : null,
    }),
  );

  function handleBuy() {
    setError(null);
    const fd = new FormData();
    fd.set("product_id", product.id);
    fd.set("slug", product.slug);
    fd.set("delivery_option", AVAILABLE_DELIVERY);
    if (selectedVariant) fd.set("variant_id", selectedVariant.id);
    startTransition(async () => {
      const result = await startShopCheckout(fd);
      // A success path redirects and never returns; only failures land here.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      {/* Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white">
          {shownImage ? (
            /* contain + padding: show the whole product, never a crop */
            <div
              className="absolute inset-6 bg-contain bg-center bg-no-repeat transition-[background-image] duration-300"
              style={{ backgroundImage: `url(${shownImage})` }}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[1.4px] text-[#BBB]">
              Fără imagine
            </div>
          )}
          {soldOut ? (
            <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-[#0A0A0A]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1.4px] text-white">
              Stoc epuizat
            </span>
          ) : null}
        </div>

        {product.images.length > 1 ? (
          <div className="flex flex-wrap gap-3">
            {product.images.map((image) => {
              const active = shownImage === image.url;
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setShownImage(image.url)}
                  aria-label={image.alt ?? "Vezi fotografia"}
                  aria-pressed={active}
                  className={`relative size-20 overflow-hidden rounded-xl border transition-all ${
                    active
                      ? "border-[#0A0A0A]"
                      : "border-[#EAEAEA] hover:border-[#C4C4C4]"
                  }`}
                >
                  {image.url ? (
                    <div
                      className="absolute inset-1.5 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${image.url})` }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Selection panel */}
      <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 sm:p-8">
        <h1 className="font-[family-name:var(--font-unbounded)] text-2xl font-bold leading-tight text-[#0A0A0A] sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-3xl font-bold tabular-nums text-[#0A0A0A]">
            {formatPrice(price, product.currency)}
          </p>
          {selectionLabel ? (
            <p className="pb-1 text-sm text-[#888]">{selectionLabel}</p>
          ) : null}
        </div>

        {/* Colours */}
        {hasColors ? (
          <div className="mt-7">
            <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#999]">
              Culoare
              {activeColor ? (
                <span className="ml-2 text-[#0A0A0A]">{activeColor.name}</span>
              ) : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((color) => {
                const available = color.variants.some((v) => v.stock > 0);
                const active = color.id === activeColor?.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={active}
                    disabled={!available}
                    onClick={() => {
                      setColorId(color.id);
                      setVariantId(
                        color.variants.find((v) => v.stock > 0)?.id ?? null,
                      );
                      if (color.image_url) setShownImage(color.image_url);
                    }}
                    className={`relative size-10 rounded-full border-2 transition-all ${
                      active
                        ? "border-[#0A0A0A] scale-105"
                        : "border-[#E4E4E4] hover:border-[#B0B0B0]"
                    } ${available ? "" : "cursor-not-allowed opacity-40"}`}
                    style={{ backgroundColor: color.hex ?? "#F0F0F0" }}
                  >
                    {active ? (
                      <Check
                        size={16}
                        className="absolute inset-0 m-auto text-white mix-blend-difference"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Weights */}
        {weightOptions.length > 0 ? (
          <div className="mt-7">
            <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#999]">
              Greutate
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {weightOptions.map((variant) => {
                const active = variant.id === selectedVariant?.id;
                const out = variant.stock === 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={out}
                    aria-pressed={active}
                    onClick={() => setVariantId(variant.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium tabular-nums transition-all ${
                      active
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                        : "border-[#E4E4E4] bg-white text-[#0A0A0A] hover:border-[#B0B0B0]"
                    } ${out ? "cursor-not-allowed text-[#BBB] line-through opacity-60 hover:border-[#E4E4E4]" : ""}`}
                  >
                    {weightText(variant)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Stock */}
        <p className="mt-6 flex items-center gap-2 text-sm">
          {soldOut ? (
            <span className="text-[#B8001F]">Stoc epuizat</span>
          ) : (
            <>
              <ShieldCheck size={15} className="text-[#B8001F]" />
              <span className="text-[#666]">
                {stock == null
                  ? "În stoc"
                  : stock <= 3
                    ? `Ultimele ${stock} bucăți`
                    : "În stoc"}
              </span>
            </>
          )}
        </p>

        {/* Delivery */}
        <div className="mt-6 space-y-2 rounded-2xl bg-[#FAFAFA] p-4">
          <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#999]">
            Livrare
          </p>
          {product.delivery_options.length === 0 ? (
            <p className="text-sm text-[#888]">
              Nicio metodă de livrare configurată.
            </p>
          ) : (
            product.delivery_options.map((option) => {
              const usable = option === AVAILABLE_DELIVERY;
              return (
                <p
                  key={option}
                  className={`flex items-center gap-2 text-sm ${
                    usable ? "text-[#0A0A0A]" : "text-[#AAA]"
                  }`}
                >
                  {option === "courier" ? (
                    <Truck size={15} />
                  ) : (
                    <PackageCheck size={15} className="text-[#B8001F]" />
                  )}
                  {DELIVERY_LABEL[option]}
                  {usable ? null : (
                    <span className="text-xs">(indisponibil momentan)</span>
                  )}
                </p>
              );
            })
          )}
        </div>

        {/* Buy */}
        {SHOP_CHECKOUT_ENABLED ? (
        <button
          type="button"
          onClick={handleBuy}
          disabled={blocked || isPending}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#B8001F] disabled:cursor-not-allowed disabled:bg-[#D8D8D8] disabled:text-[#7A7A7A]"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Se deschide plata…
            </>
          ) : soldOut ? (
            "Stoc epuizat"
          ) : !canPickup ? (
            "Indisponibil momentan"
          ) : (
            `Cumpără · ${formatPrice(price, product.currency)}`
          )}
        </button>
        ) : soldOut ? (
          <p className="mt-6 rounded-full bg-[#F2F2F2] px-6 py-4 text-center text-sm font-semibold text-[#7A7A7A]">
            Stoc epuizat
          </p>
        ) : (
          <a
            href={enquiryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#B8001F]"
          >
            <MessageCircle size={16} />
            Comandă pe WhatsApp
          </a>
        )}

        {error ? (
          <p className="mt-3 text-sm text-[#B8001F]">{error}</p>
        ) : null}

        <p className="mt-3 text-center text-xs text-[#999]">
          {SHOP_CHECKOUT_ENABLED
            ? "Plată securizată prin Stripe. Ridicare la Sense4FIT Summit."
            : "Îți confirmăm disponibilitatea și plata pe WhatsApp. Ridicare la Sense4FIT Summit."}
        </p>
      </div>
    </div>
  );
}
